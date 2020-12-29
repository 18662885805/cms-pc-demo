import React, {Fragment} from 'react'
import {
    Card, 
    message, 
    Button, 
    Form, 
    Input, 
    Upload,
    Icon,
    Spin,
} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable3'
import MyBreadcrumb from '@component/bread-crumb'
import {entranceDetail,FactoryapplyAccess,FactoryapplyDenial,entryPendingDetail} from "@apis/security/factoryapply"
import {SearchStaffCertificate} from '@apis/staff/index'
import GoBackButton from '@component/go-back'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'
import {GetTemporaryKey} from "@apis/account/index"
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
const {TextArea} = Input;
const FormItem = Form.Item
let _util = new CommonUtil()

@inject('menuState') @observer
class FactoryapplyAudit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            project_id : _util.getStorage('project_id'),
            avatar_url:'',
            audit_remarks:'',
            fileList:[],
            cardShow:false,
            certificateData:[],
            certificateLoading:false
        }
        this.apply = this.apply.bind(this)
        this.unApply = this.unApply.bind(this)
    }

    
    componentDidMount() {
        const _this = this;
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            entryPendingDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                this.setState({
                    ...res.data,
                    spinLoading: false,
                    id: this.props.location.state.id,
                    project_id:project_id
                })
                // if(res.data.staff_info&&res.data.staff_info.avatar){
                //     this.renderImg(res.data.staff_info.avatar);
                // }
                if(res.data.staff_info&&res.data.staff_info.id){
                    //获取证件信息
                    SearchStaffCertificate({project_id:project_id,staff_id:res.data.staff_info.id}).then((res) => {
                        if(res.data&&res.data.length){
                            this.setState({cardShow:true,certificateLoading:true})
                            _util.setCertificate(this,res.data,GetTemporaryKey);
                        }
                    })
                }
            });
            
        }
    }

    renderImg = (str) => {
        const fileList = this.switchToJson(str);
        if(fileList&&fileList.length){
            const key = fileList[0]['url'];
            var that = this;
            var cos = _util.getCos(null,GetTemporaryKey);
            var url = cos.getObjectUrl({
                Bucket: 'ecms-1256637595',
                Region: 'ap-shanghai',
                Key:key,
                Sign: true,
            }, function (err, data) {
                if(data && data.Url){    
                    that.setState({avatar_url:data.Url});
                }
            });
            
        }       
    }


    switchToJson = (str) => {
        return eval('(' + str + ')');
    }

    apply() {
        const {id,project_id,audit_remarks,fileList} = this.state;
        const { formatMessage } = this.props.intl;
        FactoryapplyAccess({
            project_id:project_id,
            factory_apply_id:id,
            remark:audit_remarks,
            file:fileList&&fileList.length?JSON.stringify(_util.setSourceList(fileList)) :''
        }).then((res) => {
            message.success('操作成功')
            this.props.history.goBack()
        })
    }

    unApply() {
        const {id,project_id,audit_remarks,fileList} = this.state;
        const { formatMessage } = this.props.intl;
        FactoryapplyDenial({
            project_id:project_id,
            factory_apply_id:id,
            remark:audit_remarks,
            file:fileList&&fileList.length?JSON.stringify(_util.setSourceList(fileList)):''
        }).then((res) => {
            message.success('操作成功')
            this.props.history.goBack()
        })
    }

    handleRemarksChange(e) {
        this.setState({
            audit_remarks: e.target.value
        })
    }

    fileUpload  = (info) => {
        let {fileList} = info;
        const status = info.file.status;
        const { formatMessage } = this.props.intl;

        if (status === 'done') {
            message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

        } else if (status === 'error') {
            message.error(`${info.file.name} ${info.file.response}.`)
        }
        this.setState({fileList: fileList})
      }

      //删除已上传文件
  handleRemove = (info) => {
    const {fileList} = this.state;
    const new_fileList = fileList.filter(file => {
      return file.uid != info.uid
    })
    this.setState({fileList:new_fileList})
  }

  renderCertificateTableData = (record) => {
    return(
        [
            {
               text: '证件名称',
               value: _util.getOrNull(record&&record.name ? record.name:'')
           },
           {
                text: '证件编号',
                value: _util.getOrNull(record&&record.no ? record.no:'')
            },
            {
                text: '证件有效期',
                value: _util.getOrNull(record&&record.valid_date ? record.valid_date:'')
            },
           {
               text:'附件',
               value:<Upload fileList={record.fileList}></Upload>
           },
        ]
    )
}

    render() {
        const {confirmLoading,staff_info,need_training,status,factory_approve_nam,created,updated,
            approve_time ,avatar_url,audit_remarks,remark,fileList,certificateData,cardShow,certificateLoading,
            training,apply_remark,
        } = this.state
        const { formatMessage } = this.props.intl;
        const formItemLayout = {
            'labelCol': {
                'xs': {'span': 24},
                'sm': {'span': 7}
            },
            'wrapperCol': {
                'xs': {'span': 24},
                'sm': {'span': 12}
            }
        }
        const tableData =  [
            {
               text: <FormattedMessage id="page.construction.staffNotes.name" defaultMessage="员工姓名"/>,
               value: _util.getOrNull(staff_info&&staff_info.name ? staff_info.name :'')
           },
           {
                text: '组织',
                value:_util.getOrNull(staff_info&&staff_info.org_name ? staff_info.org_name :'')
            },
            {
                text: '职务',
                value:_util.getOrNull(staff_info&&staff_info.work_type ? staff_info.work_type :'')
            },
            {
                text: '人员类型',
                value:_util.getPersonType(staff_info&&staff_info.staff_type ? staff_info.staff_type :'')
            },
           {
                text: <FormattedMessage id="page.construction.staffNotes.phone" defaultMessage="员工手机"/>,
                value: _util.getOrNull(staff_info&&staff_info.phone ? staff_info.phone :'')
            },
           {
               //text: '证件号码',
               text:<FormattedMessage id="page.construction.staff.cardNumber" defaultMessage="证件号码:"/>,
               value: _util.getOrNull(staff_info&&staff_info.id_card ? staff_info.id_card :'')
           },
           {
                text: '入场培训',
                value:_util.renderNeedTraining(need_training)
            },
            {
                text: '培训项目',
                value:_util.renderListToString(training,'name')
            },
           {
                text: '状态',
                value: _util.renderApproval(status)
           },
           {
                text: '备注',
                value: _util.getOrNull(apply_remark)
            },
           {
               text: '审批人',
               value: _util.getOrNull(factory_approve_nam)
           },
           {
                text: '审批时间',
                value: _util.getOrNull( approve_time  ?  moment(approve_time).format('YYYY-MM-DD') : null)
            },
            {
                //text: '创建人',
                text:<FormattedMessage id="page.construction.staff.created" defaultMessage="创建人"/>,
                value: _util.getOrNull(created)
            },
            {
                //text: '修改人',
                text:<FormattedMessage id="page.construction.staff.updated" defaultMessage="修改人"/>,
                value: _util.getOrNull(updated)
            },
        ]

        const props2 = {
            multiple: true,
            accept: "image/*",
            action: _util.getServerUrl(`/upload/auth/`),
            headers: {
                Authorization: 'JWT ' + _util.getStorage('token')
            },
        }

        const bread = [
            {
                name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
                url: '/'
            },
            {
                name: '入场管理'
            },
            {
                name: '绿码审批',
                url: '/staff/my/factoryapply'
            },
            {
                name: <FormattedMessage id="page.component.breadcrumb.approval" defaultMessage="审批"/>,
            }
          ]

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper content-no-table-wrapper">
                   
                    <CardDetail 
                        data={tableData}
                        title={<FormattedMessage id="page.construction.staff.staffDetail" defaultMessage="员工详情"/>} 
                    />

                    {
                        cardShow?
                        certificateData&&certificateData.map((c,index) => {
                            return <Spin spinning={certificateLoading}><CardDetail 
                                data={this.renderCertificateTableData(c)}
                                title={`证件信息${index+1}`} 
                            /></Spin>
                        })
                        :''
                    }
                    {
                        status == 1  ?
                        <Card 
                            title={<FormattedMessage id="app.table.column.operate" defaultMessage="操作"/>}
                            style={{margin: '0 auto 10px', width: '80%'}}>
                            <Form>
                                <FormItem {...formItemLayout} label={<FormattedMessage id="page.construction.projectAudit.audit1" defaultMessage="当前审批人"/>}>
                                    <span>{_util.getStorage('userInfo') ? _util.getStorage('userInfo').name : ''}</span>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<FormattedMessage id="page.construction.projectAudit.audit2" defaultMessage="审批备注"/>}
                                >
                                    <TextArea
                                        value={audit_remarks}
                                        onChange={e => this.handleRemarksChange(e)}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={'附件'}
                                >
                                    <Upload
                                        {...props2}
                                        fileList={fileList}
                                        beforeUpload={_util.beforeUpload} 
                                        onChange={this.fileUpload}
                                        //customRequest={this.fileUpload}
                                        //onRemove={this.handleRemove}
                                    >
                                    <Button>
                                        <Icon type="upload" />上传
                                    </Button>
                                    </Upload>
                                </FormItem>
                                <FormItem
                                    style={{display: 'flex', justifyContent: 'center'}} >
                                    <Button type="primary" onClick={this.apply} loading={confirmLoading}
                                            style={{marginRight: '10px'}}>
                                        <FormattedMessage id="app.button.approve" defaultMessage="通过" />
                                    </Button>
                                    <Button type="danger" onClick={this.unApply} loading={confirmLoading}
                                            style={{marginRight: '10px', bgColor: '#f5222d'}}>
                                        <FormattedMessage id="app.button.unpass" defaultMessage="不通过" />
                                    </Button>
                                    <GoBackButton props={this.props}/>
                                </FormItem>
                            </Form>
                        </Card>
                         : ''
                    }
                   
                    {
                        status == 1  ? '' : <GoBackButton props={this.props} style={{ display: 'block', margin: '0 auto' }}/>
                    }

                        
                </div>
            </div>
        )
    }
}

export default injectIntl(FactoryapplyAudit)

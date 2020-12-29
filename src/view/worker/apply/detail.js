import React from 'react'
import {
    Form,
    Select,
    Modal,
    Spin,
    message,
    Upload,
    Timeline,
    Tag,
} from 'antd';
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import CardDetail from '@component/CardDetail'
import PicList from '@component/PicList'
import GoBackButton from '@component/go-back'
import {staffOrgDetail,staffDetail,SearchStaffCertificate} from '@apis/staff/index'
import styles from '@view/common.css';
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import {GetTemporaryKey} from "@apis/account/index"
import messages from '@utils/formatMsg'
const FormItem = Form.Item
const confirm = Modal.confirm


let _util = new CommonUtil()

class WorkerDetailForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinLoading: true,
            img_url:'',
            cardShow:false,
            certificateData:[],
            certificateLoading:false
        }
    }

    componentDidMount() {
        const _this = this;
        const project_id = _util.getStorage('project_id');
        const organization_id = _util.getStorage('userdata') ? _util.getStorage('userdata').org.id : '';
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            staffOrgDetail(project_id,{id: this.props.location.state.id,organization_id:organization_id}).then((res) => {
                this.setState({
                    ...res.data,
                    spinLoading: false,
                    id: this.props.location.state.id
                });
            })
            //获取证件信息
            SearchStaffCertificate({project_id:project_id,staff_id:this.props.location.state.id}).then((res) => {
                if(res.data&&res.data.length){
                    this.setState({cardShow:true,certificateLoading:true})
                    _util.setCertificate(this,res.data,GetTemporaryKey);
                }
            })
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
                    that.setState({img_url:data.Url});
                }
            });
        }       
    }

    switchToJson = (str) => {
        return eval('(' + str + ')');
    }

    renderBindWX = (record) => {
        if(record){
          return (<Tag color="#87d068">绑定</Tag>);
        }else{
          return (<Tag color="#f50">未绑定</Tag>);
        }
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
                   value:<Upload fileList={record.fileList} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}></Upload>
               },
            ]
        )
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const  {spinLoading} = this.state
        const {
            remarks,confirmLoading,name,phone,id_card,staff_type_name,extra_desc,work_type_name,created,created_time,updated,updated_time,
            organization_nam,role_names,bind_wx,img_url,certificateData,cardShow,certificateLoading,role_info,email
        } = this.state;
        const tableData =  [
            {
               text: <FormattedMessage id="page.construction.staffNotes.name" defaultMessage="员工姓名"/>,
               value: _util.getOrNull(name)
           },
           {
                text: <FormattedMessage id="page.construction.staffNotes.phone" defaultMessage="员工手机"/>,
                value: _util.getOrNull(phone)
            },
           {
               //text: '证件号码',
               text:<FormattedMessage id="page.construction.staff.cardNumber" defaultMessage="证件号码:"/>,
               value: _util.getOrNull(id_card)
           },
           {
            text: '邮箱',
            value: _util.getOrNull(email)
            },
           {
            text: '组织',
            value: _util.getOrNull(organization_nam)
        },
           {
               text: '身份',
               value: _util.getOrNull(staff_type_name)
           },
           {
               text: '职务',
               value: _util.getOrNull(work_type_name)
           },
           {
            text: '角色',
            value: _util.getOrNull(role_info&&role_info.length? _util.renderDataName(role_info) :'')
            },
            {
                text: '是否绑定微信',
                value: this.renderBindWX(bind_wx)
            },
           {
                text: '补充描述',
                value: _util.getOrNull(extra_desc)
            },
            {
                //text: '创建人',
                text:<FormattedMessage id="page.construction.staff.created" defaultMessage="创建人"/>,
                value: _util.getOrNull(created)
            },
            {
                //text: '创建时间',
                text:<FormattedMessage id="page.construction.staff.createdTime" defaultMessage="创建时间"/>,
                value: _util.getOrNull(created_time ?  moment(created_time).format('YYYY-MM-DD') : null)
            },
            {
                //text: '修改人',
                text:<FormattedMessage id="page.construction.staff.updated" defaultMessage="修改人"/>,
                value: _util.getOrNull(updated)
            },
            {
                //text: '上次修改时间',
                text:<FormattedMessage id="page.construction.staff.updatedTime" defaultMessage="上次修改时间"/>,
                value: _util.getOrNull(updated_time ?  moment(updated_time).format('YYYY-MM-DD') : null)
            },
            // {
            //     text: '头像',
            //     value: <img src={img_url} style={{height:'100px'}}></img>
            // },
        ]


        return (
            <div>
                <MyBreadcrumb/>
                <div className="content-wrapper content-no-table-wrapper">
                    <Spin spinning={spinLoading}>
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
                        <GoBackButton
                        style={{display: 'block', margin: '0 auto'}}
                        props={this.props}
                        noConfirm/>
                    </Spin>
                </div>
            </div>
        )
    }
}

const WorkerDetail = Form.create()(WorkerDetailForm)

export default injectIntl(WorkerDetail)

import React, {Fragment} from 'react'
import { Link } from 'react-router-dom'
import {
    Card, 
    Col, 
    Row, 
    Input, 
    message, 
    Button, 
    Form, 
    Modal, 
    Upload,
    Timeline,
    Collapse,
    Spin,
    Select,
} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import moment from 'moment'
import MyBreadcrumb from '@component/bread-crumb'
import {StaffAccess,StaffDenial,workerType,StaffApproveDetail,SearchStaffCertificate} from '@apis/staff/index'
import {orgRoleInfo} from '@apis/system/role'
import GoBackButton from '@component/go-back'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'
import styles from '@view/common.css';
import UserWrapper from '@component/user-wrapper'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import values from 'postcss-modules-values'
import {GetTemporaryKey} from "@apis/account/index"
const FormItem = Form.Item
const {TextArea} = Input;
const { Panel } = Collapse;
const {Option} = Select
let _util = new CommonUtil()

@inject('menuState') @observer
class StaffRecordAudit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            remarks: null,
            confirmLoading: false,
            approve_list: [],
            audit_info_list: [],
            project_id : _util.getStorage('project_id'),
            work_type_list:[],
            role_list:[],
            work_type:'',
            role:[],
            staff_type:'',
            img_url:'',
            fileList:[],
            audit_remarks:'',
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
        this.setState({project_id})
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            //获取组织信息
            let userdata = _util.getStorage('userdata');
            if(userdata.org){
                this.setState({
                    org_name:userdata.org.company ? userdata.org.company : '',
                    org_id:userdata.org.id ? userdata.org.id: ''
                });
                //详情
                const org_id = userdata.org.id;
                StaffApproveDetail(project_id,org_id,{id: this.props.location.state.id}).then((res) => {
                    this.setState({
                        ...res.data,
                        spinLoading: false,
                        id: this.props.location.state.id,
                    });
                    if(res.data.avatar){
                        _util.setAvatar(this,res.data.avatar,'img_url',GetTemporaryKey)
                    }
                })
                //获取证件信息
                SearchStaffCertificate({project_id:project_id,staff_id:this.props.location.state.id}).then((res) => {
                    if(res.data&&res.data.length){
                        this.setState({cardShow:true,certificateLoading:true})
                        _util.setCertificate(this,res.data,GetTemporaryKey);
                    }
                })

                
                //获取职务
                workerType({project_id:project_id,org_id:org_id}).then(res => {
                    if(res&&res.data){
                        this.setState({work_type_list:res.data})
                    }
                })

                //获取角色信息     
                if(userdata.org.org_type){
                    var org_type = userdata.org.org_type;
                    //获取角色信息     
                    orgRoleInfo({project_id:project_id,org_type_id:org_type.id ? org_type.id :''}).then(res => {
                        if(res&&res.data){
                            this.setState({role_list:res.data})
                        }
                    })
                }
            }
        };
        


        
    }

    switchToJson = (str) => {
        return eval('(' + str + ')');
    }

    apply() {
        const {id,project_id,work_type,role,staff_type,audit_remarks} = this.state;
        const { formatMessage } = this.props.intl;
        StaffAccess({
            project_id:project_id,
            staff_id:id,
            extra_desc:audit_remarks,
            staff_type:staff_type,
            // work_type_id:work_type,
            role_ids:role.length ? role.join(',') :''
        }).then((res) => {
            message.success('操作成功')
            this.props.history.goBack()
        })
    }

    unApply() {
        const {id,project_id} = this.state;
        const { formatMessage } = this.props.intl;
        StaffDenial({
            project_id:project_id,
            staff_id:id,     
        }).then((res) => {
            message.success('操作成功')
            this.props.history.goBack()
        })
    }

    handleRemarksChange = e => {
        this.setState({
          audit_remarks: e.target.value
        });
    }



    handleWorkType = (value) => {
        console.log(value);
        this.setState({work_type:value})
    }

    handleRole = (value) => {
        console.log(value)
        this.setState({role:value})
    }

    setPersonType = (value) => {
        console.log(value)
        this.setState({staff_type:value})
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
        const {confirmLoading,name,phone,id_card,staff_type_name,extra_desc,created_time,
            organization_nam,work_type_list,role_list,staff_approve_nam,img_url,audit_remarks,
            certificateData,cardShow,certificateLoading,status,is_approval,email
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
                text: '组织',
                value: _util.getOrNull(organization_nam)
            },
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
               text: '身份',
               value: _util.getOrNull(staff_type_name)
           },
           {
               text: '补充描述',
               value: _util.getOrNull(extra_desc)
           },
            {
                //text: '创建时间',
                text:'申请时间',
                value: _util.getOrNull(created_time ?  moment(created_time).format('YYYY-MM-DD') : null)
            },
            {
                //text: '修改人',
                text:'审批人',
                value: _util.getOrNull(staff_approve_nam)
            },
        ]

        const roleOption = role_list instanceof Array && role_list.length ? role_list.map(d =>
            <Option key={d.id} value={d.id}>{d.name}</Option>) : [];
        return (
            <div>
                <MyBreadcrumb/>
                <div className="content-wrapper content-no-table-wrapper">
                    <CardDetail title={'员工详情'} data={tableData}/>     
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
                        is_approval	 == 1 ?
                        <Card 
                            title={<FormattedMessage id="app.table.column.operate" defaultMessage="操作"/>}
                            style={{margin: '0 auto 10px', width: '80%'}}>
                            <Form>
                                <FormItem {...formItemLayout} label={<FormattedMessage id="page.construction.projectAudit.audit1" defaultMessage="当前审批人"/>}>
                                    <span>{_util.getStorage('userInfo') ? _util.getStorage('userInfo').name : ''}</span>
                                </FormItem>
                                <FormItem {...formItemLayout} label={'人员类型'} required>
                                    <Select
                                        style={{width:'100%'}}
                                        onChange={(value) => this.setPersonType(value)}
                                        placeholder={'请选择人员类型'}
                                    >
                                            <Option value={1}>管理人员</Option>
                                            <Option value={2}>安全人员</Option>
                                            <Option value={3}>特殊工种</Option>
                                            <Option value={4}>普工</Option>
                                    </Select>
                                </FormItem>
                                {/* <FormItem {...formItemLayout} label={'职务'} required>
                                    <Select
                                        style={{width:'100%'}}
                                        onChange={(value) => this.handleWorkType(value)}
                                        placeholder={'请选择职务'}
                                    >
                                            {work_type_list.length ? work_type_list.map(d => (
                                            <Option key={d.id} value={d.id}>{d.name}</Option>
                                        )) : []}
                                    </Select>
                                </FormItem> */}
                                <FormItem {...formItemLayout} label={'角色'} required>
                                    <Select
                                        onChange={(value) => this.handleRole(value)}
                                        style={{width:'100%'}}
                                        showSearch
                                        mode="multiple"
                                        placeholder={'请选择角色'}
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {roleOption}
                                    </Select>
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
                        :''
                    }
                    {
                        is_approval	 == 1 ? '' : <GoBackButton props={this.props} style={{ display: 'block', margin: '0 auto' }}/>
                    }
                    

                        
                </div>
            </div>
        )
    }
}

export default injectIntl(StaffRecordAudit)

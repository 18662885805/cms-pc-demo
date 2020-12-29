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
class StaffRecordDetail extends React.Component {
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
                })
                //获取证件信息
                SearchStaffCertificate({project_id:project_id,staff_id:this.props.location.state.id}).then((res) => {
                    if(res.data&&res.data.length){
                        this.setState({cardShow:true,certificateLoading:true})
                        _util.setCertificate(this,res.data,GetTemporaryKey);
                    }
                })
            }
        };
        


        
    }

    switchToJson = (str) => {
        return eval('(' + str + ')');
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
        const {confirmLoading,name,phone,id_card,staff_type_name,extra_desc,created_time,
            organization_nam,work_type_name,role_list,staff_approve_nam,img_url,audit_remarks,
            certificateData,cardShow,certificateLoading,updated_time,role_info,email
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
               text: '人员类型',
               value: _util.getOrNull(staff_type_name)
           },
           {
                text: '职务',
                value: _util.getOrNull(work_type_name)
            },
            {
                text: '角色',
                value: _util.renderListToString(role_info,'name')
            },

           {
               text: '补充描述',
               value: _util.getOrNull(extra_desc)
           },
            {
                //text: '创建时间',
                text:'申请时间',
                value: _util.getOrNull(created_time ?  moment(created_time).format('YYYY-MM-DD HH:MM:SS') : null)
            },
            {
                //text: '修改人',
                text:'审批人',
                value: _util.getOrNull(staff_approve_nam)
            },
            {
                text:'审批时间',
                value: _util.getOrNull(updated_time ?  moment(updated_time).format('YYYY-MM-DD HH:MM:SS') : null)
            },
        ]
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
                        <GoBackButton props={this.props} style={{ display: 'block', margin: '0 auto' }}/>
                </div>
            </div>
        )
    }
}

export default injectIntl(StaffRecordDetail)

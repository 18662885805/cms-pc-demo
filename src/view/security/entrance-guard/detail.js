import React, {Fragment} from 'react'
import {
    Card, 
    message, 
    Button, 
    Form, 
    Input, 
    Upload,
    Icon,
    Spin
} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import moment from 'moment'
import MyBreadcrumb from '@component/bread-crumb'
import {accessCardDetail} from '@apis/security/accesscard'
import {SearchStaffCertificate} from '@apis/staff/index'
import GoBackButton from '@component/go-back'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'
import {GetTemporaryKey} from "@apis/account/index"
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
let _util = new CommonUtil()

@inject('menuState') @observer
class FactoryapplyAudit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            project_id : _util.getStorage('project_id'),
            avatar_url:'',
            cardShow:false,
            certificateData:[],
            certificateLoading:false
        }
    }

    
    componentDidMount() {
        const _this = this;
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            console.log(this.props.location.state.id)
            accessCardDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                this.setState({
                    ...res.data,
                    spinLoading: false,
                    id: this.props.location.state.id,
                    project_id:project_id
                })
                //获取头像
                // if(res.data.staff_info&&res.data.staff_info.avatar){
                //     this.renderImg(res.data.staff_info.avatar);
                // }
                //获取证件信息
                if(res.data.staff_info&&res.data.staff_info.id){
                    SearchStaffCertificate({project_id:project_id,staff_id:res.data.staff_info.id}).then((res) => {
                        if(res.data&&res.data.length){
                            this.setState({cardShow:true,certificateLoading:true})
                            _util.setCertificate(this,res.data,GetTemporaryKey);
                        }
                    })
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
                    that.setState({avatar_url:data.Url});
                }
            });
            
        }       
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
        const {confirmLoading,staff_info,need_training,status,factory_approve_nam,created,updated,
            approve_time ,avatar_url,remark,active, cardShow,certificateData,certificateLoading,
            factory_approve_name
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
            text: <FormattedMessage id="page.construction.staffNotes.phone" defaultMessage="员工手机"/>,
            value: _util.getOrNull(staff_info&&staff_info.phone ? staff_info.phone :'')
        },
       {
           //text: '证件号码',
           text:<FormattedMessage id="page.construction.staff.cardNumber" defaultMessage="证件号码:"/>,
           value: _util.getOrNull(staff_info&&staff_info.id_card ? staff_info.id_card :'')
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
                text: '审批人',
                value: _util.getOrNull(factory_approve_name)
            },
            {
                text: '审批时间',
                value: _util.getOrNull(staff_info&&staff_info.approve_time  ?  moment(staff_info.approve_time).format('YYYY-MM-DD') : null)
            },
           {
                text: '状态',
                value: _util.renderAccessCard(active)
           },
            // {
            //     text: '头像',
            //     value: <img src={avatar_url} style={{height:'100px'}}></img>
            // },
        ]

        return (
            <div>
                <MyBreadcrumb/>
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
                    <GoBackButton props={this.props} style={{ display: 'block', margin: '0 auto' }}/>
                </div>
            </div>
        )
    }
}

export default injectIntl(FactoryapplyAudit)

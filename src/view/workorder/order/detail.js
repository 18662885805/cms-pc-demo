import React, {Fragment} from 'react'
import {
    Form,
    Button,
    Modal,
    Input,
    Upload,
    Icon,
    Spin,
    Select,
    Rate,
    message,
    Timeline, InputNumber, Tag, DatePicker,Switch
} from 'antd'
import {inject, observer} from "mobx-react/index"
import MyBreadcrumb from '@component/bread-crumb'
import {recordDetail,recordHandle,recordAllDetail,recordOrgDetail} from '@apis/workorder/order'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import stylesCard from './detail.module.css';
import debounce from 'lodash/debounce'
import moment from 'moment'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import intl from 'react-intl-universal';
import SearchUserSelect from '@component/searchUserSelect'
import {GetTemporaryKey} from "@apis/account/index"
import {rulePerson} from '@apis/workorder/rule'
import {cloneDeep} from "@babel/types";
import html2pdf from "html2pdf.js";
import styles from "../../common.css";

const {TextArea} = Input
const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

let _util = new CommonUtil();

@inject('menuState') @observer
class MyOrderDetailForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            avatar: '',
            username: '',
            name: '',
            tel: '',
            email: '',
            phone: '',
            department_name: '',
            role: '',
            status: '',
            is_active: '',
            last_login: '',
            action: '',
            visible: false,
            fileList: [],
            previewVisible: false,
            previewImage: '',
            l_rate: 5,
            l_action: 0,
            fetching: false,
            data: [],
            user:undefined,
            search_id: '',
            picVisible: false,
            picSrc: '',
            cost:undefined,
            comment:undefined,
            to_user:undefined,
            fileList2:undefined,
            flowsObj:[],
            user_list:[],
            newDueDate:undefined,
            switchDate:false,
            area_name:"",
        };
        this.operateOrder = this.operateOrder.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.genPDF=this.genPDF.bind(this)
        // this.printPage = this.printPage.bind(this);
        this.fetchUser = debounce(this.fetchUser, 800)
        this.lastFetchId = 0
        // this.handleStarChange = this.handleStarChange.bind(this)
    }

    componentWillMount() {
        console.log(this.props);
        const currentUser = _util.getStorage('userInfo').id
        this.setState({currentUser});
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            console.log(this.props.location.state.type);
            let detailFn=undefined;
            if(this.props.location.state.type===1){
                detailFn=recordDetail(this.props.location.state.id,{project_id:_util.getStorage('project_id')})
            }else if(this.props.location.state.type===2){
                detailFn=recordOrgDetail(this.props.location.state.id,{project_id:_util.getStorage('project_id')})
            }else if(this.props.location.state.type===3){
                detailFn=recordAllDetail(this.props.location.state.id,{project_id:_util.getStorage('project_id')})
            }

              var that = this;
              detailFn.then(function (res) {
                console.log(res)

                let data = res.data;
                if(res.data&&res.data.pic_source){
                   //转换前端格式
                   var cos = _util.getCos(null,GetTemporaryKey);
                   const source_list = _util.switchToJson(res.data.pic_source);
                   if(source_list&&source_list.length){
                      that.setState({file_loading:true})
                      source_list.map((obj, index) => {
                          const key = obj.url;
                          var url = cos.getObjectUrl({
                              Bucket: 'ecms-1256637595',
                              Region: 'ap-shanghai',
                              Key:key,
                              Sign: true,
                          }, function (err, data) {
                              if(data && data.Url){
                                  const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
                                  const new_list = [...that.state.fileList,file_obj];
                                  that.setState({fileList:new_list});
                                  if(index == source_list.length - 1){
                                      that.setState({file_loading:false});
                                  }
                              }
                          });
                      });
                   }
                }

                const flowsObj = res.data.flows && JSON.parse(res.data.flows);
                that.setState({flowsObj:flowsObj});


                if(flowsObj&&flowsObj.length){
                    let num=0;
                   //转换前端格式
                   var cos = _util.getCos(null,GetTemporaryKey);
                   flowsObj.map((flow,fIndex)=>{
                       if(flow.fields.pic_source){
                           const source_list = _util.switchToJson(flow.fields.pic_source);
                           if(source_list&&source_list.length){
                               flow.flow_source=[];
                               source_list.map((obj, index) => {
                               cos.getObjectUrl({
                                  Bucket: 'ecms-1256637595',
                                  Region: 'ap-shanghai',
                                  Key:obj.url,
                                  Sign: true,
                               }, function (err, data) {
                                  if(data && data.Url){
                                      const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
                                      flow.flow_source.push(file_obj)
                                  }
                              });
                          });
                           }
                           num+=1;
                       }else{
                           flow.flow_source=undefined;
                           num+=1;
                        }
                   });
                   console.log(num,flowsObj.length);
                   if(num===flowsObj.length){
                       console.log(flowsObj);
                       //Promise.resolve(flowsObj).then(val=>that.setState({flowsObj:val}))
                       setTimeout(function () {
                            that.setState({flowsObj:flowsObj})
                       },2000)
                   }
                }



                // if(flowsObj&&num===flowsObj.length){
                //     resolve(flowsObj)
                // }



                    // let _this=this;
                    // setTimeout(function () {
                    //     that.setState({flowsObj:data})
                    // },1000)


                // let p=new Promise(function (resolve, reject) {
                //     // let num=0;
                //     if(flowsObj&&flowsObj.length){
                //        //转换前端格式
                //        var cos = _util.getCos(null,GetTemporaryKey);
                //        flowsObj.map((flow,fIndex)=>{
                //            if(flow.fields.pic_source){
                //                const source_list = _util.switchToJson(flow.fields.pic_source);
                //                if(source_list&&source_list.length){
                //                    flow.flow_source=[];
                //                    source_list.map((obj, index) => {
                //                    cos.getObjectUrl({
                //                       Bucket: 'ecms-1256637595',
                //                       Region: 'ap-shanghai',
                //                       Key:obj.url,
                //                       Sign: true,
                //                    }, function (err, data) {
                //                       if(data && data.Url){
                //                           const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
                //                           flow.flow_source.push(file_obj)
                //                       }
                //                   });
                //               });
                //                }
                //                // num+=1;
                //            }else{
                //                flow.flow_source=undefined;
                //                // num+=1;
                //             }
                //        });
                //     }
                //
                //     // if(flowsObj&&num===flowsObj.length){
                //         resolve(flowsObj)
                //     // }
                // });
                //
                // p.then((data)=>{
                //     // let _this=this;
                //     setTimeout(function () {
                //         that.setState({flowsObj:data})
                //     },1000)
                // });

                that.setState({
                    // flowsObj:flowsObj,
                    newDueDate:data.duedate,
                    ...data
                });

                that.props.menuState.changeMenuCurrentUrl('/assignment/record')
                that.props.menuState.changeMenuOpenKeys('/assignment')
              })
        }
    }

    handleChange = (value, obj) => {
        this.setState({
            search_id: obj ? obj.props.title : null,
            data: [],
            fetching: false,
            user: value
        })
    }

    fetchUser = (value) => {
        this.lastFetchId += 1
        const fetchId = this.lastFetchId
        this.setState({data: [], fetching: true})
        interviewee({q: value}).then((res) => {
            if (fetchId !== this.lastFetchId) {
                return
            }
            const data = res.data.results.map(user => ({
                value: user.name,
                //text: user.name,
                name:user.name,
                id: user.id,
                org:user.org,
                tel: user.tel
            }))
            this.setState({data, fetching: false})
        })
    };

    operateOrder(act, l_action) {
        if([2,8,10].indexOf(l_action)>-1){
            rulePerson({org_id: this.state.to_org,project_id:_util.getStorage("project_id")}).then((res)=>{
                 console.log(res);
                 this.setState({user_list:res.data})
            })
        }

        this.setState({
            action: act,
            visible: true,
            l_action
        })
    }

    handleSubmit(e) {
        if(e){
             e.preventDefault()
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this;
                const {l_rate, l_action, id, search_id,comment,cost,fileList2,to_user,switchDate,newDueDate} = _this.state;
                const { formatMessage } = _this.props.intl;
                console.log(switchDate);
                console.log(newDueDate);
                confirm({
                    title:formatMessage(messages.alarm1),
                    content:this.modalTips(l_action),
                    okText:formatMessage(messages.alarm3),
                    cancelText:formatMessage(messages.alarm4),
                    onOk() {

                        if (l_action === 1) {
                            if (!search_id) {
                                message.error(formatMessage(messages.order1))
                                return
                            }
                        }

                        if (l_action === 10) {
                            if (!comment) {
                                message.error(formatMessage(messages.order3));
                                return
                            }
                        }

                        values.rate = l_rate;
                        values.touser_id = to_user;
                        values.pic_source = fileList2?JSON.stringify(_util.setSourceList(fileList2)):null;
                        values.action = l_action;
                        values.task_id = id;
                        values.comment=comment;
                        values.project_id=_util.getStorage('project_id');
                        if(l_action === 10){
                            values.duedate=newDueDate
                        }

                        recordHandle(id,values).then((res) => {
                            if(res){
                                // if(l_action===11){
                                //     message.success(formatMessage(messages.workOrder21));
                                //     _this.handleCancel();
                                //     myOrderDetail(id).then((res) => {
                                //         _this.setState({
                                //             ...res.data.results
                                //         });
                                //     })
                                // }else{
                                    message.success('操作成功');
                                    _this.props.history.goBack()
                                // }
                            }
                        })
                    },
                })
            }
            this.setState({
                confirmLoading: false
            })
        })
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }

    handleMoneyChange =(value1,value2) => {
        console.log(value1)
        switch (value2) {
            case 'cost':this.setState({cost: value1});
            break;
            case 'comment':this.setState({comment: value1});
            break;
            case 'users':this.setState({to_user:value1});
            break;
            case 'date':this.setState({newDueDate: value1});
            break;
        }
    };

    actionWord=(item)=>{
        let word=''
        switch (item) {
            case 0:word='保存';
            break;
            case 1:word='分配';
            break;
            case 2:word='转派';
            break;
            case 3:word='退回';
            break;
            case 4:word='取回';
            break;
            case 5:word='执行';
            break;
            case 6:word='中断';
            break;
            case 7:word='确认';
            break;
            case 8:word='重派';
            break;
            case 9:word='关闭';
            break;
            case 10:word='拒绝';
            break;
            case 11:word='催单';
            break;
            case 12:word='撤销';
            break;
            case 13:word='完成';
            break;
            case 14:word='升级';
            break;
        }
        return word
    };

    getUser=(val)=>{
        this.setState({to_user:val.join(',')})
    };

     orgUpload = (info) => {
            let {fileList} = info;
            const status = info.file.status;
            const { formatMessage } = this.props.intl;
            if (status === 'done') {
                message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

            } else if (status === 'error') {
                message.error(`${info.file.name} ${info.file.response}.`)
            }

            this.setState({fileList2: fileList})
     };

     modalTips=(val)=>{
        const{to_user}=this.state;
        let from_user_id=_util.getStorage('userdata').id;
        console.log(to_user.id,from_user_id);
        let tip='';
        switch (val) {
            case 0:tip='';
            break;
            case 1:tip='任务将指派给组织执行人';
            break;
            case 2:tip='任务将转交给指定的人';
            break;
            case 3:tip='任务将退回给上一个人';
            break;
            case 4:tip='任务将从当前所在人处取回';
            break;
            case 5:tip='您作为执行人将承接该任务';
            break;
            case 6:tip='';
            break;
            case 7:tip='任务确认完成，将提交给任务发起人';
            break;
            case 8:tip='任务将转交给指定的人';
            break;
            case 9:tip='任务将被关闭';
            break;
            case 10:tip='你拒绝接受任务处理结果，任务将返工';
            break;
            case 11:tip='任务处理人将收到催单提醒';
            break;
            case 12:tip='任务将被撤销';
            break;
            case 13:if(parseInt(to_user.id)===parseInt(from_user_id)){
                        tip='任务完成后将提交给任务发起人'
                    }else{
                        tip='任务完成后将提交给组织执行人确认';
                    }
            break;
            case 14:tip='任务将被升级';
            break;
        }
        return tip;
     };

     printPage() {
            // const printHtml = this.refs.print.innerHTML;//这个元素的样式需要用内联方式，不然在新开打印对话框中没有样式
            // window.print(printHtml);
             // window.print();
           // console.log(window.document.getElementById('billDetails'))
           // window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML
           window.print();
           // window.location.reload();
     }

     genPDF=()=>{
        const printHtml = this.refs.print.innerHTML;
        console.log(printHtml)
        // const formHtml=`<div style="min-height: 1065px">${printHtml}</div>`;
        // //const formHtml=`<div>${printHtml}</div>`;
        // // console.log(formHtml);
        // const flowHtml= this.refs.flow.innerHTML;
        // const allHtml=formHtml+flowHtml;
        // const { formatMessage } = this.props.intl;

        const opt = {
            margin:       0.3,
            filename:     '我的工作流',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', orientation: 'portrait', format: 'a4', },
            // pagebreak: { mode:'avoid-all',before:'#flow'}
            // pagebreak:    { mode: ['avoid-all'] }
        };
        // html2pdf().set(opt).from(allHtml).save()
        html2pdf().set(opt).from(printHtml).toPdf().get('pdf').then(function (pdf) {
          window.open(pdf.output('bloburl'), '_blank')
        });
      };

     onSwitchChange=(value)=>{
         console.log(value);
         this.setState({switchDate:!value})
     };

    render() {
        const {
            serial, 
            fromuser_name, 
            fromuser_tel,
            fromuser_dep,
            fromuser_phone,
            cate_name, 
            priority_text, 
            location_name, 
            duedate, 
            created_time, 
            content, 
            rate_text,
            pic_source,
            status,
            flows,
            userlists,
            createuser_id,
            currentUser,
            fileList,
            previewVisible,
            previewImage,
            last_person,
            current_person,
            total_time,
            cost,
            comment,

            available_actions,
            file_source,
            from_user,
            id,
            is_important,
            is_escalation,
            updated_time,
            current_user,
            fileList2,
            flowsObj,
            user_list,
            org_name,
            to_user,
            is_overdue,
            can_modify_duedate,
            newDueDate,
            switchDate,area_name
        } = this.state;

        console.log(can_modify_duedate,newDueDate);

        const {getFieldDecorator} = this.props.form
        let iscurrent = false
        let userLen = 0

        if (userlists) {       
            userLen = userlists.split(',').length
            iscurrent = (currentUser === userlists.split(',')[userLen - 1]) ? true : false
            console.log(iscurrent)
        }

        const formModalLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        const tableData = [
            {
                text:'任务类型',
                value:  _util.getOrNull(cate_name)
            },
             {
                text:'组织',
                value:  _util.getOrNull(org_name)
            },
            {
                text:'任务单编号',
                value:<span>{is_important?<Icon type="flag" style={{color:'#ED5565'}}/>:null}{serial}</span>
            },
             {
                text: '状态',
                value:  _util.getOrNull(status)
            },
            {
                text:'发起人',
                value:  _util.getOrNull(from_user&&from_user.name)
            },
            {
                text: '发起人组织',
                value:  _util.getOrNull(from_user&&from_user.org)
            },
            {
                text:'发起人联系电话',
                value: _util.getOrNull(from_user&&from_user.phone)
            },
            {
                text:'任务区域',
                value: _util.getOrNull(area_name)
            },
            {
                text: '是否升级',
                value:is_escalation?<Tag color='#ff0000'>是</Tag>:<Tag color='#87d068'>否</Tag>
            },
            // {
            //     text: <FormattedMessage id="page.work.my.title18" defaultMessage="厂区地点"/>,
            //     value:  _util.getOrNull((factory_name ? factory_name : '') +'  ' + (location_name ? location_name : ''))
            // },
            // {
            //     text: <FormattedMessage id="page.work.my.title7" defaultMessage="上一处理人"/>,
            //     value:  _util.getOrNull(last_person)
            // },
            {
                text: <FormattedMessage id="page.work.my.title8" defaultMessage="当前处理人"/>,
                value:  <span>{current_user&&current_user.name?current_user.name+' '+" "+current_user.org+' '+' '+current_user.phone:'-'}</span>
            },
            {
                text:'执行人',
                value:<span>{to_user&&to_user.name?to_user.name+' '+" "+to_user.org+' '+' '+to_user.phone:'-'}</span>
            },
            {
                text: '创建时间',
                value:  _util.getOrNull(created_time)
            },
            // {
            //     text: <FormattedMessage id="page.work.my.title14" defaultMessage="总计用时"/>,
            //     value:  total_time?_util.formatDuring(total_time):'-'
            // },
            // {
            //     text: <FormattedMessage id="page.work.my.cost1" defaultMessage="花费金额(元)"/>,
            //     value:cost?cost:'-'
            // },
            {
                text: '截止日期',
                value:  _util.getOrNull(duedate)
            },
            {
                text:'是否逾期',
                value:  _util.getOrNull(is_overdue?'是':'否')
            },
            // {
            //     text:<FormattedMessage id="page.work.my.createdTime" defaultMessage="工单创建时间"/>,
            //     value:  _util.getOrNull(created_time)
            // },
            {
                text: '任务内容',
                value:  _util.getOrNull(content)
            },
            {
                text: <FormattedMessage id="app.page.text.picture" defaultMessage="图片"/>,
                value:  <div className={stylesCard.taskPic}>{pic_source && pic_source.split(',').length > 0 ?
                <Upload fileList={fileList}  listType="picture-card" showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}/>
                    : '-'}</div>
            },
            {
                text: <FormattedMessage id="page.order.myOrder.flowObj" defaultMessage="流转记录"/>,
                value:  <div>
                    {Array.isArray(flowsObj) && flowsObj.length > 0
                        ? <Timeline style={{margin: '5px auto -25px'}} >
                            {flowsObj.map((flow, flowIndex) => {
                                console.log(flow);
                                // color={flowIndex===flowsObj.length-1?'grey':'blue'}
                                    return (<Timeline.Item key={flowIndex} color={'blue'}>
                                            <div className={''}>
                                                {flow.message ?
                                                    <div className={stylesCard.line} style={{marginBottom: '5px'}}>
                                                       {flow.message} {(flow.fields.action === 4 && rate_text) ? rate_text : null}
                                                    </div>
                                                :null}

                                                 {flow.fields.comment?
                                                    <div className={stylesCard.line} style={{marginBottom: '5px'}}>
                                                        <FormattedMessage id="app.component.tablepage.remark" defaultMessage="备注"/>:&emsp;{_util.getOrNull(flow.fields.comment)}
                                                    </div>
                                                :null}

                                                {/*<div className={stylesCard.line}>*/}
                                                    {flow.fields.pic_source ?
                                                        <Upload listType={'picture-card'} fileList={flow.flow_source} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}/>
                                                    : null}
                                                {/*</div>*/}

                                                <div className={stylesCard.line}>
                                                    {moment(flow.fields.created_time).format('YYYY-MM-DD HH:mm:ss')}
                                                </div>
                                            </div>
                                        </Timeline.Item>
                                    )
                                })
                            }
                        </Timeline>
                        : '-'}
                </div>
            },
        ];

        const { formatMessage } = this.props.intl;

        const bread = [
          {
            name:'首页',
            url: "/"
          },
          {
            name:'任务管理'
          },
          {
            name:'我的任务',
            url: "/system/work/type"
          }
        ];

        const props2 = {
          multiple: true,
          accept: "image/*",
          action: _util.getServerUrl(`/upload/auth/`),
          headers: {
              Authorization: 'JWT ' + _util.getStorage('token')
          },
        };

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper content-no-table-wrapper" style={{position: 'static'}}>

                    <div ref={'print'} className={styles.printarea}>
                       <CardDetail  title={<FormattedMessage id="page.task.myOrder.orderDetail" defaultMessage="任务详情"/>} data={tableData}  />
                    </div>

                <div style={{textAlign:'center'}}>
                        {available_actions&&available_actions.map((item,index)=>{
                            return <Button
                                key={index}
                                type={item===14?'danger':'primary'}
                                onClick={() => this.operateOrder(this.actionWord(item), item)}
                                style={{marginRight: '10px'}}>{this.actionWord(item)}
                            </Button>
                        })}

                        {/*<Button style={{marginRight: '10px'}} onClick={this.genPDF}>导出</Button>*/}
                        <Button style={{marginRight: '10px'}} onClick={this.printPage}>打印</Button>
                        <GoBackButton
                            // style={{display: 'block', margin: '0 auto'}}
                            props={this.props}
                            noConfirm />
                    </div>

                    <Modal
                                // title={this.state.action}
                                title={<FormattedMessage id="page.system.accessType.operate" defaultMessage="操作"/>}
                                visible={this.state.visible}
                                onOk={this.handleSubmit}
                                onCancel={this.handleCancel}
                                okText={formatMessage({ id:"app.component.tablepage.okText", defaultMessage:"提交"})}
                                cancelText={'取消'}
                                // footer={null}
                            >
                            {/*<Form onSubmit={this.handleSubmit}>*/}
                            <Form>
                                {[2,8,10].indexOf(this.state.l_action)>-1 ?
                                    <div>
                                        <FormItem label={'组织'}{...formModalLayout} style={{marginBottom:'8px'}}>
                                            <span>{org_name}</span>
                                        </FormItem>

                                        <FormItem {...formModalLayout} label={<FormattedMessage id="page.order.myOrder.sendTo" defaultMessage="派发给"/>} required style={{marginBottom:'8px'}}>
                                        {/*<SearchUserSelect getUser={this.getUser}/>*/}
                                        <Select style={{ width: '100%'}} placeholder={'请选择'} onChange={value => this.handleMoneyChange(value,'users')}>
                                            {user_list && user_list.length ?
                                                user_list.map((option, index) => {
                                                    return (<Option key={option.id} value={option.id}>{option.name}</Option>)
                                                }) : null
                                            }
                                        </Select>
                                        </FormItem>
                                    </div> : null}

                                     {
                                        can_modify_duedate&&this.state.l_action==10?<FormItem label={'截止日期'}  {...formModalLayout} required={true} style={{marginBottom:'8px'}}>
                                          <DatePicker
                                              allowClear={false}
                                              // disabled={!switchDate}
                                              placeholder={formatMessage(messages.inCon6)}
                                              onChange={date => this.handleMoneyChange(date ? date.format('YYYY-MM-DD') : null, 'date')}
                                              value={newDueDate ? moment(newDueDate) :undefined}
                                              disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                                              style={{ width: '100%' }}
                                          />
                                          {/*<Switch value={switchDate} checkedChildren="修改" style={{marginLeft:"10px"}} onChange={()=>this.onSwitchChange(switchDate)}/>*/}
                                    </FormItem>:null
                                    }

                                {/*{this.state.l_action === 3 ? <FormItem*/}
                                    {/*label={<FormattedMessage id="page.work.detail,money" defaultMessage="金额"/>}*/}
                                    {/*{...formItemLayout}*/}

                                    {/*>*/}
                                    {/*<Input*/}
                                          {/*style={{width:'100%'}}*/}
                                          {/*value={cost}*/}
                                          {/*prefix="￥"*/}
                                          {/*placeholder={formatMessage(messages.workOrder12)}*/}
                                          {/*// formatter={value => `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                                          {/*// parser={value => value.replace(/\¥\s?|(,*)/g, '')}*/}
                                          {/*onChange={e=>this.handleMoneyChange(e.target.value,'cost')}*/}
                                    {/*/>*/}
                                {/*</FormItem> : null}*/}

                                {/*{this.state.l_action === 4 ? <FormItem*/}
                                    {/*label={<FormattedMessage id="page.work.my.title15" defaultMessage="评价"/>}*/}
                                    {/*{...formItemLayout}>*/}
                                    {/*<Rate onChange={this.handleStarChange} value={this.state.l_rate} />*/}
                                    {/*{rates[this.state.l_rate - 1]}*/}
                                {/*</FormItem> : null}*/}

                                <FormItem
                                    label={<FormattedMessage id="page.carryout.goods_record.remarks" defaultMessage="备注" />}
                                    hasFeedback
                                    required={this.state.l_action === 10}
                                    style={{marginBottom:'8px'}}
                                    {...formModalLayout}>
                                    <TextArea placeholder={formatMessage(messages.alarm34)} value={comment} onChange={e=>this.handleMoneyChange(e.target.value,'comment')}/>
                                </FormItem>

                                <FormItem {...formModalLayout} style={{marginBottom:'8px'}} label={'附件'} extra={'图片格式jpg jpeg png'}>
                                    <Upload
                                        {...props2}
                                        fileList={fileList2}
                                        beforeUpload={_util.beforeUpload}
                                        onChange={this.orgUpload}
                                        //customRequest={this.fileUpload}
                                        accept='image/*'
                                        //onRemove={this.handleRemove}
                                      >
                                      <Button>
                                          <Icon type="upload" />上传
                                      </Button>
                                      </Upload>

                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleUploadCancel}>
                                        <img alt='' style={{width: '100%'}} src={previewImage}/>
                                    </Modal>
                                </FormItem>
                            </Form>
                            </Modal>
                </div>
            </div>
        )
    }
}

const MyOrderDetail = Form.create()(MyOrderDetailForm)

export default injectIntl(MyOrderDetail)

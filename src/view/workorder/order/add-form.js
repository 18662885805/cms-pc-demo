import React from 'react'
import {
    Form,
    Button,
    Modal,
    Spin,
    message,
    Upload,
    Icon,
    Row,
    Col, Select, Input, DatePicker, Cascader, Card, Rate,Switch
} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import GoBackButton from '@component/go-back'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {typeOrder,typeCategory} from '@apis/workorder/order-type'
import {rule,ruleUser} from '@apis/workorder/rule'
import {area,getArea} from '@apis/workorder/area'
import {recordPost,recordPut,recordDetail} from '@apis/workorder/order'
import SearchUserSelect from '@component/searchUserSelect'
import {SearchStaffTypeByOrg} from '@apis/home';
import {GetTemporaryKey} from "@apis/account/index"

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option;
const {TextArea} = Input

let _util = new CommonUtil()

@inject('menuState') @observer
class MyOrderAddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            formData: {},
            spinLoading: false,
            fileList: [],
            previewVisible: false,
            previewImage: '',
            factory_options:[],
            priority_options:[],
            type_options:[],
            type_info:[],
            remarkShow:false,
            userOptions:[],
            user_id:undefined,
            user_name:undefined,
            isEdit:false,
            currentUser:_util.getStorage('userInfo').id,
            data: [],
            action: '',
            visible: false,
            cost:undefined,
            comment:undefined,
            fetching:false,
            fileListFlow: [],
            role_list:[],
            postData:{
                cate_name:'',
                duedate:undefined,
                content:'',
                to_org:undefined,
                is_important:false,
                is_escalation:false,
                area:undefined,
                to_user:undefined,
                from_user:_util.getStorage('userdata').id,
                cate:undefined,
            },
            user_list:[],
            area_list:[],
            fileList2:[],
            to_user:undefined,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleArea=this.handleArea.bind(this);
    }

    componentWillMount() {
        const { setFieldsValue } = this.props.form;
        const { state } = this.props.location;
        let { postData} = this.state;
        console.log(state);

        const { formatMessage } = this.props.intl;

        if (state&&state.id) {
            recordDetail(state.id,{project_id:_util.getStorage('project_id')}).then((res) => {
                let data=cloneDeep(res.data);

                // 执行人
                ruleUser({project_id:_util.getStorage('project_id'),search_org_id:data.to_org}).then((res)=>{
                   this.setState({user_list:res.data});
                });
                data.to_user=data.to_user&&data.to_user.id;
                data.from_user=data.from_user&&data.from_user.id;
                // data.area=[1,5];

                this.setState({
                    // spinLoading: false,
                    postData:data,
                    id:state.id,
                });

                // 图片
                if(data&&data.pic_source){
                   //转换前端格式
                   var that = this;
                   var cos = _util.getCos(null,GetTemporaryKey);
                   const source_list = _util.switchToJson(data.pic_source);
                   if(source_list&&source_list.length){
                      this.setState({file_loading:true})
                      source_list.map((obj, index) => {
                          const key = obj.url;
                          cos.getObjectUrl({
                              Bucket: 'ecms-1256637595',
                              Region: 'ap-shanghai',
                              Key:key,
                              Sign: true,
                          }, function (err, data) {
                              if(data && data.Url){
                                  const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
                                  const new_list = [...that.state.fileList,file_obj];
                                  that.setState({fileList2:new_list});
                                  if(index == source_list.length - 1){
                                      that.setState({file_loading:false});
                                  }
                              }
                          });
                      });
                   }
                }
            })
        }else{
            postData.cate_name=state.type_name;
            postData.cate= state.type_id;
            this.setState({
                // spinLoading: false,
                postData
            });
        }

        getArea({project_id:_util.getStorage('project_id')}).then((res) => {
            let res_data=cloneDeep(res.data);
            // console.log(area_res)
            // if(area_res){
            //     area_arr.unshift(area_res[0].father)
            // }
            // console.log(area_arr)

            new Promise(
                function(resolve,reject){
                    let level1_array=[];
                    let level2_array=[];
                    let level3_array=[];
                    res.data.map(a=>{
                        a.label=a.name;
                        a.value=a.id;
                        a.children=[];
                        switch (a.level) {
                            case 1:level1_array.push(a);
                            break;
                            case 2:level2_array.push(a);
                            break;
                            case 3:level3_array.push(a);
                            break
                        }
                    });
                    resolve([level1_array,level2_array,level3_array])
                }
            ).then(
                (res)=>{
                    res[1].map(item2=> {
                        res[2].map(item3 => {
                            if (item3.father === item2.id) {
                                item2.children.push(item3)
                            }
                        });
                    });

                    res[0].map(item1=>{
                        res[1].map(item2=>{
                            if(item2.father===item1.id){
                                item1.children.push(item2)
                            }
                        })
                    });

                    console.log(res[0]);
                    this.setState({area_list:res[0]})

                    let _this=this;
                    setTimeout(function () {
                        const{postData}=_this.state;

                     if(postData.area){
                        // 区域第三个
                        let area_arr=[];
                        area_arr.unshift(postData&&postData.area);

                        //区域第二个
                        let area2=_this.handleArea(res_data,postData&&postData.area);
                        if(area2){
                            area_arr.unshift(area2);
                            // 区域第一个
                            let area3=_this.handleArea(res_data,area2);
                            if(area3){
                                area_arr.unshift(area3);
                            }
                        }

                        console.log(area_arr);
                        postData.area=area_arr;
                        _this.setState(postData);
                     }
                    },800)
                }
            );
        });

        this.props.menuState.changeMenuCurrentUrl('/assignment/record')
        this.props.menuState.changeMenuOpenKeys('/assignment');

        SearchStaffTypeByOrg({project_id:_util.getStorage('project_id')}).then(res => {
          if(res.data){
              this.setState({role_list:res.data})
          }
        });
    }

    handleArea=(param1,param2)=>{
        let area_res=param1.filter(a=>{
                return a.id===param2
        });
        if(area_res&&area_res.length){
            return area_res[0].father
        }
    };

    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            const { formatMessage } = this.props.intl;
            const {postData,fileList2,id} =this.state;
            console.log(values);
            console.log(postData);
            // if (!err) {
                let _this = this;
                confirm({
                    title:formatMessage(messages.alarm1),
                    content:formatMessage(messages.alarm2),
                    okText:formatMessage(messages.alarm3),
                    cancelText:formatMessage(messages.alarm4),
                    onOk() {
                        let post_values = cloneDeep(postData);
                        //post_values.from_user=108;
                        post_values.project_id = _util.getStorage('project_id');
                        post_values.pic_source = JSON.stringify(_util.setSourceList(fileList2));
                        post_values.area=postData.area&&postData.area.length?postData.area[postData.area.length-1]:null;

                        _this.setState({confirmLoading: true})

                        if(id) {
                            recordPut(id,post_values).then(res => {
                                message.success(formatMessage(messages.alarm5));
                                _this.setState({
                                    confirmLoading: false
                                });
                                _this.props.history.goBack()
                            }).catch(err => {
                                _this.setState({
                                    confirmLoading: false
                                })
                            });
                        // }else if (_this.props.location.state && state.label.indexOf('facility') > -1) {
                         }else {
                            recordPost(post_values).then((res) => {
                                message.success(formatMessage(messages.alarm7))
                                _this.setState({
                                    confirmLoading: false
                                });
                                _this.props.history.goBack()
                                // _this.props.history.push({
                                //     pathname: path,
                                //     state: {
                                //       id: res.data.results.id
                                //     }
                                //   })
                            }).catch(err => {
                                _this.setState({
                                    confirmLoading: false
                                })
                            });
                        }
                    },
                })
            // }

        })
    }

    handleUploadChange = ({ fileList, file }) => {
        if (file) {
            const { status } = file
            if (status === 'uploading') {
                this.props.menuState.changeFetching(true)
            } else {
                this.props.menuState.changeFetching(false)
            }
        }
        this.setState({ fileList })
    };

    handlePostData = (value, field) => {
          const { postData,type_options} = this.state;
          const { setFieldsValue } = this.props.form;
          const { formatMessage } = this.props.intl;
          let{type_info}=this.state;

          console.log(value);

          if(field==='to_org'){
              ruleUser({project_id:_util.getStorage('project_id'),search_org_id:value}).then((res)=>{
                   this.setState({user_list:res.data});
                   return res
                   // postData['to_user']=res.data[0].id;
              }).then((res)=>{
                  if(res.data&&res.data.length){
                      postData['to_user']=res.data[0].id;
                  }else{
                      postData['to_user']=undefined;
                  }
                  this.setState(postData);
              });
              postData[field]=value;
              this.setState(postData);
          }else{
              postData[field]=value
              this.setState(postData);
          }
    };

      handleChange = (value, obj) => {
        this.setState({
            search_id: obj ? obj.props.title : null,
            data: [],
            fetching: false,
            user: value
        })
    };

    handleOk(e){
        console.log(1)
         if(e){
             e.preventDefault()
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this;
                const { formatMessage } = _this.props.intl;
                confirm({
                    title:formatMessage(messages.alarm1),
                    content:formatMessage(messages.alarm2),
                    okText:formatMessage(messages.alarm3),
                    cancelText:formatMessage(messages.alarm4),
                    onOk() {
                        const {l_rate, l_action, id, search_id,comment,cost} = _this.state
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

                        let pics = [];
                        _this.state.fileListFlow.forEach((file, index) => {
                            pics.push(file.response.content.results.url)
                        })
                        values.rate = l_rate;
                        values.touser_id = search_id;
                        values.pic_source = pics.join();
                        values.action = l_action;
                        values.id = id
                        values.comment=comment;
                        l_action===3?values.cost=cost:null;

                        myOrderHandlePost(values).then((res) => {
                            if(res){
                                if(l_action===11){
                                    message.success(formatMessage(messages.workOrder21));
                                    _this.handleCancel();
                                    myOrderDetail(id).then((res) => {
                                        _this.setState({
                                            ...res.data.results
                                        });
                                    })
                                }else{
                                    message.success(formatMessage(messages.alarm7));
                                    _this.props.history.goBack()
                                }
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
    }
    // onSwitchChange=(checked,field)=>{
    //     const{postData}=this.state;
    //     postData[field]=checked;
    //     this.setState(postData)
    // };

    render() {
        const {getFieldDecorator} = this.props.form
        const {id,confirmLoading, formData, spinLoading, fileList,
            postData,type_options,userOptions,user_id,isEdit,type_info,userlists,createuser_id,currentUser,status,cost,
            comment,fetching,user,data,fileListFlow,can_modify,role_list,user_list,area_list,fileList2} = this.state;

        console.log(postData);

        let iscurrent = false;
        let userLen = 0;

        if (userlists) {
            userLen = userlists.split(',').length
            iscurrent = (currentUser === userlists.split(',')[userLen - 1]) ? true : false
        }

        const formItemLayout={labelCol:{sm: {span: 6},xs: {span: 24}},
            wrapperCol:{sm: {span: 16},xs: {span: 24}}};

        const { formatMessage } = this.props.intl;

         const bread = [
          {
              name: <FormattedMessage id="page.accessory.bread.homepage" defaultMessage="首页"/>,
              url: '/'
          },
          {
              name:'任务管理',
          },
          {
              name: '我的任务',
              url: '/assignment/record'
          },
            {
              name: id ? '修改':<FormattedMessage id="component.tablepage.add" defaultMessage="新增" />,
              url: ''
          }
        ];

        postData.fromuser_name=_util.getStorage('userInfo').real_name;
        postData.fromuser_dep=_util.getStorage('userInfo').department;
        postData.fromuser_phone=postData.fromuser_phone?postData.fromuser_phone:_util.getStorage('userInfo').phone;
        postData.fromuser_tel=_util.getStorage('userInfo').tel;
        postData.fromuser_id=postData.fromuser_id?postData.fromuser_id:_util.getStorage('userInfo').id;

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
                <div className="content-wrapper content-no-table-wrapper" id="onestop">
                    <Spin spinning={spinLoading}>
                        {/*<Card*/}
                                {/*title={<FormattedMessage id="page.workOrder.cardOperation.applyerInfo" defaultMessage="报修人信息"/>}*/}
                                {/*style={{marginBottom: '15px'}} bordered={false}>*/}
                                {/*<Row gutter={24}>*/}
                                    {/*<Col span={6} >*/}
                                            {/*<FormItem {...formItemInfo}*/}
                                                {/*label={<FormattedMessage id="page.workOrder.cardOperation.realName" defaultMessage="报修人"/>}*/}
                                            {/*>*/}
                                                {/*{postData.fromuser_name}*/}
                                            {/*</FormItem>*/}
                                    {/*</Col>*/}

                                    {/*<Col span={6} >*/}
                                            {/*<FormItem {...formItemInfo}*/}
                                                {/*label={<FormattedMessage id="page.workOrder.cardOperation.userDepartment" defaultMessage="报修人部门"/>}*/}
                                            {/*>*/}
                                                {/*{postData.fromuser_dep?postData.fromuser_dep:'-'}*/}
                                            {/*</FormItem>*/}
                                    {/*</Col>*/}

                                    {/*<Col span={6} >*/}
                                            {/*<FormItem {...formItemInfo}*/}
                                                {/*label={<FormattedMessage id="page.workOrder.cardOperation.tel" defaultMessage="报修人座机"/>}*/}
                                            {/*>*/}
                                                {/*{postData.fromuser_tel}*/}
                                            {/*</FormItem>*/}
                                    {/*</Col>*/}

                                    {/*<Col span={6} >*/}
                                            {/*<FormItem {...formItemInfo}*/}
                                                {/*label={<FormattedMessage id="page.workOrder.cardOperation.telPhone" defaultMessage="报修人手机"/>}*/}
                                            {/*>*/}
                                                {/*{getFieldDecorator('fromuser_phone', {*/}
                                                    {/*initialValue:postData?postData.fromuser_phone: null,*/}
                                                    {/*rules: [{required: true, message:formatMessage(messages.inCon6)}],*/}
                                                {/*})(<Input placeholder={formatMessage(messages.workOrder6)} onChange={e => this.handlePostData(e.target.value, 'fromuser_phone')} />)}*/}
                                            {/*</FormItem>*/}
                                    {/*</Col>*/}
                                {/*</Row>*/}
                            {/*</Card>*/}

                        <Card
                          title={'任务信息'}
                          //title={<FormattedMessage id="page.oneStop.cardOperation.cardMakerInfo" defaultMessage="办证人信息"/>}
                          style={{ marginBottom: '15px' }}
                          bordered={false}>
                            {/*<Form onSubmit={this.handleSubmit} style={{width:'60%',marginLeft:'15%'}}>*/}
                            <Form style={{width:'60%',marginLeft:'15%'}}>
                                 <FormItem label={'任务类型'} {...formItemLayout}>
                                    <span>{postData.cate_name}</span>
                                  </FormItem>

                                <FormItem label={'组织'} {...formItemLayout} required>
                                    {getFieldDecorator('to_org', {
                                        initialValue:postData&&postData.to_org?postData.to_org:undefined,
                                        rules: [{required: true, message:formatMessage(messages.inSelect)}],
                                    })(
                                    <Select style={{ width: '100%'}} defaultValue={postData?postData.to_org:undefined} placeholder={'请先选择组织'} onSelect={value => this.handlePostData(value,"to_org")} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                       {role_list && role_list.length ?
                                                role_list.map((option, index) => {
                                                    return (<Option key={option.org_id} value={option.org_id}>{option.org_name}</Option>)
                                                        {/*<Option key={option.id} value={option.id} disabled={!option.is_service} style={{color:option.id==='0'?'#001A50':'reset'}}>{option.desc+'（'+option.user_name+"）"}<span style={{float:'right'}}>{option.is_service&&option.id!=='0'?'在线':!option.is_service&&option.id!=='0'?'离线':''}</span></Option>*/}

                                                }) : null
                                         }
                                    </Select>)}
                                  </FormItem>

                                <FormItem label={'执行人'} {...formItemLayout} required>
                                    {getFieldDecorator('to_user', {
                                        initialValue:postData&&postData.to_user?postData.to_user:undefined,
                                        rules: [{required: true, message:formatMessage(messages.inSelect)}],
                                    })(<Select style={{ width: '100%'}} defaultValue={postData?postData.to_user:undefined} placeholder={'请选择执行人'} onSelect={value => this.handlePostData(value,"to_user")} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        {user_list && user_list.length ?
                                                user_list.map((option, index) => {
                                                    return (<Option key={option.id} value={option.id}>{option.name}</Option>)
                                                }) : null
                                        }</Select>
                                        )}
                                  </FormItem>

                                 <FormItem label={'任务区域'} {...formItemLayout}>
                                    {getFieldDecorator('area', {
                                        initialValue:postData&&postData.area?postData.area:undefined,
                                        // rules: [{required: true, message:formatMessage(messages.inSelect)}],
                                    })(
                                        <Cascader  options={area_list} changeOnSelect  placeholder={'请选择任务执行的区域'} onChange={value => this.handlePostData(value,"area")}/>
                                      )
                                    }
                                 </FormItem>

                                <FormItem {...formItemLayout} label={'截止日期'} required>
                                    {getFieldDecorator('duedate', {
                                        initialValue:postData&&postData.duedate?moment(postData.duedate):undefined,
                                        rules: [{required: true, message:formatMessage(messages.inCon6)}],
                                    })(<DatePicker
                                          allowClear={false}
                                          placeholder={formatMessage(messages.inCon6)}
                                          onChange={date => this.handlePostData(date ? date.format('YYYY-MM-DD') : null, 'duedate')}
                                          // value={postData.due_date ? moment(postData.duedate) :moment().add(3,'days').format('YYYY-MM-DD')}
                                          disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                                          style={{ width: '100%' }}
                                        />
                                    )}
                                  </FormItem>

                                <FormItem {...formItemLayout} label={'重要程度'} required>
                                    <Switch checkedChildren="重要" checked={postData&&postData.is_important} unCheckedChildren="普通" onChange={(value)=>this.handlePostData(value,'is_important')}/>
                                  </FormItem>

                                <FormItem {...formItemLayout} label={'是否升级'} required>
                                    <Switch checkedChildren="是" checked={postData&&postData.is_escalation} unCheckedChildren="否" onChange={(value)=>this.handlePostData(value,'is_escalation')}/>
                                  </FormItem>

                                <FormItem label={'任务内容'} {...formItemLayout} required>
                                    {getFieldDecorator('content', {
                                        initialValue:postData?postData.content: null,
                                        rules: [{required: true, message:formatMessage(messages.inCon6)}],
                                    })(<Input placeholder={'请详细描述该任务'} onChange={e => this.handlePostData(e.target.value, 'content')} />)}
                                 </FormItem>

                                    <FormItem  {...formItemLayout}
                                      label={'附件'}
                                      extra={'图片格式jpg jpeg png'}
                                      // required
                                  >
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
                                  </FormItem>

                                    {/*<Col >*/}
                                        <div style={{width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'center'}}>
                                            {id?
                                                <Button type="primary" htmlType="submit" onClick={this.handleSubmit} loading={confirmLoading} style={{marginRight: '10px'}}>
                                                     修改并提交
                                                </Button>
                                                : <Button type="primary" onClick={this.handleSubmit} htmlType="submit" loading={confirmLoading} style={{marginRight: '10px'}}>
                                                     <FormattedMessage id="app.component.tablepage.okText" defaultMessage="提交"/>
                                                  </Button>
                                            }

                                            <GoBackButton props={this.props}/>
                                        </div>
                                    {/*</Col>*/}

                                {/*</Row>*/}
                            </Form>
                        </Card>
                    </Spin>

                </div>
            </div>
        )
    }
}

const MyOrderAdd = Form.create()(MyOrderAddForm)

export default injectIntl(MyOrderAdd)

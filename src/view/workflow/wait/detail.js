import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input, Collapse,Card,Timeline,Upload,Icon} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { wait, waitDetail,waitAudit,waitBack,waitStop,waitProxy,waitJump } from "@apis/workflow/wait";
import GoBackButton from "@component/go-back";
import FormBuilder from "@component/FormBuilder";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import SearchUserSelect from '@component/searchUserSelect'
import FlowCardDetail from '@component/flowCardDetail'
import {GetTemporaryKey} from "@apis/account/index"

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { Panel } = Collapse;
const {TextArea}=Input;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class WorkTypeAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      factoryList: [],
      is_parent: false,
      location_list: [],
      typeoption: [],
      param_info: undefined,
      form: undefined,
      approval: undefined,
      child_step_id:undefined,
      e_type:undefined,
      info:undefined,
      id:undefined,
    form_content:undefined,
    record:undefined,
    form_name:'',
    type:'',
    fileList2:[],
    postData:{
        remarks:'',
        source:'',
        cc:'',
      },
    proxy_id:undefined,
    };
  }

  componentDidMount() {
    const {id,work_flow_id} = this.props.location.state;

    if (id) {
      waitDetail(id, {work_flow_id:work_flow_id,project_id: _util.getStorage('project_id') }).then((res) => {
          console.log('res', res);
          let info=res.data;
          var new_list=[];
          if(info&&info.info&&info.info.record){
              if(info.info.record){
                  info.info.record.map((value,index)=>{
                      value.fileList=[];
                      if(value.source){
                        //转换前端格式
                         var that = this;
                         var cos = _util.getCos(null,GetTemporaryKey);
                         const source_list = _util.switchToJson(value.source);
                         if(source_list&&source_list.length){
                            source_list.map((obj, i) => {
                                const key = obj.url;
                                var url = cos.getObjectUrl({
                                    Bucket: 'ecms-1256637595',
                                    Region: 'ap-shanghai',
                                    Key:key,
                                    Sign: true,
                                }, function (err, data) {
                                    if(data && data.Url){
                                        const file_obj =  {url:data.Url,name:obj.name,uid:-(i+1),status: "done",cosKey:obj.url};
                                        value.fileList.push(file_obj)
                                    }
                                });
                            });
                         }
                      }
                  })
              }
          }

          console.log(info);
          this.setState({...info})
          //this.setState({...res.data});
      });
    }

    this.setState({spinLoading: false});
    this.props.menuState.changeMenuCurrentUrl("/workflow/record/wait");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  handleToApproval=(type)=>{
     this.setState({type:type,subVisible:true})
  };

  handleRemarkChange=(value,field)=>{
    const {postData}=this.state;
    postData[field]=value;
    this.setState(postData)
  };

  submitModal=()=>{
     const{child_step_id,e_type,info,id,type,postData,fileList2,proxy_id}=this.state;

     let data={
        project_id:_util.getStorage('project_id'),
        id:info.id,
        cc:postData.cc,
        remarks:postData.remarks,
        source:JSON.stringify(_util.setSourceList(fileList2))
     };

     const _this = this;
     if(type==='resolve'){
       data.step_id=child_step_id;
       data.operation=4;
       waitAudit(data).then((res) => {
          if(res){
            message.success('操作成功');
            _this.props.history.goBack();
          }
      });
     }else if(type==='reject'){
       data.step_id=child_step_id;
       data.operation=5;
       waitAudit(data).then((res) => {
          if(res){
            message.success('操作成功');
            _this.props.history.goBack();
          }
      });
     }else if(type==='back'){
       data.step_id=child_step_id;
       data.back_step_id=4;
       waitBack(data).then((res) => {
          if(res){
            message.success('退回成功');
            _this.props.history.goBack();
          }
      });
     }else if(type==='proxy'){
       data.step_id=child_step_id;
       if(proxy_id&&proxy_id.length>0){
           data.proxy_id=proxy_id.join(',');
           waitProxy(data).then((res) => {
              if(res){
                message.success('指定代理人成功');
                _this.props.history.goBack();
              }
          });
       }else{
           message.error('请先指定代理人');
       }
     }else if(type==='stop'){
       waitStop(data).then((res) => {
          if(res){
            message.success('已撤回成功');
            _this.props.history.goBack();
          }
      });
     }else if(type==='jump'){
       data.step_id=child_step_id;
       waitJump(data).then((res) => {
          if(res){
            message.success('跳过成功');
            _this.props.history.goBack();
          }
      });
     }
  };

  hideModal=()=>{
      let postData={
        remarks:'',
        source:'',
        cc:'',
      };
      this.setState({subVisible:false,postData,fileList2:[]})
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

  getUser=(val)=>{
    const{postData}=this.state;
    postData.cc=val.join(',');
    this.setState(postData)
  };

  getUser2=(val)=>{
    this.setState({proxy_id:val})
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {formatMessage} = this.props.intl;
    const {confirmLoading, spinLoading, location_list, data, typeoption,fileList2,
      org_type,param_info,form,approval,child_step_id,e_type,info,form_content,record,form_name,subVisible,type,postData} = this.state;

     const props2 = {
      multiple: true,
      accept: "image/*",
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    }

    // let test=[
    //     {demo: false,
    //   fieldName: "input0",
    //   icon: "edit",
    //   key: "input0",
    //   label: "项目名称",
    //   level: 1,
    //   name: "单行文本",
    //   required: false,
    //   requiredMessage: "",
    //   type: "input",
    //   value:'123'
    // },
    // {
    //   demo: false,
    //   fieldName: "radio1",
    //   icon: "check-circle",
    //   key: "radio1",
    //   label: "radio1",
    //   level: 1,
    //   name: "单选框组",
    //   optionRowShow: 3,
    //   options:[{label: "default1",value: "1"}, {label: "default2",value: "2"}],
    //   required: false,
    //   requiredMessage: "",
    //   type: "radio",
    //   value: "1",
    // }
    // ]

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };

    const tableData =  info?[
        {
           text:'编号',
           value: _util.getOrNull(info.code)
        },
        {
           text:'表单标题',
           value: _util.getOrNull(info.form_name)
        },
        {
           text:'表单描述',
           value: _util.getOrNull(info.form_desc)
        },
        {
           text:'表单内容',
           value: {form_content: _util.getOrNull(info.form_content), form_data: _util.getOrNull(info.form_data)}
        },
        {
           text:'审批流名称',
           value: _util.getOrNull(info.template_name)
        },
        {
           text:'审批流描述',
           value: _util.getOrNull(info.template_desc)
        },
        {
           text:'是否跳过',
           value: info.is_jump?'是':'否'
        },
        {
           text:'备注',
           value: _util.getOrNull(info.remarks)
        },
        {
            text:'审批进度',
            value:info.record
        },
        {
           text:'创建人',
           value: _util.getOrNull(info.created)
        },
        {
           text:'创建时间',
           value: _util.getOrNull(info.created_time)
        },
        {
           text:'更新时间',
           value: _util.getOrNull(info.updated_time)
        },
    ]:[];

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
          name: '待处理工作流',
          url: '/workflow/record/wait'
      },
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
              <FlowCardDetail
                data={tableData}
                title={'详情'}
              />

             <div style={{width: "100%", margin: "15px",textAlign:'center'}}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                          style={{marginRight: "10px"}}
                          onClick={()=>this.handleToApproval('resolve')}
                  >
                    通过
                  </Button>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                          style={{marginRight: "10px"}}
                          onClick={()=>this.handleToApproval('reject')}
                  >
                    拒绝
                  </Button>
                  {/*<Button type='primary' htmlType='submit' loading={confirmLoading}*/}
                          {/*style={{marginRight: "10px"}}*/}
                          {/*onClick={()=>this.handleToApproval('back')}*/}
                  {/*>*/}
                    {/*退回*/}
                  {/*</Button>*/}
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                          style={{marginRight: "10px"}}
                          onClick={()=>this.handleToApproval('proxy')}
                  >
                    委托
                  </Button>
                  {/*<Button type='primary' htmlType='submit' loading={confirmLoading}*/}
                          {/*style={{marginRight: "10px"}}*/}
                          {/*onClick={()=>this.handleToApproval('stop')}*/}
                  {/*>*/}
                    {/*已撤回*/}
                  {/*</Button>*/}
                  {/*<Button type='primary' htmlType='submit' loading={confirmLoading}*/}
                          {/*style={{marginRight: "10px"}}*/}
                          {/*onClick={()=>this.handleToApproval('jump')}*/}
                  {/*>*/}
                    {/*跳过*/}
                  {/*</Button>*/}
                  <GoBackButton props={this.props}/>
                </div>
          </Spin>
        </div>

        <Modal
            title={'操作'}
            style={{ top: 20 }}
            visible={subVisible}
            onOk={this.submitModal}
            onCancel={this.hideModal}
            okText={<FormattedMessage id="component.tablepage.sure" defaultMessage="确定" />}
            cancelText={<FormattedMessage id="page.oneStop.cardOperation.close" defaultMessage="关闭" />}
            destroyOnClose={true}
        >
              <Form  {...formItemLayout}>
                  {type==='proxy'?
                      <Form.Item label={'代理人'} required>
                         <SearchUserSelect getUser={this.getUser2}/>
                      </Form.Item>:null
                  }

                     <Form.Item label={'抄送人'}>
                         <SearchUserSelect getUser={this.getUser}/>
                    </Form.Item>

                    <Form.Item label={'备注'}>
                        <TextArea
                          placeholder="请输入"
                          style={{width:'100%'}}
                          onChange={(e)=>this.handleRemarkChange(e.target.value,'remarks')}
                        />
                    </Form.Item>

                    <Form.Item label={'附件'}>
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
                    </Form.Item>
              </Form>
            </Modal>
      </div>
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;

import React, { Component, Fragment}from "react";
import {Form, Button, Modal, Spin, message, Select, Input,Radio,Checkbox,InputNumber,Icon,Row,Col,Tag} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {approvalPost, approvalPut, approvalDetail} from "@apis/workflow/approval";
import GoBackButton from "@component/go-back";
import ApprovalStep from '@component/approvalStep3'
import SearchUserSelect from '@component/searchUserSelect'
import SearchUserTransfer from '@component/searchUserTransfer'
import { SearchProjectUser } from "@apis/system/user";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import styles from './index.css'
import { Scrollbars } from 'react-custom-scrollbars'
import debounce from 'lodash/debounce';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;
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
      postData:{
        name:"",
        final_result:undefined,
        is_begin_can_edit:false,
        step:[{name:'',deadline:1,user:[]}],
        cc:undefined,
        sponsor:undefined,
        sponsor_condition:1,
      },
      global_complete_rule:1,
      global_reject_next:2,
      id:undefined,
      step_array:undefined,
      steps:[{name:'',deadline:1,user:[]}],
      current:0,
      userVisiable:false,
      data: [],
      fetching: false,
      child_length:0,
      start_icon_height:0,
      new_user_list:[],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }



    componentDidMount(){
        if (this.props.match.params === undefined || this.props.match.params.id === undefined) {
            this.props.history.replace('/404')
        } else {
            const {id} = this.props.match.params;
            approvalDetail(id, {project_id: _util.getStorage('project_id') }).then(res => {
                if(res&&res.data){
                    this.setState({postData: res.data})
                    if(res.data.step&&res.data.step.length){
                      var new_steps = [];
                      var default_steps = res.data.step;
                      default_steps.map((s,sIndex) => {
                        const {id,name,deadline,user} = s;
                        var step_onj = {id:id,name:name,deadline:deadline,user:this.renderDefaultUser(user)}
                        new_steps.push(step_onj)
                      })
                      this.setState({steps:new_steps})
                    }
                }
            })
            

            this.setState({
                spinLoading: false,id:id
            });
            this.props.menuState.changeMenuCurrentUrl("/approval/flow/template");
            this.props.menuState.changeMenuOpenKeys("/workflow");
        }   
        
    }


  renderDataName = (list) => {
    if(list&&list.length){
      var nameList = [];
      list.map(item => {
        nameList.push(item.key)
      });
      var nameStr = nameList
      return nameStr
    }else{
      return []
    }
  }

  renderDefaultUser = (list) => {
    if(list&&list.length){
      var nameList = [];
      list.map(item => {
        var userObj = {key:item.id,label:item.name}
        nameList.push(userObj)
      });
      return nameList
    }else{
      return []
    }
  }

  handleSubmit=()=>{
    const{postData,id,steps}=this.state;
    let step_array=steps;
    
    let res=true;
    var step = [];
    if(step_array&&step_array.length){
      step_array.map((s,sIndex) => {
        var S_obj = {
          id:s.id ? s.id :'',
          name:s.name,
          deadline:s.deadline,
          user:this.renderDataName(s.user ? s.user :'')
        }
        step.push(S_obj)
      })
    }

    this.setState({confirmLoading: true});
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(res){
            let _this = this;
            const {formatMessage} = this.props.intl;

            let data=postData;
            data.project_id=_util.getStorage('project_id')
            data.step=JSON.stringify(step);

            confirm({
              title: '确认提交?',
              content: '单击确认按钮后，将会提交数据',
              okText: '确认',
              cancelText: '取消',
              onOk () {
                if (id) {
                  approvalPut(id, data).then((res) => {
                    message.success(formatMessage(translation.saved));
                    _this.props.history.goBack();
                  });
                  return;
                }
              },
              onCancel () {}
            });
        }else{
          message.error('每个步骤至少需要一名参与者');
        }
      }
    });

    this.setState({confirmLoading: false});
  };

  handleChange = (value,field) => {
    const {postData}=this.state;
    postData[field]=value;
    this.setState(postData)
  };

  handleCompleteChange = (value,field) => {
    const {global_complete_rule,global_reject_next}=this.state;
    let _this=this;
    if(field==='global_complete_rule'){
       confirm({
         title: '这将更改模板中所有步骤的完成规则',
         content: '建议使用下方的工作流生成器修改单个步骤',
         okText:'仍要更改',
         cancelText:'取消',
        onOk() {
          _this.setState({global_complete_rule:value})
        },
        onCancel() {},
      });
    }else if(field==='global_reject_next'){
      confirm({
        title: '这将更改此模板中所有步骤的否决规则',
        content: '建议使用下方的工作流生成器修改单个步骤',
        okText:'仍要更改',
         cancelText:'取消',
        onOk() {
          _this.setState({global_reject_next:value})
        },
        onCancel() {},
      });
    }
  };

  getUser=(val)=>{
    const{postData}=this.state;
    postData.cc=val.join(',');
    this.setState(postData)
  };

  getSponsor=(val)=>{
    const{postData}=this.state;
    postData.sponsor=val.join(',');
    this.setState(postData)
  };

  addStep=()=>{
    const{steps}=this.state;
    if(steps&&steps.length){
     var prevStep = steps[steps.length - 1];
     if(!prevStep.name){
       message.warning('请输入步骤名称')
       return
     }
     if(!prevStep.deadline){
       message.warning('请输入期限')
       return
     }
     if(!(prevStep.user&&prevStep.user.length)){
       message.warning('请输入参与人员')
       return
     }
     steps.push({name:'',deadline:1,user:[]});
     this.setState(steps)
    }else{
       steps.push({name:'',deadline:1,user:[]});
       this.setState(steps)
    }
    
 };

 handleStepContent = (index,field,value) => {
  const{steps}=this.state;
  steps[index][field]=value;
  this.setState(steps)
}

handleDeleteStep=(index1)=>{
  let _this=this;
  const{steps}=_this.state;
  confirm({
    title: '确认删除此步骤？',
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      steps.splice(index1,1);
      _this.setState(steps);
    },
    onCancel() {
    },
  });
};

showAddUserModal = (index) => {
  this.setState({userVisiable:true,detail_index:index})
}

handleChange2 = value => {
  console.log(value);
  this.setState({new_user_list:value})
};

hideUserModal=(index)=>{
  this.setState({userVisiable:false,new_user_list:[],detail_index:0})
};



fetchUser = value => {
  this.lastFetchId += 1;
  const fetchId = this.lastFetchId;
  this.setState({ data: [], fetching: true });
  SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') })
    .then(body => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const data = body.data.map(user => ({
        //text: `${user.org}  ${user.name}`,
        text: `${user.name}-${user.org}`,
        value: user.id,
      }));
      this.setState({ data, fetching: false });
    });
};

handleAddUser=()=>{
  const {new_user_list,user,detail_index,steps} = this.state;
  if(new_user_list&&new_user_list.length){
    new_user_list.forEach(u => {
      u.label = u.label.split('-')[0]
      //去重
      if(steps[detail_index].user&&steps[detail_index].user.length){
        //原人员列表有人
        var same_check = steps[detail_index].user.find(s => {
          return s.key == u.key
        });
        if(!same_check){
          steps[detail_index].user.push(u);
        }
      }else{
        //原人员列表无人
        steps[detail_index].user.push(u);
      }

    })
  }
  this.setState({steps:steps});
  this.hideUserModal();
};

deleteUser = (index,uIndex) => {
  const { steps } = this.state;
  if(steps[index].user&&steps[index].user.length){
    steps[index].user.splice(uIndex, 1);
    this.setState({steps:steps})
  }   
}

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, location_list, typeoption, org_type,postData,
      id,global_complete_rule,global_reject_next,steps,fetching, data,new_user_list} = this.state;

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

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10}
      }
    };

    const radioStyle = {
      display: 'inline-block',
      height: '30px',
      lineHeight: '30px',
    };

    const {formatMessage} = this.props.intl;

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
        name: formatMessage({
          id: "page.component.workFlow.approval1",
          defaultMessage: "审批流配置"
        }),
        url: "/approval/flow/template"
      },
      {
          name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ];

    console.log('1100','add-form',steps)

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form {...formItemLayout}>
              <Form.Item label="模板名称">
                {getFieldDecorator('name', {
                  initialValue:postData?postData.name:undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入模板名称',
                    },
                  ],
                })(<Input placeholder={'请输入模板名称'} value={postData.name} onChange={(e)=>this.handleChange(e.target.value,'name')}/>)}
              </Form.Item>


              <Form.Item label="工作流发起人">
                        <Row gutter={16}>
                          <Col span={12} >
                            <Select placeholder={'请选择'} value={postData.sponsor_condition} onChange={(value)=>this.handleChange(value,'sponsor_condition')}>
                                <Option value={1}>所有人员</Option>
                                <Option value={2}>具体的人</Option>
                            </Select>
                          </Col>
                          <Col span={12}>
                            <SearchUserTransfer getSponsor={this.getSponsor} conditionType={postData.sponsor_condition} sponsor={postData.sponsor}/>
                          </Col>
                        </Row>
                      </Form.Item>

              <Form.Item label="工作流发起人选项">
                <Checkbox checked={postData.is_begin_can_edit} onChange={(e)=>this.handleChange(e.target.checked,'is_begin_can_edit')}>
                当工作流开始时,发起人可以编辑步骤的期限和参与者
                </Checkbox>
              </Form.Item>


              <Form.Item label="最终传送–其他(抄送)收件人">
                <SearchUserSelect getUser={this.getUser} cc={postData.cc}/>
              </Form.Item>
              <div>
              <Row>
            <Col span={6} className={styles.start_style}>
              <p style={{fontSize:'14px'}}>步骤配置</p>
            </Col>

            <Col span={16}>
            <div className={styles.step_content}>
                      {steps&&steps.map((s,index)=>{
                          return(
                              <div className={styles.step_item}>
                                <div style={{width:'100%',height:'20px',textAlign:'right'}}>
                                  {
                                    index == 0 ? '' : <Icon type='delete' style={{color:'red'}} onClick={() => this.handleDeleteStep(index)}/>
                                  }
                                </div>
                                <Form.Item label="步骤名称" required>
                                  <Input 
                                    size='small' 
                                    value={steps&&steps[index]&&steps[index].name} 
                                    onChange={(e)=>this.handleStepContent(index,'name',e.target.value)}
                                  />
                                </Form.Item>
                                <Form.Item label="期限(天)" required>
                                  <InputNumber 
                                    size='small' 
                                    min={1} 
                                    value={steps&&steps[index]&&steps[index].deadline ? steps[index].deadline : 1} 
                                    onChange={(value)=>this.handleStepContent(index,'deadline',value)}
                                  />
                                </Form.Item>
                                <Form.Item label="参与人员" required>
                                  <ul style={{width:"100%"}}>
                                      {s.user&&s.user.length ? s.user.map((u,uIndex) => {
                                        return <li className={styles.user_item} value={u.key} key={u.key}>
                                            <span>{uIndex +1 }.{u.label}</span>
                                            <span>
                                              <Tag  color="red" style={{cursor:"pointer"}} onClick={() => this.deleteUser(index,uIndex)}>删除</Tag>
                                            </span>
                                          </li>
                                      }) :''}
                                  </ul>
                                  <Button className={styles.user_add_button} onClick={() => this.showAddUserModal(index)}>添加人员</Button>
                                </Form.Item>
                              </div>
                          )
                      })} 
                      <Button onClick={()=>this.addStep()}>新增步骤</Button>              
                  
            </div>
            </Col>
          </Row>
              </div>

              <FormItem {...submitFormLayout}>
                  <div style={{width: "100%", marginBottom: "20px"}}>
                    <Button type='primary' htmlType='submit' loading={confirmLoading}
                            style={{marginRight: "10px"}}
                            onClick={this.handleSubmit}
                    >
                      {id?'修改':<FormattedMessage id="app.button.save" defaultMessage="保存"/>}
                    </Button>
                    <GoBackButton props={this.props}/>
                  </div>
                </FormItem>
            </Form>
          </Spin>
        </div>

        <Modal
            title="添加人员"
            visible={this.state.userVisiable}
            onOk={this.handleAddUser}
            onCancel={this.hideUserModal}
            maskClosable={false}
            destroyOnClose={true}
            okText={'确定'}
            cancelText={'取消'}
          >
            <Form {...formItemLayout} style={{ width:'100%'}}>
              <Select
                mode="multiple"
                labelInValue
                placeholder="输入名字搜索"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange2}
                style={{ width: '410px' }}
                value={new_user_list}
              >
                {data.map(d => (
                  <Option key={d.value} value={d.value}>{d.text}</Option>
                ))}
              </Select>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;

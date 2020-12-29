import React, { Component, Fragment} from "react";
import {
  Card, Steps, Button, Input, Row, Col, Icon, Modal, Form, Select, Tooltip, Spin, Popconfirm,InputNumber,List,Tag, message
} from "antd";
import CardDetail from "../CardDetail";
import styles from './index.css'
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import debounce from 'lodash/debounce';
import { SearchProjectUser } from "@apis/system/user";
import CommonUtil from "@utils/common";
import {FormattedMessage} from "react-intl";
import moment from 'moment'
import { Scrollbars } from 'react-custom-scrollbars'

let _util = new CommonUtil();
const { confirm } = Modal;
const { Option } = Select;
const { Step } = Steps;

class approvalAddStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps:[{name:'',deadline:1,user:[]}],
      current:0,
      userVisiable:false,
      data: [],
      fetching: false,
      child_length:0,
      start_icon_height:0,
      new_user_list:[],
    };
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  componentDidMount() {
    if(this.props.steps&&this.props.steps.length){
      this.setState({steps:this.props.steps})
    }
  }

  componentWillReceiveProps(nextProps){
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

  
  onChange = current => {
    this.setState({ current });
  };


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


  hideUserModal=(index)=>{
    this.setState({userVisiable:false,new_user_list:[],detail_index:0})
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

  handleChange = value => {
    console.log(value);
    this.setState({new_user_list:value})
  };

  handleStepContent = (index,field,value) => {
    console.log(index,field,value)
    const{steps}=this.state;
    steps[index][field]=value;
    this.setState(steps)
  }


  showAddUserModal = (index) => {
    this.setState({userVisiable:true,detail_index:index})
  }



  render () {
    const {type} = this.props;
    const{steps,fetching, data,new_user_list}=this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
        <div>
          <Row>
            <Col span={6} className={styles.start_style}>
              <p style={{fontSize:type==='record'||type==='wait'?'12px':'14px'}}>步骤配置</p>
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
                          <Input size='small' value={steps&&steps[index]&&steps[index].name} onChange={(e)=>this.handleStepContent(index,'name',e.target.value)}/>
                        </Form.Item>
                        <Form.Item label="期限(天)" required>
                          <InputNumber size='small' min={1} max={999} value={steps&&steps[index]&&steps[index].deadline ? steps[index].deadline : 1} onChange={(value)=>this.handleStepContent(index,'deadline',value)}/>
                        </Form.Item>
                        <Form.Item label="参与人员" required>
                          <ul style={{width:"100%"}}>
                              {s.user&&s.user.length ? s.user.map((u,uIndex) => {
                                return <li className={styles.user_item} value={u.key} key={u.key}>
                                    <span>{u.label}</span>
                                    <Tag  color="red" style={{cursor:"pointer"}} onClick={() => this.deleteUser(index,uIndex)}>删除</Tag>
                                  </li>
                              }) :''}
                          </ul>
                          <div className={styles.user_add_button} onClick={() => this.showAddUserModal(index)}>添加人员</div>
                        </Form.Item>
                      </div>
                  )
                })} 
                {type==='approval'?<Button onClick={()=>this.addStep()}>新增步骤</Button>:null}
              </div>
            
            </Col>
          </Row>

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
                onChange={this.handleChange}
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
    )
  }
}

export default approvalAddStep;
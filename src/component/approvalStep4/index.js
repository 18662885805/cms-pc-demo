import React, { Component, Fragment} from "react";
import {
  Card, Steps, Button, Input, Row, Col, Icon, Modal, Form, Select, Tooltip, Spin, Popconfirm,InputNumber,List,Tag
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

class StepDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps:[{name:'',deadline:'',user:[]}],
      current:0,
      step_rule:false,
      step_name:"",
      step_detail:false,
      fa_index:undefined,
      son_index:undefined,
      global_reject_next:undefined,
      global_complete_rule:undefined,
      data: [],
      value: [],
      cc:[],
      fetching: false,
      child_length:0,
      start_icon_height:0,
      new_user_list:[],
      is_begin_can_edit:false
    };
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps){
    if(this.props.steps != newProps.steps){
      var default_steps = newProps.steps;
      var is_begin_can_edit = newProps.is_begin_can_edit;
      this.setState({is_begin_can_edit})
      if(default_steps&&default_steps.length){
        var new_steps = [];
        default_steps.map((s,sIndex) => {
          const {id,name,deadline,user} = s;
          var step_onj = {id:id,name:name,deadline:deadline,user:this.renderDefaultUser(user)}
          new_steps.push(step_onj)
        })
        this.setState({steps:new_steps})
      }
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

  addStep=()=>{
     const{steps}=this.state;
     steps.push({name:'',deadline:'',user:[]});
     this.setState(steps)
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
    this.setState({step_detail:false,new_user_list:[],detail_index:0})
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


  handleShowStatus=(status)=>{
    console.log(status);
    let status_desc='';
    switch (status) {
      case 3:status_desc='process';
      break;
      case 4:status_desc='finish';
      break;
      case 5:status_desc='error';
      break;
      default:status_desc='wait';
    }
    console.log(status_desc);
    return status_desc
  };



  handleStepContent = (index,field,value) => {
    console.log(index,field,value)
    const{steps}=this.state;
    steps[index][field]=value;
    this.setState(steps)
  }


  showAddUserModal = (index) => {
    this.setState({step_detail:true,detail_index:index})
  }

  //渲染列表中的数组数据
  renderDetailName(list){
    if(list&&list.length){
      var nameList = [];
      list.map(item => {
        nameList.push(item.label)
      });
      var nameStr = nameList.join(',')
      return nameStr
    }else{
      return null
    }
  }



  render () {
    const { leftWidth, rightWidth,type} = this.props;
    const{is_begin_can_edit,steps,current,step_rule,step_detail,
      step_name,fa_index,son_index,fetching, data, value,cc,
      child_length,start_icon_height,new_user_list}=this.state;

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
              <p style={{fontSize:'12px'}}>步骤配置:</p>
            </Col>

            <Col span={16}>
              <div className={styles.step_detail_content}>
              {steps&&steps.map((s,index)=>{
                  return(
                      <div className={styles.step_detail_item}>
                        <Row gutter={24}>
                          <Col span={12}>步骤名称:{s.name ? s.name :''}</Col>
                          <Col span={12}>{`期限(天):${s.deadline ? s.deadline :''}`}</Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={24}>参与人员:{this.renderDetailName(s.user ? s.user :'')}</Col>
                        </Row>
                      </div>
                  )
                })}    
              </div>
            </Col>
          </Row>

          <Modal
            title="添加人员"
            visible={this.state.step_detail}
            onOk={this.handleAddUser}
            onCancel={this.hideUserModal}
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

export default StepDetailView;
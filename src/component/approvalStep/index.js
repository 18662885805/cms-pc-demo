import React, { Component } from "react";
import {
  Card, Steps, Button, Input, Row, Col, Icon, Modal, Form, Select, Tooltip, Spin, Popconfirm
} from "antd";
import CardDetail from "../CardDetail";
import styles from './index.css'
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import debounce from 'lodash/debounce';
import { SearchProjectUser } from "@apis/system/user";
import CommonUtil from "@utils/common";
import {FormattedMessage} from "react-intl";
import moment from 'moment'

let _util = new CommonUtil();
const { confirm } = Modal;
const { Option } = Select;
const { Step } = Steps;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class approvalStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //steps:this.props.steps,
      //steps:[{complete_rule:undefined,reject_next:undefined,deadline:1,child:[]}],
      steps:[],
      current:0,
      step_rule:false,
      step_name:"",
      step_detail:false,
      fa_index:undefined,
      son_index:undefined,
      global_reject_next:undefined,
      global_complete_rule:undefined,
      is_begin_can_edit:undefined,
      data: [],
      value: [],
      cc:[],
      fetching: false,
      child_length:0,
      start_icon_height:0
    };
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  componentDidMount() {
    setTimeout(function () {
        //let steps=this.props.steps;
        this.props.steps&&this.props.steps.map(items=>{
          items.child.map(item=>{
            item.user_info=item.user;
            if(item.user){
              item.user_info.map(a=>{
                a.key=a.id;
                a.label='';
                // if(a.org){a.label+=a.org+' '}
                a.label+=a.name
              });
              item.user=item.user.map(a=>a.id);
            }

            item.cc_info=item.cc;
            if(item.cc){
              item.cc_info.map(a=>{
                a.key=a.id;
                a.label='';
                // if(a.org){a.label+=a.org+' '}
                a.label+=a.name
                //a.label=a.org?a.org:''+' '+a.name
              });
              item.cc=item.cc.map(a=>a.id)
            }
          })
        });
        let can_edit=this.props.is_begin_can_edit;
        this.setState({steps:this.props.steps,is_begin_can_edit:can_edit})
  }.bind(this),1000)
  }

  componentWillReceiveProps(newProps){
      console.log(newProps);
      let{steps}=this.state;
      steps&&steps.map(a=>a.reject_next=newProps.global_reject_next);
      steps&&steps.map(a=>a.complete_rule=newProps.global_complete_rule);
      this.setState({global_reject_next:newProps.global_reject_next,global_complete_rule:newProps.global_complete_rule})
  }

  addStep=()=>{
     const{steps,global_reject_next,global_complete_rule}=this.state;
     steps.push({complete_rule:global_complete_rule,reject_next:global_reject_next,deadline:1,child:[{name:'无标题步骤',user:[],cc:[]}]});
     this.setState(steps)
  };

  addChildStep=(index)=>{
     const{steps}=this.state;
     let {start_icon_height}=this.state;
     steps[index].child.push({name:"无标题步骤",user:[],cc:[]});
     console.log(steps[0]);
     if(index===0){
       start_icon_height=steps[0]&&steps[0].child.length*30
     }
     this.setState({steps:steps,start_icon_height:start_icon_height})
  };

  onChange = current => {
    this.setState({ current });
  };

  handleReviseChild=(index1,index2)=>{
    this.setState({fa_index:index1,son_index:index2});
    this.setState({step_detail:true})
  };

  handleDeleteChild=(index1,index2)=>{
    let _this=this
    const{steps}=_this.state;
    confirm({
      title: '确认删除此步骤？',
      // content: 'Some descriptions',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log(steps[index1].child.length);
        if(steps[index1].child.length>1){
          steps[index1].child.splice(index2,1);
        }else{
          steps.splice(index1,1)
        }
        _this.setState(steps);
      },
      onCancel() {
      },
    });
    //this.setState({fa_index:index1,son_index:index2});
  };

  handleReviseRule=(index,length)=>{
    this.setState({step_rule:true,fa_index:index,child_length:length})
  };

  handleDeleteFa=(index1)=>{
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
    //this.setState({fa_index:index1,son_index:index2});
  };

  handleCloseRule=(index)=>{
    this.setState({step_rule:false})
  };

  handleCloseDetail=(index)=>{
    this.setState({step_detail:false})
  };

  handleChangeInput=(e)=>{
    const{steps,fa_index,son_index,step_name}=this.state;
     steps[fa_index].child[son_index].name=e.target.value;
    this.setState(steps)
  };

  handleOkDetail=()=>{
     this.setState({step_detail:false})
  };

  handleSingleComplete=(val)=>{
    const{steps,fa_index}=this.state;
    steps[fa_index].reject_next=val;
    this.setState({steps:steps})
  };

  handleSingleComplete2=(val)=>{
    const{steps,fa_index}=this.state;
    steps[fa_index].complete_rule=val;
    this.setState({steps:steps})
  };

  handleChangeDeadline=(val,index)=>{
    const{steps}=this.state;
    steps[index].deadline=val;
    this.setState({steps:steps})
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
          text: `${user.name}`,
          value: user.id,
        }));
        this.setState({ data, fetching: false });
      });
  };

  handleChange = value => {
    console.log(value);
    const{fa_index,son_index,steps}=this.state;
    steps[fa_index].child[son_index].user=value.map(a=>a.key);
    steps[fa_index].child[son_index].user_info=value;
    //console.log(steps);
    this.setState({
      //value,
      data: [],
      fetching: false,
      steps
    });
  };

  handleChange2 = cc => {
    const{fa_index,son_index,steps}=this.state;
    steps[fa_index].child[son_index].cc_info=cc;
    steps[fa_index].child[son_index].cc=cc.map(a=>parseInt(a.key));
    this.setState({
      cc,
      data: [],
      fetching: false,
      steps
    });
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

  handleDeadDay=(day)=>{
     let last_day=moment(day);
     let now_day=moment().format('YYYY-MM-DD');
     let gap_day=moment(now_day).diff(moment(last_day),'days');
     let day_str='截止日期:'+day;
     console.log(day_str);
     return day_str
  };

  render () {
    const { leftWidth, rightWidth,type} = this.props;
    const{is_begin_can_edit,steps,current,step_rule,step_detail,step_name,fa_index,son_index,fetching, data, value,cc,child_length,start_icon_height}=this.state;

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
              <p style={{fontSize:type==='record'||type==='wait'?'12px':'14px'}}>期限 :</p>
              <div style={{marginTop:start_icon_height}}>
                <Icon type={'play-circle'} className={styles.start_circle}/>
              </div>
            </Col>

            <Col span={16}>
                <div style={{float:'left'}}>
                    <Steps current={current}
                     style={{maxWidth:'630px',overflowX:'auto',marginBottom: 60,}}
                     className={styles.step_div}
                     size="small">
                         {steps&&steps.map((val,index)=>{
                          return(
                              <Step key={index}
                                    status={this.handleShowStatus(val.status)}
                                    style={{minWidth:'200px'}}
                                    title={
                                      <Tooltip title={val.dead_day?this.handleDeadDay(val.dead_day):''}>
                                          <span><Input value={val.deadline} disabled={!is_begin_can_edit} placeholder={'期限天数'} style={{width:'120px'}} onChange={(e)=>this.handleChangeDeadline(e.target.value,index)}/> 天</span>
                                      </Tooltip>
                                      }
                                    subTitle={
                                      <span>
                                      {/*<Icon className={styles.step_icon} type="close" onClick={()=>this.handleDeleteFa(index)}/>*/}
                                         <Icon className={styles.step_icon} type="caret-right" theme="filled" onClick={()=>this.handleReviseRule(index,val.child.length)}/>
                                      </span>
                                    }

                                    description={
                                          <div style={{marginTop:'5px'}}>
                                            <Steps progressDot current={val.child.length} direction="vertical">
                                              {val.child.map((item,i)=>{
                                                console.log(item);
                                                return(<Step key={i}
                                                             className={styles.childStyle}
                                                             title={<div className={styles.step_title}>
                                                               {
                                                                 type==='wait'||type==='record'?
                                                                     <div className={styles.step_word_info}>
                                                                      <p>{item.name.length>5?item.name.substr(0, 5) + "..." : item.name}</p>
                                                                      {item.user&&item.user.length>0?<p>参与者:{item.user_info.map(a=>a.name).join(',')}</p>:null}
                                                                      {/*{item.cc&&item.cc.length>0?<p>{item.cc.length}名cc对象</p>:null}*/}
                                                                     </div>:
                                                                     <div className={styles.step_word_info}>
                                                                       <p>{item.name.length>17?item.name.substr(0, 17) + "..." : item.name}</p>
                                                                       {/*{item.user&&item.user.length>0?<p>{item.user.length}名参与者</p>:null}*/}
                                                                       {/*{item.cc&&item.cc.length>0?<p>{item.cc.length}名cc对象</p>:null}*/}
                                                                     </div>
                                                               }

                                                               <div className={styles.step_icon_info}>
                                                                  <Icon type="edit" className={styles.step_icon1} theme="filled" onClick={()=>this.handleReviseChild(index,i)}/>
                                                                  <Icon type="delete" className={styles.step_icon2} theme="filled" onClick={()=>this.handleDeleteChild(index,i)} />
                                                               </div>
                                                             </div>}
                                                    />)
                                              })}
                                            </Steps>
                                            {type==='approval'?
                                                <Tooltip title="并行步骤不区分先后顺序">
                                                    <Button style={{width:'120px'}} onClick={()=>this.addChildStep(index)}>新增并行步骤</Button>
                                                </Tooltip>:null
                                            }

                                            </div>
                               }>
                          </Step>
                          )
                        })}
                     </Steps>
                     <p style={{clear:'both'}}/>
                </div>
                {type==='approval'?<Button onClick={()=>this.addStep()}>新增步骤</Button>:null}
            </Col>
          </Row>

        <Modal
          title="步骤详情"
          visible={this.state.step_detail}
          onOk={this.handleOkDetail}
          onCancel={this.handleCloseDetail}
        >
          <Form {...formItemLayout} style={{ width:'80%'}}>
            <Form.Item label="步骤名称" required>
              <Input value={steps&&steps[fa_index]&&steps[fa_index].child[son_index]&&steps[fa_index].child[son_index].name} onChange={(e)=>this.handleChangeInput(e)}/>
            </Form.Item>
            <Form.Item label="参与者" required>
              <Select
                mode="multiple"
                labelInValue
                disabled={!is_begin_can_edit}
                value={steps&&steps[fa_index]&&steps[fa_index].child[son_index]&&steps[fa_index].child[son_index].user_info}
                placeholder="输入名字搜索"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                style={{ width: '100%' }}
              >
                {data.map(d => (
                  <Option key={d.value} value={d.value}>{d.text}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="抄送">
              <Select
                mode="multiple"
                labelInValue
                value={steps&&steps[fa_index]&&steps[fa_index].child[son_index]&&steps[fa_index].child[son_index].cc_info}
                placeholder="输入名字搜索"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange2}
                style={{ width: '100%' }}
              >
                {data.map(d => (
                  <Option key={d.value} id={d.value}>{d.text}</Option>
                ))}
              </Select>
            </Form.Item>
           </Form>
        </Modal>

        <Modal
          title="步骤完成规则"
          visible={this.state.step_rule}
          onOk={this.handleCloseRule}
          onCancel={this.handleCloseRule}
        >
         <Form {...formItemLayout}>
           {
             child_length>1?
                 <Form.Item label="完成规则">
                    <Select value={steps&&steps[fa_index]&&steps[fa_index].complete_rule} style={{ width:'80%'}} onChange={(value)=>this.handleSingleComplete2(value)}>
                      <Option value={1}>所有步骤完成时</Option>
                      <Option value={2}>任何步骤完成时</Option>
                      <Option value={3}>除被否决外的所有步骤完成时</Option>
                    </Select>
                  </Form.Item>:null
           }

          <Form.Item label="如果被否决时">
            <Select value={steps&&steps[fa_index]&&steps[fa_index].reject_next} style={{ width:'80%'}} onChange={(value)=>this.handleSingleComplete(value)}>
              <Option value={1}>返回工作流发起人</Option>
              <Option value={2}>继续下个步骤</Option>
            </Select>
          </Form.Item>
         </Form>
        </Modal>
        </div>
    )
  }
}

export default approvalStep;
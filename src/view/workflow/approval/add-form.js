import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input,Radio,Checkbox,InputNumber,Icon,Row,Col} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {approvalPost, approvalPut, approvalDetail} from "@apis/workflow/approval";
import GoBackButton from "@component/go-back";
import ApprovalStep from '@component/approvalStep2'
import SearchUserSelect from '@component/searchUserSelect'
import SearchUserTransfer from '@component/searchUserTransfer'
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
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
      fetching: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const {id} = this.props.match.params;
    if (id) {
          let p1=new Promise((resolve, reject)=>{approvalDetail(id, {project_id: _util.getStorage('project_id') }).then((res)=>{
          if(res.status===200){
              resolve(res)
          }
      })});
      let _this=this;
      p1.then(function (res) {
        _this.setState({postData: res.data});
      })
    }

    this.setState({
      spinLoading: false,id:id
    });
    this.props.menuState.changeMenuCurrentUrl("/approval/flow/template");
    this.props.menuState.changeMenuOpenKeys("/workflow");
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

  handleSubmit=()=>{
    const{postData,id}=this.state;
    let step_array=this.refs['steps'].state.steps;
    
    let res=true;
    var step = [];
    if(step_array&&step_array.length){
      step_array.map((s,sIndex) => {
        var S_obj = {
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

                approvalPost(data).then((res) => {
                  message.success(formatMessage(translation.saved));
                  _this.props.history.goBack();
                });
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

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, location_list, data,fetching, typeoption, org_type,postData,
      id,global_complete_rule,global_reject_next} = this.state;

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

    console.log('1100','add-form',postData.step)

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

              <ApprovalStep ref={'steps'} type="approval" steps={postData.step} is_begin_can_edit={true} />

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
      </div>
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;

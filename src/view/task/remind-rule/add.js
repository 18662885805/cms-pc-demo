import React from "react";
import {
    Form, 
    Button, 
    Modal, 
    Spin, 
    message, 
    Select, 
    Input,
    Tree,
    Card,
    Icon,
    Row,
    Col,
    InputNumber
} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {orgtypeInfo} from "@apis/system/orgtype";
import {SearchProjectUser} from "@apis/system/user";
import styles from "./index.module.css"
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;
const {TreeNode} = Tree;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class OrgTypeAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      treeData: [],
      typeoption: [],
      checkedKeys: [],
      selectedKeys:[],
      RuleData:[{name:'',desc:'',contacts:[{c_name:'',c_phone:''}]}],
      cardShow:true,
      typeoption:[],
      searchOptions: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
        this.setState({typeoption: res.data})
    })
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/system/org/type");
    this.props.menuState.changeMenuOpenKeys("/system");
  }

  
  handleSubmit(e) {
    const {id} = this.props.match.params;
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            
          },
          onCancel () {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  }



  showCard = () => {
    const{cardShow} = this.state;
    this.setState({cardShow:!cardShow})
  }

  handleRuleData = (value,field,index) => {
    const { RuleData } = this.state;
    RuleData[index][field] = value;
    this.setState({
      RuleData
    })
  };

  handleContactsData = (value,field,pIndex,cIndex) => {
    const { RuleData } = this.state;
    RuleData[pIndex]['contacts'][cIndex][field] = value;
    this.setState({
      RuleData
    })
  }

  addForm = (i) => {
    const { RuleData} = this.state;
    RuleData.push({
      name:'',desc:'',contacts:[{c_name:'',c_phone:''}]
    });
    this.setState({RuleData})
  };

  removeForm = index => {
    const { RuleData } = this.state;
    RuleData.splice(index, 1);
    this.setState({RuleData})
  };

  addC = (pIndex,cIndex) => {
    const { RuleData} = this.state;
    if(!RuleData[pIndex].contacts[cIndex]['c_name']){
      message.error('请输入联系人姓名！');
      return false
    }
    if(!RuleData[pIndex].contacts[cIndex]['c_phone']){
      message.error('请输入联系人手机！');
      return false
    }
    RuleData[pIndex].contacts.push({
        c_name:'',
        c_phone:'',
    });
    this.setState({RuleData})
  }

  removeC = (pIndex,cIndex)  => {
    if(cIndex == 0){
      message.warning('至少保留一位联系人!')
      return
    }
    const { RuleData } = this.state;
    RuleData[pIndex].contacts.splice(cIndex, 1);
    this.setState({RuleData})
  };

  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({
      fetching: true,
      searchOptions: []
    });
    SearchProjectUser({
      q: value,
      project_id: _util.getStorage('project_id')
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const searchOptions = res.data.map(user => ({
        name: user.name,
        value: user.name,
        text: user.name,
        id: user.id,
        org:user.org,
        tel: user.tel,
        phone: user.phone
      }));
      this.setState({
        searchOptions,
        fetching: false
      });
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, typeoption,
      cardShow,RuleData,} = this.state;

      const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 7 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 10 }
        }
    };

    const formItemLayout2={
      labelCol:{
        sm: {span:6},
        xs: {span: 24}
      },
      wrapperCol:{
        sm: {span: 16},
        xs: {span: 24}
      }
    };

    const _this = this;
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10}
      }
    };

    const {formatMessage} = this.props.intl;
    const {id} = this.props.match.params;
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: '重要问题'
      },
      {
          name: '提醒规则',
      },
      {
          name: id ?  <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> :<FormattedMessage id="app.page.bread.add" defaultMessage="新增"/>
      }
    ]

    let formData = [
        {
            field: "org_type",
            type: "select",
            icon: "",
            value: null,
            text: "组织名称",
            placeholder: "组织名称",
            options: typeoption,
            rules: [{required: true, message: "请选择组织"}],
          },
    ];
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

            {
                formData ? formData.map((item, index) => {
                  return (
                      <FormItem
                        key={index}
                        label={item.text}
                        extra={item.extra}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {
                          item.value
                            ?
                            getFieldDecorator(item.field, {
                              initialValue: item.value,
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                            :
                            getFieldDecorator(item.field, {
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                        }
                      </FormItem>
                  );
                }) : null
              }
    
               <FormItem  {...formItemLayout}
                label={'规则配置'}
                required
              >
                <Button type='primary' onClick={() => this.showCard()}>
                    {
                        cardShow ? '删除' : '新增'
                    }
                </Button>
                {cardShow && RuleData.map((p, pIndex) => {
                  return(
                    <Card               
                      style={{marginBottom: '15px',width:'100%'}}
                      bordered={true}
                      actions={
                        RuleData.length === 1
                        ? [<span style={{padding:'0 auto'}} onClick={() => this.addForm(pIndex)}><Icon type="plus"/> 添加规则</span>]
                        : RuleData.length - 1 === pIndex
                          ? [<span style={{padding:'0 auto'}} onClick={() => this.addForm(pIndex)}><Icon type="plus"/> 添加规则</span>,
                              <span style={{padding:'0 auto'}} onClick={() => this.removeForm(pIndex)}><Icon type="delete"/> 删除规则</span>,
                            ]
                            : [<span style={{padding:'0 auto'}} onClick={() => this.removeForm(pIndex)}><Icon type="delete"/> 删除规则</span>]
                      }
                    >
                      <FormItem  {...formItemLayout2} required label={'规则名称'}>
                          <Input name='name'
                              value={p.name}
                              placeholder={"请输入规则名称"}
                              onChange={e => this.handleRuleData(e.target.value, 'name',pIndex)}/>
                      </FormItem>
                      <FormItem  {...formItemLayout2} label={'延期时间(天)'} required>
                          <InputNumber name='desc' style={{width:'100%'}} placeholder={"请输入延期时间"}/>
                      </FormItem>
                      <FormItem  {...formItemLayout2} label={'推送联系人'} required>
                        <div className={styles.contact_content}>
                          {
                            p.contacts && p.contacts.length && p.contacts.map((c,cIndex) => {
                              return(
                                <div className={styles.contact_item}>
                                  <div className={styles.contact_item_info}>
                                    <Input 
                                      style={{width:'80px'}} 
                                      placeholder={'姓名'}
                                      size='small'
                                      onChange={e => this.handleContactsData(e.target.value, 'c_name',pIndex,cIndex)}
                                    />
                                    <Input 
                                      style={{width:'120px'}} 
                                      placeholder={'手机'}
                                      size='small'
                                      maxLength={11}
                                      onChange={e => this.handleContactsData(e.target.value, 'c_phone',pIndex,cIndex)}
                                    />
                                  </div>
                                  <div className={styles.contact_item_operate}>
                                    <span onClick={() => this.removeC(pIndex,cIndex)}>删除联系人</span>
                                    <span onClick={() => this.addC(pIndex,cIndex)}>新增联系人</span>   
                                  </div>
                                </div>
                              )
                            })
                          }                       
                        </div>
                      </FormItem>
                  </Card>
                  )              
              })}
              </FormItem>
             
                 

              <FormItem {...submitFormLayout}>
                <div style={{width: "100%", marginBottom: "20px"}}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                          style={{marginRight: "10px"}}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存"/>
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

const OrgTypeAdd = Form.create()(OrgTypeAddForm);

export default OrgTypeAdd;

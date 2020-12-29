import React from "react";
import {Form, Button, Modal, Spin, message, Select,Switch} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
// import FormData from "@component/FormData";
import {userDetail, userPost, userPut} from '@apis/myadmin/user';
import {SearchProjectUser} from "@apis/system/user";
import GoBackButton from "@component/go-back";
import {debounce} from "lodash";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
// import translation from '../translation'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class ChannelAddForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      is_search: false,
      factoryList: [],
      searchOptions: [],
      is_super: false,
      id:''
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount () {

    const {id} = this.props.match.params;
    if (id) {
      this.setState({id})
      userDetail({id: id}).then((res) => {
        const {user} = res.data
        this.setState({
          searchOptions: user,
          data: res.data
        });
      });
    }

    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/myadmin/user");
    this.props.menuState.changeMenuOpenKeys("/myadmin");
  }

  // componentWillMount () {
  //   // channelForm().then((res) => {
  //   //   this.setState({
  //   //     formData: res.data.results
  //   //   });
  //   // });
  //   this.setState({
  //     spinLoading: false
  //   });
  // }

  handleSubmit (e) {
    e.preventDefault();
    // this.setState({
    //   confirmLoading: true
    // });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        values.project_id = _util.getStorage('project_id');
        // values.user = Array.isArray(values.person) ? values.person.join(",") : values.person;
        const { formatMessage } = this.props.intl;
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            const { id } = _this.props.match.params;
            //修改MJK管理员
            if (id) {
              values.is_super = true;
              userPut(id, values).then((res) => {
                message.success('保存成功');
                _this.props.history.goBack();
              });
              return;
            }

            //新增
            userPost(values).then((res) => {
              message.success('保存成功');
              _this.props.history.goBack();
            });
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

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onChangeSwitch = () => {
    console.log('0319')
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, factoryList, data, password} = this.state;
    const _this = this;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10}
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    const factory = factoryList instanceof Array && factoryList.length ? factoryList.map(d =>
      <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

      let pwd = []
      const {id} = this.props.match.params;
      if(!id){
        pwd = [
          {
            field: "password",
            type: "password",
            icon: "",
            value: data ? data.password : password,
            text: "密码",
            placeholder: "密码",
            onChange: (e) => this.onChange(e),
            rules: [
              {
                required: true,
                message: "请输入密码"
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7e]{10,16}$/,
                message: "密码要包含字母、数字，10-16位"
              }
            ],
            disabled: this.state.is_search
          }
        ]
      }

    const formData = [
      {
        field: "phone",
        type: "char",
        icon: "",
        value: data ? data.phone : null,
        text: "手机号",
        placeholder: "手机号",
        rules: [{required: true, message: "请输入手机号"}, {max: 11, message: "手机格式错误"}]
      },
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "姓名",
        placeholder: "姓名",
        rules: [{required: true, message: "请输入姓名"}, {max: 64, message: "最大长度不能超过64字节"}],
        // disabled: this.state.is_search
      },
      ...pwd,
        // {
        //   field: "email",
        //   type: "char",
        //   icon: "",
        //   value: data ? data.email : null,
        //   text: "邮箱",
        //   placeholder: "邮箱",
        //   rules: [{required: true, message: "请输入邮箱"}, {max: 128, message: "最大长度不能超过128字节"}, {type: "email", message: "邮箱格式错误"}],
        //   // disabled: this.state.is_search
        // },
        // {
        //   field: "is_super",
        //   type: "switch",
        //   icon: "",
        //   value: data ? data.is_super : false,
        //   text: "MJK管理员",
        //   placeholder: "",
        //   rules: [],
        //   // disabled: this.state.is_search
        // },
    ];

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="app.page.bread.backend" defaultMessage="后台管理"/>
      },
      {
          name: <FormattedMessage id="app.page.bread.user" defaultMessage="用户管理"/>,
          url: '/myadmin/user'
      },
      {
          name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ]

    return (
      <div>
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

            {
                formData ? formData.map((item, index) => {
                  return (

                    item.type === "password" || item.type === "switch" || item.type === "checkbox" ?
                      <FormItem
                        key={index}
                        label={item.text}
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
                      :
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

              {
                id ?//编辑
                  <FormItem 
                    {...formItemLayout}
                    label={'MJK管理员'}
                    >
                      <Switch checked={true}/>
                  </FormItem>
                  :
                  <FormItem //新增
                  {...formItemLayout}
                  label={'MJK管理员'}
                  >
                     {getFieldDecorator('is_super', {  
                       initialValue:true,               
                    })(
                      <Switch defaultChecked={true}/>
                    )}  
                    
                  </FormItem>
              }
             

              <FormItem {...submitFormLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                    style={{ marginRight: "10px" }}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存"/>
                  </Button>
                  <GoBackButton props={this.props} />
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const ChannelAdd = Form.create()(ChannelAddForm);

export default ChannelAdd;

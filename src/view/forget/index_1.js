import React from 'react'
import {
  Form,
  Button,
  Input,
  Icon,
  Modal,
  message,
  notification
} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import ViewPwd from '@component/ViewPwd'
import {changePwd} from '@apis/account/index'
import {logout} from "@apis/account/index";
import GoBackButton from '@component/go-back'

const FormItem = Form.Item
const confirm = Modal.confirm

let _util = new CommonUtil()

const messages = defineMessages({
  confirm_title: {
    id: 'app.confirm.title.submit',
    defaultMessage: '确认提交?',
  },
  confirm_content: {
    id: 'app.fit.button.content',
    defaultMessage: '单击确认按钮后，将会提交数据',
  },
  okText: {
    id: 'app.button.ok',
    defaultMessage: '确认',
  },
  cancelText: {
    id: 'app.button.cancel',
    defaultMessage: '取消',
  },
  pwd_different: {
    id: 'app.message.password.pwd_different',
    defaultMessage: '两次输入的密码不同',
  },
  pwd_updated: {
    id: 'app.message.password.pwd_updated',
    defaultMessage: '修改密码成功',
  },
  enter_old_pwd: {
    id: 'app.required.password.enter_old_pwd',
    defaultMessage: '请输入旧密码',
  },
  old_pwd_placeholder: {
    id: 'app.placeholder.password.old_pwd_placeholder',
    defaultMessage: '旧密码',
  },
  min_length: {
    id: 'app.required.password.min_length',
    defaultMessage: '最小长度不能小于6个字节',
  },
  enter_new_pwd: {
    id: 'app.required.password.enter_new_pwd',
    defaultMessage: '请输入新密码',
  },
  enter_again: {
    id: 'app.required.password.enter_again',
    defaultMessage: '请再次输入密码',
  },
  new_pwd: {
    id: 'app.placeholder.password.new_pwd',
    defaultMessage: '新密码',
  },
  password_confirm: {
    id: 'app.placeholder.password.password_confirm',
    defaultMessage: '确认密码',
  },
  email_format_error: {
    id: 'app.required.password.email_format_error',
    defaultMessage: '邮箱格式不正确!',
  },
  enter_email: {
    id: 'app.required.password.enter_email',
    defaultMessage: '请输入邮箱!',
  },
  email_placeholder: {
    id: 'app.placeholder.password.email_placeholder',
    defaultMessage: '邮箱',
  },
  password_format: {
    id: 'app.required.password.password_format',
    defaultMessage: '密码要包含字母、数字或特殊字符，10-16位',
  },
});

@injectIntl
class PasswordForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmLoading: false,
      old_pwd: null,
      password: null,
      userInfo: _util.getStorage('userInfo')
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this)
  }

  componentDidMount () {
    const { location } = this.props
    if (location && location.state && location.state.title && location.state.content) {
      notification.info({
        message: location.state.title,
        description: location.state.content,
        duration: null
      })
    }
  }

  compareToFirstPassword (rule, value, callback) {
    const { formatMessage } = this.props.intl
    const form = this.props.form
    if (value && value !== form.getFieldValue('password') && form.getFieldValue('password')) {
      callback(formatMessage(messages.pwd_different))   //两次输入的密码不同
    } else {
      callback()
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.setState({
      confirmLoading: true
    })
    this.props.form.validateFields((err, values) => {
      console.log(values);
      const postData = {old_pwd:values.old_pwd,new_pwd:values.password}
      if (!err) {
        let _this = this
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk () {
            changePwd(postData).then((res) => {
              message.success(formatMessage(messages.pwd_updated))    //修改密码成功
              logout().then((res) => {
                message.success(intl.get("app.component.side_layout.logout_success")); //注销成功
                localStorage.removeItem("menu");
                localStorage.removeItem("project_id");
                localStorage.removeItem("role");
                localStorage.removeItem("permission");
                localStorage.removeItem("userInfo");
                localStorage.removeItem("token");
                localStorage.removeItem("lastLogin");
                this.props.menuState.setLogin(false);
                window.location.href = "/login";
              });
            })
          },
          onCancel () {
          }
        })
      }
      this.setState({
        confirmLoading: false
      })
    })
  }

  onChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const {formatMessage} = this.props.intl
    const { confirmLoading, old_pwd, password, check_password, userInfo } = this.state
    const _this = this

    const formData = {
      'formItemLayout': {
        'labelCol': {
          'xs': { 'span': 24 },
          'sm': { 'span': 6 }
        },
        'wrapperCol': {
          'xs': { 'span': 24 },
          'sm': { 'span': 16 }
        }
      },
      'tailFormItemLayout': {
        'wrapperCol': {
          'xs': {
            'span': 4,
            'offset': 0
          },
          'sm': {
            'span': 4,
            'offset': 12
          }
        }
      },
      'content': [
        {
          'field': 'old_pwd',
          'text': '旧密码',
          'rules': [
            {
              'required': true,
              'message': '请输入旧密码'
            },
            {
              'min': 6,
              'message': '最小长度不能小于6个字节'
            }
          ],
          'type': 'password',
          'placeholder': '旧密码',
          'icon': 'lock'
        }, {
          'field': 'password',
          'text': '新密码',
          'rules': [
            {
              'required': true,
              'message': '请输入新密码'
            },
            {
              'min': 6,
              'message': '最小长度不能小于6个字节'
            }
          ],
          'type': 'password',
          'placeholder': '新密码',
          'icon': 'lock'
        }, {
          'field': 'check_password',
          'text': '确认密码',
          'rules': [
            {
              'required': true,
              'message': '请再次输入密码'
            },
            {
              'min': 6,
              'message': '最小长度不能小于6个字节'
            }, {
              validator: this.compareToFirstPassword
            }
          ],
          'type': 'password',
          'placeholder': '确认密码',
          'icon': 'lock'
        }
      ]
    }
    return (
      <div>
        <MyBreadcrumb />
        <div className='content-wrapper'>
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              {...formData.formItemLayout} label={<FormattedMessage id="page.password.old_pwd" defaultMessage="旧密码" />}
            >
              {getFieldDecorator('old_pwd', {
                rules: [
                  {
                    'required': true,
                    'message': formatMessage(messages.enter_old_pwd)    //请输入旧密码
                  },
                  {
                    'min': 6,
                    'message': formatMessage(messages.min_length)   //最小长度不能小于6个字节
                  }
                ]
              })(
                <ViewPwd inputName='old_pwd' placeholder={formatMessage(messages.old_pwd_placeholder)} pwd={old_pwd} onChange={(e) => this.onChange(e)} />
              )}
            </FormItem>

            <FormItem
              {...formData.formItemLayout}
              label={<FormattedMessage id="page.password.new_pwd" defaultMessage="新密码" />}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    'required': true,
                    'message': formatMessage(messages.enter_new_pwd)    //请输入新密码
                  },
                  {
                    'message': "密码要包含字母、数字，8-16位",    
                    'pattern': /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7e]{8,16}$/
                  }
                ]
              })(
                <ViewPwd inputName='password' placeholder={formatMessage(messages.new_pwd)} pwd={password} onChange={(e) => this.onChange(e)} />
              )}
            </FormItem>

            <FormItem
              {...formData.formItemLayout}
              label={<FormattedMessage id="page.password.password_confirm" defaultMessage="确认密码" />}
            >
              {getFieldDecorator('check_password', {
                rules: [
                  {
                    'required': true,
                    'message': formatMessage(messages.enter_again)   //请再次输入密码
                  },
                  {
                    'message': "密码要包含字母、数字，8-16位",    
                    'pattern': /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7e]{8,16}$/
                  }, {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <ViewPwd inputName='check_password' placeholder={formatMessage(messages.password_confirm)} pwd={check_password} onChange={(e) => this.onChange(e)} />
              )}
            </FormItem>
            <FormItem {...formData.tailFormItemLayout}>
              <div style={{ width: '100%', marginBottom: '20px' }}>
                <Button type='primary' htmlType='submit' loading={confirmLoading}
                  style={{ marginRight: '10px' }}>
                  <FormattedMessage id="app.button.submit" defaultMessage="提交" />
                </Button>
                <GoBackButton props={this.props} />
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

const Password = Form.create()(PasswordForm)

export default Password

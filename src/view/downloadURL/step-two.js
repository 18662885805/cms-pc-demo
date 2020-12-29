import React from 'react'
import styled from 'styled-components'
import { Form, Input,Button, Spin, message, Modal, Row, Col, Icon } from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import ViewPwd from '@component/ViewPwd'
import { ForgetPwd } from '@apis/account/index'
import CommonUtil from '@utils/common'
import styles from '../login/index.css'

const FormItem = Form.Item

let _util = new CommonUtil()
const confirm = Modal.confirm

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
  pwd_success: {
    id: 'app.forget.message.pwd_success',
    defaultMessage: '密码修改成功',
  }
});

@injectIntl
class DownloadTwoForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      phone: '',
      site_id: ''
    }
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    _util.removeStorage('phone')
    const { location } = this.props
    if (location && location.state) {
      this.setState({
        phone: location.state.phone,
      })
    }

    this.setState({
      spinLoading: false
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    const {
      phone,
    } = this.state

    this.setState({
      confirmLoading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk () {
            values.phone = phone
            ForgetPwd(values).then((res) => {
              message.success(formatMessage(messages.pwd_success))     //密码修改成功
              _this.props.history.replace('/login')
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
    const { confirmLoading, spinLoading, password } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

    return (
      <div className={styles.bjcover}>
          <div className={styles.login2}>
          <Spin spinning={spinLoading}>
            
              <Form onSubmit={this.handleSubmit} className={styles.login_form2}>
                <div className={styles.logo} style={{marginBottom:'20px'}}>
                    <img src={require('./logo.png')} style={{height:'100%'}}></img>
                </div> 
                <FormItem 
                  colon={false}
                  required={false}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={confirmLoading}
                    style={{
                      width: '100%',
                      marginBottom: '20px',
                      backgroundColor: '#02a1c1',
                      border: 0
                    }} className='login-form-button'>
                      下载
                  </Button>
                </FormItem>
              </Form>
            </Spin>
          </div>
      </div>
    )
  }
}

const DownloadTwo = Form.create()(DownloadTwoForm)

export default DownloadTwo

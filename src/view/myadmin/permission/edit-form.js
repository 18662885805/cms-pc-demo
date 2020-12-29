import React from 'react'
import {
  Form,
  Button,
  Modal,
  Spin,
  message
} from 'antd'

import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { permissionForm, permissionPut } from '@apis/system/permission/index'
import GoBackButton from '@component/go-back'
import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import messages from '@utils/formatMsg'
const FormItem = Form.Item
const confirm = Modal.confirm

let _util = new CommonUtil()

class PermissionEditForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      permissionForm({ id: this.props.location.state.id }).then((res) => {
        this.setState({
          formData: res.data.results
        })
      })
      this.setState({
        spinLoading: false,
        id: this.props.location.state.id
      })
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({
      confirmLoading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        const { formatMessage } = this.props.intl;
        confirm({
          title:formatMessage(messages.alarm1),
content:formatMessage(messages.alarm2),
okText:formatMessage(messages.alarm3),
cancelText:formatMessage(messages.alarm4),
          // title: '确认提交?',
          // content: '单击确认按钮后，将会提交数据',
          // okText: '确认',
          // cancelText: '取消',
          onOk () {
            permissionPut(_this.state.id, values).then((res) => {
              message.success(formatMessage(messages.alarm5))
              _this.props.history.goBack()
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

  render () {
    const { getFieldDecorator } = this.props.form
    const { confirmLoading, formData, spinLoading } = this.state
    const formItemLayout = formData.formItemLayout
    const tailFormItemLayout = formData.tailFormItemLayout
    const _this = this
    return (
      <div>
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              {
                formData.content ? formData.content.map((item, index) => {
                  return (
                    <FormItem
                      key={index}
                      label={item.text}
                      hasFeedback
                      {...formItemLayout}
                    >
                      {
                        item.value
                          ? getFieldDecorator(item.field, {
                            initialValue: item.value,
                            rules: item.rules
                          })(
                            _util.switchItem(item, _this)
                          )
                          : getFieldDecorator(item.field, {
                            rules: item.rules
                          })(
                            _util.switchItem(item, _this)
                          )
                      }
                    </FormItem>
                  )
                }) : ''
              }
              <FormItem {...tailFormItemLayout}>
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                    style={{ marginRight: '10px' }}>
                       <FormattedMessage id="page.construction.location.yesSubmit" defaultMessage="提交"/>
                  </Button>
                  <GoBackButton props={this.props} />
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    )
  }
}

const PermissionEdit = Form.create()(PermissionEditForm)

export default injectIntl(PermissionEdit)

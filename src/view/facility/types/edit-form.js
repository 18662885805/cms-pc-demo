import React from 'react'
import {Form, Button, Modal, Input, Select, Spin, Icon, message, TreeSelect} from 'antd'
import debounce from 'lodash/debounce'
import moment from 'moment'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {TypePut, TypeDetail} from '@apis/facility/types'
import GoBackButton from '@component/go-back'

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item
const confirm = Modal.confirm
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

let _util = new CommonUtil()
let uuid = 1;

const messages = defineMessages({
  confirm_title: {
    id: 'app.confirm.title.submit',
    defaultMessage: '确认提交?',
  },
  confirm_content: {
    id: 'app.common.button.content',
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
  saved: {
    id: 'app.message.walkthrough.saved',
    defaultMessage: '保存成功',
  },
  input_m_type: {
    id: 'app.placeholder.walkthrough.input_m_type',
    defaultMessage: '请输入维护类型',
  },
  typedesc: {
    id: 'app.placeholder.walkthrough.typedesc',
    defaultMessage: '类型描述',
  },
});

@injectIntl
class TypesEditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      spinLoading: true,
      data: [],
      search_id: null,
      fetching: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {

      TypeDetail(this.props.location.state.id).then((res) => {
        const data = res.data.results

        this.setState({
          name: data.name,
          abbr: data.abbr,
          desc: data.desc,
        })
      })

      this.setState({
        spinLoading: false,
        id: this.props.location.state.id
      })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this
        let { id } = _this.state
        let param = {}

        _this.setState({
          confirmLoading: true
        })
        param.name = values.name
        param.abbr = values.abbr
        param.desc = values.desc

        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            TypePut(id, values).then((res) => {
              message.success(formatMessage(messages.saved))   //保存成功
              _this.props.history.goBack()
            })
          },
          onCancel() {
          },
        })
      }
      this.setState({
        confirmLoading: false
      })
    })
  }

  fetchUser = (value) => {
    this.lastFetchId += 1
    const fetchId = this.lastFetchId
    this.setState({data: [], fetching: true})
    // contractorSearch({q: value}).then((res) => {
    //   if (fetchId !== this.lastFetchId) {
    //     return
    //   }
    //   const data = res.data.results.map(user => ({
    //     value: user.text,  //`${user.name.first} ${user.name.last}`,
    //     text: user.text,
    //     id: user.id
    //   }))
    //   this.setState({data, fetching: false})
    // })
  }

  handleChange = (value, obj) => {
    this.setState({
      search_id: obj ? obj.props.title : null,
      data: [],
      fetching: false,
    })
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {confirmLoading, spinLoading, name, abbr, desc} = this.state
    const { formatMessage } = this.props.intl
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10},
      },
    };

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintenancetype" defaultMessage="维护类型" />}>
                {getFieldDecorator('name', {
                  initialValue: name ? name : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_m_type),    //请输入维护类型
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.input_m_type)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintenancetypeabbr" defaultMessage="类型简写" />}>
                {getFieldDecorator('abbr', {
                  initialValue: abbr ? abbr : null,
                  rules: [
                    {
                      required: true,
                      message: "请输入类型简写"
                    }
                  ],
                })(<Input placeholder="类型简写"/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.typedesc" defaultMessage="类型描述" />}>
                {getFieldDecorator('desc', {
                  initialValue: desc ? desc : null,
                })(
                  <TextArea
                    placeholder={formatMessage(messages.typedesc)}    //类型描述
                    // className="custom"
                    // autosize={{minRows: 2, maxRows: 6}}
                    style={{minHeight: 32}}
                    rows={4}
                    // style={{ height: 50 }}
                  />
                )}
              </FormItem>

              <FormItem {...tailFormItemLayout}>
                <div style={{width: '100%', marginBottom: '20px'}}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                          style={{marginRight: '10px'}}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    )
  }
}

export default TypesEditForm = Form.create()(TypesEditForm)

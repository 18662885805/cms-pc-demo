import React from 'react'
import {Form, Button, Modal, Input, Select, Spin, Icon, message, TreeSelect} from 'antd'
import debounce from 'lodash/debounce'
import moment from 'moment'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {SupplierPut, SupplierDetail} from '@apis/facility/supplier'
import GoBackButton from '@component/go-back'
import translation from '../translation.js'

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item
const confirm = Modal.confirm
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

let _util = new CommonUtil()
let uuid = 1;

const messages = defineMessages({
  input_company: {
    id: 'app.placeholder.maintcard.input_company',
    defaultMessage: '请输入供应商名称',
  },
  input_companycode: {
    id: 'app.placeholder.maintcard.input_companycode',
    defaultMessage: '请输入供应商编号',
  },
  input_email: {
    id: 'app.placeholder.maintcard.input_email',
    defaultMessage: '请输入供应商邮箱',
  },
  input_address: {
    id: 'app.placeholder.maintcard.input_address',
    defaultMessage: '请输入供应商地址',
  },
  input_phone: {
    id: 'app.placeholder.maintcard.input_phone',
    defaultMessage: '请输入供应商联系电话',
  },
  desc: {
    id: 'app.placeholder.maintcard.desc',
    defaultMessage: '备注',
  },
});

@injectIntl
class SupplierEditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      isCycle: false,
      fetching: false,
      phone: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
    this.fetchRules = debounce(this.fetchRules, 800)
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      SupplierDetail(this.props.location.state.id).then((res) => {
        const {results} = res.data
        this.setState({
          results,
          company: results.name,
          code: results.no,
          email: results.email,
          phone: [results.phone_a, results.phone_b],
          address: results.address,
          remarks: results.remarks

        })
      })
    }

    this.setState({
      spinLoading: false,
      id: this.props.location.state.id
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this
        const { id } = _this.state
        let data = {}
        //let {search_id} = this.state
        _this.setState({
          confirmLoading: true
        })

        data = {
          name: values.company,
          no: values.code,
          email: values.email,
          phone_a: values.phone[0],
          phone_b: values.phone[1],
          address: values.address,
          remarks: values.remarks
        }

        confirm({
          title: formatMessage(translation.confirm_title),
          content: formatMessage(translation.confirm_content),
          okText: formatMessage(translation.okText),
          cancelText: formatMessage(translation.cancelText),
          onOk() {
            SupplierPut(id, data).then((res) => {
              message.success(formatMessage(translation.saved))   //保存成功
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
    contractorSearch({q: value}).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return
      }
      const data = res.data.results.map(user => ({
        value: user.text,
        text: user.text,
        id: user.id
      }))
      this.setState({data, fetching: false})
    })
  }

  handleChange = (value, obj) => {
    this.setState({
      search_id: obj ? obj.props.title : null,
      data: [],
      fetching: false,
    })
  }

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({value});
  }

  componentDidUpdate() {
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
  }

  fetchRules = (value) => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({data: [], fetching: true});
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({data, fetching: false});
      });
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {confirmLoading, formData, spinLoading, company, code, email, phone, address, remarks} = this.state
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

    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.company" defaultMessage="供应商" />}>
                {getFieldDecorator('company', {
                  initialValue: company ? company : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_company),    //请输入供应商名称
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.input_company)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.code" defaultMessage="供应商编号" />}>
                {getFieldDecorator('code', {
                  initialValue: code ? code : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_companycode),    //请输入供应商编号
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.input_companycode)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.email" defaultMessage="邮箱" />}>
                {getFieldDecorator('email', {
                  initialValue: email ? email : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_email),    //请输入供应商邮箱
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.input_email)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.phone1" defaultMessage="联系电话1" />}>
                {getFieldDecorator('phone[0]', {
                  initialValue: phone ? phone[0] : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_phone),    //请输入供应商联系电话
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.input_phone)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.phone2" defaultMessage="联系电话2" />}>
                {getFieldDecorator('phone[1]', {
                  initialValue: phone ? phone[1] : null,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: formatMessage(messages.input_phone),    //请输入供应商联系电话
                  //   }
                  // ],
                })(<Input placeholder={formatMessage(messages.input_phone)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.address" defaultMessage="地址" />}>
                {getFieldDecorator('address', {
                  initialValue: address ? address : null,
                  rules: [
                    // {
                    //   // required: true,
                    //   //message: formatMessage(messages.input_address),    //请输入供应商地址
                    // }
                  ],
                })(<Input placeholder={formatMessage(messages.input_address)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.desc" defaultMessage="备注" />}>
                {getFieldDecorator('remarks', {
                  initialValue: remarks ? remarks : null,
                })(
                  <TextArea
                    placeholder={formatMessage(messages.desc)}    //备注
                    // className="custom"
                    // autosize={{minRows: 2, maxRows: 6}}
                    style={{minHeight: 32}}
                    rows={4}
                    // onKeyPress={this.handleKeyPress}
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

const SupplierEdit = Form.create()(SupplierEditForm)

export default SupplierEdit

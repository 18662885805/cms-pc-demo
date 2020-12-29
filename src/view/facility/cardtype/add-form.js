import React from 'react'
import {inject, observer} from "mobx-react/index";
import {Form, Button, Modal, Input, Select, Spin, Icon, message, TreeSelect} from 'antd'
import debounce from 'lodash/debounce'
import moment from 'moment'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {CardTypePost} from '@apis/facility/cardtype'
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
  // saved: {
  //   id: 'app.message.walkthrough.saved',
  //   defaultMessage: '保存成功',
  // },
  input_type: {
    id: 'app.placeholder.maintcard.input_type',
    defaultMessage: '请输入维修类型',
  },
  desc: {
    id: 'app.placeholder.maintcard.desc',
    defaultMessage: '描述',
  },
});

@inject("menuState") @injectIntl
class TypeAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      isCycle: false,
      fetching: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
    this.fetchRules = debounce(this.fetchRules, 800)
  }

  componentWillMount() {

    this.setState({
      spinLoading: false
    })
    this.props.menuState.changeMenuCurrentUrl("/eqp/cardtype");
    this.props.menuState.changeMenuOpenKeys("/eqp");
  }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this
        _this.setState({
          confirmLoading: true
        })
        let param = {
          name: values.name,
          desc: values.desc,
          project_id: _util.getStorage('project_id')
        }
        confirm({
          title: formatMessage(translation.confirm_title),
          content: formatMessage(translation.confirm_content),
          okText: formatMessage(translation.okText),
          cancelText: formatMessage(translation.cancelText),
          onOk() {
            CardTypePost(param).then((res) => {
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
    const {confirmLoading, formData, spinLoading} = this.state
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.type" defaultMessage="维修类型" />}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_type),    //请输入维修类型
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.input_type)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintcard.desc" defaultMessage="描述" />}>
                {getFieldDecorator('desc')(
                  <TextArea
                    placeholder={formatMessage(messages.desc)}    //描述
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

const TypeAdd = Form.create()(TypeAddForm)

export default TypeAdd

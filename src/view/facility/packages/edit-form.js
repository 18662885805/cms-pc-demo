import React from 'react'
import { Form, Button, Modal, Input, Select, Switch, Spin, Icon,
  message, Upload, Checkbox, Cascader, TreeSelect, DatePicker } from 'antd'
import debounce from 'lodash/debounce'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {PackagePut, PackageDetail} from '@apis/facility/packages'
import {interviewee} from '@apis/event/interviewee/'
// import {contractorSearch} from "@apis/construction/contractor/"
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
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
  package_desc: {
    id: 'app.message.walkthrough.package_desc',
    defaultMessage: '任务包说明',
  },
  package_name: {
    id: 'app.placeholder.walkthrough.package_name',
    defaultMessage: '任务包名称',
  },
  input_package_name: {
    id: 'app.message.walkthrough.input_package_name',
    defaultMessage: '请输入任务包名称',
  },
  input_user_name: {
    id: 'app.placeholder.walkthrough.input_user_name',
    defaultMessage: '请输入姓名搜索执行人',
  },
  priority: {
    id: 'app.message.walkthrough.priority',
    defaultMessage: '优先级',
  },
});

@injectIntl
class PackageAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      search_id: null,
      num: null,
      phone: null,
      isCycle: false,
      fetching: false,
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

      PackageDetail(this.props.location.state.id).then((res) => {
        const {results} = res.data

        this.setState({
          // result: res.data.results,
          name: results.name,
          priority: results.priority,
          desc: results.desc,
          search_id: results.user,
          user_name: results.user_name,
          data: [{
            id: results.user ? results.user : null,
            text: results.user_name ? results.user_name : null
          }],
          // searchdata: [{
          //   id: res.data.results.contractor_id,
          //   text: res.data.results.contractor_name + '-' + res.data.results.contractor_company
          // }]
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
        let {search_id} = this.state
        let param = {}
        _this.setState({
          confirmLoading: true
        })
        param.name = values.name
        param.user = search_id
        param.priority = values.priority
        param.desc = values.desc
        const { id } = _this.state
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            PackagePut(id, param).then((res) => {
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
    interviewee({q: value, type: 'event'}).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return
      }
      const data = res.data.results.map(user => ({
        name: user.name,
        value: user.name,
        text: user.name,
        id: user.id,
        org:user.org,
        tel: user.tel,
        phone: user.phone
      }))
      this.setState({data, fetching: false})
    })
  }

  handleChange = (value, obj) => {
    // const {children} = obj.props
    this.setState({
      // search_id: obj ? obj.props.title : null,
      search_id: value,
      // data: [],
      fetching: false,
      // user: children
    })
  }

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({value});
  }

  add = () => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  remove = (k) => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    // if (keys.length === 1) {
    //     return;
    // }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  onCycleChange = (checked) => {
    this.setState({
      isCycle: checked
    })
    //console.log(`switch to ${checked}`);
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
    const {confirmLoading, spinLoading, data, name, priority, user, search_id, desc} = this.state
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.package_name" defaultMessage="任务包名称" />}>
                {getFieldDecorator('name', {
                  initialValue: name ? name : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_package_name),    //请输入任务包名称
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.package_name)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.user_name" defaultMessage="执行人" />} >
                {
                  getFieldDecorator('user_id', {
                    initialValue: search_id ? search_id : null,
                    rules: [
                      {
                        required: true,
                        message: formatMessage(messages.input_user_name),   //请输入姓名搜索执行人
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder={formatMessage(messages.input_user_name)}   //请输入姓名搜索执行人
                      notFoundContent={this.state.fetching ?
                        <Spin size="small"/> : <FormattedMessage id="global.nodata" defaultMessage="暂无数据"/>}
                      filterOption={false}
                      onSearch={this.fetchUser}
                      onChange={this.handleChange}
                      style={{width: '100%'}}
                    >
                      {this.state.data.map((d, index) => <Option
                        title={d.text}
                        // value={d.value}
                        key={d.id}>{d.text}</Option>)}
                      {/*{data.map((d, index) => <Option title={_util.searchConcat(d)}*/}
                      {/*key={d.id}>*/}
                      {/*{*/}
                      {/*_util.searchConcat(d)*/}
                      {/*}*/}

                      {/*</Option>)}*/}
                    </Select>
                  )
                }
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.priority" defaultMessage="优先级" />} >
                {getFieldDecorator('priority', {
                  initialValue: priority ? priority : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.priority),   //优先级
                    },
                  ],
                })(
                  <Select
                    placeholder={formatMessage(messages.select)}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="0"><FormattedMessage id="page.walkthrough.text.urgent" defaultMessage="紧急" /></Option>
                    <Option value="1"><FormattedMessage id="page.walkthrough.text.high_level" defaultMessage="高" /></Option>
                    <Option value="2"><FormattedMessage id="page.walkthrough.text.middle" defaultMessage="中" /></Option>
                    <Option value="3"><FormattedMessage id="page.walkthrough.text.low" defaultMessage="低" /></Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.package_desc" defaultMessage="任务包说明" />}>
                {getFieldDecorator('desc', {
                  initialValue: desc ? desc : null,
                })(
                  <TextArea
                    placeholder={formatMessage(messages.package_desc)}    //任务包说明
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

export default PackageAddForm = Form.create()(PackageAddForm)


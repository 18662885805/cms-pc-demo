import React, {Fragment} from 'react'
import {Form, Button, Modal, Input, Select, Spin, message, Upload, Checkbox} from 'antd'
import debounce from 'lodash/debounce'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {Keys, KeyDetail, keySearch, relatedSearch, KeyPut} from '@apis/facility/keys'
import {contractorSearch} from "@apis/construction/contractor"
import GoBackButton from '@component/go-back'

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item
const confirm = Modal.confirm

let _util = new CommonUtil()

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
  select_key_type: {
    id: 'app.message.walkthrough.select_key_type',
    defaultMessage: '请选择KEY类型',
  },
  select_trade_key: {
    id: 'app.message.walkthrough.select_trade_key',
    defaultMessage: '请选择类KEY',
  },
  select_system_key: {
    id: 'app.message.walkthrough.select_system_key',
    defaultMessage: '请选择系统KEY',
  },
  input_key_abbr: {
    id: 'app.message.walkthrough.input_key_abbr',
    defaultMessage: '请输入KEY的缩写',
  },
  input_english_abbr: {
    id: 'app.message.walkthrough.input_english_abbr',
    defaultMessage: '缩写必须是1位英文字母',
  },
  placeholder_key_abbr: {
    id: 'app.placeholder.walkthrough.placeholder_key_abbr',
    defaultMessage: 'KEY缩写',
  },
  input_english_abbr_4: {
    id: 'app.message.walkthrough.input_english_abbr_4',
    defaultMessage: '缩写必须是4位以内的英文字母',
  },
  placeholder_key_name: {
    id: 'app.placeholder.walkthrough.placeholder_key_name',
    defaultMessage: 'key名称',
  },
  input_name: {
    id: 'app.message.walkthrough.input_name',
    defaultMessage: '请输入名称',
  },
  placeholder_eqpt_desc: {
    id: 'app.placeholder.walkthrough.placeholder_eqpt_desc',
    defaultMessage: '系统/设备的相关描述',
  },
});

@injectIntl
class KeyEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      search_id: null,
      type: 0,
      tradekey: null,
      syskey: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      KeyDetail(this.props.location.state.id).then((res) => {
        const data = res.data.results

        if (data.type == 1) {
          keySearch({type: 0}).then(res => {
            this.setState({
              tradekey: res.data.results
            })
          })
        }
        if (data.type == 2) {
          keySearch({type: 0}).then(res => {
            this.setState({
              tradelist: res.data.results
            })
          })
          relatedSearch({related_key: data.trade_id}).then(res => {
            this.setState({
              syskey: res.data.results
            })
          })
          // keySearch({type: 1}).then(res => {
          //   this.setState({
          //     syskey: res.data.results
          //   })
          // })
        }

        this.setState({
          id: this.props.location.state.id,
          trade: data.trade_id,
          trade_name: data.trade_name,
          trade_abbr: data.trade_abbr,
          abbr: data.abbr,
          name: data.name,
          desc: data.introduce,
          type: data.type,
          related: data.related_key,
          related_label: data.related_key_abbr,
        }, () => {
          const {setFieldsValue} = this.props.form
          setFieldsValue({
            related_key: {key: data.related_key, label: `${data.related_key_abbr}-${data.related_key_name}`}
          })
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
        let {id} = _this.state
        let param = {}
        _this.setState({
          confirmLoading: true
        })
        const {type, related, related_label} = _this.state
        param.name = values.name
        param.type = type
        param.abbr = values.abbr.toUpperCase().trim()
        param.introduce = values.desc
        param.related_key = related ? related : null

        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            KeyPut(id, param).then((res) => {
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

  // handleChange = (value, obj) => {
  //   this.setState({
  //     search_id: obj ? obj.props.title : null,
  //     data: [],
  //     fetching: false,
  //   })
  // }

  onTypeChange = (value) => {
    if (value == 1) {
      keySearch({type: 0}).then(res => {
        this.setState({
          tradekey: res.data.results
        })
      })
    }

    if (value == 2) {
      keySearch({type: 1}).then(res => {
        this.setState({
          syskey: res.data.results
        })
      })
    }

    this.setState({
      related: '',
      related_label: '',
      abbr: '',
      name: '',
      desc: ''
    })
  }

  onRelatedChange = (value) => {
    this.setState({
      related: value.key,
      related_label: value.label,
      // abbr: '',
      // name: '',
      // desc: ''
    })
  }

  tradekeyChange = (obj) => {
    const {setFieldsValue} = this.props.form;
    relatedSearch({related_key: obj.key}).then(res => {
      this.setState({
        syskey: res.data.results
      })
    })
    setFieldsValue({
      related_key: {key: '', label: ''},
      // abbr: '',
      // name: '',
      // desc: ''
    })
    this.setState({
      trade: obj.label,
      trade_key: obj.key,
      related_label: '',
      related: '',
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {confirmLoading, spinLoading, type, tradekey, syskey, abbr, name, desc, related, related_label, tradelist, trade, trade_abbr, trade_name} = this.state
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.key.key_type" defaultMessage="KEY类型" />}>

                <Select
                  disabled
                  showSearch
                  placeholder={formatMessage(messages.select)}
                  optionFilterProp="children"
                  // onChange={this.onTypeChange}
                  value={type}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="0"><FormattedMessage id="page.walkthrough.trade" defaultMessage="大类" /></Option>
                  <Option value="1"><FormattedMessage id="page.walkthrough.system" defaultMessage="系统" /></Option>
                  <Option value="2"><FormattedMessage id="page.walkthrough.eqpt" defaultMessage="设备" /></Option>
                </Select>

              </FormItem>

              {
                type == 1 ?
                  <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.trade_key" defaultMessage="类KEY" />}>
                    {getFieldDecorator('related_key', {
                      //initialValue: related && related_label ? {key: related,label: related_label} : {key: null,label: null},
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.select_trade_key),   //请选择类KEY
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        allowClear
                        labelInValue
                        //value={{key: related, label: related_label}}
                        onChange={this.onRelatedChange}
                        placeholder={formatMessage(messages.select)}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {
                          Array.isArray(tradekey) && tradekey.map((d, index) =>
                            <Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                  :
                  null
              }

              {
                type == 2 ?
                  <Fragment>
                    <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.trade_key" defaultMessage="类KEY" />}>
                      {getFieldDecorator('trade_key', {
                        initialValue: trade && trade_name ? {key: trade, label: `${trade_abbr}-${trade_name}`} : {key: null, label: null},
                        rules: [
                          {
                            required: true,
                            message: formatMessage(messages.select_trade_key),   //请选择类KEY
                          },
                        ],
                      })(
                        <Select
                          showSearch
                          labelInValue
                          placeholder={formatMessage(messages.select)}
                          optionFilterProp="children"
                          onChange={this.tradekeyChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {
                            Array.isArray(tradelist) && tradelist.map((d, index) =>
                              <Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)
                          }
                        </Select>
                      )}
                    </FormItem>

                    <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system_key" defaultMessage="系统KEY" />}>
                      {
                        getFieldDecorator('related_key', {
                          //initialValue: related && related_label ? {key: related, label: related_label} : {key: null, label: null},
                          rules: [
                            {
                              required: true,
                              message: formatMessage(messages.select_system_key),   //请选择系统KEY
                            },
                          ],
                        })(
                          <Select
                            allowClear
                            showSearch
                            placeholder={formatMessage(messages.select_system_key)}   //"请选择系统KEY"
                            labelInValue
                            //value={{key: related, label: related_label}}
                            onChange={this.onRelatedChange}
                            notFoundContent={this.state.fetching ?
                              <Spin size="small"/> : <FormattedMessage id="global.nodata" defaultMessage="暂无数据"/>}
                            filterOption={false}
                            //onSearch={this.fetchUser}
                            style={{width: '100%'}}
                          >
                            {
                              Array.isArray(syskey) && syskey.map((d, index) =>
                                <Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)
                            }
                          </Select>
                        )}
                    </FormItem>
                  </Fragment>

                  :
                  null
              }

              {/*<FormItem {...formItemLayout} label="缩写:">*/}
                {/*{getFieldDecorator('abbr', {*/}
                  {/*initialValue: abbr ? abbr : null,*/}
                  {/*//getValueFromEvent: e => e.target.value.toUpperCase().trim(),*/}
                  {/*rules: [*/}
                    {/*{required: true, message: '请输入KEY的缩写'},*/}
                    {/*{*/}
                      {/*message: "缩写必须是英文字母和数字，数字可选",*/}
                      {/*pattern: /^[A-Za-z0-9]+$/*/}
                    {/*}*/}
                  {/*]*/}
                {/*})(<Input placeholder="KEY缩写"/>)}*/}
              {/*</FormItem>*/}

              {
                type == 0 ?
                  <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.abbr" defaultMessage="缩写" />}>
                    {getFieldDecorator('abbr', {
                      initialValue: abbr ? abbr : null,
                      //getValueFromEvent: e => e.target.value.toUpperCase().trim(),
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.input_key_abbr)    //请输入KEY的缩写
                        },
                        {
                          message: formatMessage(messages.input_english_abbr),     //缩写必须是1位英文字母
                          pattern: /^[A-Za-z]{1}$/
                        }
                      ]
                    })(<Input placeholder={formatMessage(messages.placeholder_key_abbr)}/>)}
                  </FormItem>
                  :
                  <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.abbr" defaultMessage="缩写" />}>
                    {getFieldDecorator('abbr', {
                      initialValue: abbr ? abbr : null,
                      //getValueFromEvent: e => e.target.value.toUpperCase().trim(),
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.input_key_abbr)    //请输入KEY的缩写
                        },
                        {
                          message: formatMessage(messages.input_english_abbr_4),    //缩写必须是4位以内的英文字母
                          pattern: /^[A-Za-z]{1,4}$/
                        }
                      ]
                    })(<Input placeholder={formatMessage(messages.placeholder_key_abbr)}/>)}
                  </FormItem>
              }

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.name" defaultMessage="名称" />}>
                {getFieldDecorator('name', {
                  initialValue: name ? name : null,
                  rules: [{required: true, message: formatMessage(messages.input_name)}],
                })(<Input placeholder={formatMessage(messages.placeholder_key_name)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.desc" defaultMessage="描述" />}>
                {getFieldDecorator('desc', {
                  initialValue: desc ? desc : null
                })(
                  <TextArea
                    placeholder={formatMessage(messages.placeholder_eqpt_desc)}    //"系统/设备的相关描述"
                    // className="custom"
                    // autosize={{minRows: 2, maxRows: 6}}
                    style={{minHeight: 32}}
                    rows={4}
                    // style={{ height: 50 }}
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

export default KeyEdit = Form.create()(KeyEdit)

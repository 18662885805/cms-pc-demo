import React from 'react'
import {Form, Button, Modal, Input, Select, Spin, Icon, message,
  Upload, Checkbox, Cascader, TreeSelect, DatePicker, Transfer} from 'antd'
import debounce from 'lodash/debounce'
import moment from 'moment'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {Rules} from '@apis/facility/rules'
import {TaskPost, getPackages} from '@apis/facility/packages'
import {SysEqptTree, RelatedRuleSearch, RelatedKeySearch, RuleSearchEqpt} from '@apis/facility/syseqpt'
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
  select_system_eqpt_key: {
    id: 'app.message.walkthrough.select_system_eqpt_key',
    defaultMessage: '请选择系统/设备KEY',
  },
  not_assign: {
    id: 'app.placeholder.walkthrough.not_assign',
    defaultMessage: '未分配',
  },
  assigned: {
    id: 'app.placeholder.walkthrough.assigned',
    defaultMessage: '已分配',
  },
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
  select_rule: {
    id: 'app.placeholder.select_rule',
    defaultMessage: '请选择规则',
  },
  cyclebase: {
    id: 'app.message.walkthrough.cyclebase',
    defaultMessage: '循环基于',
  },
  select_start_date: {
    id: 'app.placeholder.walkthrough.select_start_date',
    defaultMessage: '请选择开始时间',
  },
  select_next_date: {
    id: 'app.placeholder.walkthrough.select_next_date',
    defaultMessage: '请选择下次维护日期',
  },
  taskdesc: {
    id: 'app.placeholder.walkthrough.taskdesc',
    defaultMessage: '任务描述',
  },
});

@injectIntl
class TaskAddForm extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      search_id: null,
      is_cycle: true,
      fetching: false,
      mockData: [],
      dataSource: [],
      targetKeys: [],
      ruleslist: null,
      treeData: [],
      tempKeys: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
    this.fetchRules = debounce(this.fetchRules, 800)
  }

  componentDidMount() {
    console.log(this.props.location.state.id)
    SysEqptTree().then((res) => {
      let syseqpt_list = res.data.results.sys_eqp_data;
      const getValue = (obj) => {
        const tempObj = {}
        tempObj.title = obj.abbr + '-' + obj.name
        tempObj.value = obj.id
        tempObj.key = obj.number
        if (obj.children) {
          tempObj.children = []
          obj.children.map(o => {
            tempObj.children.push(getValue(o))
          })
        }
        return tempObj
      }
      const targetArr = []
      syseqpt_list.forEach(a => {
        targetArr.push(getValue(a))
      })

      this.setState({
        treeData: targetArr
      })
    })

    getPackages().then(res => {
      this.setState({
        packagelist: res.data.results
      })
    })

    this.setState({
      spinLoading: false,
      package_id: this.props.location.state.id
    })

  }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this
        const {package_id, targetKeys, tempKeys} = _this.state
        // _this.setState({
        //   confirmLoading: true
        // })
        let arr = targetKeys.filter(d => tempKeys.findIndex(c => c == d) < 0)

        if(arr.length < 1) {
          message.error('请选择系统/设备')
          return
        }

        const data = {
          package_id: _this.props.location.state.id,
          rule_id: values.rule_id,
          key_id: values.related_key,
          // cycle_base: values.base ? values.base == 0 ? 'interval' : 'real' : null,
          start_time: values.start_time.format('YYYY-MM-DD'),
          syseqp_ids: JSON.stringify(arr),
          desc: values.desc
        }
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            TaskPost(data).then((res) => {
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
    //     if (fetchId !== this.lastFetchId) {
    //         return
    //     }
    //     const data = res.data.results.map(user => ({
    //         value: user.text,
    //         text: user.text,
    //         id: user.id
    //     }))
    //     this.setState({data, fetching: false})
    // })
  }

  handleChange = (value, obj) => {
    this.setState({
      search_id: obj ? obj.props.title : null,
      data: [],
      fetching: false,
    })
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

  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }

  transferChange = (targetKeys) => {
    console.log(targetKeys)
    this.setState({targetKeys});
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  onKeyChange = (value) => {
    const {setFieldsValue} = this.props.form;
    RelatedRuleSearch({key_id: value}).then(res => {
      this.setState({
        ruleslist: res.data.results
      })
    })

    setFieldsValue({
      rule_id: ''
    })
    this.setState({
      dataSource: [],
      targetKeys: []
    })

    // RelatedKeySearch({related_key: value}).then(res => {
    //   let dataSource = []
    //   let source = res.data.results
    //   source.map((value) => {
    //     dataSource.push({
    //       key: value.id,
    //       title: value.name,
    //       description: value.sys_eqp_no
    //     })
    //   })
    //   this.setState({dataSource})
    // })
    //
    // this.setState({
    //   targetKeys: []
    // })
  }

  handleRuleChange = (value) => {
    const { ruleslist } = this.state
    let is_cycle = ruleslist.filter(d => d.id == value)[0].is_cycle
    this.setState({is_cycle: is_cycle})
    let dataSource = []
    let targetKeys = []
    this.setState({spinLoading: true})
    RuleSearchEqpt({rule_id: value}).then(res => {
      let temp0 = []
      let temp1 = []
      let source0 = res.data.results[0].assign_data
      let source1 = res.data.results[1].not_assign_data

      Array.isArray(source0) && source0.map((value) => {
        temp0.push({
          key: value.id,
          title: value.name,
          description: value.sys_eqp_no,
          disabled: true
        })
        targetKeys.push(value.id);
      })
      Array.isArray(source1) && source1.map((value) => {
        temp1.push({
          key: value.id,
          title: value.name,
          description: value.sys_eqp_no,
          disabled: false
        })
      })
      dataSource = [...temp1, ...temp0]
      this.setState({dataSource, spinLoading: false})
    })
    this.setState({
      //targetKeys: []
      targetKeys: targetKeys,
      tempKeys: targetKeys
    })
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {confirmLoading, spinLoading, treeData, ruleslist, packagelist} = this.state
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

    const children = [];

    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper eqpt">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system_eqpt_key" defaultMessage="系统/设备KEY" />} >
                {getFieldDecorator('related_key', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.select_system_eqpt_key),   //请选择系统/设备KEY
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    allowClear
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={treeData}
                    placeholder={formatMessage(messages.select_system_eqpt_key)}    //请选择系统/设备KEY
                    treeDefaultExpandAll
                    onChange={this.onKeyChange}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.rule" defaultMessage="规则" />} >
                {
                  getFieldDecorator('rule_id', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(messages.select_rule),   //请选择规则
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder={formatMessage(messages.select_rule)}   //请选择规则
                      onChange={this.handleRuleChange}
                      style={{width: '100%'}}
                    >
                      {
                        Array.isArray(ruleslist) && ruleslist.map((d, index) =>
                          <Option key={d.id} value={d.id}>{d.name}</Option>)
                      }
                    </Select>
                  )
                }
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.select_eqpt" defaultMessage="系统/设备选择" />} >

              </FormItem>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '15px'
              }}>

                <Transfer
                  dataSource={this.state.dataSource}
                  showSearch
                  className="tree-transfer"
                  titles={[formatMessage(messages.not_assign), formatMessage(messages.assigned)]}   //未分配/已分配
                  listStyle={{
                    width: 250,
                    height: 300,
                  }}
                  operations={['to right', 'to left']}
                  targetKeys={this.state.targetKeys}
                  onChange={this.transferChange}
                  onSelectChange={this.handleSelectChange}
                  render={item => `${item.title}-${item.description}`}
                  //render={item => item.title}
                  // footer={this.renderFooter}
                />
              </div>
              {/* {
                this.state.is_cycle ?
                  <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.base" defaultMessage="循环基于" />} >
                    {getFieldDecorator('base', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.cyclebase),    //循环基于
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        placeholder={formatMessage(messages.select)}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="0"><FormattedMessage id="page.walkthrough.text.fixed_time" defaultMessage="固定时间" /></Option>
                        <Option value="1"><FormattedMessage id="page.walkthrough.text.complete_time" defaultMessage="完成时间" /></Option>
                      </Select>
                    )}
                  </FormItem>
                  :
                  null
              } */}

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.next_date" defaultMessage="下次维护日期" />} >
                {getFieldDecorator('start_time', {
                  rules: [{required: true, message: formatMessage(messages.select_next_date)}],
                })(<DatePicker
                  placeholder={formatMessage(messages.select_next_date)}    //请选择下次维护日期
                  onChange={this.onStartChange}
                  disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                  format="YYYY-MM-DD" style={{width: '100%'}}
                />)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.belongpackage" defaultMessage="所属任务包" />} >

                <span>{this.props.location.state.package}</span>

              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.desc" defaultMessage="描述" />}>
                {getFieldDecorator('desc')(
                  <TextArea
                    placeholder={formatMessage(messages.taskdesc)}   //任务描述
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

export default TaskAddForm = Form.create()(TaskAddForm)

import React from 'react'
import {Form, Button, Modal, Input, Select, Switch, Spin, Icon,
  message, Upload, Checkbox, Cascader, TreeSelect, DatePicker, Transfer} from 'antd'
import debounce from 'lodash/debounce'
import moment from 'moment'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {Rules} from '@apis/facility/rules'
import {TaskDetail, TaskPut, getPackages} from '@apis/facility/packages'
import {SysEqptTree, RelatedKeySearch} from '@apis/facility/syseqpt'
import GoBackButton from '@component/go-back'

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item
const confirm = Modal.confirm
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

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
  select_package: {
    id: 'app.placeholder.walkthrough.select_package',
    defaultMessage: '请选择所属任务包',
  },
  taskdesc: {
    id: 'app.placeholder.walkthrough.taskdesc',
    defaultMessage: '任务描述',
  },
  is_transfer: {
    id: 'app.confirm.title.is_transfer',
    defaultMessage: '是否转移任务包，请确认?',
  },
  next_date: {
    id: 'app.placeholder.walkthrough.next_date',
    defaultMessage: '下次维护日期',
  },
  select_next_date: {
    id: 'app.placeholder.walkthrough.select_next_date',
    defaultMessage: '请选择下次维护日期',
  },
  operation: {
    id: 'app.confirm.walkthrough.operation',
    defaultMessage: '操作提示',
  },
  multiedit: {
    id: 'app.confirm.walkthrough.multiedit',
    defaultMessage: '您选择了多个对象，是否一起修改它们？',
  },
  yes: {
    id: 'app.confirm.walkthrough.yes',
    defaultMessage: '确认',
  },
  no: {
    id: 'app.confirm.walkthrough.no',
    defaultMessage: '取消',
  },
});

@injectIntl
class TaskEditForm extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      search_id: null,
      isCycle: false,
      fetching: false,
      mockData: [],
      dataSource: [],
      targetKeys: [],
      ruleslist: null,
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
      console.log(this.props.location.state.ids)
      console.log(this.props.location.state.package_id)
      TaskDetail(this.props.location.state.id).then((res) => {
        let data = res.data.results

        let obj = {
          package_id: data.package_id,
          next_date: data.next_date ? moment(data.next_date).format('YYYY-MM-DD') : '',
          next_remind: data.next_remind ? moment(data.next_remind).format('YYYY-MM-DD') : '',
          desc: data.desc
        }

        this.setState({
          obj: obj,
          rule: data.rule,
          rule_name: data.rule_name,
          related_key: data.sys_eqp_no,
          syseqpt: data.sys_eqp_name,
          start_time: data.start_time,
          interval: data.interval,
          interval_type: data.interval_type,
          last_date: data.last_date,
          next_date: data.next_date,
          next_remind: data.next_remind ? moment(data.next_remind).format('YYYY-MM-DD') : '',
          base: data.cycle_base == 'interval' ? '0' : '1',
          desc: data.desc,
          cycle_base: data.cycle_base,
          remind: data.remind,
        })
      })

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

      Rules().then(res => {
        this.setState({
          ruleslist: res.data.results
        })
      })

      getPackages().then(res => {
        this.setState({
          packagelist: res.data.results
        })
      })

      this.setState({
        spinLoading: false,
        id: this.props.location.state.id,
        package_id: this.props.location.state.package_id
      })

    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.props.location.state.ids && this.props.location.state.ids.length > 1){
          const _this = this
          const {obj, package_id, rule, next_remind} = _this.state
          const {id} = _this.state
          const data = {
            package_id: package_id,
            // rule_id: rule,
            task_id: id,
            //start_time: start_time ? start_time.format('YYYY-MM-DD') : null,
            next_date: values.next_date ? values.next_date.format('YYYY-MM-DD') : null,
            next_remind: next_remind,
            desc: values.desc
          }

          let param = {}
          Object.keys(obj).map(function(key){
            // if(obj[key] && obj[key] != data[key]){
            if(obj[key] != data[key]){
              console.log(key,obj[key])
              return param[key] = data[key]
            }
          });
          param.task_ids = _this.props.location.state.ids.join(',')
          console.log(param)

          confirm({
            title: formatMessage(messages.operation), //操作提示
            content: formatMessage(messages.multiedit),   //您选择了多个对象，是否一起修改它们？
            okText: formatMessage(messages.yes),
            cancelText: formatMessage(messages.no),
            onOk() {
              TaskPut(param).then((res) => {
                message.success(formatMessage(messages.saved))   //保存成功
                _this.props.history.goBack()
              })
            },
            onCancel() {
            }
          })
        }else {
          const _this = this
          const {package_id, rule, next_remind} = _this.state
          _this.setState({
            confirmLoading: true
          })
          const {id} = _this.state
          const data = {
            package_id: package_id,
            // rule_id: rule,
            //task_id: id,
            //start_time: start_time ? start_time.format('YYYY-MM-DD') : null,
            next_date: values.next_date ? values.next_date.format('YYYY-MM-DD') : null,
            next_remind: next_remind,
            desc: values.desc,
            task_ids: _this.props.location.state.id
          }

          confirm({
            title: formatMessage(messages.confirm_title),
            content: formatMessage(messages.confirm_content),
            okText: formatMessage(messages.okText),
            cancelText: formatMessage(messages.cancelText),
            onOk() {
              TaskPut(data).then((res) => {
                message.success(formatMessage(messages.saved))   //保存成功
                _this.props.history.goBack()
              })
            },
            onCancel() {
            }
          })
        }

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

  onCycleChange = (checked) => {
    this.setState({
      isCycle: checked
    })
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
    RelatedKeySearch({related_key: value}).then(res => {
      let dataSource = []
      let source = res.data.results
      source.map((value) => {
        dataSource.push({
          key: value.id,
          title: value.name,
          description: value.sys_eqp_no
        })
      })
      this.setState({dataSource})
    })

    this.setState({
      targetKeys: []
    })
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  // disabledEndDate = (current) => {
  //   const {next_date} = this.state
  //   //const startDate = this.state.startDate;
  //   if (!current || !next_date) {
  //     return false;
  //   }
  //   // return current && (current.valueOf() < moment().valueOf() || current.valueOf() > moment(startDate).add(30, 'days').valueOf());
  //   return current && (current.isBefore(moment(Date.now()).add(-1, 'days')) || current.isAfter(next_date) );
  // }

  disabledEndDate = (current) => {
    const {last_date, next_date, interval, interval_type} = this.state
    //const startDate = this.state.startDate;
    if (!current || !next_date) {
      return false;
    }
    if(!last_date){
      return current && ( current.isBefore(moment(Date.now()).add(-1, 'days')) );
    }else {
      if(interval_type === 'day'){
        return current && (current.isBefore(moment(Date.now()).add(-1, 'days')) || current.isBefore(moment(next_date).add(-interval, 'days').add(1, 'days')) || current.isAfter(next_date) );
      }
      if(interval_type === 'week'){
        return current && (current.isBefore(moment(Date.now()).add(-1, 'days')) || current.isBefore(moment(next_date).add(-interval, 'weeks').add(1, 'days')) || current.isAfter(next_date) );
      }
      if(interval_type === 'month'){
        return current && (current.isBefore(moment(Date.now()).add(-1, 'days')) || current.isBefore(moment(next_date).add(-interval, 'months').add(1, 'days')) || current.isAfter(next_date) );
      }
    }
  }

  onNextChange = (date, dateString) => {
    const { remind } = this.state
    console.log(remind)
    // let temp = moment(dateString).add(-2, 'days').format('YYYY-MM-DD')
    let temp = moment(dateString).add(-remind, 'days').format('YYYY-MM-DD')
    console.log(temp)
    this.onChange('next_remind', temp);
  }

  handlePackageChange = (value) =>{
    console.log(value)
    const { formatMessage } = this.props.intl
    const { setFieldsValue } = this.props.form
    let _this = this
    confirm({
      title: formatMessage(messages.is_transfer),    //是否转移任务包，请确认?
      content: formatMessage(messages.confirm_content),   //单击确认按钮后，将会提交数据
      okText: formatMessage(messages.okText),
      cancelText: formatMessage(messages.cancelText),
      onOk() {
        _this.setState({
          package_id: value
        })
      },
      onCancel() {

        setFieldsValue({
            package_id: _this.state.package_id
        })
      },
    })
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {confirmLoading, spinLoading, isCycle, treeData, ruleslist, rule, base, start_time, next_date, desc, packagelist} = this.state
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system_eqpt_code" defaultMessage="系统/设备编号" />} >
                <span>{this.state.related_key}</span>
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.rule" defaultMessage="规则" />}>
                <span>{this.state.rule_name}</span>
                {/*{*/}
                {/*getFieldDecorator('rule_id', {*/}
                {/*initialValue: rule ? rule : null,*/}
                {/*rules: [*/}
                {/*{*/}
                {/*required: true,*/}
                {/*message: '请选择规则',*/}
                {/*},*/}
                {/*],*/}
                {/*})(*/}
                {/*<Select*/}
                {/*disabled*/}
                {/*allowClear*/}
                {/*showSearch*/}
                {/*placeholder="请选择规则"*/}
                {/*//labelInValue*/}
                {/*notFoundContent={this.state.fetching ?*/}
                {/*<Spin size="small"/> : '暂无数据'}*/}
                {/*filterOption={false}*/}
                {/*onSearch={this.fetchUser}*/}
                {/*onChange={this.handleChange}*/}
                {/*style={{width: '100%'}}*/}
                {/*>*/}
                {/*{*/}
                {/*Array.isArray(ruleslist) && ruleslist.map((d, index) =>*/}
                {/*<Option key={d.id} value={d.id}>{d.name}</Option>)*/}
                {/*}*/}
                {/*</Select>*/}
                {/*)*/}
                {/*}*/}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system_eqpt_name" defaultMessage="系统/设备名" />} >
                <span>{this.state.syseqpt}</span>
                {/*{getFieldDecorator('eqp', {*/}
                {/*rules: [*/}
                {/*{*/}
                {/*required: true,*/}
                {/*message: '设备',*/}
                {/*},*/}
                {/*],*/}
                {/*})(*/}
                {/*<Select*/}
                {/*mode="multiple"*/}
                {/*style={{ width: '100%' }}*/}
                {/*placeholder="Please select"*/}
                {/*defaultValue={['a10', 'c12']}*/}
                {/*onChange={this.handleChange}*/}
                {/*>*/}
                {/*{children}*/}
                {/*</Select>*/}
                {/*)}*/}
              </FormItem>

              {/* {
                this.state.cycle_base ?
                  <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.base" defaultMessage="循环基于" />}>
                    {getFieldDecorator('base', {
                      initialValue: base ? base : null,
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.cyclebase),    //循环基于
                        },
                      ],
                    })(
                      <Select
                        disabled
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

              {/*<FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.start_time" defaultMessage="开始时间" />} >*/}
                {/*{getFieldDecorator('start_time', {*/}
                  {/*initialValue: start_time ? moment(start_time, 'YYYY-MM-DD') : null,*/}
                  {/*rules: [{required: true, message: formatMessage(messages.select_start_date)}],*/}
                {/*})(<DatePicker*/}
                  {/*placeholder={formatMessage(messages.select_start_date)}    //请选择开始时间*/}
                  {/*onChange={this.onStartChange}*/}
                  {/*disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}*/}
                  {/*format="YYYY-MM-DD" style={{width: '100%'}}*/}
                  {/*disabled*/}
                {/*/>)}*/}
              {/*</FormItem>*/}

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.next_date" defaultMessage="下次维护日期" />} >
                {getFieldDecorator('next_date', {
                  initialValue: next_date ? moment(next_date, 'YYYY-MM-DD') : null,
                  rules: [{required: true, message: formatMessage(messages.select_next_date)}],
                })(<DatePicker
                  placeholder={formatMessage(messages.select_next_date)}    //下次维护日期
                  onChange={this.onNextChange}
                  // disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                  disabledDate={this.disabledEndDate}
                  format="YYYY-MM-DD" style={{width: '100%'}}
                />)}
              </FormItem>

              {/*<FormItem {...formItemLayout} label="所属任务包">*/}

                {/*<span>{this.props.location.state.package}</span>*/}

              {/*</FormItem>*/}

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.belongpackage" defaultMessage="所属任务包" />}>
                {
                  getFieldDecorator('package_id', {
                    initialValue: this.state.package_id ? this.state.package_id : null,
                    rules: [
                      {
                        required: true,
                        message: formatMessage(messages.select_package),    //请选择所属任务包
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder={formatMessage(messages.select_package)}    //请选择所属任务包
                      onChange={this.handlePackageChange}
                      style={{width: '100%'}}
                    >
                      {
                        Array.isArray(packagelist) && packagelist.map((d, index) =>
                          <Option key={d.id} value={d.id}>{d.name}</Option>)
                      }
                    </Select>
                  )
                }
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.desc" defaultMessage="描述" />}>
                {getFieldDecorator('desc', {
                  initialValue: desc ? desc : null,
                })(
                  <TextArea
                    placeholder={formatMessage(messages.taskdesc)}   //任务描述
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

export default TaskEditForm = Form.create()(TaskEditForm)

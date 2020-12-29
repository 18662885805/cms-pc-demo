import React from 'react'
import {
  Form,
  Button,
  Modal,
  Input,
  Select,
  Switch,
  Spin,
  Icon,
  message,
  Upload,
  Checkbox,
  Cascader,
  TreeSelect,
  Row,
  Col,
  Radio,
  List
} from 'antd'
import debounce from 'lodash/debounce'
import { cloneDeep } from 'lodash'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {keySearch} from '@apis/facility/keys'
import {RulesPost, RulesDelete, myproject} from '@apis/facility/rules'
import {SysEqptTree} from '@apis/facility/syseqpt'
import {Types} from '@apis/facility/types'
import GoBackButton from '@component/go-back'

const {Option} = Select;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode;
const confirm = Modal.confirm
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

let _util = new CommonUtil()
let uuid = 1;

class RulesAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      search_id: null,
      num: null,
      goods: [],
      take_person: null,
      phone: null,
      isCycle: false,
      is_enable: false,
      fetching: false,
      visible: false,
      visible1: false,
      uid: null,
      ques: {
        name: '',
        content: []
      },
      subject: [],
      interval: '',
      remind: '',
      treeData: []
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  componentDidMount() {

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

    Types().then(res => {
      this.setState({
        typelist: res.data.results
      })
    })

    this.setState({
      spinLoading: false
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      let {subject, remind, interval, isCycle} = this.state
      if (subject.length < 1) {
        message.error('请添加检查步骤！')
        return
      }
      if (isCycle && interval == '') {
        message.error('请填写循环周期！')
        return
      }
      if (isCycle && remind == '') {
        message.error('请填写提前提醒天数！')
        return
      }
      if(values.unit === '0'){
        if( parseInt(remind) > parseInt(interval) ){
          message.warning('提前提醒天数不能超过循环周期！')
          return
        }
      }

      if (!err) {
        const _this = this

        _this.setState({
          confirmLoading: true
        })
        const { isCycle, is_enable } = _this.state
        const data = {
          rule_name: values.name,
          related_key: values.related_key.value,
          rule_mtype: values.mtype,
          rule_cycle: isCycle,
          rule_interval: interval ? interval : '',
          rule_interval_type: values.unit == 0 ? 'day' : values.unit == 1 ? 'week' : 'month',
          rule_remind: remind ? remind : '',
          rule_check_type: values.check_method,
          rule_is_open: is_enable,
          rule_desc: values.desc,
          step_info: JSON.stringify(subject),
        }

        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            RulesPost(data).then((res) => {
              message.success('保存成功')
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

  onEnableChange = (checked) => {
    this.setState({
      is_enable: checked
    })
  }

  fetchUser = (value) => {
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

  stepAdd = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      ques: {
        name: '',
        content: []
      },
    })
  }

  handleCancelEdit = () => {
    const {ques, subject} = this.state
    console.log(subject)
    this.setState({
      visible1: false,
      ques: {
        name: '',
        content: []
      },
      subject
    })
  }

  editQuestion(index) {
    const {subject, ques} = this.state;
    let temp = {};
    // Object.assign(temp, subject[index])
    temp = cloneDeep(subject[index])
    console.log(temp)
    this.setState({
      ques: temp,
      visible1: true,
      uid: index
    })
  }

  deleteQuestion(index) {
    const {subject} = this.state;

    subject.splice(index, 1)

    this.setState({
      subject
    })
  }

  addChoice = () => {
    const {ques, subject} = this.state
    //console.log(subject)
    console.log(ques)
    let is_true = true;
    try {
      ques.content.forEach(c => {
        if(!c.name){
          is_true = false;
          message.warning('选项不能为空')
          throw 'jumpout';
        }
      })
    }catch (e){
      console.log(e)
    }

    if(!is_true){
      return
    }

    let index = ques.content.length;
    ques.content.push({
      index: index,
      name: '',
      is_fault: false
    })
    this.setState({
      ques
    })
  }

  deleteChoice(idx) {
    console.log(idx)
    const {ques, subject} = this.state
    console.log(ques)
    ques.content.splice(idx, 1)

    this.setState({
      ques
    })
  }

  handleRadio = (args) => {
    let is_true = true;
    const {ques} = this.state
    console.log('checked = ', args);
    //let str = args.join(',');


    if(!is_true){
      return
    }

    // ques.content[e.target.value].is_fault = true

    ques.content.map((value, index) => {
      value.is_fault = false
      if (args.findIndex(d => d == value.name) > -1) {
        value.is_fault = true
      }
      // if (str.indexOf(index) > -1) {
      //   console.log(index)
      //   value.is_fault = true
      // }
    })

    console.log(ques)
    this.setState({
      ques
    })
  }

  handleRadioEdit = (args) => {
    const {ques} = this.state
    console.log('checked = ', args);
    let str = args.join(',');
    ques.content.forEach(c => c.is_fault = false)
    // ques.content[e.target.value].is_fault = true
    ques.content.map((value, index) => {

      if (str.indexOf(value.name) > -1) {
        console.log(value.name)
        value.is_fault = true
      }
    })
    console.log(ques)
    this.setState({
      ques
    })
  }

  hanldeQuestion = (e, index) => {
    const {ques} = this.state

    ques.name = e.target.value

    this.setState({
      ques
    })
  }

  handleChoice = (e, idx) => {
    const {ques} = this.state

    let is_true = true;
    // ques.content.forEach((d, index) => {
    //   if (e.target.value && e.target.value == d.name) {
    //     message.warning('该选项已存在');
    //     is_true = false
    //   }
    //   return  is_true
    // })
    if (is_true) {
      ques.content[idx].name = e.target.value
    }
    console.log(ques)
    this.setState({
      ques
    })
  }

  onBlur = (index) => {
    console.log(index)
    // ques.content[cIndex].name
    const {ques} = this.state
    let arr = ques.content.map(d => d.name)
    if(new Set(arr).size !== arr.length){
        ques.content[index].name = ''
        message.warning('该选项已存在')
    }

    this.setState({ques})

  }

  handleSave() {
    const {ques, subject} = this.state;

    if (!ques.name) {
      message.error('请填写步骤!')
      return
    }
    let is_true = false
    try {
      ques.content.forEach(c => {
        if(!c.name){
          message.warning('选项不能为空')
          is_true = true;
          throw 'jumpout';
        }
      })
    }catch (e){
      console.log(e)
    }

    if(is_true){
      return
    }

    if (ques.content.length <= 0) {
      message.error('请添加步骤选项!')
      return
    } else {
      const {content} = ques
      //console.log(content)
      if (!content.some(c => c.is_fault)) {
        message.error('至少设置一项异常结果!')
        return
      }
      if (!content.some(c => !c.is_fault)) {
        message.error('至少设置一项正常结果!')
        return
      }

      let arr = [];
      for (let j = 0, l = content.length; j < l; j++) {
        if (!content[j].name) {
          message.error('请填写选项内容!')
          return
        }else {
          if(arr.indexOf(content[j].name) == -1){
            arr.push(content[j].name)
          }else {
            message.error('选项已存在')
            return
          }
        }
      }
    }

    subject.push(ques)
    console.log(subject)
    //console.log(ques)
    this.setState({
      subject,
      visible: false,
      ques: {
        name: '',
        content: []
      },
      //loading: true
    })

  }

  handleEdit = (id) => {
    const {ques, subject} = this.state;

    if (!ques.name) {
      message.error('请填写步骤!')
      return
    }

    if (ques.content.length <= 0) {
      message.error('请添加步骤选项!')
      return
    } else {
      const {content} = ques

      if (!content.some(c => c.is_fault)) {
        message.error('请设置一项异常结果!')
        return
      }
      if (!content.some(c => !c.is_fault)) {
        message.error('至少设置一项正常结果!')
        return
      }
      let arr = []
      for (let j = 0, l = content.length; j < l; j++) {
        if (!content[j].name) {
          message.error('请填写选项内容!')
          return
        }else {
          if(arr.indexOf(content[j].name) == -1){
            arr.push(content[j].name)
          }else {
            message.error('选项已存在')
            return
          }
        }
      }
    }

    subject.splice(id, 1, ques)
    console.log(ques)
    this.setState({
      subject,
      visible1: false,
      ques: {
        name: '',
        content: []
      },
      //loading: true
    })
  }

  handleUnitChange = value => {
    console.log(value)
  }

  handleNumChange = (field,e) => {
    const { value } = e.target;
      this.setState({
        [field]: value
      })
    // const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    // if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
    //   this.setState({
    //     [field]: value
    //   })
    // }else {
    //   message.warning('请输入数字')
    // }
  };

  tradekeyChange = (obj) => {
    console.log(obj)
    const {setFieldsValue} = this.props.form;

    // SysEqptTree({trade_id: obj.key}).then((res) => {
    //   let syseqpt_list = res.data.results.sys_eqp_data;
    //   const getValue = (obj) => {
    //     const tempObj = {}
    //     tempObj.title = obj.abbr + '-' + obj.name
    //     tempObj.value = obj.id
    //     tempObj.key = obj.number
    //     if (obj.children) {
    //       tempObj.children = []
    //       obj.children.map(o => {
    //         tempObj.children.push(getValue(o))
    //       })
    //     }
    //     return tempObj
    //   }
    //   const targetArr = []
    //   syseqpt_list.forEach(a => {
    //     targetArr.push(getValue(a))
    //   })
    //
    //   this.setState({
    //     treeData: targetArr
    //   })
    // })

    setFieldsValue({
      related_key: {key: '', label: ''}
    })
    this.setState({
      trade: obj.label ? obj.label.split('-')[0] : '',
      trade_key: obj.key,
    })
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {confirmLoading, spinLoading, isCycle, fetching, data, subject, ques, uid, treeData, typelist, interval, remind} = this.state
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

    const modalItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
        md: {span: 16},
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10},
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };

    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <div style={{marginTop: '32px'}} key={k}>

          <FormItem
            {...formItemLayout}
            label={`步骤${index + 2}`}
            required={false}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "请输入步骤名称.",
              }],
            })(
              <Input placeholder="步骤名称" style={{marginRight: 8}}/>
            )}
            <Icon
              style={{position: 'absolute', right: '-30px', top: '4px'}}
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          </FormItem>

        </div>
      );
    });


    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              <FormItem {...formItemLayout} label="规则名称:">
                {getFieldDecorator('name', {
                  rules: [{required: true, message: '请输入规则名称'}],
                })(<Input placeholder="规则名称"/>)}
              </FormItem>

              {/*<FormItem {...formItemLayout} label="类key">*/}
                {/*{getFieldDecorator('trade_key', {*/}
                  {/*rules: [*/}
                    {/*{*/}
                      {/*required: true,*/}
                      {/*message: '请选择类',*/}
                    {/*},*/}
                  {/*],*/}
                {/*})(*/}
                  {/*<Select*/}
                    {/*showSearch*/}
                    {/*labelInValue*/}
                    {/*placeholder="-- 请选择 --"*/}
                    {/*optionFilterProp="children"*/}
                    {/*onChange={this.tradekeyChange}*/}
                    {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                  {/*>*/}
                    {/*{*/}
                      {/*Array.isArray(tradelist) && tradelist.map((d, index) =>*/}
                        {/*<Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)*/}
                    {/*}*/}
                  {/*</Select>*/}
                {/*)}*/}
              {/*</FormItem>*/}

              <FormItem {...formItemLayout} label="系统/设备Key">
                {getFieldDecorator('related_key', {
                  rules: [
                    {
                      required: true,
                      message: '请选择系统/设备KEY',
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    allowClear
                    labelInValue
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={treeData}
                    placeholder="请选择系统Key或设备Key"
                    treeDefaultExpandAll={false}
                    onChange={this.onChange}
                    filterTreeNode={(inputValue, treeNode) => treeNode.props.title.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  />
                )}
              </FormItem>

              {/*<TreeSelect*/}
              {/*showSearch*/}
              {/*//style={{ width: 300 }}*/}
              {/*value={this.state.value}*/}
              {/*dropdownStyle={{maxHeight: 400, overflow: 'auto'}}*/}
              {/*placeholder="Please select"*/}
              {/*allowClear*/}
              {/*treeDefaultExpandAll*/}
              {/*onChange={this.onChange}*/}
              {/*>*/}
              {/*<TreeNode value="parent 1" title="parent 1" key="0-1">*/}
              {/*<TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">*/}

              {/*</TreeNode>*/}
              {/*<TreeNode value="parent 1-1" title="parent 1-1" key="random2">*/}
              {/*/!*<TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />*!/*/}
              {/*</TreeNode>*/}
              {/*</TreeNode>*/}
              {/*<TreeNode value="parent 2" title="parent 2" key="0-2">*/}
              {/*<TreeNode value="parent 2-0" title="parent 2-0" key="0-2-1">*/}

              {/*</TreeNode>*/}
              {/*</TreeNode>*/}
              {/*</TreeSelect>*/}

              <FormItem {...formItemLayout} label="维护类型:">
                {getFieldDecorator('mtype', {
                  rules: [
                    {
                      required: true,
                      message: '维护类型',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    placeholder="-- 请选择 --"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      Array.isArray(typelist) && typelist.map((d, index) =>
                        <Option key={d.id} value={d.id}>{d.name}</Option>)
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否循环:">
                <Switch checked={this.state.isCycle} onChange={this.onCycleChange}/>
              </FormItem>

              {
                isCycle ?
                  <FormItem {...formItemLayout} label="循环周期:">

                    <Row gutter={8}>
                      <Col span={16}>
                        {getFieldDecorator('interval', {
                          rules: [
                            {required: true, message: '请输入循环周期'},
                            {
                              message: "请输入有效的循环周期",
                              pattern: /^(0|\+?[1-9][0-9]*)$/
                            }
                          ],
                        })(
                          <Input value={interval} onChange={this.handleNumChange.bind(this, 'interval')} placeholder="请输入循环周期"/>
                        )}
                        {/*<Input value={interval} onChange={this.handleNumChange.bind(this, 'interval')} placeholder="请输入循环周期"/>*/}
                      </Col>
                      <Col span={8}>
                        {getFieldDecorator('unit', {
                          rules: [{required: true, message: '请选择周期单位'}],
                        })(
                          <Select
                            placeholder="-- 请选择 --"
                            onChange={this.handleUnitChange}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            <Option value="0">天</Option>
                            <Option value="1">周</Option>
                            <Option value="2">月</Option>
                          </Select>
                        )}
                      </Col>
                    </Row>

                  </FormItem>
                  :
                  null

              }

              <FormItem {...formItemLayout} label="提前提醒天数">
                {getFieldDecorator('remind', {
                  rules: [
                    {required: true, message: '请设置提前提醒天数'},
                    {
                      message: "请输入有效的提醒天数",
                      pattern: /^(0|\+?[1-9][0-9]*)$/
                    }
                  ],
                })(
                  <Input value={remind} onChange={this.handleNumChange.bind(this, 'remind')} placeholder="请输入提前提醒天数"/>
                )}
                {/*<Input value={remind} onChange={this.handleNumChange.bind(this, 'remind')} placeholder="请输入提前提醒天数"/>*/}
              </FormItem>

              <FormItem {...formItemLayout} label="检查方式:">
                {getFieldDecorator('check_method', {
                  rules: [
                    {
                      required: true,
                      message: '检查方式',
                    },
                  ],
                })(
                  <Select
                    //showSearch
                    placeholder="-- 请选择 --"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="0">扫码</Option>
                    <Option value="1">手动</Option>
                    <Option value="2" disabled>NFC</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否启用">
                <Switch checked={this.state.is_enable} onChange={this.onEnableChange}/>
              </FormItem>

              <FormItem {...formItemLayout} label="描述">
                {getFieldDecorator('desc')(
                  <TextArea
                    placeholder="系统/设备的相关描述"
                    // className="custom"
                    // autosize={{minRows: 2, maxRows: 6}}
                    style={{minHeight: 32}}
                    rows={4}
                    // style={{ height: 50 }}
                    // onKeyPress={this.handleKeyPress}
                  />
                )}
              </FormItem>

              <div >

                {
                  subject.map((q, qIndex) => {
                    return (
                      <FormItem
                          label={`步骤${qIndex + 1}`}
                          {...formItemLayout}

                        >
                      <div
                        key={qIndex}
                        style={{
                          margin: '0 auto 10px',
                          // padding: '10px',
                          overflow: 'hidden',
                          borderBottom: subject.length > 1 ? '1px dashed #e8e8e8' : 'none',
                          // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                          width: '100%',
                          position: 'relative'
                        }}
                      >
                        <FormItem required>
                          <span>{subject[qIndex].name}</span>
                          <FormItem style={{marginBottom: 0}}>
                            <CheckboxGroup
                              //onChange={e => this.handleRadio(e, qIndex)}
                              style={{width: '100%'}}
                              value={
                                subject[qIndex].content.filter(n => n.is_fault).map(d => d.name)
                              }
                            >
                              {
                                q.content.map((c, cIndex) => {
                                  return (
                                    <FormItem
                                      key={cIndex}
                                      label={c.label}
                                      style={{height: '36px',overflow: 'hidden'}}
                                    >

                                      <Row gutter={5}>

                                        <Col span={10}>
                                          <FormItem
                                            key={cIndex}
                                            required
                                          >

                                            <span>{subject[qIndex].content[cIndex].name}</span>

                                          </FormItem>
                                        </Col>
                                        <Col span={6}>

                                          <Checkbox disabled
                                            value={`${c.name}`} style={{paddingLeft: '15px'}}>Is fault</Checkbox>

                                        </Col>

                                      </Row>

                                    </FormItem>
                                  )
                                })
                              }
                            </CheckboxGroup>
                            {/*<Button*/}
                            {/*type='dashed'*/}
                            {/*icon='plus'*/}
                            {/*onClick={() => {*/}
                            {/*this.addChoice(qIndex)*/}
                            {/*}}>添加结果</Button>*/}
                          </FormItem>
                        </FormItem>

                        <Icon
                          type="edit"
                          style={{
                            position: 'absolute',
                            right: '50px',
                            top: '10px',
                            cursor: 'pointer',
                            color: 'blue'
                          }}
                          onClick={() => {
                            this.editQuestion(qIndex)
                          }}/>

                        <Icon
                          type="close-circle-o"
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            cursor: 'pointer',
                            color: 'red'
                          }}
                          onClick={() => {
                            this.deleteQuestion(qIndex)
                          }}/>

                      </div>
                      </FormItem>
                    )

                  })
                }
                {/*<div style={{display: 'flex', justifyContent: 'center'}}>*/}
                {/*<Button type='dashed' icon='plus' onClick={this.addQuestion}>新增步骤</Button>*/}

                {/*</div>*/}

              </div>

              <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.stepAdd} style={{width: '100%'}}>
                  <Icon type="plus"/> 添加步骤
                </Button>
              </FormItem>


              {/*{*/}
              {/*formData.content ? formData.content.map((item, index) => {*/}
              {/*return (*/}
              {/*<FormItem*/}
              {/*key={index}*/}
              {/*label={item.text}*/}
              {/*hasFeedback*/}
              {/*{...formItemLayout}*/}
              {/*>*/}
              {/*{*/}
              {/*item.value*/}
              {/*?*/}
              {/*getFieldDecorator(item.field, {*/}
              {/*initialValue: item.value,*/}
              {/*rules: item.rules,*/}
              {/*})(*/}
              {/*_util.switchItem(item, _this)*/}
              {/*)*/}
              {/*:*/}
              {/*getFieldDecorator(item.field, {*/}
              {/*rules: item.rules,*/}
              {/*})(*/}
              {/*_util.switchItem(item, _this)*/}
              {/*)*/}
              {/*}*/}
              {/*</FormItem>*/}
              {/*)*/}
              {/*}) : ''*/}
              {/*}*/}
              <FormItem {...tailFormItemLayout}>
                <div style={{width: '100%', marginBottom: '20px'}}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                          style={{marginRight: '10px'}}>
                    提交
                  </Button>
                  <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>

            <Modal
              title="步骤添加"
              width={800}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              footer={null}
              maskClosable={false}
            >

              <div >
                <div
                  //key={qIndex}
                  style={{
                    margin: '0 auto 10px',
                    padding: '10px',
                    overflow: 'hidden',
                    // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  <FormItem
                    //label={`步骤${qIndex + 1}`}
                    label="步骤"
                    {...modalItemLayout}
                    required
                  >
                    <Input
                      placeholder="请编辑步骤标题"
                      onChange={e => this.hanldeQuestion(e)}
                      value={ques.name}/>
                    <FormItem style={{marginBottom: 0}}>

                      {
                        ques.content ?
                          <CheckboxGroup
                            onChange={e => this.handleRadio(e)}
                            style={{width: '100%',marginTop: '12px'}}
                            value={
                              ques.content.filter(n => n.name && n.is_fault).map(d => d.name)
                            }
                            // value={
                            //     '' + ques.content.map(con => con.is_fault).indexOf(true)
                            // }
                          >
                            {
                              ques.content.map((c, cIndex) => {
                                return (
                                  <FormItem
                                    key={cIndex}
                                    label={c.label}
                                    style={{height: '36px',overflow: 'hidden', marginBottom: '12px'}}
                                  >

                                    <Row gutter={5}>

                                      <Col span={10}>
                                        <FormItem
                                          key={cIndex}
                                          required
                                        >
                                          <Input
                                            placeholder="请编辑选项"
                                            onChange={e => this.handleChoice(e, cIndex)}
                                            onBlur={() => {this.onBlur(cIndex)}}
                                            value={ques.content[cIndex].name}/>

                                        </FormItem>
                                      </Col>
                                      <Col span={6}>

                                        <Checkbox
                                          value={`${c.name}`} style={{paddingLeft: '15px'}}>Is fault</Checkbox>

                                      </Col>
                                      <Col span={8}>
                                        <a onClick={() => {
                                          this.deleteChoice(cIndex)
                                        }}
                                           style={{paddingLeft: '15px'}}><Icon
                                          type="close"
                                          style={{color: 'red'}}/></a>
                                      </Col>
                                    </Row>

                                  </FormItem>
                                )
                              })
                            }
                          </CheckboxGroup>
                          :
                          null
                      }

                      <Button
                        type='dashed'
                        icon='plus'
                        onClick={() => {
                          this.addChoice()
                        }}>添加结果</Button>

                    </FormItem>
                  </FormItem>
                </div>

              </div>

              <FormItem style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                <Button
                  type="primary"
                  onClick={() => this.handleSave()}
                  loading={this.state.loading}
                  style={{marginRight: '10px'}}>
                  保存
                </Button>
              </FormItem>

            </Modal>

            <Modal
              title="步骤修改"
              width={800}
              visible={this.state.visible1}
              onCancel={this.handleCancelEdit}
              footer={null}
              maskClosable={false}
            >

              <div >

                <div
                  //key={qIndex}
                  style={{
                    margin: '0 auto 10px',
                    padding: '10px',
                    overflow: 'hidden',
                    // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  <FormItem
                    //label={`步骤${qIndex + 1}`}
                    label="步骤"
                    {...modalItemLayout}
                    required
                  >
                    <Input
                      placeholder="请编辑步骤标题"
                      onChange={e => this.hanldeQuestion(e)}
                      value={ques.name}/>
                    <FormItem style={{marginBottom: 0}}>
                      {
                        ques.content ?
                          <CheckboxGroup
                            onChange={e => this.handleRadioEdit(e)}
                            style={{width: '100%',marginTop: '12px'}}
                            value={ques.content.filter(n => n.name && n.is_fault).map(d => d.name)}
                            //value={ques.content.filter(n => n.is_fault).map(d => d.name)}
                            //value={[1,2]}
                          >
                            {
                              ques.content.map((c, cIndex) => {
                                return (
                                  <FormItem
                                    key={cIndex}
                                    label={c.label}
                                    style={{height: '36px',overflow: 'hidden', marginBottom: '12px'}}
                                  >

                                    <Row gutter={5}>

                                      <Col span={10}>
                                        <FormItem
                                          key={cIndex}
                                          required
                                        >
                                          <Input
                                            placeholder="请编辑选项"
                                            onChange={e => this.handleChoice(e, cIndex)}
                                            value={ques.content[cIndex].name}/>

                                        </FormItem>
                                      </Col>
                                      <Col span={6}>

                                        <Checkbox value={`${c.name}`} style={{paddingLeft: '15px'}}>
                                          Is fault</Checkbox>

                                      </Col>
                                      <Col span={8}>
                                        <a onClick={() => {
                                          this.deleteChoice(cIndex)
                                        }}
                                           style={{paddingLeft: '15px'}}><Icon
                                          type="close"
                                          style={{color: 'red'}}/></a>
                                      </Col>
                                    </Row>

                                  </FormItem>
                                )
                              })
                            }
                          </CheckboxGroup>
                          :
                          null
                      }
                      <Button
                        type='dashed'
                        icon='plus'
                        onClick={() => {
                          this.addChoice()
                        }}>添加结果</Button>

                    </FormItem>
                  </FormItem>
                </div>

              </div>

              <FormItem style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                <Button
                  type="primary"
                  onClick={() => this.handleEdit(uid)}
                  loading={this.state.loading}
                  style={{marginRight: '10px'}}>
                  保存
                </Button>
              </FormItem>

            </Modal>

          </Spin>
        </div>
      </div>
    )
  }
}

export default RulesAddForm = Form.create()(RulesAddForm)

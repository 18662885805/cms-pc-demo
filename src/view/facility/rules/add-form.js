import React, {Fragment} from 'react'
import {inject, observer} from "mobx-react/index";
import {
  Form, Button, Modal, Input, Select, Switch, Spin, Icon,
  message, Checkbox, TreeSelect, Row, Col, Radio, Upload
} from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
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
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode;
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
  addstep: {
    id: 'app.message.walkthrough.addstep',
    defaultMessage: '请添加检查步骤！',
  },
  input_cycle: {
    id: 'app.message.walkthrough.input_cycle',
    defaultMessage: '请填写循环周期！',
  },
  input_remind: {
    id: 'app.message.walkthrough.input_remind',
    defaultMessage: '请填写提前提醒天数！',
  },
  reminddate: {
    id: 'app.message.walkthrough.reminddate',
    defaultMessage: '提前提醒天数不能超过循环周期！',
  },
  empty: {
    id: 'app.message.walkthrough.empty',
    defaultMessage: '选项不能为空',
  },
  exists: {
    id: 'app.message.walkthrough.exists',
    defaultMessage: '选项已存在',
  },
  fillstep: {
    id: 'app.message.walkthrough.fillstep',
    defaultMessage: '请填写步骤!',
  },
  addstepoption: {
    id: 'app.message.walkthrough.addstepoption',
    defaultMessage: '请添加步骤选项!',
  },
  set_error_result: {
    id: 'app.message.walkthrough.set_error_result',
    defaultMessage: '至少设置一项异常结果!',
  },
  set_true_result: {
    id: 'app.message.walkthrough.set_true_result',
    defaultMessage: '至少设置一项正常结果!',
  },
  filloption: {
    id: 'app.message.walkthrough.filloption',
    defaultMessage: '请填写选项内容!',
  },
  input_rule_name: {
    id: 'app.message.walkthrough.input_rule_name',
    defaultMessage: '请输入规则名称',
  },
  rule_name: {
    id: 'app.placeholder.walkthrough.rule_name',
    defaultMessage: '规则名称',
  },
  select_system_eqpt_key: {
    id: 'app.message.walkthrough.select_system_eqpt_key',
    defaultMessage: '请选择系统/设备KEY',
  },
  mtype: {
    id: 'app.message.walkthrough.mtype',
    defaultMessage: '维护类型',
  },
  enter_cycle: {
    id: 'app.message.walkthrough.enter_cycle',
    defaultMessage: '请输入循环周期',
  },
  enter_right_cycle: {
    id: 'app.message.walkthrough.enter_right_cycle',
    defaultMessage: '请输入有效的循环周期',
  },
  select_cycle_unit: {
    id: 'app.message.walkthrough.select_cycle_unit',
    defaultMessage: '请选择周期单位',
  },
  set_remind_days: {
    id: 'app.message.walkthrough.set_remind_days',
    defaultMessage: '请设置提前提醒天数',
  },
  enter_right_days: {
    id: 'app.message.walkthrough.enter_right_days',
    defaultMessage: '请输入有效的提醒天数',
  },
  enter_remind_days: {
    id: 'app.placeholder.walkthrough.enter_remind_days',
    defaultMessage: '请输入提前提醒天数',
  },
  check_type: {
    id: 'app.message.walkthrough.check_type',
    defaultMessage: '检查方式',
  },
  desc: {
    id: 'app.placeholder.walkthrough.desc',
    defaultMessage: '系统/设备的相关描述',
  },
  editstep: {
    id: 'app.placeholder.walkthrough.editstep',
    defaultMessage: '请编辑步骤标题',
  },
  editoption: {
    id: 'app.placeholder.walkthrough.editoption',
    defaultMessage: '请编辑选项',
  },
  uploaded: {
    id: 'app.message.walkthrough.uploaded',
    defaultMessage: '上传成功',
  },
  cyclebase: {
    id: 'app.message.walkthrough.cyclebase',
    defaultMessage: '循环基于',
  },
});

@inject("menuState") @injectIntl
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
      treeData: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      unit: '0'
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  componentDidMount() {
      SysEqptTree({project_id: _util.getStorage('project_id')}).then((res) => {
        let syseqpt_list = res.data.sys_eqp_data;
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

    Types({project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        typelist: res.data
      })
    })

    this.setState({
      spinLoading: false
    })
    this.props.menuState.changeMenuCurrentUrl("/eqp/rule");
    this.props.menuState.changeMenuOpenKeys("/eqp");
  }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      let {subject, remind, interval, isCycle} = this.state
      if (subject.length < 1) {
        message.error(formatMessage(messages.addstep))    //请添加检查步骤！
        return
      }
      if (isCycle && interval == '') {
        message.error(formatMessage(messages.input_cycle))    //请填写循环周期！
        return
      }
      if (isCycle && remind == '') {
        message.error(formatMessage(messages.input_remind))    //请填写提前提醒天数！
        return
      }
      if(values.unit === '0'){
        if( parseInt(remind) > parseInt(interval) ){
          message.warning(formatMessage(messages.reminddate))    //提前提醒天数不能超过循环周期！
          return
        }
      }

      if (!err) {
        const _this = this

        _this.setState({
          confirmLoading: true
        })
        const { isCycle, is_enable, fileList } = _this.state

        let source = []
        if (fileList instanceof Array) {
          fileList.forEach((value) => {
            source.push(value.response.content.results.url)
          })
        }

        const data = {
          rule_name: values.name,
          related_key: values.related_key.value,
          rule_mtype: values.mtype,
          rule_cycle: isCycle,
          rule_interval: interval ? interval : '',
          rule_interval_type: values.unit == 0 ? 'day' : values.unit == 1 ? 'week' : 'month',
          cycle_base: values.base ? values.base == 0 ? 'interval' : 'real' : null,
          rule_remind: remind ? remind : '',
          rule_check_type: values.check_method,
          rule_is_open: is_enable,
          rule_desc: values.desc,
          step_info: JSON.stringify(subject),
          rule_guide_menu: source.length && source instanceof Array ? source.join(',') : ''
        }

        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            RulesPost(data).then((res) => {
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
    const { formatMessage } = this.props.intl
    const {ques, subject} = this.state
    //console.log(subject)
    console.log(ques)
    let is_true = true;
    try {
      ques.content.forEach(c => {
        if(!c.name){
          is_true = false;
          message.warning(formatMessage(messages.empty))    //选项不能为空
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
      is_fault: false,
      has_remarks: false
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

  handleRadio (index,event) {
    //let is_true = true;
    const {ques} = this.state
    console.log(`checked = ${event.target.checked}`);
    console.log(`${event.target.value}`);

    ques.content[index].is_fault = event.target.checked

    // ques.content.map((value, index) => {
    //   value.is_fault = false
    //   if (args.findIndex(d => d == value.name) > -1) {
    //     value.is_fault = true
    //   }
    // })

    console.log(ques)
    this.setState({
      ques
    })
  }

  handleRadio2 (index,event) {
    //let is_true = true;
    const {ques} = this.state
    console.log(`checked = ${event.target.checked}`);
    console.log(`${event.target.value}`);

    ques.content[index].has_remarks = event.target.checked

    console.log(ques)
    this.setState({
      ques
    })
  }

  handleRadioEdit(index,event) {
    //let is_true = true;
    const {ques} = this.state
    console.log(`checked = ${event.target.checked}`);
    console.log(`${event.target.value}`);

    ques.content[index].is_fault = event.target.checked
    console.log(ques)
    this.setState({
      ques
    })
  }

  handleRadioEdit2 = (index,event) => {
    //let is_true = true;
    const {ques} = this.state
    console.log(`checked = ${event.target.checked}`);
    console.log(`${event.target.value}`);

    ques.content[index].has_remarks = event.target.checked
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
    const { formatMessage } = this.props.intl
    // ques.content[cIndex].name
    const {ques} = this.state
    let arr = ques.content.map(d => d.name)
    if(new Set(arr).size !== arr.length){
        ques.content[index].name = ''
        message.warning(formatMessage(messages.exists))    //该选项已存在
    }

    this.setState({ques})

  }

  handleSave() {
    const {ques, subject} = this.state;
    const { formatMessage } = this.props.intl
    if (!ques.name) {
      message.error(formatMessage(messages.fillstep))    //请填写步骤!
      return
    }
    let is_true = false
    try {
      ques.content.forEach(c => {
        if(!c.name){
          message.warning(formatMessage(messages.empty))   //选项不能为空
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
      message.error(formatMessage(messages.addstepoption))   //请添加步骤选项!
      return
    } else {
      const {content} = ques
      //console.log(content)
      if (!content.some(c => c.is_fault)) {
        message.error(formatMessage(messages.set_error_result))   //至少设置一项异常结果!
        return
      }
      if (!content.some(c => !c.is_fault)) {
        message.error(formatMessage(messages.set_true_result))   //至少设置一项正常结果!
        return
      }

      let arr = [];
      for (let j = 0, l = content.length; j < l; j++) {
        if (!content[j].name) {
          message.error(formatMessage(messages.filloption))   //请填写选项内容!
          return
        }else {
          if(arr.indexOf(content[j].name) == -1){
            arr.push(content[j].name)
          }else {
            message.error(formatMessage(messages.exists))    //选项已存在
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
    const { formatMessage } = this.props.intl
    const {ques, subject} = this.state;

    if (!ques.name) {
      message.error(formatMessage(messages.fillstep))    //请填写步骤!
      return
    }

    if (ques.content.length <= 0) {
      message.error(formatMessage(messages.addstepoption))   //请添加步骤选项!
      return
    } else {
      const {content} = ques

      if (!content.some(c => c.is_fault)) {
        message.error(formatMessage(messages.set_error_result))   //至少设置一项异常结果!
        return
      }
      if (!content.some(c => !c.is_fault)) {
        message.error(formatMessage(messages.set_true_result))   //至少设置一项正常结果!
        return
      }
      let arr = []
      for (let j = 0, l = content.length; j < l; j++) {
        if (!content[j].name) {
          message.error(formatMessage(messages.filloption))   //请填写选项内容!
          return
        }else {
          if(arr.indexOf(content[j].name) == -1){
            arr.push(content[j].name)
          }else {
            message.error(formatMessage(messages.exists))    //选项已存在
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

  handleUploadChange = (info) => {
    let {fileList} = info

    const status = info.file.status
    const {formatMessage} = this.props.intl
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} ${formatMessage(messages.uploaded)}.`)   //上传成功
    } else if (status === 'error') {
      message.error(`${info.file.name} ${info.file.response.msg}.`)
    }
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = _util.getImageUrl(file.response.content.results.url);
      }
      return file;
    });
    this.setState({fileList})
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {confirmLoading, spinLoading, isCycle, fetching, data, subject, ques, uid, treeData, typelist, interval, remind, fileList, previewImage, unit} = this.state
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

    const modalItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18}
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

    const props2 = {
      multiple: true,
      action: _util.getServerUrl('/upload/card/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token')
      },
      data: {
        site_id: _util.getStorage('site')
      },
      // listType: 'picture',
      className: 'upload-list-inline',
    }

    const uploadButton = (
      <Button>
        <Icon type="upload"/> upload
      </Button>
    );

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.rule_name" defaultMessage="规则名称" />}>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: formatMessage(messages.input_rule_name)}],
                })(<Input placeholder={formatMessage(messages.rule_name)}/>)}
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system_eqpt_key" defaultMessage="系统/设备KEY" />}>
                {getFieldDecorator('related_key', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.select_system_eqpt_key),    //请选择系统/设备KEY
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    allowClear
                    labelInValue
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={treeData}
                    placeholder={formatMessage(messages.select_system_eqpt_key)}   //请选择系统Key或设备Key
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.maintenance_type" defaultMessage="维护类型" />}>
                {getFieldDecorator('mtype', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.mtype),   //维护类型
                    },
                  ],
                })(
                  <Select
                    showSearch
                    placeholder={formatMessage(messages.select)}
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.is_cycle" defaultMessage="是否循环" />}>
                <Switch checked={this.state.isCycle} onChange={this.onCycleChange}/>
              </FormItem>

              {
                isCycle ?
                  <Fragment>
                    <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.cycle" defaultMessage="循环周期" />}>
                      <Row gutter={8}>
                        <Col span={16}>
                          {getFieldDecorator('interval', {
                            rules: [
                              {required: true, message: formatMessage(messages.enter_cycle)},
                              {
                                message: formatMessage(messages.enter_right_cycle),   //请输入有效的循环周期
                                pattern: /^\+?[1-9][0-9]*$/        ///^(0|\+?[1-9][0-9]*)$/
                              }
                            ],
                          })(
                            <Input value={interval} onChange={this.handleNumChange.bind(this, 'interval')} placeholder={formatMessage(messages.enter_cycle)}/>
                          )}
                          {/*<Input value={interval} onChange={this.handleNumChange.bind(this, 'interval')} placeholder="请输入循环周期"/>*/}
                        </Col>
                        <Col span={8}>
                          {getFieldDecorator('unit', {
                            initialValue: unit ? unit : null,
                            rules: [{required: true, message: formatMessage(messages.select_cycle_unit)}],
                          })(
                            <Select
                              placeholder={formatMessage(messages.select)}
                              onChange={this.handleUnitChange}
                              optionFilterProp="children"
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                              <Option value="0"><FormattedMessage id="page.walkthrough.text.day" defaultMessage="天" /></Option>
                              <Option value="1"><FormattedMessage id="page.walkthrough.text.week" defaultMessage="周" /></Option>
                              <Option value="2"><FormattedMessage id="page.walkthrough.text.month" defaultMessage="月" /></Option>
                            </Select>
                          )}
                        </Col>
                      </Row>
                    </FormItem>

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
                  </Fragment>
                  :
                  null

              }

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.common.remind" defaultMessage="提前提醒天数" />}>
                {getFieldDecorator('remind', {
                  rules: [
                    {required: true, message: formatMessage(messages.set_remind_days)},
                    {
                      message: formatMessage(messages.enter_right_days),   //请输入有效的提醒天数
                      pattern: /^(0|\+?[1-9][0-9]*)$/
                    }
                  ],
                })(
                  <Input value={remind} onChange={this.handleNumChange.bind(this, 'remind')} placeholder={formatMessage(messages.enter_remind_days)}/>
                )}
                {/*<Input value={remind} onChange={this.handleNumChange.bind(this, 'remind')} placeholder="请输入提前提醒天数"/>*/}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.check_type" defaultMessage="检查方式" />}>
                {getFieldDecorator('check_method', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.check_type),   //检查方式
                    },
                  ],
                })(
                  <Select
                    //showSearch
                    placeholder={formatMessage(messages.select)}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="0"><FormattedMessage id="page.walkthrough.scancode" defaultMessage="扫码" /></Option>
                    <Option value="1"><FormattedMessage id="page.walkthrough.handle" defaultMessage="手动" /></Option>
                    <Option value="2" disabled>NFC</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.is_enable" defaultMessage="是否启用" />}>
                <Switch checked={this.state.is_enable} onChange={this.onEnableChange}/>
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.desc" defaultMessage="描述" />}>
                {getFieldDecorator('desc')(
                  <TextArea
                    placeholder={formatMessage(messages.desc)}    //系统/设备的相关描述
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
                            {/*<CheckboxGroup*/}
                              {/*//onChange={e => this.handleRadio(e, qIndex)}*/}
                              {/*style={{width: '100%'}}*/}
                              {/*value={*/}
                                {/*subject[qIndex].content.filter(n => n.is_fault).map(d => d.name)*/}
                              {/*}*/}
                            {/*>*/}
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

                                          <Checkbox disabled style={{paddingLeft: '15px'}} checked={c.is_fault}>Is fault</Checkbox>

                                        </Col>

                                        <Col span={6}>

                                          <Checkbox disabled style={{paddingLeft: '15px'}} checked={c.has_remarks}>需要备注附件</Checkbox>

                                        </Col>

                                      </Row>

                                    </FormItem>
                                  )
                                })
                              }
                            {/*</CheckboxGroup>*/}
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
                  <Icon type="plus"/> <FormattedMessage id="page.walkthrough.text.addstep" defaultMessage="添加步骤" />
                </Button>
              </FormItem>

              <FormItem {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.document" defaultMessage="操作手册"/>}>
              <div>
                <Upload
                  {...props2}
                  fileList={fileList}
                  beforeUpload={(file, files) => _util.beforeUploadFile(file, files, 3)}
                  onPreview={this.handlePreview}
                  onChange={this.handleUploadChange}
                  // accept='image/*,.pdf,.xlsx,.xls,.docx,.doc,.zip'
                  accept='.pdf'
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <div style={{
                  color: '#aab2bd',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  <FormattedMessage id="page.walkthrough.uploaddesc"
                                          defaultMessage="附件大小限制3M，格式要求.pdf"/>
                </div>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
              </div>
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
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>

            <Modal
              title={<FormattedMessage id="page.walkthrough.title.stepadd" defaultMessage="步骤添加" />}
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
                    label={<FormattedMessage id="page.walkthrough.text.steps" defaultMessage="步骤" />}
                    {...modalItemLayout}
                    required
                  >
                    <Input
                      placeholder={formatMessage(messages.editstep)}   //请编辑步骤标题
                      onChange={e => this.hanldeQuestion(e)}
                      value={ques.name}/>
                    <FormItem style={{marginBottom: 0}}>

                      {
                        ques.content ?
                            <div style={{marginTop: '12px'}}>
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
                                            placeholder={formatMessage(messages.editoption)}    //请编辑选项
                                            onChange={e => this.handleChoice(e, cIndex)}
                                            onBlur={() => {this.onBlur(cIndex)}}
                                            value={ques.content[cIndex].name}/>

                                        </FormItem>
                                      </Col>
                                      <Col span={6}>

                                        <Checkbox checked={ques.content[cIndex].is_fault} style={{paddingLeft: '15px'}} onChange={this.handleRadioEdit.bind(this,cIndex)}>
                                          Is fault</Checkbox>

                                      </Col>

                                      <Col span={6}>
                                        <Checkbox checked={ques.content[cIndex].has_remarks} style={{paddingLeft: '15px'}} onChange={this.handleRadioEdit2.bind(this,cIndex)}>需要备注附件</Checkbox>
                                      </Col>

                                      <Col span={2}>
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
                            </div>
                          :
                          null
                      }

                      <Button
                        type='dashed'
                        icon='plus'
                        onClick={() => {
                          this.addChoice()
                        }}>
                        <FormattedMessage id="page.walkthrough.text.addresult" defaultMessage="添加结果" />
                      </Button>

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
                  <FormattedMessage id="app.button.save" defaultMessage="保存"/>
                </Button>
              </FormItem>

            </Modal>

            <Modal
              title={<FormattedMessage id="page.walkthrough.title.stepedit" defaultMessage="步骤修改" />}
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
                    label={<FormattedMessage id="page.walkthrough.text.steps" defaultMessage="步骤" />}
                    {...modalItemLayout}
                    required
                  >
                    <Input
                      placeholder={formatMessage(messages.editstep)}   //请编辑步骤标题
                      onChange={e => this.hanldeQuestion(e)}
                      value={ques.name}/>
                    <FormItem style={{marginBottom: 0}}>
                      {
                        ques.content ?
                            <div style={{marginTop: '12px'}}>
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
                                              placeholder={formatMessage(messages.editoption)}    //请编辑选项
                                              onChange={e => this.handleChoice(e, cIndex)}
                                              onBlur={() => {this.onBlur(cIndex)}}
                                              value={ques.content[cIndex].name}/>

                                          </FormItem>
                                        </Col>
                                        <Col span={6}>

                                          <Checkbox checked={ques.content[cIndex].is_fault} style={{paddingLeft: '15px'}} onChange={this.handleRadioEdit.bind(this,cIndex)}>
                                            Is fault</Checkbox>

                                        </Col>

                                        <Col span={6}>
                                          <Checkbox checked={ques.content[cIndex].has_remarks} style={{paddingLeft: '15px'}} onChange={this.handleRadioEdit2.bind(this,cIndex)}>需要备注附件</Checkbox>
                                        </Col>

                                        <Col span={2}>
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
                            </div>

                          :
                          null
                      }
                      <Button
                        type='dashed'
                        icon='plus'
                        onClick={() => {
                          this.addChoice()
                        }}>
                        <FormattedMessage id="page.walkthrough.text.addresult" defaultMessage="添加结果" />
                      </Button>

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
                  <FormattedMessage id="app.button.save" defaultMessage="保存"/>
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

import React from 'react'
import {
  Form, Button, Modal, Input, Select, Spin, Icon, message, Row, Col, DatePicker, Upload, TimePicker, Card, Rate
} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {cloneDeep} from 'lodash'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {visitInfo} from '@apis/system/location/'
import {interviewee} from '@apis/event/interviewee'
import {MyMaintCardPut, MyMaintCardDetail} from '@apis/facility/mymaintcard'
import {CardType} from '@apis/facility/cardtype'
import {SupplierList} from '@apis/facility/supplier'
import GoBackButton from '@component/go-back'
import translation from '../translation'

const {Option} = Select;
const FormItem = Form.Item
const {TextArea} = Input;
const {RangePicker} = DatePicker
const confirm = Modal.confirm
let _util = new CommonUtil()
let uuid = 0;

const messages = defineMessages({
  number: {
    id: 'app.placeholder.maintcard.number',
    defaultMessage: '请输入合同编号',
  },
  object: {
    id: 'app.placeholder.maintcard.object',
    defaultMessage: '请输入维修对象',
  },
  supervisor: {
    id: 'app.placeholder.maintcard.supervisor',
    defaultMessage: '请输入监督人员',
  },
  workers: {
    id: 'app.placeholder.maintcard.workers',
    defaultMessage: '请输入维修人',
  },
  select_factory: {
    id: 'app.message.maintcard.select_factory',
    defaultMessage: '请选择访问厂区',
  },
  choose_interviewee: {
    id: 'app.message.maintcard.choose_interviewee',
    defaultMessage: '请选择接待人',
  },
  input_company: {
    id: 'app.placeholder.maintcard.input_company',
    defaultMessage: '请输入来访的公司或单位名称',
  },
  input_contact: {
    id: 'app.placeholder.maintcard.input_contact',
    defaultMessage: '请输入访问联系人',
  },
  input_phone: {
    id: 'app.placeholder.maintcard.input_phone',
    defaultMessage: '请输入联系人电话',
  },
  input_hours: {
    id: 'app.placeholder.maintcard.input_hours',
    defaultMessage: '请输入工时',
  },
  input_correct_hour: {
    id: 'app.message.maintcard.input_correct_hour',
    defaultMessage: '请输入正确的工时',
  },
  input_cost: {
    id: 'app.placeholder.maintcard.input_cost',
    defaultMessage: '请输入费用',
  },
  input_correct_cost: {
    id: 'app.message.maintcard.input_correct_cost',
    defaultMessage: '请输入正确的费用',
  },
  input_area: {
    id: 'app.placeholder.maintcard.input_area',
    defaultMessage: '请输入访问区域',
  },
  input_address: {
    id: 'app.placeholder.maintcard.input_address',
    defaultMessage: '请输入公司地址',
  },
  select_start_date: {
    id: 'app.placeholder.maintcard.select_start_date',
    defaultMessage: '请选择开始日期',
  },
  select_end_date: {
    id: 'app.placeholder.maintcard.select_end_date',
    defaultMessage: '请选择结束日期',
  },
  start_hour: {
    id: 'app.placeholder.maintcard.start_hour',
    defaultMessage: '进厂开始时间',
  },
  select_start_hour: {
    id: 'app.message.maintcard.select_start_hour',
    defaultMessage: '选择进厂开始时间',
  },
  end_hour: {
    id: 'app.placeholder.maintcard.end_hour',
    defaultMessage: '进厂截止时间',
  },
  select_end_hour: {
    id: 'app.message.maintcard.select_end_hour',
    defaultMessage: '选择进厂截止时间',
  },
  search_name_tel: {
    id: 'app.placeholder.maintcard.search_name_tel',
    defaultMessage: '输入姓名或者座机搜索',
  },
  city: {
    id: 'app.cargo.check.city',
    defaultMessage: '请选择省份',
  },
  city_code: {
    id: 'app.cargo.check.city_code',
    defaultMessage: '请选择车辆号牌归属地',
  },
  is_supplier: {
    id: 'app.message.maintcard.is_supplier',
    defaultMessage: '是否供应商',
  },
  supplier: {
    id: 'app.message.maintcard.supplier',
    defaultMessage: '请选择供应商',
  },
  need_type: {
    id: 'app.message.maintcard.need_type',
    defaultMessage: '请选项维修类型',
  },
  desc: {
    id: 'app.message.walkthrough.desc',
    defaultMessage: '维修内容',
  },
  member_list: {
    id: 'app.message.maintcard.member_list',
    defaultMessage: '请上传来访人员名单',
  },
  items: {
    id: 'app.page.maintcard.items',
    defaultMessage: '维修内容',
  },
  start_date: {
    id: 'app.walkthrough.start_date',
    defaultMessage: '开始日期',
  },
  end_date: {
    id: 'app.walkthrough.end_date',
    defaultMessage: '结束日期',
  },
});

@injectIntl
class MaintCardAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      num: 0,
      phone: null,
      fetching: false,
      visible: false,
      treeData: [],
      location_list: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      dateValue: null,
      type: '',
      userInfo: _util.getStorage('userInfo'),
      searchOptions: [],
      typelist: [],
      supplierlist: [],
      // search_id: _util.getStorage('userInfo').id || null,
      supervisor_id: '',
      // searchOptions: [{
      //   id: _util.getStorage('userInfo').id,
      //   name: _util.getStorage('userInfo').real_name,
      //   tel: _util.getStorage('userInfo').tel,
      //   department: _util.getStorage('userInfo').department
      // }],
      is_supplier: 0,
    }

    this.lastFetchId = 0
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fetchUser = debounce(this.fetchUser, 500).bind(this)
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      MyMaintCardDetail(this.props.location.state.id).then((res) => {
        const {results} = res.data

        let source_list = []
        if (results.file_path) {
          results.file_path.split(',').map((value, index) => {
            return source_list.push({
              uid: -(index + 1),
              name: value,
              status: 'done',
              url: _util.getImageUrl(value),
              thumbUrl: _util.getImageUrl(value),
              response: {
                content: {
                  results: {
                    url: value
                  }
                }
              }
            })
          })
        }

        this.setState({
          number: results.contract_no,
          object: results.main_obj,
          type: results.m_type_id,
          supervisor_id: results.agent_person,
          supervisor: results.agent_person_name,
          is_supplier: results.is_supplier ? 0 : 1,
          supplier: results.supplier_id,
          main_person: results.main_person,
          hours: results.total_time,
          unit1: results.time_unit,
          cost: results.cost,
          unit2: results.cost_unit,
          material: results.material,
          eqpt: results.sup_eqp,
          rate: results.result,
          start_date: results.start_date ? moment(results.start_date, 'YYYY-MM-DD') : '',
          end_date: results.end_date ? moment(results.end_date, 'YYYY-MM-DD') : '',
          items: results.maintain_detail,
          // start_date: results.start_date ? moment(results.start_date).format('YYYY-MM-DD') : '',
          // end_date: results.end_date ? moment(results.end_date).format('YYYY-MM-DD') : '',
          // start_hour: values.start_hour ? values.start_hour.format('HH:mm') : '',
          // end_hour: values.end_hour ? values.end_hour.format('HH:mm') : '',
          // items: JSON.parse(results.maintaindetail),
          fileList: source_list,
          code: results.supplier_no,
          email: results.supplier_email,
          phone: results.supplier_phone_a,
          // file_path: source.length && source instanceof Array ? source.join(',') : ''
        })
        // let length = results.maintain_detail.length
        // console.log('1'+length)
        // this.props.form.setFieldsValue({keys: [...Array(length).keys()]})
      })
    }

    CardType().then((res) => { // 维修类型
      this.setState({
        typelist: res.data.results
      })
    })

    SupplierList().then((res) => { //供应商列表
      this.setState({
        supplierlist: res.data.results
      })
    })

    //厂区
    visitInfo().then((res) => {
      if (res && res.data) {
        const {factory_and_location} = res.data && res.data.results
        if (Array.isArray(factory_and_location) && factory_and_location.length > 0) {
          this.setState({
            location_list: factory_and_location
          })
        }
      }
    })

    this.setState({
      spinLoading: false,
      id: this.props.location.state.id
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const {formatMessage} = this.props.intl
    this.props.form.validateFields((err, values) => {
      const {id, number, factory_id, supervisor, supervisor_id, fileList, start_date, end_date, is_supplier} = this.state

      if (!err) {

        // if (!factory_id) {
        //   message.error(formatMessage(messages.select_factory));   //请选择访问厂区
        //   return
        // }
        // if (!supervisor_id) {
        //   message.error(formatMessage(messages.choose_interviewee));   //请选择监督人员
        //   return
        // }
        // if (fileList.length === 0) {
        //   message.error(formatMessage(messages.member_list));   //请上传附件
        //   return
        // }

        const _this = this

        // _this.setState({
        //   confirmLoading: true
        // })

        let source = []
        if (fileList instanceof Array) {
          fileList.forEach((value) => {
            source.push(value.response.content.results.url)
          })
        }
        let arr1 = []
        arr1 = values.items.filter(item => item)

        const data = {
          maintenancecard_id: id,
          contract_no: values.number,
          main_obj: values.object,
          m_type_id: values.type,
          agent_person: supervisor_id,
          agent_person_name: supervisor,
          is_supplier: is_supplier === 0 ? 'True' : 'False',
          supplier_id: values.supplier,
          main_person: values.main_person,
          total_time: values.hours,
          time_unit: values.unit1,
          cost: values.cost,
          cost_unit: values.unit2,
          material: values.material,
          sup_eqp: values.eqpt,
          result: values.rate,
          // factory_id: factory_id,
          start_date: start_date ? moment(start_date).format('YYYY-MM-DD') : '',
          end_date: end_date ? moment(end_date).format('YYYY-MM-DD') : '',
          // start_hour: values.start_hour ? values.start_hour.format('HH:mm') : '',
          // end_hour: values.end_hour ? values.end_hour.format('HH:mm') : '',
          maintaindetail: JSON.stringify(arr1),
          file_path: source.length && source instanceof Array ? source.join(',') : ''
        }

        confirm({
          title: formatMessage(translation.confirm_title),
          content: formatMessage(translation.confirm_content),
          okText: formatMessage(translation.okText),
          cancelText: formatMessage(translation.cancelText),
          onOk() {
            MyMaintCardPut(data).then((res) => {
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

  handleUploadChange = (info) => {
    let {fileList} = info

    const status = info.file.status
    const {formatMessage} = this.props.intl
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} ${formatMessage(translation.uploaded)}.`)   //上传成功
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

  handleSupervisorPerson = obj => {
    if (obj) {
      this.setState({
        supervisor_id: obj.key,
        supervisor: obj.label
      })
    }
  }

  // handleApprovalPerson = value => {
  //   if (value) {
  //     this.setState({
  //       search_id: value
  //     })
  //   }
  // }
  fetchUser = value => {
    this.lastFetchId += 1
    const fetchId = this.lastFetchId

    this.setState({
      fetching: true,
      searchOptions: []
    })
    interviewee({
      q: value,
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return
      }
      const searchOptions = res.data.results.map(user => ({
        name: user.name,
        value: user.name,
        text: user.name,
        id: user.id,
        org:user.org,
        tel: user.tel,
        //phone: user.phone
      }))
      this.setState({
        searchOptions,
        fetching: false
      })
    })
  }

  // handleCancel = () => {
  //   this.setState({
  //     visible: false,
  //     ques: {
  //       name: '',
  //       content: []
  //     },
  //   })
  // }
  handleCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  handleNumChange = (field, e) => {
    const {value} = e.target;
    this.setState({
      [field]: value
    })
  };

  handleSelectChange = (field, value) => {
    this.setState({
      [field]: value
    })
  }

  onLocationChange = (value) => {

    this.setState({
      factory_id: value,
    })
  }

  // changeNumberForm = (field, value) => {
  //   this.setState({
  //     [field]: value
  //   })
  // };

  InputForm = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSupplierChange = value => {
    this.setState({
      is_supplier: value
    })
  }

  handleSupplierChange = value => {
    const {supplierlist} = this.state
    const {setFieldsValue} = this.props.form;
    let obj = supplierlist.filter(d => d.id == value)[0]
    let phone = ''
    if (obj.phone_a && obj.phone_b) {
      phone = [obj.phone_a, obj.phone_b].join(',')
    } else {
      phone = obj.phone_a
    }
    setFieldsValue({
      code: obj.no,
      email: obj.email,
      phone: phone
    })
  }

  onDateChange = (value, dateString) => {
    console.log(value, dateString);
    this.setState({
      dateValue: value,
      start_date: value[0],
      end_date: value[1]
    })
  }

  handleUploadChange(info) {
    let {fileList} = info
    const status = info.file.status
    const {formatMessage} = this.props.intl
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} ${formatMessage(translation.uploaded)}.`)   //上传成功
    } else if (status === 'error') {
      message.error(`${info.file.name} ${info.file.response.msg}.`)
    }
    this.setState({fileList})
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  removex = (index) => {
        const {items} = this.state;
        const _this = this;

        items.splice(index, 1)

        _this.setState({
            items
        })

    }

  remove = k => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const {form} = this.props;
    const {items} = this.state
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid + items.length);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {
      confirmLoading, spinLoading, fetching, treeData, fileList, previewImage, userInfo, typelist, supplierlist,
      number, object, type, supervisor_id, supervisor, is_supplier, supplier, main_person, hours, unit1, cost,
      unit2, material, eqpt, rate, start_date, end_date, items, code, email, phone
    } = this.state

    const {formatMessage} = this.props.intl
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const addItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 4},
      },
    };

    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <div style={{marginTop: '32px'}} key={k}>

          <FormItem
              {...addItemLayout}
              label={formatMessage(messages.items)+`${index + 1 + items.length}`}
              required={false}
          >
              {getFieldDecorator(`items[${k}]`, {
                  // validateTrigger: ['onChange', 'onBlur'],
                  // rules: [{
                  //     required: true,
                  //     whitespace: true,
                  //     message: formatMessage(messages.items),
                  // }],
              })(
                  <Input placeholder={formatMessage(messages.items)} style={{marginRight: 8}}/>
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
    // const props2 = {
    //   multiple: true,
    //   accept: 'image/*,.xlsx,.xls',
    //   action: _util.getServerUrl('/upload/member_list/'),
    //   headers: {
    //     Authorization: 'JWT ' + _util.getStorage('token')
    //   },
    //   data: {
    //     site_id: _util.getStorage('site')
    //   },
    //   // listType: 'picture',
    //   // defaultFileList: [...fileList],
    //   className: 'upload-list-inline',
    // }

    const issupplier = [
      {id: 0, name: <FormattedMessage id="page.walkthrough.maintcard.yes" defaultMessage="是"/>},
      {id: 1, name: <FormattedMessage id="page.walkthrough.maintcard.no" defaultMessage="否"/>}
    ]

    const props2 = {
      action: _util.getServerUrl('/eqp/syseqp/file/upload/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token')
      },
      data: {
        site_id: _util.getStorage('site')
      },
      listType: 'picture',
      // defaultFileList: [...fileList],
      className: 'upload-list-inline',
    }

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              <Card
                title={<FormattedMessage id="page.walkthrough.maintcard.eqpInfo" defaultMessage="维修信息"/>}
                style={{marginBottom: '15px'}}
              >
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.number" defaultMessage="合同编号"/>}
                    >
                      {getFieldDecorator('number', {
                        initialValue: number ? number : null,
                        rules: [{required: true, message: formatMessage(messages.number)}],
                      })(<Input placeholder={formatMessage(messages.number)}/>)}
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.object" defaultMessage="维修对象"/>}
                    >
                      {getFieldDecorator('object', {
                        initialValue: object ? object : null,
                        rules: [{required: true, message: formatMessage(messages.object)}],
                      })(<Input placeholder={formatMessage(messages.object)}/>)}
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.type" defaultMessage="维修类型"/>}
                    >
                      {getFieldDecorator('type', {
                        initialValue: type ? type : null,
                        rules: [{required: true, message: formatMessage(messages.need_type)}],
                      })(
                        <Select
                          allowClear
                          showSearch
                          //onChange={value => this.onChange(value)}
                          placeholder={formatMessage(translation.select)}
                          // value={this.state.type || undefined}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {
                            typelist instanceof Array && typelist.length ? typelist.map((d, index) => {
                              return (<Option key={index} value={d.id}>{d.name}</Option>)
                            }) : null
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem
                      label={<FormattedMessage id="page.walkthrough.maintcard.supervisor" defaultMessage="监督人员"/>}
                      hasFeedback
                      {...formItemLayout}
                      required
                    >
                      {getFieldDecorator('supervisor', {
                        initialValue: supervisor && supervisor_id ? {
                          label: supervisor,
                          value: supervisor_id
                        } : {label: null, value: null},
                        //initialValue: supervisor ? {key: supervisor_id, label: supervisor} : null,
                        rules: [{required: true, message: formatMessage(messages.supervisor)}],
                      })(
                        <Select
                          // showArrow
                          showSearch
                          labelInValue
                          // allowClear
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          notFoundContent={this.state.fetching ? <Spin size="small"/> :
                            <FormattedMessage id="global.nodata" defaultMessage="暂无数据"/>}
                          placeholder={formatMessage(messages.search_name_tel)}   //输入姓名或者座机搜索
                          onSearch={this.fetchUser}
                          onChange={this.handleSupervisorPerson}
                          // value={this.state.supervisor_id || undefined}
                          // value={{key: supervisor_id, label: supervisor}}
                        >
                          {
                            this.state.searchOptions.map(s => {
                              return <Option key={s.id} title={_util.searchConcat(s)}>{_util.searchConcat(s)}</Option>
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  {/*<FormItem*/}
                  {/*{...formItemLayout}*/}
                  {/*label={<FormattedMessage id="page.walkthrough.maintcard.supervisor" defaultMessage="监督人员"/>}*/}
                  {/*>*/}
                  {/*{getFieldDecorator('supervisor', {*/}
                  {/*rules: [{required: true, message: formatMessage(messages.supervisor)}],*/}
                  {/*})(<Input placeholder={formatMessage(messages.supervisor)}/>)}*/}
                  {/*</FormItem>*/}

                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.is_supplier" defaultMessage="是否供应商"/>}
                    >
                      {getFieldDecorator('is_supplier', {
                        initialValue: is_supplier === 0 ? 0 : 1,
                        rules: [{required: true, message: formatMessage(messages.is_supplier)}],
                      })(
                        <Select
                          allowClear
                          showSearch
                          onChange={value => this.onSupplierChange(value)}
                          placeholder={formatMessage(translation.select)}
                          //value={this.state.is_supplier}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {
                            issupplier instanceof Array && issupplier.length ? issupplier.map((d, index) => {
                              return (<Option key={index} value={d.id}>{d.name}</Option>)
                            }) : null
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.workers" defaultMessage="维修人"/>}
                    >
                      {getFieldDecorator('main_person', {
                        initialValue: main_person ? main_person : null,
                        rules: [{required: true, message: formatMessage(messages.workers)}],
                      })(<Input placeholder={formatMessage(messages.workers)}/>)}
                    </FormItem>
                  </Col>
                </Row>

                {/*<Col span={8}>*/}
                {/*<FormItem*/}
                {/*{...formItemLayout}*/}
                {/*label={<FormattedMessage id="page.walkthrough.maintcard.start_time" defaultMessage="开始时间"/>}*/}
                {/*>*/}
                {/*<Row gutter={8}>*/}
                {/*<Col span={16}>*/}

                {/*{getFieldDecorator('start_time', {*/}
                {/*//initialValue: moment(new Date(), 'YYYY-MM-DD'),*/}
                {/*rules: [{required: true, message: formatMessage(messages.select_start_date)}],*/}
                {/*})(*/}
                {/*<DatePicker*/}
                {/*placeholder={formatMessage(messages.select_start_date)}   //请选择开始日期*/}
                {/*//onChange={this.onStartChange}*/}
                {/*disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}*/}
                {/*format="YYYY-MM-DD" style={{width: '100%'}}*/}
                {/*/>*/}
                {/*)}*/}
                {/*</Col>*/}
                {/*<Col span={8}>*/}
                {/*{getFieldDecorator('start_hour', {*/}
                {/*//initialValue: moment('8:00', 'HH:mm'),*/}
                {/*rules: [*/}
                {/*{*/}
                {/*required: true,*/}
                {/*message: formatMessage(messages.select_start_hour),   //选择开始时间*/}
                {/*},*/}
                {/*],*/}
                {/*})(*/}
                {/*<TimePicker format={format} minuteStep={30} placeholder={formatMessage(messages.start_hour)}*/}
                {/*style={{width: '100%'}}/>*/}
                {/*)}*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*</FormItem>*/}
                {/*</Col>*/}

                {/*<Col span={8}>*/}
                {/*<FormItem*/}
                {/*{...formItemLayout}*/}
                {/*label={<FormattedMessage id="page.walkthrough.maintcard.end_time" defaultMessage="结束时间"/>}*/}
                {/*>*/}
                {/*<Row gutter={8}>*/}
                {/*<Col span={16}>*/}
                {/*{getFieldDecorator('end_time', {*/}
                {/*//initialValue: moment(new Date(), 'YYYY-MM-DD'),*/}
                {/*rules: [{required: true, message: formatMessage(messages.select_end_date)}],*/}
                {/*})(*/}
                {/*<DatePicker*/}
                {/*placeholder={formatMessage(messages.select_end_date)}   //请选择结束日期*/}
                {/*//onChange={this.onStartChange}*/}
                {/*disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}*/}
                {/*format="YYYY-MM-DD" style={{width: '100%'}}*/}
                {/*/>*/}
                {/*)}*/}
                {/*</Col>*/}
                {/*<Col span={8}>*/}
                {/*{getFieldDecorator('end_hour', {*/}
                {/*//initialValue: moment('18:00', 'HH:mm'),*/}
                {/*rules: [*/}
                {/*{*/}
                {/*required: true,*/}
                {/*message: formatMessage(messages.select_end_hour),   //请选择结束时间*/}
                {/*},*/}
                {/*],*/}
                {/*})(<TimePicker format={format} minuteStep={30} placeholder={formatMessage(messages.end_hour)}*/}
                {/*style={{width: '100%'}}/>)}*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage id="page.event.maintcard.workinghour" defaultMessage="工时"/>}>
                      <Row gutter={8}>
                        <Col span={16}>
                          {getFieldDecorator('hours', {
                            initialValue: hours ? hours : null,
                            rules: [
                              {required: true, message: formatMessage(messages.input_hours)},
                              {
                                message: formatMessage(messages.input_correct_hour),   //请输入正确的工时
                                pattern: /^\d+(\.{0,1}\d+){0,1}$/
                              }
                            ],
                          })(
                            <Input value={hours} onChange={this.handleNumChange.bind(this, 'hours')}
                                   placeholder={formatMessage(messages.input_hours)}/>
                          )}
                        </Col>
                        <Col span={8}>
                          {getFieldDecorator('unit1', {
                            initialValue: unit1 ? unit1 : null,
                            rules: [
                              // {
                              //   required: true,
                              //   message: formatMessage(messages.select_start_hour),   //选择开始时间
                              // },
                            ],
                          })(
                            <Select
                              // value={currency}
                              // size={size}
                              style={{width: '100%'}}
                              onChange={this.handleSelectChange.bind(this, 'unit1')}
                            >
                              <Option value="0">hour</Option>
                            </Select>
                          )}
                        </Col>
                      </Row>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.cost" defaultMessage="费用"/>}
                    >
                      <Row gutter={8}>
                        <Col span={16}>
                          {getFieldDecorator('cost', {
                            initialValue: cost ? cost : null,
                            rules: [
                              {required: true, message: formatMessage(messages.input_cost)},
                              {
                                message: formatMessage(messages.input_correct_cost),
                                pattern: /^\d+(\.{0,1}\d+){0,1}$/
                              }
                            ],
                          })(
                            <Input value={hours} onChange={this.handleNumChange.bind(this, 'hours')}
                                   placeholder={formatMessage(messages.input_cost)}/>
                          )}
                        </Col>
                        <Col span={8}>
                          {getFieldDecorator('unit2', {
                            initialValue: unit2 ? unit2 : null,
                            rules: [
                              // {
                              //   required: true,
                              //   message: formatMessage(messages.select_start_hour),   //选择开始时间
                              // },
                            ],
                          })(
                            <Select
                              // value={currency}
                              // size={size}
                              style={{width: '100%'}}
                              onChange={this.handleSelectChange.bind(this, 'unit2')}
                            >
                              <Option value="0">CNY¥</Option>
                              <Option value="1">USA$</Option>
                            </Select>
                          )}
                        </Col>
                      </Row>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage id="page.event.maintcard.material" defaultMessage="使用材料"/>}>
                      {getFieldDecorator('material', {
                        initialValue: material ? material : null,
                        rules: [
                          // {required: true, message: formatMessage(messages.input_material)}
                        ],
                      })(
                        <Input placeholder="请输入使用材料"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage id="page.event.maintcard.eqpt" defaultMessage="辅助设备"/>}>
                      {getFieldDecorator('eqpt', {
                        initialValue: eqpt ? eqpt : null,
                        rules: [
                          // {required: true, message: formatMessage(messages.input_material)}
                        ],
                      })(
                        <Input placeholder="请输入辅助设备"/>
                      )}
                    </FormItem>
                  </Col>

                  {/*<Col span={8}>*/}
                  {/*<FormItem*/}
                  {/*{...formItemLayout}*/}
                  {/*label={<FormattedMessage id="page.walkthrough.maintcard.prod" defaultMessage="维修日期"/>}*/}
                  {/*>*/}
                  {/*{getFieldDecorator('start_time', {*/}
                  {/*//initialValue: moment(new Date(), 'YYYY-MM-DD'),*/}
                  {/*//rules: [{required: true, message: formatMessage(messages.select_start_date)}],*/}
                  {/*})(*/}
                  {/*<DatePicker*/}
                  {/*//placeholder={formatMessage(messages.select_start_date)}   //请选择开始日期*/}
                  {/*placeholder="维修日期"   //请选择开始日期*/}
                  {/*//onChange={this.onStartChange}*/}
                  {/*disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}*/}
                  {/*format="YYYY-MM-DD" style={{width: '100%'}}*/}
                  {/*/>*/}
                  {/*)}*/}
                  {/*</FormItem>*/}
                  {/*</Col>*/}

                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.prod" defaultMessage="维修日期"/>}
                    >
                      <RangePicker
                        placeholder={[formatMessage(messages.start_date), formatMessage(messages.end_date)]}     // 开始日期/结束日期
                        // ranges={{Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')]}}
                        onChange={this.onDateChange}
                        // onOk={this.onOk}
                        value={[start_date, end_date]}
                      />
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem
                      label={<FormattedMessage id="page.event.maintcard.created" defaultMessage="创建人"/>}
                      hasFeedback
                      {...formItemLayout}
                      required
                    >
                      <span>{userInfo.real_name}</span>
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={<FormattedMessage id="page.walkthrough.maintcard.rate" defaultMessage="完成结果"/>}
                    >
                      {getFieldDecorator('rate', {
                        initialValue: rate ? rate : null,
                      })(<Rate />)}
                    </FormItem>
                  </Col>
                </Row>

              </Card>

              <Card
                title={<FormattedMessage id="page.walkthrough.maintcard.content" defaultMessage="维修内容"/>}
                style={{marginBottom: '15px'}}
              >
                <div className="item-box">

                  {/*<FormItem*/}
                  {/*{...addItemLayout}*/}
                  {/*label={formatMessage(messages.items) + `1`}*/}
                  {/*required*/}
                  {/*>*/}
                  {/*{getFieldDecorator(`items[0]`, {*/}
                  {/*validateTrigger: ['onChange', 'onBlur'],*/}
                  {/*rules: [{*/}
                  {/*required: true,*/}
                  {/*whitespace: true,*/}
                  {/*message: formatMessage(messages.items),       //请输入维修内容.*/}
                  {/*}],*/}
                  {/*})(*/}
                  {/*<Input placeholder={formatMessage(messages.items)} style={{marginRight: 8}}/>*/}
                  {/*)}*/}
                  {/*</FormItem>*/}

                  {
                    items && items instanceof Array && items.length
                      ?
                      items.map((value, index) => {
                        return (
                          <div style={{marginTop: '32px'}} key={index}>

                            <FormItem
                              {...addItemLayout}
                              label={formatMessage(messages.items) + `${index + 1}`}
                            >
                              {getFieldDecorator(`items[${index}]`, {
                                // validateTrigger: ['onChange', 'onBlur'],
                                initialValue: value ? value : null,
                                // rules: [{
                                //   required: true,
                                //   whitespace: true,
                                //   message: formatMessage(messages.items),       //请输入维修内容.
                                // }],
                              })(
                                <Input placeholder={formatMessage(messages.items)} style={{marginRight: 8}}/>
                              )}
                              {
                                index > 0 ?
                                  <Icon
                                    style={{
                                      position: 'absolute',
                                      right: '-30px',
                                      top: '4px'
                                    }}
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    disabled={items.length === 1}
                                    onClick={() => this.removex(index)}
                                  />
                                  :
                                  null
                              }

                            </FormItem>
                          </div>
                        )
                      })
                      :
                      null
                  }

                  {formItems}

                  <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{width: '100%'}}>
                      <Icon type="plus"/> <FormattedMessage id="page.maintcard.additem"
                                                            defaultMessage="添加维修内容"/>
                    </Button>
                  </FormItem>
                </div>
                <Row gutter={24}>
                  <Col span={8}>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage id="page.walkthrough.upload" defaultMessage="上传附件"/>}>
                      <div>
                        <Upload
                          {...props2}
                          listType="picture-card"
                          fileList={fileList}
                          beforeUpload={_util.beforeUpload}
                          onPreview={this.handlePreview}
                          onChange={this.handleUploadChange}
                        >
                          {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                        <div style={{
                          color: '#aab2bd',
                          fontSize: '12px',
                          whiteSpace: 'nowrap'
                        }}>
                          <FormattedMessage id="page.walkthrough.uploadtips"
                                            defaultMessage="图片大小限制3M，格式限制jpg jpeg png gif bmp"/>
                        </div>
                        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                          <img alt="example" style={{width: '100%'}} src={previewImage}/>
                        </Modal>
                      </div>
                    </FormItem>
                  </Col>
                </Row>
              </Card>

              {
                is_supplier === 0 ?
                  <Card
                    title={<FormattedMessage id="page.walkthrough.maintcard.supplierInfo" defaultMessage="供应商信息"/>}
                    style={{marginBottom: '15px'}}
                  >
                    <Row gutter={8}>
                      <Col span={8}>
                        <FormItem
                          label={<FormattedMessage id="page.walkthrough.maintcard.supplier" defaultMessage="供应商"/>}
                          hasFeedback
                          {...formItemLayout}
                          required
                        >
                          {getFieldDecorator('supplier', {
                            initialValue: supplier ? supplier : null,
                            rules: [{required: true, message: formatMessage(messages.supplier)}],
                          })(
                            <Select
                              allowClear
                              showSearch
                              onSelect={this.handleSupplierChange}
                              //onChange={value => this.onChange(value)}
                              //placeholder={formatMessage(translation.select)}
                              placeholder={formatMessage(translation.select)}     //输入供应商名称搜索
                              //value={this.state.supplier}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                              {
                                supplierlist instanceof Array && supplierlist.length ? supplierlist.map((d, index) => {
                                  return (<Option key={index} value={d.id}>{d.name}</Option>)
                                }) : null
                              }
                            </Select>
                          )}
                        </FormItem>
                      </Col>

                      <Col span={8}>
                        <FormItem
                          {...formItemLayout}
                          label={<FormattedMessage id="page.walkthrough.maintcard.code" defaultMessage="供应商编号"/>}
                        >
                          {getFieldDecorator('code', {
                            initialValue: code ? code : null,
                            // rules: [{required: true, message: formatMessage(messages.input_area)}],
                          })(<Input placeholder="" disabled/>)}
                        </FormItem>
                      </Col>

                      <Col span={8}>
                        <FormItem
                          {...formItemLayout}
                          label={<FormattedMessage id="page.walkthrough.maintcard.email" defaultMessage="邮箱"/>}
                        >
                          {getFieldDecorator('email', {
                            initialValue: email ? email : null,
                            // rules: [{required: true, message: formatMessage(messages.input_area)}],
                          })(<Input placeholder="" disabled/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={8}>
                        <FormItem
                          {...formItemLayout}
                          label={<FormattedMessage id="page.walkthrough.maintcard.phone" defaultMessage="联系电话"/>}
                        >
                          {getFieldDecorator('phone', {
                            initialValue: phone ? phone : null,
                            // rules: [{required: true, message: formatMessage(messages.input_area)}],
                          })(<Input placeholder="" disabled/>)}
                        </FormItem>
                      </Col>
                    </Row>
                  </Card>
                  :
                  null
              }

              <FormItem {...tailFormItemLayout}>
                <div style={{width: '100%', marginBottom: '20px'}}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                          style={{marginRight: '10px'}}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存"/>
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

export default MaintCardAddForm = Form.create()(MaintCardAddForm)

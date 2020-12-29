import React from 'react'
import {inject, observer} from "mobx-react/index";
import {Form, Button, Modal, Input, Select, Spin, message, Upload, Checkbox, Cascader, Icon, TreeSelect, DatePicker} from 'antd'
import debounce from 'lodash/debounce'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {areaInfo} from "@apis/system/area";
import {Keys, keySearch, relatedSearch} from '@apis/facility/keys'
import {Syseqpt, tradeSearch, randomSearch, SyseqptPost} from '@apis/facility/syseqpt'
import {visitInfo} from '@apis/system/location/'
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
  select_system: {
    id: 'app.message.walkthrough.select_system',
    defaultMessage: '请选择系统',
  },
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
  select_trade_key: {
    id: 'app.message.walkthrough.select_trade_key',
    defaultMessage: '请选择类KEY',
  },
  select_eqpt_key: {
    id: 'app.message.walkthrough.select_eqpt_key',
    defaultMessage: '请选择设备KEY',
  },
  input_eqpt_name: {
    id: 'app.message.walkthrough.input_eqpt_name',
    defaultMessage: '请输入设备名称',
  },
  eqpt_name: {
    id: 'app.placeholder.walkthrough.eqpt_name',
    defaultMessage: '设备名称',
  },
  select_location: {
    id: 'app.message.walkthrough.select_location',
    defaultMessage: '请选择位置',
  },
  need_number: {
    id: 'app.message.walkthrough.need_number',
    defaultMessage: 'No编号必填',
  },
  input_number: {
    id: 'app.message.walkthrough.input_number',
    defaultMessage: '请输入数字',
  },
  number_placeholder: {
    id: 'app.placeholder.walkthrough.number_placeholder',
    defaultMessage: '请输入最多4位数字的No编号',
  },
  defined_code: {
    id: 'app.placeholder.walkthrough.defined_code',
    defaultMessage: '自定义编号',
  },
  asset: {
    id: 'app.placeholder.walkthrough.asset',
    defaultMessage: '固定资产编号',
  },
  select_production: {
    id: 'app.placeholder.walkthrough.select_production',
    defaultMessage: '请选择生产日期',
  },
  select_assurance: {
    id: 'app.placeholder.walkthrough.select_assurance',
    defaultMessage: '请选择质保日期',
  },
  producer: {
    id: 'app.placeholder.walkthrough.producer',
    defaultMessage: '生产产商',
  },
  brand: {
    id: 'app.placeholder.walkthrough.brand',
    defaultMessage: '品牌',
  },
  power: {
    id: 'app.placeholder.walkthrough.power',
    defaultMessage: '额定功率',
  },
  desc: {
    id: 'app.placeholder.walkthrough.desc',
    defaultMessage: '系统/设备的相关描述',
  },
  uploaded: {
    id: 'app.message.walkthrough.uploaded',
    defaultMessage: '上传成功',
  },
});

@inject("menuState") @injectIntl
class EqptAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      data: [],
      search_id: null,
      code: '',
      location: '',
      trade: '',
      system: '',
      system_label: '',
      eqpt: '',
      number: '',
      systems: '',
      eqptkey: '',
      location_label: '',
      type: 1,
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUploadChange = this.handleUploadChange.bind(this)
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  componentDidMount() {

    areaInfo({project_id: _util.getStorage('project_id'), mode: 'tree'}).then((res) => {
      let targetArr = []
      const getValue = (obj) => {
        const tempObj = {};
        tempObj.title = obj.name;
        tempObj.value = obj.id;
        tempObj.key = obj.id;
        if (obj.children) {
          tempObj.children = [];
          obj.children.map(o => {
            tempObj.children.push(getValue(o))
          });
        }
        return tempObj;
      };
      res.data.forEach(a => {
        targetArr.push(getValue(a));
      });
      console.log(targetArr)
      
      this.setState({
        treeData: targetArr
      });
    });

    // visitInfo().then((res) => {
    //   let location_list = res.data.results.factory_and_location;
    //   const getValue = (obj) => {
    //     const tempObj = {}
    //     tempObj.title = obj.number
    //     tempObj.value = obj.id
    //     tempObj.key = obj.number
    //     if (obj.children) {
    //       tempObj.children = []
    //       obj.children.map(o => {
    //         // tempObj.children.push(getValue(o))
    //         tempObj.children.push({
    //           title: o.number,
    //           value: o.id,
    //           key: o.number
    //         })
    //       })
    //     }
    //     return tempObj
    //   }
    //   const targetArr = []
    //   location_list.forEach(a => {
    //     targetArr.push(getValue(a))
    //   })

    //   this.setState({
    //     treeData: targetArr
    //   })
    // })

    // Syseqpt().then(res => {
    //   this.setState({
    //     systems: res.data.results.filter(d => d.type == 0)
    //   })
    // })

    keySearch({type: 0, project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        tradelist: res.data.results
      })
    })

    keySearch({type: 2, project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        eqptkey: res.data.results
      })
    })

    this.setState({
      spinLoading: false
    })
    this.props.menuState.changeMenuCurrentUrl("/eqp/syseqp");
    this.props.menuState.changeMenuOpenKeys("/eqp");
  }

  handleSubmit(e) {
    e.preventDefault()
    const {formatMessage} = this.props.intl
    this.props.form.validateFields((err, values) => {
      let {fileList, location, type} = this.state
      const {location_label, trade, trade_key, system, system_label, eqpt, number, code} = this.state
      console.log(trade_key)
      if (!err) {
        const _this = this
        //let {search_id} = this.state
        _this.setState({
          confirmLoading: true
        })

        let source = []
        if (fileList instanceof Array) {
          fileList.forEach((value) => {
            source.push(value.response.content.results.url)
          })
        }
        //let ident = `${location_label}_${trade}_${system_label}_${eqpt}_${number}`
        let ident = `${code}_${eqpt}_${number}`
        console.log(trade_key)
        const data = {
          type: type,
          related_no: system,
          name: values.name,
          related_key: values.eqpt_key.key,
          location: values.location.value,
          location_name: values.location.label,
          file_path: source.length && source instanceof Array ? source.join(',') : '',
          sys_eqp_no: ident,
          no: number,
          trade_key: trade_key,
          diyinfo: values.diyinfo ? values.diyinfo : '',
          fixed_assets_num: values.asset ? values.asset : '',
          manufacture_date: values.production_date ? values.production_date.format('YYYY-MM-DD') : '',
          valid_date: values.assurance ? values.assurance.format('YYYY-MM-DD') : '',
          manufacture_company: values.producer ? values.producer : '',
          brand: values.brand ? values.brand : '',
          power: values.power ? values.power : '',
          desc: values.desc ? values.desc : ''
        }

        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            SyseqptPost(data).then((res) => {
              message.success(formatMessage(messages.saved))    //保存成功
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

  handleUploadChange(info) {
    let {fileList} = info
    const status = info.file.status
    const { formatMessage } = this.props.intl
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} ${formatMessage(messages.uploaded)}.`)   //上传成功
    } else if (status === 'error') {
      message.error(`${info.file.name} ${info.file.response.msg}.`)
    }
    this.setState({fileList})
  }

  handleChange = (value, obj) => {
    this.setState({
      search_id: obj ? obj.props.title : null,
      data: [],
      fetching: false,
    })
  }

  onSystemChange = (obj) => {
    const {systems} = this.state

    let system = systems.filter(d => d.id == obj.key)
    //console.log(system[0].trade_key_abbr)
    this.setState({
      system: obj.key,
      system_label: obj.label,
      // trade: system[0].trade_key_abbr,
      // trade_key: system[0].trade_key_id,
      location: system[0].location,
      location_label: system[0].location_name,
      code: system[0].sys_eqp_no
    })
  }

  onKeyChange = (obj) => {
    const {formatMessage} = this.props.intl
    const {type, system} = this.state
    if(!system){
      message.error(formatMessage(messages.select_system));   //请选择系统
      return
    }
    let data = {
      type: type,
      related_no: system,
      related_key: obj.key
    }
    randomSearch(data).then(res => {
      this.setState({
        number: res.data.results
      })
    })
    this.setState({
      eqpt: obj.label ? obj.label.split('-')[0] : '',
      eqpt_key: obj.key
    })
  }

  numberChange = (e) => {
      this.setState({
        number: e.target.value
      })
    // const reg = /^[0-9]*$/;
    // if(reg.test(e.target.value)){
    //   this.setState({
    //     number: e.target.value
    //   })
    // }else {
    //   message.warning('请输入数字')
    //   return
    // }
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
      this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
      });
  }

  tradekeyChange = (obj) => {
    // console.log(obj)
    const {setFieldsValue} = this.props.form;
    this.setState({spinLoading: true})
    tradeSearch({trade_key: obj.key}).then(res => {
      this.setState({
        spinLoading: false,
        systems: res.data.results
      })
    })
    setFieldsValue({
      system: {key: '', label: ''},
      // eqpt_key: {key: '', label: ''}
    })

    this.setState({
      trade: obj.label ? obj.label.split('-')[0] : '',
      trade_key: obj.key,
      system: '',
      system_label: '',
      // eqpt: '',
      // eqpt_key: '',
      // number: ''
    })
  }

  // onLocationChange = (obj) => {
  //   console.log(obj);
  //   this.setState({
  //     location: obj.value,
  //     location_label: obj.label
  //   });
  // }

  render() {
    const {getFieldDecorator} = this.props.form
    const {
      confirmLoading, spinLoading, fileList, location, location_label, trade, system, system_label,
      eqpt, number, treeData, systems, eqptkey, code, previewImage, tradelist
    } = this.state
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.trade_key" defaultMessage="类KEY" />} >
                {getFieldDecorator('trade_key', {
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system" defaultMessage="系统" />} >
                {
                  getFieldDecorator('system', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(messages.select_system),   //请选择系统
                      },
                    ],
                  })(
                    <Select
                      //allowClear
                      showSearch
                      labelInValue
                      placeholder={formatMessage(messages.select_system)}   //请选择系统
                      optionFilterProp="children"
                      // notFoundContent={this.state.fetching ?
                      //   <Spin size="small"/> : '暂无数据'}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      // onSearch={this.fetchUser}
                      onChange={this.onSystemChange}
                      style={{width: '100%'}}
                    >
                      {
                        Array.isArray(systems) && systems.map((d, index) =>
                          <Option key={d.id} value={d.id}>{d.name + '-' + d.sys_eqp_no}</Option>)
                      }
                    </Select>
                  )
                }
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.eqpt_key" defaultMessage="设备KEY" />} >
                {getFieldDecorator('eqpt_key', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.select_eqpt_key),   //请选择设备KEY
                    },
                  ],
                })(
                  <Select
                    //allowClear
                    showSearch
                    labelInValue
                    placeholder={formatMessage(messages.select)}
                    // value={value}
                    notFoundContent={this.state.fetching ?
                      <Spin size="small"/> : <FormattedMessage id="global.nodata" defaultMessage="暂无数据"/>}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // onSearch={this.fetchUser}
                    onChange={this.onKeyChange}
                    style={{width: '100%'}}
                  >
                    {
                      Array.isArray(eqptkey) && eqptkey.map((d, index) =>
                        <Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.eqpt_name" defaultMessage="设备名称" />} >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_eqpt_name),    //请输入设备名称
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.eqpt_name)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.location" defaultMessage="位置" />} >
                {getFieldDecorator('location', {
                  initialValue: location && location_label ? {label: location_label, value: location} : {
                    label: null,
                    value: null
                  },
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.select_location),    //请选择位置
                    }
                  ],
                })(
                  <TreeSelect
                    disabled
                    //value={this.state.location}
                    labelInValue
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={treeData}
                    placeholder={formatMessage(messages.select_location)}  //请选择位置
                    treeDefaultExpandAll
                    onChange={this.onLocationChange}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.number" defaultMessage="No编号" />} >
                {getFieldDecorator('number', {
                  initialValue: number ? number : null,
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.need_number),     //No编号必填
                    },{
                      message: formatMessage(messages.input_number),    //请输入数字
                      pattern: /^[0-9]*$/
                    }
                  ],
                })(
                  <Input onChange={this.numberChange} maxLength={4} placeholder={formatMessage(messages.number_placeholder)}/>
                )}
                {/*<Input value={number} onChange={this.numberChange} placeholder="No编号"/>*/}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.walkthrough.ident" defaultMessage="设备标识" />} >
                <Input value={`${code}_${eqpt}_${number}`} disabled/>
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.definedcode" defaultMessage="自定义编号" />}>
                {getFieldDecorator('diyinfo')(
                  <Input placeholder={formatMessage(messages.defined_code)}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.asset" defaultMessage="固定资产编号" />}>
                {getFieldDecorator('asset')(
                  <Input placeholder={formatMessage(messages.asset)}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.production" defaultMessage="生产日期" />}>
                {getFieldDecorator('production_date')(
                  <DatePicker
                    placeholder={formatMessage(messages.select_production)}   //请选择生产日期
                    onChange={this.onStartChange}
                    //disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                    format="YYYY-MM-DD" style={{width: '100%'}}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.assurance" defaultMessage="质保日期" />}>
                {getFieldDecorator('assurance')(
                  <DatePicker
                    placeholder={formatMessage(messages.select_assurance)}    //请选择质保日期
                    onChange={this.onStartChange}
                    //disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                    format="YYYY-MM-DD" style={{width: '100%'}}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.producer" defaultMessage="生产产商" />}>
                {getFieldDecorator('producer')(
                  <Input placeholder={formatMessage(messages.producer)}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.brand" defaultMessage="品牌" />}>
                {getFieldDecorator('brand')(
                  <Input placeholder={formatMessage(messages.brand)}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.power" defaultMessage="额定功率" />}>
                {getFieldDecorator('power')(
                  <Input placeholder={formatMessage(messages.power)}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.desc" defaultMessage="描述" />}>
                {getFieldDecorator('desc')(
                  <TextArea
                    placeholder={formatMessage(messages.desc)}     //系统/设备的相关描述
                    // className="custom"
                    // autosize={{minRows: 2, maxRows: 6}}
                    style={{minHeight: 32}}
                    rows={4}
                    // style={{ height: 50 }}
                    // onKeyPress={this.handleKeyPress}
                  />
                )}
              </FormItem>


              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.upload" defaultMessage="上传附件" />}>
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
                      fontSize: '12px'
                  }}>
                    <FormattedMessage id="page.walkthrough.uploadtips" defaultMessage="图片大小限制3M，格式限制jpg jpeg png gif bmp" />
                  </div>
                  <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{width: '100%'}} src={previewImage}/>
                  </Modal>
                </div>
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

export default EqptAddForm = Form.create()(EqptAddForm)


import React from 'react'
import {inject, observer} from "mobx-react/index";
import {Form, Button, Modal, Input, Select, Spin, message, Upload,
  Checkbox, Cascader, Icon, TreeSelect, DatePicker} from 'antd'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {areaInfo} from "@apis/system/area";
import {Keys, keySearch, relatedSearch} from '@apis/facility/keys'
import {tradeSearch, randomSearch, randomCheck, SyseqptPost} from '@apis/facility/syseqpt'
import {visitInfo} from '@apis/system/location/'
import GoBackButton from '@component/go-back'

const {Option} = Select;
const {TextArea} = Input;
//const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item
const confirm = Modal.confirm

let _util = new CommonUtil()

const messages = defineMessages({
  select_system_key: {
    id: 'app.message.walkthrough.select_system_key',
    defaultMessage: '请选择系统KEY',
  },
  input_code: {
    id: 'app.message.walkthrough.input_code',
    defaultMessage: '请填写编号!',
  },
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
  select_trade_key: {
    id: 'app.message.walkthrough.select_trade_key',
    defaultMessage: '请选择类KEY',
  },
  input_system_name: {
    id: 'app.message.walkthrough.input_system_name',
    defaultMessage: '请输入系统名称',
  },
  system_name: {
    id: 'app.placeholder.walkthrough.system_name',
    defaultMessage: '系统名称',
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
class SystemAddForm extends React.Component {
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
      location_label: '',
      trade: '',
      system: '',
      number: '',
      treeData: [],
      syskey: null,
      type: 0,  //系统
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUploadChange = this.handleUploadChange.bind(this)
    this.lastFetchId = 0
    // this.fetchUser = debounce(this.fetchUser, 800)
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


    keySearch({type: 0, project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        tradelist: res.data
      })
    })

    // Keys().then(res => {
    //   //const { tradekey } = this.state
    //   console.log(res.data.results)
    //
    //   this.setState({
    //     tradekey: res.data.results
    //   })
    //   // const {results} = res.data
    //   // if (Array.isArray(results)) {
    //   //   this.setState({
    //   //     typeOptions: results,
    //   //   })
    //   // }
    // })

    this.setState({
      spinLoading: false
    })
    this.props.menuState.changeMenuCurrentUrl("/eqp/syseqp");
    this.props.menuState.changeMenuOpenKeys("/eqp");
  }

  handleSubmit(e) {
    e.preventDefault()

    // const {type} = this.state
    // let data = {
    //   type: type,
    //   related_no: '',
    //   //related_key: obj.key
    // }
    // randomCheck(data).then(res => {
    //   this.setState({
    //     number: res.data.results
    //   })
    // })
    const {formatMessage} = this.props.intl
    this.props.form.validateFields((err, values) => {
      let {fileList, location, trade_key, system_key, type} = this.state
      const {location_label, trade, system, number} = this.state
      if (!system_key) {
        message.error(formatMessage(messages.select_system_key))   //请选择系统KEY
        return
      }
      if (!number) {
        message.error(formatMessage(messages.input_code))    //请填写编号!
        return
      }
      if (!err) {
        const _this = this
        _this.setState({
          confirmLoading: true
        })

        let source = []
        if (fileList instanceof Array) {
          fileList.forEach((value) => {
            source.push(value.response.content.results.url)
          })
        }
        let ident = `${location_label.toUpperCase()}_${trade}_${system}_${number}`

        const data = {
          type: type,
          trade_key: trade_key,
          name: values.name,
          related_key: system_key,
          location: values.location.value,
          location_name: values.location.label,
          file_path: source.length && source instanceof Array ? source.join(',') : '',
          sys_eqp_no: ident,
          no: number,
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

  handleChange = (value, obj) => {
    this.setState({
      search_id: obj ? obj.props.title : null,
      data: [],
      fetching: false,
    })
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

  tradekeyChange = (obj) => {
    console.log(obj)
    const {setFieldsValue} = this.props.form;
    relatedSearch({related_key: obj.key}).then(res => {
      this.setState({
        syskey: res.data.results
      })
    })
    setFieldsValue({
      trade_key: {key: '', label: ''}
    })
    this.setState({
      trade: obj.label ? obj.label.split('-')[0] : '',
      trade_key: obj.key,
      system_key: '',
      system: '',
      number: ''
    })
  }

  onKeyChange = (obj) => {
    const {type} = this.state
    let data = {
      type: type,
      related_no: '',
      related_key: obj.key
    }
    randomSearch(data).then(res => {
      this.setState({
        number: res.data.results
      })
      const {setFieldsValue} = this.props.form
      setFieldsValue({
        number: res.data.results
      })
    })
    this.setState({
      system: obj.label ? obj.label.split('-')[0] : '',
      system_key: obj.key
    })
  }

  numberChange = (e) => {
      this.setState({
        number: e.target.value
      })
    // const reg = /^[0-9]*$/;
    // if(reg.test(e.target.value)){
    //
    // }else {
    //   this.setState({
    //     number: ''
    //   })
    //   message.warning('请输入数字')
    //   return
    // }
  }

  codeChange = (index, e) => {
    const {location, trade, system} = this.state
    let number = [location, trade, system]

    if (index == 0) {
      this.setState({
        location: e
      })
    }
    if (index == 1) {
      this.setState({
        trade: e
      })
    }
    if (index == 2) {
      this.setState({
        system: e
      })
    }
    this.setState({
      //code: `${number[0]}_${number[1]}_${number[2]}`
    })
  }

  onLocationChange = (obj) => {
    this.setState({
      location: obj.value,
      location_label: obj.label
    });
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
      this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
      });
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {confirmLoading, formData, spinLoading, type, fileList, location_label, trade,
      system, number, tradelist, syskey, treeData, system_key, previewImage} = this.state
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.trade_key" defaultMessage="类KEY" />}>
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system_key" defaultMessage="系统KEY" />}>
                {getFieldDecorator('system_key', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.select_system_key),   //请选择系统KEY
                    }
                  ],
                })(
                  <Select
                    showSearch
                    labelInValue
                    placeholder={formatMessage(messages.select)}
                    optionFilterProp="children"
                    onChange={this.onKeyChange}
                    value={{key: system_key, label: system}}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      Array.isArray(syskey) && syskey.map((d, index) =>
                        <Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system_name" defaultMessage="系统名称" />}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.input_system_name),    //请输入系统名称
                    }
                  ],
                })(<Input placeholder={formatMessage(messages.system_name)}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.location" defaultMessage="位置" />}>
                {getFieldDecorator('location', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.select_location),    //请选择位置
                    }
                  ],
                })(
                  <TreeSelect
                    //style={{ width: 300 }}
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.number" defaultMessage="No编号" />}>
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

              <FormItem {...formItemLayout} label={<FormattedMessage id="page.walkthrough.system.ident" defaultMessage="系统标识" />}>
                <Input value={`${location_label.toUpperCase()}_${trade}_${system}_${number}`} disabled/>
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

export default SystemAddForm = Form.create()(SystemAddForm)

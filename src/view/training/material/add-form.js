import React from 'react'
import {Form, Button, Modal, Spin, message, Upload, Icon, Input, Select} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {materialsPost} from '@apis/training/material'
import GoBackButton from '@component/go-back'
import COS from 'cos-js-sdk-v5'
import {GetTemporaryKey} from "@apis/account/index"

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option

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
  save_success: {
    id: 'app.message.save_success',
    defaultMessage: '保存成功',
  },
  upload_success: {
    id: 'app.message.upload_success',
    defaultMessage: '上传成功',
  },
  format_incorrect: {
    id: 'app.message.material.format_incorrect',
    defaultMessage: '附件格式不正确',
  },
  oversize: {
    id: 'app.message.material.oversize',
    defaultMessage: '附件大小不超过100MB!',
  },
  material_name: {
    id: 'app.placeholder.material.material_name',
    defaultMessage: '资料名称',
  },
  material_name_check: {
    id: 'app.material.check.material_name_check',
    defaultMessage: '请输入资料名称',
  },
  paper_name_check: {
    id: 'app.material.check.paper_name_check',
    defaultMessage: '请输入试卷名称',
  },
  paper_name: {
    id: 'app.material.check.paper_name',
    defaultMessage: '请选择试卷',
  },
  desc: {
    id: 'app.placeholder.material.desc',
    defaultMessage: '描述',
  },
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
  nodata: {
    id: 'app.placeholder.nodata',
    defaultMessage: '暂无数据',
  },
});

@injectIntl
class ContractorAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      fileList: [],
      fetching: false,
      papers:[],
      name: '',
      desc: '',
      resdata: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUploadChange = this.handleUploadChange.bind(this)
  }

  componentDidMount() {
    const project_id = _util.getStorage('project_id');
    this.setState({spinLoading:false})
  }

  handleSubmit(e) {
    e.preventDefault()
    const {formatMessage} = this.props.intl;
    const {fileList} = this.state;
    const project_id = _util.getStorage('project_id');
    //设置附件列表
    let source = _util.setSourceList(fileList)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this
        _this.setState({
          confirmLoading: true
        })
        values.source = source.length && source instanceof Array ? JSON.stringify(source) : '';
        values.status = true;
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            materialsPost(project_id,values).then((res) => {
              message.success(formatMessage(messages.save_success))      //保存成功
              _this.props.history.goBack()
            })
          },
          onCancel() {
          },
        })
        this.setState({
          confirmLoading: false
        })
      }
    })
  }

  handleUploadChange(info) {
    let {fileList} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    this.setState({fileList: fileList})
  }



  beforeUpload(file) {
    let reg = new RegExp(/^video/, 'i');
    const sizeOk = file.size / 1024 / 1024 < 800;
    return new Promise((resolve, reject) => {
      // if (!reg.test(file.type)) {
      //   message.error(<FormattedMessage id="app.message.material.format_incorrect" defaultMessage="附件格式不正确" />);    //附件格式不正确
      // }
      if (!sizeOk) {
        message.error(<FormattedMessage id="app.message.material.oversize" defaultMessage="附件大小不超过800MB!" />);     //附件大小不超过100MB!
      }
      if (sizeOk) {
        resolve(file);
      } else {
        reject(file);
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const { formatMessage } = this.props.intl
    const {
      confirmLoading,
      spinLoading,
      papers,
      fileList
    } = this.state

    const props2 = {
      multiple: false,
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    }

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
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10},
      },
    };

    const paperList = papers instanceof Array && papers.length ? papers.map(d =>
      <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                label={<FormattedMessage id="page.training.material.material_name" defaultMessage="资料名称" />}
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: formatMessage(messages.material_name_check),         //请输入资料名称
                  }],
                })(<Input placeholder={formatMessage(messages.material_name)} />)}
              </FormItem>
              <FormItem
                label={<FormattedMessage id="page.training.material.desc" defaultMessage="描述" />}
                {...formItemLayout}
              >
                {getFieldDecorator('desc')(
                  <Input placeholder={formatMessage(messages.desc)}/>
                )}
              </FormItem>
             
              

              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="page.training.material.upload" defaultMessage="上传附件" />}
                extra={'请上传视频、图片或PDF格式'}
                required={true}
              >
                <div>
                  <Upload 
                   {...props2}
                    fileList={fileList}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleUploadChange}
                    //customRequest={this.handleUploadChange}
                  >
                    <Button>
                      <Icon type="upload"/> 上传
                    </Button>
                  </Upload>
                </div>
              </FormItem>

              <FormItem {...submitFormLayout}>
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

const ContractorAdd = Form.create()(ContractorAddForm)

export default ContractorAdd

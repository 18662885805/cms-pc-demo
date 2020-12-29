import React from "react";
import CommonUtil from "@utils/common";
import { Form, Button, Modal, Spin, message,  Input,Select,Upload,Icon,} from "antd";
import MyBreadcrumb from "@component/bread-crumb";
import{messageDetail,messagePut} from "@apis/today/message";
import GoBackButton from "@component/go-back";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import {GetTemporaryKey} from "@apis/account/index"

const _util = new CommonUtil();
const { TextArea } = Input;
const Option = Select.Option
const FormItem = Form.Item;
const confirm = Modal.confirm;

@injectIntl
class PushMessageAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      m_type: 1,
      fileList: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const project_id = _util.getStorage('project_id');
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      messageDetail(project_id, {id:this.props.location.state.id}).then((res) => {
        let data = res.data;
        if (data.content && data.m_type ===  2) {
          //转换前端格式
          var that = this;
          var cos = _util.getCos(null,GetTemporaryKey);
          const source_list = JSON.parse(data.content);
          if(source_list&&source_list.length){
              this.setState({file_loading:true})
              source_list.map((obj, index) => {
                  const key = obj.url;
                  var url = cos.getObjectUrl({
                      Bucket: 'ecms-1256637595',
                      Region: 'ap-shanghai',
                      Key:key,
                      Sign: true,
                  }, function (err, data) {
                      if(data && data.Url){    
                          const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};             
                          const new_list = [...that.state.fileList,file_obj];
                          that.setState({fileList:new_list});
                          if(index == source_list.length - 1){
                              that.setState({file_loading:false});
                          }
                      }
                  });
              });
          }            
        }
        this.setState({
          ...data,
          spinLoading: false
        });
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    const { formatMessage } = this.props.intl;
    const project_id = _util.getStorage('project_id')
    this.props.form.validateFields((err, values) => {
      const { fileList } = this.state;
      if (!err) {
        let _this = this;
        let source = _util.setSourceList(fileList)
        let data = {
          id:this.props.location.state.id,
          m_type: values.m_type,
          title: values.title,
          content: values.m_type === 1 ? values.content : JSON.stringify(source),
          file:''
        }
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            messagePut(project_id,data).then((res) => {
              message.success('保存成功');
              _this.props.history.goBack();
            });
          },
          onCancel() {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  }

  handleUploadChange = (info) => {
    const { formatMessage } = this.props.intl
    let {fileList} = info
    const status = info.file.status
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      message.success('上传成功')    //上传成功.
    } else if (status === 'error') {
      message.error('上传失败')
    }
    this.setState({fileList})
  }

  handleChange = (value) => {
    console.log(value)
    this.setState({
      m_type: value
    })
  }

  beforeUpload(file) {
    console.log('0308',file)
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


  fileUpload  = (info) => {
    const that = this;
    var cos = _util.getCos(null,GetTemporaryKey);
    cos.putObject({
      Bucket: 'ecms-1256637595',
      Region: 'ap-shanghai',
      Key:`source/${info.file.uid}`,
      Body: info.file,
      onProgress: function (progressData) {
          console.log('上传中', JSON.stringify(progressData));
      },
    }, function (err, data) {
        if(data&&data.Location){
          //上传成功
          var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:`source/${info.file.uid}`,
            Sign: true,
          }, function (err, data) {
              if(data && data.Url){
                const {fileList} = that.state;
                const newFile  = {
                  uid: -(fileList&&fileList.length ? fileList.length + 1 :1),
                  name: info.file.name,
                  status: 'done',
                  url:data.Url,
                  cosKey: `source/${info.file.uid}`,
                };
                const new_fileList = [newFile]
                that.setState({fileList:new_fileList});
              }
          });
        }
    });
  }

  handleRemove = (info) => {
    const {fileList} = this.state;
    const new_fileList = fileList.filter(file => {
      return file.uid != info.uid
    })
    this.setState({fileList:new_fileList})
  }

  //普通上传
  messageUpload = (info) => {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, title, m_type ,content,fileList} = this.state;
    const { formatMessage } = this.props.intl;

    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
        xs: { span: 24 }
      },
      wrapperCol: {
        sm: { span: 16 },
        xs: { span: 24 }
      }
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    const props2 = {
      //accept: ".mp3,.mp4",
      multiple: false,
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    };

    return (
      <div>
        <MyBreadcrumb/>
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                label={'标题'}
                {...formItemLayout}
              >
                {getFieldDecorator('title', {
                  initialValue: title ? title : null,
                  rules: [{
                    required: true,
                    message: '请输入标题',        
                  }],
                })(<Input maxLength={20} placeholder={'请输入标题(20字符以内)'}/>)}
              </FormItem>
              <FormItem
                label={'类型'}
                {...formItemLayout}
              >
                {getFieldDecorator('m_type', {
                  initialValue: m_type,
                  rules: [{
                    required: true,
                    message: '请输入',        
                  }],
                })(
                  <Select onChange={this.handleChange}>
                    <Option value={1} key={1}>文字</Option>
                    {/* <Option value={2} key={2}>音频</Option> */}
                  </Select>
                )}
              </FormItem>
              {
                m_type == 1 ?
                <FormItem
                  label={'内容'}
                  {...formItemLayout}
                >
                  {getFieldDecorator('content', {
                    initialValue: content,
                    rules: [{
                      required: true,
                      message: '请输入内容',        
                    }],
                  })(
                    <TextArea placeholder={'请输入内容'}/>
                  )}
                </FormItem>
                :
                <FormItem
                  label={'上传附件'}
                  extra={'请上传音频文件'}
                  {...formItemLayout}
                >
                  {getFieldDecorator('file', {
                    rules: [{
                      required: true,
                      message: '',        
                    }],
                  })(
                    <Upload
                      {...props2}
                      fileList={fileList}
                      onChange={this.messageUpload}
                      // customRequest={this.fileUpload}
                      // onRemove={this.handleRemove}
                    >
                    <Button>
                        <Icon type="upload" />上传
                    </Button>
                    </Upload>
                  )}
                </FormItem>
              }        
              <FormItem {...submitFormLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                    style={{ marginRight: "10px" }}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  <GoBackButton props={this.props} />
                </div>
              </FormItem>

            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const PushMessageAdd = Form.create()(PushMessageAddForm);

export default PushMessageAdd;

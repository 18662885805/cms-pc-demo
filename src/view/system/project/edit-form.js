import React from "react";
import {
  Form, Button, Modal, Input, Select, Spin, Icon, message, Row, Col, Upload
} from "antd";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import debounce from "lodash/debounce";
import moment from "moment";
import { cloneDeep } from "lodash";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import { SearchProjectUser } from "@apis/system/user";
import { projectInfoList, projectInfo, projectConfig, projectPut } from "@apis/system/project";
import address from '@utils/address.json'
import GoBackButton from "@component/go-back";
import translation from "../translation.js";
import {GetTemporaryKey} from "@apis/account/index"

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const confirm = Modal.confirm;
let _util = new CommonUtil();

const messages = defineMessages({
  name: {
    id: "app.placeholder.system.projectname",
    defaultMessage: "请输入项目名称"
  },
  desc: {
    id: "app.placeholder.system.desc",
    defaultMessage: "描述"
  },
  location: {
    id: "app.placeholder.system.location",
    defaultMessage: "省市区"
  },
  address: {
    id: "app.placeholder.system.address",
    defaultMessage: "详细地址"
  },
  admin: {
    id: "app.placeholder.system.admin",
    defaultMessage: "请选择项目管理员"
  },
  groupapply: {
    id: "app.placeholder.system.groupapply",
    defaultMessage: "组织注册审批人"
  },
  personapply: {
    id: "app.placeholder.system.personapply",
    defaultMessage: "个人注册审批人 "
  },
  joinapply: {
    id: "app.placeholder.system.joinapply",
    defaultMessage: "组织加入审批人"
  },
  personjoinapply: {
    id: "app.placeholder.system.personjoinapply",
    defaultMessage: "个人加入审批人"
  },
});

@injectIntl
class SettingProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      phone: null,
      fetching: false,
      visible: false,
      treeData: [],
      location_list: [],
      previewVisible: false,
      previewImage: "",
      fileList: [],
      previewWxVisible: false,
      previewWxImage: "",
      search_id: _util.getStorage("userInfo").id || null,
      searchOptions: [{
        id: _util.getStorage("userInfo").id,
        name: _util.getStorage("userInfo").real_name,
        tel: _util.getStorage("userInfo").tel,
        department: _util.getStorage("userInfo").department
      }],
      project_obj: _util.getStorage('project'),
      search_data: [],
      search_data1:[],
      fileList: []
    };

    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }


  componentDidMount() {
    projectInfoList({project_id: _util.getStorage('project_id')}).then((res) => {
      if(res.data.results.length > 0) {
        let data = res.data.results[0]
        const { org_approve,application_approve,logo } = data
        if(logo){
          var that = this;
          var cos = _util.getCos(null,GetTemporaryKey);
          _util.switchToJson(logo).map((obj, index) => {
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
                }
            });
          });
        }
        
  
        this.setState({
          data,
          id: data.id,
          search_data: org_approve,
          search_data1:application_approve,
        })
      }
    })

    const getValue = (obj) => {
      const tempObj = {};
      tempObj.label = obj.label;
      tempObj.value = obj.code;
      tempObj.key = obj.code;
      if (obj.children) {
        tempObj.children = [];
        obj.children.map(o => {
          tempObj.children.push(getValue(o))
        });
      }
      return tempObj;
    };
    const targetArr = [];
    address.forEach(a => {
      targetArr.push(getValue(a));
    });

    this.setState({
      treeData: targetArr,
      spinLoading: false
    });
  }


  setSourceList = (fileList) => {
    let source = []
    if (fileList instanceof Array) {
      fileList.forEach((value) => {
        source.push({name:value.name,url:value.cosKey})
      })
    }
    return source
  }

  handleSubmit(e) {
    e.preventDefault();
    const { formatMessage } = this.props.intl;
    const { fileList } = this.state;  
    let file = _util.setSourceList(fileList);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this;
        const data = {
          project_id: _util.getStorage('project_id'),
          org_approve: values.org_approve ? values.org_approve.join(',') : null,
          name:values.name,
          logo:JSON.stringify(file),
          application_approve: values.org_approve ? values.org_approve.join(',') : null,
          // application_approve: values.application_approve ? values.application_approve.join(',') : null,
        };
        confirm({
          title: formatMessage(translation.confirm_title),
          content: formatMessage(translation.confirm_content),
          okText: formatMessage(translation.okText),
          cancelText: formatMessage(translation.cancelText),
          onOk() {
            const { id } = _this.state;
            if (id) {
              projectPut(id, data).then(res => {
                message.success(formatMessage(translation.saved)); //保存成功
                // _this.props.history.goBack();
              });
              return;
            }
            projectConfig(data).then((res) => {
              message.success(formatMessage(translation.saved)); //保存成功
              // _this.props.history.goBack();
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

  handleCancel = () => {
    this.setState({
      visible: false,
      ques: {
        name: "",
        content: []
      }
    });
  }

  handleNumChange = (field, e) => {
    const { value } = e.target;
    this.setState({
      [field]: value
    });
  };


  changeNumberForm = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  InputForm = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  imageUpload = (info) => {
    let {fileList,file} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    if(fileList&&fileList.length){
      this.setState({fileList:[fileList[0]]})
    }else{
      this.setState({fileList:fileList})
    }
  }

  fetchUser = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ search_data: [], fetching: true, search_info: "", search_id: null });
    SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const search_data = res.data.map(user => ({
        name: user.name,
        org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id
      }));
      this.setState({ search_data, fetching: false });
    });
  }

  fetchUser1 = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ search_data1: [], fetching: true, search_info: "", search_id: null });
    SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const search_data1 = res.data.map(user => ({
        name: user.name,
        org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id
      }));
      this.setState({ search_data1, fetching: false });
    });
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  handleWxCancel = () => {
    this.setState({ previewWxVisible: false });
  }

  handlePreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }

  handleWxPreview = file => {
    this.setState({
      previewWxImage: file.url || file.thumbUrl,
      previewWxVisible: true
    });
  }

  handleFormChange = (value, field) => {
    console.log(value, field);
    if (field === "person_no") {
      const { search_data } = this.state;
      const { name, pers_no, cost_center, department } = search_data.filter(o => o.id === value)[0];
      this.setState({
        name,
        pers_no,
        cost_center,
        department
      });
    }
    this.setState({
      [field]: value
    });
  }


  fileUpload  = (info) => {
    let {fileList} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;
    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`);
    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    this.setState({fileList: fileList})
  
  }

  handleRemove = (info) => {
    const {fileList} = this.state;
    const new_fileList = fileList.filter(file => {
      return file.uid != info.uid
    })
    this.setState({fileList:new_fileList})
  }

  beforeUpload = (file) => {
    return new Promise(resolve => {
      // 图片压缩
      let reader = new FileReader(), img = new Image();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        img.src = e.target.result;
      }
      img.onload = function () {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
 
        let originWidth = this.width;
        let originHeight = this.height;
 
        canvas.width = originWidth;
        canvas.height = originHeight;
 
        context.clearRect(0, 0, originWidth, originHeight);
        context.drawImage(img, 0, 0, originWidth, originHeight);
        canvas.toBlob((blob) => {
          let imgFile = new File([blob], file.name, {type: file.type}); // 将blob对象转化为图片文件
          resolve(imgFile);
        }, file.type, 0.2); // file压缩的图片类型
      }
    })
  }

 


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      confirmLoading, spinLoading,  fileList, search_data, data,search_data1
    } = this.state;
    const { formatMessage } = this.props.intl;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    const props2 = {
      multiple: true,
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    }

    const formData = [
      {
        field: "org_approve",
        type: "search",
        mode: "multiple",
        icon: "",
        value: data && data.org_approve ? data.org_approve.map(d => {return d.id+''}) : null,
        text: <FormattedMessage id="system.setting.org.approver" defaultMessage="组织注册审批人" />,
        placeholder: <FormattedMessage id="search-user" defaultMessage="根据姓名、手机搜索项目用户" />,
        options: search_data,
        rules: [{ required: true, message: formatMessage(messages.groupapply) }]
      },
      // {
      //   field: "application_approve",
      //   type: "search",
      //   mode: "multiple",
      //   icon: "",
      //   value: data && data.application_approve ? data.application_approve.map(d => {return d.id+''}) : null,
      //   text: <FormattedMessage id="system.setting.entry.approver" defaultMessage="绿码申请审批人" />,
      //   placeholder: <FormattedMessage id="search-user" defaultMessage="根据姓名、手机搜索项目用户" />,
      //   options: search_data1,
      //   fetchUser:  (value) => this.fetchUser1(value),
      //   rules: [{ required: true, message: '请选择绿码申请审批人' }]
      // },
    ];
    const _this = this;

    var canEditLogo = _util.getStorage('myadmin') ? true : false;

    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              {
                formData ? formData.map((item, index) => {
                  return (
                        <FormItem
                          key={index}
                          label={item.text}
                          extra={item.extra}
                          hasFeedback
                          {...formItemLayout}
                        >
                          {
                            item.value
                              ?
                              getFieldDecorator(item.field, {
                                initialValue: item.value,
                                rules: item.rules
                              })(
                                _util.switchItem(item, _this)
                              )
                              :
                              getFieldDecorator(item.field, {
                                rules: item.rules
                              })(
                                _util.switchItem(item, _this)
                              )
                          }
                        </FormItem>
                  );
                }) : null
              }

              {/* <FormItem
                label={'公司名称'}
                {...formItemLayout}
              >   
                {
                  getFieldDecorator('name', {
                    initialValue: data&&data.name ? data.name :'',
                  })(<Input maxLength={4} placeholder={'请输入公司名称(不超过4字节)'}/>)
                }                
              </FormItem> */}

              {
                canEditLogo ?
                <FormItem
                  label={'Logo'}
                  {...formItemLayout}
                  extra={'提示:请上传正方形logo图片文件'}
                >   
                  <Upload
                    {...props2}
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={_util.beforeUpload}
                    onChange={this.imageUpload}
                    accept='image/*'
                    className='avatar-uploader'
                  >
                    {
                      fileList&&fileList.length == 0 ?
                      <Button>
                          <Icon type="upload" />上传
                      </Button>:''
                    }   
                  </Upload>             
                </FormItem> :''
              }

              

              <FormItem {...tailFormItemLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                    style={{ marginRight: "10px" }}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                </div>
              </FormItem>
            </Form>

          </Spin>
        </div>
      </div>
    );
  }
}

export default SettingProject = Form.create()(SettingProject);

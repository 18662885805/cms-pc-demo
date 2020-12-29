import React from "react";
import { Form, Button, Modal, Spin, message, Select, Upload, Icon } from "antd";
import { inject, observer } from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import { TemplateDetail, Template } from "@apis/workflow/template";
import GoBackButton from "@component/go-back";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import translation from "../translation";
import { getCosSourse } from "@apis/system/cos";
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
let _util = new CommonUtil();

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("只能上传JPG/PNG图片文件！");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片文件不能大于2MB!");
  }
  return isJpgOrPng && isLt2M;
}

@inject("menuState")
@injectIntl
class WorkTypeAddForm extends React.Component {
  state = {
    confirmLoading: false,
    formData: {},
    spinLoading: true,
    factoryList: [],
    is_parent: false,
    location_list: [],
    typeoption: [],
    data: { content: "", name: "", desc: "" },
    fileList2: [],
    total_name: [],
    id: "",
    logoUploading: false,
    logoUrl: null,
    logoBase64: null
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // Template({page:1,page_size:10000,project_id: _util.getStorage('project_id')}).then((res)=>{
    //   if(res&&res.data){
    //     const{results}=res.data;
    //     let total_name=results.map(a=>a.name);
    //     this.setState({total_name:total_name});
    //   }
    // });
    const { id } = this.props.match.params;
    if (id) {
      TemplateDetail(id, { project_id: _util.getStorage("project_id") }).then(
        (res) => {
          console.log(res);
          this.setState({
            data: res.data,
            id,
          });
          if (res.data.logo && res.data.logo !== '') {
            const logoObj = JSON.parse(res.data.logo)
            if (logoObj && logoObj.length > 0) {
              const logoUrl = logoObj[0].url
              this.setState({
                logoUrl
              })
              getCosSourse({ file_name: logoUrl }).then((res) => {
                if (res && res.data && res.data.data) {
                  const logoBase64 = `data:image/png;base64,${res.data.data}`;
                  this.setState({
                    logoBase64,
                  });
                }
              });
            }
          }
        }
      );
    }
    this.setState({
      spinLoading: false,
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/template");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  isNull = (str) => {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  };

  handleUpload = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ logoUploading: true });
      return;
    }

    if (info.file.status === "done") {
      message.success(`${info.file.name} 上传成功`);
      if (info.file.response && info.file.response.file_name) {
        this.setState({
          logoUrl: info.file.response.file_name
        });
        getCosSourse({ file_name: info.file.response.file_name }).then((res) => {
          if (res && res.data && res.data.data) {
            const logoBase64 = `data:image/png;base64,${res.data.data}`;
            this.setState({
              logoUploading: false,
              logoBase64,
            });
          }
        });
        return;
      }
    }
    if (status === "error") {
      this.setState({ logoUploading: false });
      message.error(`${info.file.name} ${info.file.response}.`);
    }
  };

  handleStepTwo = (e) => {
    const { data, fileList2, total_name, id, logoUrl } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.isNull(values.name)) {
          // if(!id&&total_name.indexOf(values.name)>-1){
          //   message.error(`此标题已经被使用，请重新填写`)
          // }else{ 
          let data_param = {
            created_time: data.created_time,
            name: values.name,
            desc: values.desc,
            content: data.content,
            id: data.id,
            fileList: fileList2,
            project_id: _util.getStorage("project_id"),
            logo: logoUrl || ''
          };
          this.props.history.push({
            pathname: "/workflow/template/drag",
            state: data_param,
          });
          localStorage.setItem("drag-form-params", data_param);
          // }
        } else {
          message.error(`表单标题不能为空`);
        }
      }
    });
  };

  render() {
    const { confirmLoading, spinLoading, location_list, data, id, logoUrl, logoBase64 } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 },
      },
    };

    const formData = [
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "标题",
        placeholder: "请输入表单标题",
        rules: [{ required: true, message: "请输入表单标题" }],
      },
      {
        field: "desc",
        type: "textarea",
        icon: "",
        value: data ? data.desc : null,
        text: "描述",
        placeholder: "请输入表单描述",
        rules: [],
      },
    ];

    const bread = [
      {
        name: (
          <FormattedMessage id="app.page.bread.home" defaultMessage="首页" />
        ),
        url: "/",
      },
      {
        name: (
          <FormattedMessage
            id="page.system.workFlow.systemManage"
            defaultMessage="工作流管理"
          />
        ),
      },
      {
        name: (
          <FormattedMessage
            id="page.component.workFlow.template"
            defaultMessage="表单配置"
          />
        ),
        url: "/workflow/template",
      },
      {
        name: id ? (
          <FormattedMessage id="app.page.bread.edit" defaultMessage="修改" />
        ) : (
          <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
        ),
      },
    ];

    const uploadButton = (
      <div>
        {this.state.loading ? <Icon type="loading" /> : <Icon type="plus" />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form>
              <FormData
                data={formData}
                form={this.props.form}
                layout={formItemLayout}
              />
              <FormItem {...formItemLayout} label="Logo">
                <Upload
                  showUploadList={false}
                  accept="image/*"
                  action={_util.getServerUrl(`/upload/auth/`)}
                  headers={{
                    Authorization: "JWT " + _util.getStorage("token"),
                  }}
                  listType="picture-card"
                  beforeUpload={beforeUpload}
                  onChange={this.handleUpload}
                >
                  {logoUrl ? (
                    <img src={logoBase64} alt="logo" style={{ width: "100%" }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </FormItem>
              <FormItem {...submitFormLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button
                    type="primary"
                    loading={confirmLoading}
                    onClick={this.handleStepTwo}
                    style={{ marginRight: "10px" }}
                  >
                    下一步
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

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;

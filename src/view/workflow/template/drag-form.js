import React, { createRef } from "react";
import { inject, observer } from "mobx-react/index";
import FormCreator from "@component/FormCreator";
import MyBreadcrumb from "@component/bread-crumb";
import { FormattedMessage, injectIntl } from "react-intl";
import { Spin, Layout, Button, Modal, message, Icon } from "antd";
import translation from "../translation";
import { getCosSourse } from "@apis/system/cos";

import {
  TemplatePost,
  TemplatePut,
  TemplateDetail,
} from "@apis/workflow/template";

const { confirm } = Modal;
const { Header, Sider, Content } = Layout;

@inject("menuState")
@injectIntl
class FormCreatorPage extends React.Component {
  state = {
    info: {},
    spinLoading: true,
    preview: false,
    jsonModalVisible: false,
    schema: {},
    initialSchema: {},
    logoUrl: null,
    logoBase64: null
  };

  constructor(props) {
    super(props);
    let {
      location: { state: info },
    } = this.props;
    if (!info) {
      const infoInStorage = localStorage.getItem("drag-form-params");
      if (infoInStorage) {
        info = JSON.parse(infoInStorage);
      }
    }

    this.state.info = info;

    if (info.content) {
      const initialSchema = JSON.parse(info.content);
      if (!initialSchema.props || !initialSchema.properties) {
        message.error("旧表单已不受支持，请重新创建表单！");
      } else {
        this.state.initialSchema = initialSchema;
      }
    } 
    if (info.logo && info.logo !== "") {
      this.state.logoUrl = info.logo;
      this.state.initialSchema = {
        ...this.state.initialSchema,
        logo: {
          alt: 'logo',
          url: info.logo
        }
      }
    }
    this.formRef = createRef();
  }

  componentDidMount() {
    this.setState({
      spinLoading: false,
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/template");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  handleChange = (schema) => {
    this.setState({
      schema,
    });
  };

  handlePreview = () => {
    this.setState({
      preview: !this.state.preview,
    });
  };

  handleShowJsonModal = () => {
    this.setState({
      jsonModalVisible: true,
    });
  };

  handleCloseJsonModal = () => {
    this.setState({
      jsonModalVisible: false,
    });
  };

  handleSave = () => {
    let { schema } = this.state;

    if (!schema.properties || schema.properties.length === 0) {
      return message.error("请先添加一些组件！");
    }

    let { info } = this.state;
    const { formatMessage } = this.props.intl;
    if (info.logo && info.logo !== "") {
      info.logo = JSON.stringify([
        {
          name: "logo.png",
          url: info.logo,
        },
      ]);
    }
    info.content = JSON.stringify(schema);

    confirm({
      title: "确定要提交吗？",
      onOk: () => {
        if (info.id) {
          TemplatePut(info.id, info).then((res) => {
            message.success(formatMessage(translation.saved));
            this.props.history.push("/workflow/template");
          });
        } else {
          TemplatePost(info).then((res) => {
            message.success(formatMessage(translation.saved));
            this.props.history.push("/workflow/template");
          });
        }
      },
    });
  };

  setLogoBase64 = (url) => {
    if (!url) {
      return;
    }
    getCosSourse({ file_name: url }).then((res) => {
      if (res && res.data && res.data.data) {
        const logoBase64 = `data:image/png;base64,${res.data.data}`;
        this.setState({
          logoBase64,
        });
      }
    });
  }

  render() {
    const { info, spinLoading, initialSchema, schema, logoBase64 } = this.state;

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
        name: info.id ? (
          <FormattedMessage id="app.page.bread.edit" defaultMessage="修改" />
        ) : (
          <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
        ),
      },
    ];

    if (!logoBase64 && schema && Object.keys(schema).length > 0) {
      if (schema.logo && schema.logo.url) {
        this.setLogoBase64(schema.logo.url)
      }
    }
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}></Spin>
          <FormCreator
            renderEditor={!this.state.preview}
            onChange={this.handleChange}
            initialSchema={initialSchema}
          >
            <Layout
              style={{ height: "calc(100vh - 200px)", position: "relative" }}
            >
              <Sider
                style={{
                  overflow: "auto",
                  position: "absolute",
                  height: "100%",
                  left: 0,
                  borderRight: "1px solid #e8e8e8",
                  zIndex: 1000,
                }}
              >
                <FormCreator.Picker />
              </Sider>
              <Layout
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  background: "#fff",
                  paddingLeft: 200,
                }}
              >
                <Header
                  style={{
                    background: "#fff",
                    padding: 0,
                    borderBottom: "1px solid #e8e8e8",
                    height: "44px",
                    lineHeight: "44px"
                  }}
                >
                  <div style={{ float: "right" }}>
                    <Button
                      type="link"
                      onClick={this.handleSave}
                      style={{ padding: "0 5px" }}
                      disabled={
                        !schema.properties || schema.properties.length === 0
                      }
                    >
                      <Icon type="save" />
                      {info.id ? "修改" : "保存"}
                    </Button>
                    <Button
                      type="link"
                      onClick={this.handlePreview}
                      style={{ padding: "0 5px" }}
                      disabled={
                        !schema.properties || schema.properties.length === 0
                      }
                    >
                      {this.state.preview ? (
                        <Icon type="eye-invisible" />
                      ) : (
                        <Icon type="eye" />
                      )}
                      {this.state.preview ? "关闭预览" : "开启预览"}
                    </Button>
                    <Button
                      type="link"
                      onClick={this.handleShowJsonModal}
                      style={{ padding: "0 5px" }}
                      disabled={
                        !schema.properties || schema.properties.length === 0
                      }
                    >
                      <Icon type="profile" />
                      JSON
                    </Button>
                  </div>
                </Header>
                <Content
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#fff",
                  }}
                >
                  <FormCreator.Render
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                    wrappedComponentRef={(form) => {
                      this.formRef = form;
                    }}
                    onSubmit={this.handleSubmit}
                  >
                    {
                      logoBase64 ? (
                        <img src={logoBase64} alt={schema.logo.alt || 'logo'} {...schema.logo.props}/>
                      ): null
                    }
                  </FormCreator.Render>
                </Content>
              </Layout>
              <Sider
                theme="light"
                style={{
                  overflow: "auto",
                  borderLeft: "1px solid #e8e8e8",
                }}
                width={300}
              >
                <FormCreator.Configurator />
              </Sider>
            </Layout>
            <Modal
              title="JSON"
              visible={this.state.jsonModalVisible}
              onOk={this.handleCloseJsonModal}
              onCancel={this.handleCloseJsonModal}
              width={640}
            >
              <FormCreator.Debugger
                style={{
                  maxHeight: 560,
                  overflow: "auto",
                }}
              />
            </Modal>
          </FormCreator>
        </div>
      </div>
    );
  }
}

export default FormCreatorPage;

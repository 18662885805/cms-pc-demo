import React from "react";
import MyBreadcrumb from "@component/bread-crumb";
import { Input, Form, Button, message, Select, Icon, Row, Col, Menu, Dropdown } from "antd";
import GoBackButton from "@component/go-back";
import {
  observer,
  inject
} from "mobx-react";
import CommonUtil from "@utils/common";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { privacyDetail, privacyPut } from "@apis/myadmin/privacy";
import privacyTypes from "./privacyTypes";
import {FormattedMessage,injectIntl, defineMessages} from "react-intl";
import messages from "@utils/formatMsg";
const FormItem = Form.Item;
const { Option } = Select;
let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class PrivacyAdd extends React.Component {
  state = {
    privacy_langs: _util.getStorage("langs") || (this.props.menuState?this.props.menuState.language:false) || "zh-Hans"
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
        this.props.history.replace('/404')
      } else{
        privacyDetail(this.props.location.state.id).then(res => {
            const { p_type, title, content, content_en } = res.data;
            if (p_type && content && title) {
                this.setState({
                  type: "" + p_type,
                  title,
                  content: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(content).contentBlocks)),
                  content_en: content_en ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(content_en).contentBlocks)) : null
                });
              }
        });
      }
  }
  handleTitle = e => this.setState({ title: e.target.value })
  handleContent = editorState => this.setState({ content: editorState })
  handleContentEN = editorState => this.setState({content_en: editorState})

  handleType = id => this.setState({ type: id })
  handleSubmit = () => {
    const { title, type, content, content_en } = this.state;
    const { formatMessage } = this.props.intl;

    if (!type) {
      message.error(formatMessage(messages.alarm21));
      return;
    }
    if (!title) {
      message.error(formatMessage(messages.alarm22));
      return;
    }
    if (!content) {
      message.error(formatMessage(messages.alarm23));
      return;
    }

    const params = {
      p_type: type,
      title,
      content: draftToHtml(convertToRaw(content.getCurrentContent())),
      content_en: content_en ? draftToHtml(convertToRaw(content_en.getCurrentContent())) : null
    };
    const { id } = this.props.location.state;
    if (id) {
      privacyPut(id, params).then(res => {
        message.success(formatMessage(messages.alarm5));
        this.props.history.goBack();
      });
      return;
    }
  }

  changeEditorLang = ({ key }) => {
    this.setState({privacy_langs: key});
  }

  render() {
    const toolbar = {
      options: [
        "inline",
        "blockType",
        "fontSize",
        "fontFamily",
        "list",
        "textAlign",
        "colorPicker",
        "remove",
        "history"
      ]
    };
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 }
      },
      wrapperCol: {
        sm: { span: 16 }
      }
    };
    const { id } = this.props.match.params;
    const {formatMessage} = this.props.intl;
    const bread = [
      {
        name: <FormattedMessage id="menu.homepage" defaultMessage="首页"/>,
        url: "/"
      },
      {
        name: <FormattedMessage id="page.system.accessType.systemManage" defaultMessage="系统管理"/>
      },
      {
        name: <FormattedMessage id="page.system.accessType.privacy" defaultMessage="隐私条款"/>,
        url: "/system/privacy"
      },
      {
        name: id ? <FormattedMessage id="global.revise" defaultMessage="修改"/> : <FormattedMessage id="component.tablepage.add" defaultMessage="新增" />
      }
    ];

    return (
      <div>
        <div className="content-wrapper content-no-table-wrapper">
          <Form style={{
            maxWidth: 1000,
            margin: "0 auto"
          }}>
            <FormItem label={<FormattedMessage id="page.system.accessType.type" defaultMessage="种类"/>} required {...formItemLayout} >
              <Select
                allowClear
                showArrow
                value={this.state.type}
                onChange={this.handleType}
                placeholder={<FormattedMessage id="page.system.accessType.selectPlz" defaultMessage="请选择"/>} >
                {
                  privacyTypes.map(privacy => {
                    return <Option key={privacy.id}>{privacy.name}</Option>;
                  })
                }
              </Select>
            </FormItem>
            <FormItem label={<FormattedMessage id="page.system.accessType.title" defaultMessage="标题"/>} required {...formItemLayout} >
              <Input
                value={this.state.title}
                onChange={this.handleTitle}
                placeholder={formatMessage(messages.filePlz)} />
            </FormItem>
            <FormItem label={<FormattedMessage id="page.system.accessType.content" defaultMessage="内容"/>} required {...formItemLayout} >
              <Row gutter={8}>
                <Col span={20}>
                  {
                    this.state.privacy_langs == "zh-Hans" ?
                      <Editor
                        editorState={this.state.content}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.handleContent}
                        toolbar={toolbar}
                        style={{height: 300}}
                      />
                      :
                      <Editor
                        editorState={this.state.content_en}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.handleContentEN}
                        toolbar={toolbar}
                        style={{height: 300}}
                      />
                  }
                </Col>
                <Col span={4}>
                  <ul>
                    <li style={{marginRight: 0}}>
                      <Dropdown overlay={
                        <Menu
                          selectedKeys={[this.state.privacy_langs]}
                          onClick={this.changeEditorLang}>
                          <Menu.Item className="lang" key='zh-Hans'>
                            <img src={require("../../../assets/locales/china.png")} />
                            <span className="lang-txt">CN</span>
                          </Menu.Item>
                          <Menu.Item className="lang" key='en'>
                            <img src={require("../../../assets/locales/uk.png")} />
                            <span className="lang-txt">EN</span>
                          </Menu.Item>
                        </Menu>
                      }>
                        <div className="current" style={{
                          lineHeight: "64px",
                          height: 64,
                          cursor: "pointer"
                        }}>
                          {
                            this.state.privacy_langs == "zh-Hans" ?
                              <img src={require("../../../assets/locales/china.png")} />
                              :
                              <img src={require("../../../assets/locales/uk.png")} />
                          }
                          {
                            this.state.privacy_langs == "zh-Hans" ?
                              <span className="lang-txt">CN</span>
                              :
                              <span className="lang-txt">EN</span>
                          }

                          <Icon type="down" style={{ font: "normal normal normal 14px/1 FontAwesome",color: "#D5D6E2" }} />

                        </div>

                      </Dropdown>
                    </li>
                  </ul>
                </Col>
              </Row>
            </FormItem>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px"
            }}>
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={this.handleSubmit}><FormattedMessage id="page.construction.location.yesSubmit" defaultMessage="提交"/></Button>
              <GoBackButton
                props={this.props} />
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default PrivacyAdd;

import React from 'react'
import MyBreadcrumb from '@component/bread-crumb'
import {Input, Form, Button, message, Select, Icon, Row, Col, Menu, Dropdown} from 'antd'
import GoBackButton from '@component/go-back'
import {
  observer,
  inject
} from 'mobx-react'
import CommonUtil from '@utils/common'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {noticePost, notice} from '@apis/training/notice'
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation.js'
import { noticePut } from '../../../apis/training/notice/index.js'
const FormItem = Form.Item
const {Option} = Select
let _util = new CommonUtil()

@inject('menuState') @observer @injectIntl
class PrivacyAdd extends React.Component {
  state = {
    langs1: _util.getStorage('langs') || (this.props.menuState ? this.props.menuState.language : false) || 'zh-Hans',
    langs2: _util.getStorage('langs') || (this.props.menuState ? this.props.menuState.language : false) || 'zh-Hans',
    id:''
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this.props.menuState.changeMenuCurrentUrl("/training");
    this.props.menuState.changeMenuOpenKeys("/training");
    notice({project_id:_util.getStorage('project_id')}).then(res => {
      if(res.data&&res.data.results&&res.data.results.length){
        const result = res.data.results[0];
        this.setState({id:res.data.results[0]['id']})
        const {training_attention,training_attention_en} = result
        if (training_attention || training_attention_en) {
            this.setState({
              content: training_attention ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(training_attention).contentBlocks)) : null,
              content_en: training_attention_en ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(training_attention_en).contentBlocks)) : null,
            })
        }
      }
    })
    // noticeDetail().then(res => {
    //   const {results} = res.data

    //   if (results) {
    //     const {auth_attention, auth_attention_en, visit_attention, visit_attention_en} = results

    //     if (auth_attention || auth_attention_en || visit_attention || visit_attention_en) {

    //       this.setState({
    //         content: auth_attention ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(auth_attention).contentBlocks)) : null,
    //         content_en: auth_attention_en ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(auth_attention_en).contentBlocks)) : null,
    //         visitor: visit_attention ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(visit_attention).contentBlocks)) : null,
    //         visitor_en: visit_attention_en ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(visit_attention_en).contentBlocks)) : null,
    //       })
    //     }
    //   }
    // })

    this.props.menuState.changeMenuCurrentUrl('/parking/notice')
    this.props.menuState.changeMenuOpenKeys('/parking')
  }

  // handleTitle = e => this.setState({ title: e.target.value })
  handleContent = editorState => this.setState({content: editorState})
  handleContentEN = editorState => this.setState({content_en: editorState})
//   handleVisitor = editorState => this.setState({visitor: editorState})
//   handleVisitorEN = editorState => this.setState({visitor_en: editorState})

  handleType = id => this.setState({type: id})
  handleSubmit = () => {
    const {title, type, content, content_en, visitor, visitor_en} = this.state;
    const {formatMessage} = this.props.intl;

    if (!content && !visitor) {
      message.error(formatMessage(translation.fillattention))   //请填写注意事项!
      return
    }
    const project_id = _util.getStorage('project_id');
    const params = {
        project_id:project_id,
        training_attention: draftToHtml(convertToRaw(content.getCurrentContent())),
        training_attention_en: content_en ? draftToHtml(convertToRaw(content_en.getCurrentContent())) : null,
        start_training_attention: draftToHtml(convertToRaw(content.getCurrentContent())),
        start_training_attention_en: content_en ? draftToHtml(convertToRaw(content_en.getCurrentContent())) : null,
        id:this.state.id
    //   visit_attention: draftToHtml(convertToRaw(visitor.getCurrentContent())),
    //   visit_attention_en: visitor_en ? draftToHtml(convertToRaw(visitor_en.getCurrentContent())) : null
    }
    const {id} = this.state;
    if(id){
      noticePut(project_id,params).then(res => {
        message.success(formatMessage(translation.saved))
      })
    }else{
        noticePost(project_id,params).then(res => {
          message.success(formatMessage(translation.saved))
        })
    }
  }

  changeEditorLang1 = ({key}) => {
    this.setState({langs1: key})
  }
  changeEditorLang2 = ({key}) => {
    this.setState({langs2: key})
  }

  render() {
    const toolbar = {
      options: [
        'inline',
        'blockType',
        'fontSize',
        'fontFamily',
        'list',
        'textAlign',
        'colorPicker',
        'remove',
        'history'
      ],
    }
    const formItemLayout = {
      labelCol: {
        sm: {span: 5},
      },
      wrapperCol: {
        sm: {span: 16},
      },
    }
    const {id} = this.props.match.params
    const {formatMessage} = this.props.intl
    const bread = [
      {
        name: <FormattedMessage id="menu.homepage" defaultMessage="首页"/>,
        url: '/'
      },
      {
        name: '培训管理'
      },
      {
        name: '培训须知',
        url: '/training/notice'
      }
    ]

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Form style={{
            maxWidth: 1000,
            margin: '0 auto'
          }}>

            <FormItem label={'培训须知'}
                      required {...formItemLayout} >
              <Row gutter={8}>
                <Col span={20}>
                  {
                    this.state.langs1 == 'zh-Hans' ?
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
                          selectedKeys={[this.state.langs1]}
                          onClick={this.changeEditorLang1}>
                          <Menu.Item className="lang" key='zh-Hans'>
                            <img src={require('../../../assets/locales/china.png')}/>
                            <span className="lang-txt">CN</span>
                          </Menu.Item>
                          <Menu.Item className="lang" key='en'>
                            <img src={require('../../../assets/locales/uk.png')}/>
                            <span className="lang-txt">EN</span>
                          </Menu.Item>
                        </Menu>
                      }>
                        <div className="current" style={{
                          lineHeight: '64px',
                          height: 64,
                          cursor: 'pointer'
                        }}>
                          {
                            this.state.langs1 == 'zh-Hans' ?
                              <img src={require('../../../assets/locales/china.png')}/>
                              :
                              <img src={require('../../../assets/locales/uk.png')}/>
                          }
                          {
                            this.state.langs1 == 'zh-Hans' ?
                              <span className="lang-txt">CN</span>
                              :
                              <span className="lang-txt">EN</span>
                          }

                          <Icon type="down"
                                style={{font: 'normal normal normal 14px/1 FontAwesome', color: '#D5D6E2'}}/>

                        </div>

                      </Dropdown>
                    </li>
                  </ul>
                </Col>
              </Row>
            </FormItem>

           

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px'
            }}>
              <Button
                type="primary"
                style={{marginRight: '10px'}}
                onClick={this.handleSubmit}><FormattedMessage id="app.button.save" defaultMessage="保存"/></Button>
              <GoBackButton
                props={this.props}/>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

export default PrivacyAdd

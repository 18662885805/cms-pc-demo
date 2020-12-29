import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Form, Button, Spin, message, Modal, Row, Col, Input, Icon } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { MsgCode, pwd, VerifyCode, CodeImg } from '@apis/account/index'
// import { forgetForm, forgetStepOneForm } from '@apis/account/index'
// import { forgetStepTwoForm, forgetStepTwoPost } from '@apis/account/index'

import CommonUtil from '@utils/common'
import menuState from '../../store/menu-state'

import styles from '../login/index.css'

const FormItem = Form.Item

let _util = new CommonUtil()
const confirm = Modal.confirm

const loginBg = require('../login/bosch_bg.jpg')

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
    background-size: cover;
    background: url(${loginBg}) center no-repeat;
`

const Content = styled.div`
    flex: 1 1 0%;
    padding: 112px 0 24px;
`

const Top = styled.div`
    text-align: center;
`

const Header = styled.div`
    
`

const HeaderTitle = styled.span`
    position: relative;
    top: 6px;
    margin-left: 20px;
    font-size: 33px;
    color: rgba(255, 255, 255, .85);
    font-weight: 600;
`

const HeaderDesc = styled.div`
    font-size: 20px;
    color: rgba(255, 255, 255, .7);
    margin-top: 12px;
    margin-bottom: 40px;
`

const MainWrapper = styled.div`
    width: 100%;
    background: rgba(0, 0, 0, .2)
`

const Main = styled.div`
    width: 368px;
    margin: 0 auto;
    padding-top: 20px
`

const messages = defineMessages({
  confirm_title: {
    id: 'app.confirm.title.submit',
    defaultMessage: '确认提交?',
  },
  confirm_content: {
    id: 'app.fit.button.content',
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
  code_send: {
    id: 'app.forget.message.code_send',
    defaultMessage: '验证码已发送到您的邮箱',
  }
});

@injectIntl
class ForgetForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      count: 60,
      seconds: 60,
      active: false,
      canNextStep: false,
      spinLoading: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    _util.removeStorage('phone')
    _util.removeStorage('site')
    menuState.setLogin(false)
    let uuid = uuidv4();
    this.setState({uuid})
    console.log(uuid)
    CodeImg({ uid: uuid }).then((res) => {
      console.log(res.data)
      this.setState({captcha: res.data.image})
    })

    // const formData = new FormData();
    // formData.append("uid", uuidv4());
    // const config = {
    //   headers: {
    //     "Authorization": "JWT " + _util.getStorage("token")
    //   }
    // };
    // const instance=axios.create({
    //   responseType: 'blob',
    //   withCredentials: true
    // });
    // const res = instance.get(_util.getServerUrl(`/account/verification_code/?uid=${uuidv4()}`), formData, config).then(res => {
    //   if (res.data) {
    //     return Promise.resolve(res.data)
    //   } else {
    //     throw res
    //   }
    // }).catch(err => {
    //   return Promise.reject(err)
    // });

    this.setState({
      spinLoading: false
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this
        const {code, phone} = _this.state;
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            _this.setState({
              confirmLoading: true
            })
            // values.site_id = values.site[values.site.length - 1]
            VerifyCode({phone: phone, code: code, g_type:1}).then((res) => {
              _this.setState({
                confirmLoading: false
              })
              message.success(formatMessage(messages.code_send))   //验证码已发送到您的邮箱
              // _util.setStorage('username', values.username)
              // _util.setStorage('site', values.site)
              // _this.props.history.replace('/forget/step/two')
              _this.props.history.replace({
                pathname: '/forget/step/two',
                state: {
                  phone: phone,
                  // site_id: values.site_id
                }
              })
            }).catch((error) => {
              _this.setState({
                confirmLoading: false
              })
            })
          },
          onCancel() { }
        })
      }
    })
  }

  getMsgCode = () => {
    const { phone, text, uuid } = this.state;
    console.log(uuid)
    if (phone) {
      MsgCode({ type: 1, phone, text, uid: uuid }).then(res => {
        message.success('验证码发送成功');
        this.timeFun();
        // this.countDown();
        // const {code} = res.data;
        this.setState({canNextStep: true})
      })
    } else {
      message.warning('请输入手机号！')
    }
  }

  //倒计时
  countDown = () => {
    const { count } = this.state
    if (count === 1) {//当为0的时候，active设置为true，button按钮显示内容为 获取验证码
      this.setState({
        count: 60,
        active: true,
      })
    } else {
      this.setState({
        count: count - 1,
        active: false,
      })
      setTimeout(() => this.countDown(), 1000)//每一秒调用一次
    }
  }

  timeFun = () => {
    this.setState({
      active: true,
      seconds: 60,
    });
    this.clock = setInterval(() => {
        this.setState(() => ({
            seconds: this.state.seconds - 1,
            // dlgTipTxt: `已发送(${preState.seconds - 1}s重新发送)`,
        }), () => {
            if (this.state.seconds <= 0) {
                this.setState({active: false});
                clearInterval(this.clock);
            }
        });
    }, 1000)
  }

  handleFormChange = (value, field) => {
    console.log(value, field);
    this.setState({
      [field]: value
    });
  }

  refreshCodeImg = () => {
    const { uuid } = this.state
    CodeImg({ uid: uuid }).then((res) => {
      console.log(res.data)
      this.setState({captcha: res.data.image})
    })
  }

  nextStep = () => {
    const { phone } = this.state;
    // VerifyCode({phone:phone,code:checkRegisterCode,g_type:1}).then((res) => {
    //   if(res){
    //     this.setState({step:2});
    //   }else{
    //     message.error('验证码错误！')
    //   }
    // })
    this.props.history.replace({
      pathname: '/forget/step/two',
      state: {
        phone: phone,
        // site_id: values.site_id
      }
    })
  }

  render() {
    const { confirmLoading, formData, spinLoading, active, captcha, canNextStep, seconds } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return (
      <div className={styles.bjcover}>
          <div className={styles.login2}>
          
          <Spin spinning={spinLoading}>
              <Form onSubmit={this.handleSubmit} className={styles.login_form2}>
              <div className={styles.logo} style={{marginBottom:'20px'}}>
                  <img src={require('./logo.png')} style={{height:'100%'}}></img>
              </div>
                <FormItem 
                  colon={false}
                  required={false}
                >
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '' }],
                  })(
                    <Input 
                      autoComplete='off' maxLength={11} onChange={e => this.handleFormChange(e.target.value, "phone")} placeholder={'请输入手机号'} />
                  )}
                </FormItem>

                <FormItem 
                  colon={false}
                  required={false}
                >
                  <Row gutter={8}>
                    <Col span={10}>
                      {getFieldDecorator('captcha', {
                        rules: [{ required: true, message: 'Please input the captcha you got!' }],
                      })(<Input onChange={e => this.handleFormChange(e.target.value, "text")} placeholder={'请输入图片验证码'} style={{verticalAlign: 'middle'}} />)}
                    </Col>
                    <Col span={6} title="点击刷新">
                      <img src={`data:image/png;base64,${this.state.captcha}`} style={{width: '100%', height: '33px', cursor: 'pointer'}} onClick={this.refreshCodeImg} />
                    </Col>
                    <Col span={8}>
                      <Button
                        type='primary'
                        style={{ width: '100%', verticalAlign: 'middle',align:'center' }}
                        disabled={active ? true : false}
                        onClick={() => this.getMsgCode()}>
                        {active ? `${seconds}秒` : '获取验证码'}
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem  
                  colon={false}
                  required={false}>
                  <Button type='primary' block onClick={() => this.nextStep()} disabled={!canNextStep}>
                      下一步                                      
                  </Button>
                </FormItem>
              </Form>
            </Spin>
          </div>
      </div>

    )
  }
}

const Forget = Form.create()(ForgetForm)

export default Forget

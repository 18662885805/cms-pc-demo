import React from "react";
import { Form, Button, Spin, message, Modal, Input,Icon } from "antd";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import CommonUtil from "@utils/common";
import menuState from "../../store/menu-state";
import ViewPwd from '@component/ViewPwd'
import Code from '@component/code'
import styles from "../login/index.css";
import { v4 as uuidv4 } from 'uuid';
import {MsgCode,pwd,VerifyCode, CodeImg} from '@apis/account/index'
import values from "postcss-modules-values";

const FormItem = Form.Item;

let _util = new CommonUtil();
const confirm = Modal.confirm;


const messages = defineMessages({
  confirm_title: {
    id: "app.confirm.title.submit",
    defaultMessage: "确认提交?"
  },
  confirm_content: {
    id: "app.fit.button.content",
    defaultMessage: "单击确认按钮后，将会提交数据"
  },
  okText: {
    id: "app.button.ok",
    defaultMessage: "确认"
  },
  cancelText: {
    id: "app.button.cancel",
    defaultMessage: "取消"
  },
});

@injectIntl
class ForgetForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      step:1,
      confirmLoading: false,
      spinLoading: true,
      count:60,
      liked: true,
      password1:null,
      password2:null,
      phone:null,
      canNextStep:false,
      registerCode:null,
      checkRegisterCode:null
    };
  }

  componentDidMount () {
    menuState.setLogin(false);
    // console.log(uuidv4())
    CodeImg({uuid: uuidv4()}).then((res) => {

    })

    this.setState({
      spinLoading: false
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { formatMessage } = this.props.intl;
    const {password1,password2,phone,checkRegisterCode} = this.state;
    if(password1 !== password2){
      message.warning('两次密码不一致！')
      return
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;      
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk () {
            _this.setState({
              confirmLoading: true
            });
            let data = {
              password:values.password2,
              code:checkRegisterCode,
              phone:phone
            };
            pwd(data).then((res) => {
              _this.props.history.push({
                pathname: '/login'
              })
            })
          },
          onCancel () {}
        });
      }
    });
  }
  
  nextStep = () => {
    const {checkRegisterCode,phone} = this.state;
    // VerifyCode({phone:phone,code:checkRegisterCode,g_type:1}).then((res) => {
    //   if(res){
    //     this.setState({step:2});
    //   }else{
    //     message.error('验证码错误！')
    //   }
    // })
    this.setState({step:2});
  }


  setPhone = (value) => {
    this.setState({phone:value})
  }

  getMsgCode = () => {
    const {phone} = this.state;
    if(phone){
      MsgCode({type: 1, phone:phone}).then(res => {
          message.success('验证码发送成功');
          this.countDown();
          // const {code} = res.data;
          // this.setState({registerCode:code})
      })
    }else{
      message.warning('请输入手机号！')
    }
   
  }

  //倒计时
  countDown = () => {
    const { count } = this.state
    if (count === 1) {//当为0的时候，liked设置为true，button按钮显示内容为 获取验证码
        this.setState({
            count: 60,
            liked: true,
        })
    } else {
        this.setState({
            count: count - 1,
            liked: false,
        })
        setTimeout(() => this.countDown(), 1000)//每一秒调用一次
    }
  }

  onChange = (e,name) => {
    this.setState({
        [name]: e.target.value
    })
  }

  setMsgCode = (value) => {
    const {phone} = this.state;
    this.setState({checkRegisterCode:value});
    if(phone){
      this.setState({canNextStep:true});
    }
  }

  render () {
    const {form} = this.props;
    const {getFieldDecorator} = form
    const {spinLoading,  liked, count,step,password1,password2,canNextStep } = this.state;
    const {formatMessage} = this.props.intl;
    const VerificationStyle={
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'space-around',
      height:'200px',
      padding:'20px',
  }
    return (
      <div className={styles.bjcover}>
        <div className={styles.login}>   
          <div className={styles.logo}>
          <img src={require('./ecms_logo_3.png')} style={{width:"200px"}}></img>
          </div>           
            <Spin spinning={spinLoading}>
              {
                step === 1 ?
                  <div style={VerificationStyle}>
                  <Input  
                  placeholder={'请输入手机号'} 
                  prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onChange={e => this.setPhone(e.target.value)}
                  maxLength={11}
                  />
                  <div style={{display:'flex',width:"100%"}}>
                      <Input  placeholder={'请输入短信验证码'} onChange={e => this.setMsgCode(e.target.value)}/>
                      <Button 
                      type='primary' 
                      style={{marginLeft:'10px',width:'40%',textAlign:'center'}} 
                      disabled={liked ? false : true}
                      onClick={() => this.getMsgCode()}>
                      {liked ? '获取短信验证码' : `${count}秒`}                                       
                      </Button>
                  </div>
                  <Button type='primary' block onClick={() => this.nextStep()} disabled={!canNextStep}>
                      下一步                                      
                  </Button>
                </div>:
                 <Form onSubmit={this.handleSubmit} className={`specific login_form`} hideRequiredMark={true}>
                    <FormItem                         
                        label={'新密码'}
                    >
                        {getFieldDecorator('password1', {
                            rules: [{required: true, message: '请输入新密码' }],
                        })(
                          <ViewPwd inputName="password" placeholder="请输入新密码" pwd={password1} onChange={(e) => this.onChange(e,'password1')}/>
                        )}
                    </FormItem>

                    <FormItem 
                        label={'确认新密码'}
                    >
                        {getFieldDecorator('password2', {
                            rules: [{required: true, message: '请输入确认密码' }],
                        })(                         
                          <ViewPwd inputName="password" placeholder="请确认新密码" pwd={password2} onChange={(e) => this.onChange(e,'password2')}/>
                        )}
                    </FormItem>

                    <FormItem style={{marginTop: 12}}>
                      <Button type='primary' htmlType="submit" style={{width:'100%'}}>
                          提交
                      </Button>
                    </FormItem>
                    
                </Form>
              }
            </Spin>           
          </div>
      </div>
    );
  }
}

const Forget = Form.create()(ForgetForm);

export default Forget;

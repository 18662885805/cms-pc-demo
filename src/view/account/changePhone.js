import React from "react";
import {Form, Button, Modal, Spin, message, Tree, Select, Upload, Icon,Input, Row, Col} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {MsgCode, ChangePhone, CodeImg} from '@apis/account/index'
import GoBackButton from "@component/go-back";
import { v4 as uuidv4 } from 'uuid';
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const {Option} = Select;

let _util = new CommonUtil();

@inject("menuState")
class PhoneChangeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinLoading:false,
            confirmLoading:false,
            count: 60,
            seconds: 60,
            active: false,
            phone:null,
            canNextStep:false
        };
    }

    componentWillMount(){
      let uuid = uuidv4();
      this.setState({uuid})
      CodeImg({ uid: uuid }).then((res) => {
          console.log(res.data)
          this.setState({captcha: res.data.image})
        })
    }

    componentDidMount() {
        // let uuid = uuidv4();
        // this.setState({uuid})
        // CodeImg({ uid: uuid }).then((res) => {
        //     console.log(res.data)
        //     this.setState({captcha: res.data.image})
        //   })
    }

    setPhone = (value) => {
        this.setState({ phone: value })
    }

    setMsgCode = (value) => {
        const {phone} = this.state;
        this.setState({ code: value });
        if(phone){
            this.setState({canNextStep:true });
        }
    }


    // getMsgCode = () => {
    //     const {phone } = this.state; 
    //     if(phone){
    //         MsgCode({ type: 4, phone: phone }).then(res => {        
    //             message.success('验证码发送成功');
    //             this.countDown();
    //         })
    //     }else{
    //         message.warning('请输入手机号！')
    //     }    
    // }
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

    handleSubmit = () => {
        // this.setState({confirmLoading:true})
        let _this = this;
        const {phone,code} = this.state;
        ChangePhone({phone:phone, code:code}).then((res) => {
            message.success('手机号修改成功，请重新登录')
            _this.props.history.goBack();
            // this.setState({confirmLoading:false})
        })
    }

    getMsgCode = () => {
        const { phone, text, uuid } = this.state;
        console.log(uuid)
        if (phone) {
          MsgCode({ type: 4, phone, text, uid: uuid }).then(res => {
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

      refreshCodeImg = () => {
        const { uuid } = this.state
        CodeImg({ uid: uuid }).then((res) => {
          console.log(res.data)
          this.setState({captcha: res.data.image})
        })
      }

      handleFormChange = (value, field) => {
        console.log(value, field);
        this.setState({
          [field]: value
        });
      }

  render() {
    const {spinLoading,active,count,phone,confirmLoading,canNextStep, seconds} = this.state;
    const {getFieldDecorator} = this.props.form
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
      const submitFormLayout = {
        wrapperCol: {
          xs: {span: 24, offset: 0},
          sm: {span: 10, offset: 10},
        },
      };

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form>
                <FormItem
                    {...formItemLayout}
                    label={'新手机号'}
                    colon={false}
                >
                   <Input 
                   placeholder={'请输入手机号'} 
                   onChange={e => this.setPhone(e.target.value)}
                   value={phone}
                   maxLength={11}
                   />
                </FormItem>

                <FormItem {...formItemLayout}
                    label={'图片验证码'}
                    colon={false}
                    required={false}
                >
                    <Row gutter={8}>
                    <Col span={10}>
                        {/* <Input 
                            placeholder={'请输入短信验证码'}
                            onChange={e => this.setMsgCode(e.target.value)}                
                        />  */}
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
                            style={{ width: '100%', verticalAlign: 'middle' }}
                            disabled={active ? true : false}
                            onClick={() => this.getMsgCode()}>
                            {active ? `${seconds}秒` : '获取短信验证码'}
                        </Button>
                    </Col>
                    </Row>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={'验证码'}
                >
                   <Input 
                        placeholder={'请输入短信验证码'}
                        onChange={e => this.handleFormChange(e.target.value, "code")}             
                    /> 
                   
                </FormItem>
                {/* <FormItem
                    {...formItemLayout}
                    style={{display:"flex",justifyContent:"center"}}
                >
                    <Button 
                        type='primary'
                        disabled={active ? false : true}
                        onClick={() => this.getMsgCode()} 
                        style={{width:"100%"}} 
                        disabled={active ? false : true}                          
                    >
                    {active ? '获取短信验证码' : `${count}秒`}
                    </Button>
                </FormItem> */}

                <FormItem {...submitFormLayout}>
                <div style={{width: '100%', marginBottom: '20px'}}>
                    <Button type="primary" onClick={() => this.handleSubmit()} disabled={!canNextStep}
                            style={{marginRight: '10px'}} loading={confirmLoading}>
                        <FormattedMessage id="app.button.save" defaultMessage="保存" />
                    </Button>
                    <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const PhoneChange = Form.create()(PhoneChangeForm);

export default injectIntl(PhoneChange);

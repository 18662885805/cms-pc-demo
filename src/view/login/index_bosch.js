import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {
    Form,
    Button,
    Modal,
    Spin,
    message,
    Row,
    Col,
    Input as AntInput,
    Icon,
    Select,
    Checkbox,
} from 'antd'
import {
    observer,
    inject
} from 'mobx-react'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import {UserProject} from "@apis/system/project";
import {login} from '@apis/account/index'
import {privacySearch} from '@apis/system/privacy'
import inputDecorate from '@component/input-decorate'
import ViewPwd from '@component/ViewPwd'
import styles from './index.css';
import menuState from '../../store/menu-state'
import MyIcon from '@component/MyIcon'
const FormItem = Form.Item
const Option = Select.Option;
const Input = inputDecorate(AntInput)

let _util = new CommonUtil()

const messages = defineMessages({
  upload_success: {
    id: 'app.message.login.upload_success',
    defaultMessage: '上传成功',
  },
  read_and_agree: {
    id: 'app.message.login.read_and_agree',
    defaultMessage: '登录前请先阅读并同意软件使用须知',
  },
  login_successful: {
    id: 'app.message.login.login_successful',
    defaultMessage: '登陆成功',
  },
  before_register: {
    id: 'app.message.login.before_register',
    defaultMessage: '注册前请阅读并勾选注册提示!',
  },
  wait_for_review: {
    id: 'app.message.login.wait_for_review',
    defaultMessage: '申请成功, 请等待管理员审核',
  },
  upload_certificate: {
    id: 'app.message.login.upload_certificate',
    defaultMessage: '请上传营业执照或资质证明',
  },
  enter_user: {
    id: 'app.require.login.enter_user',
    defaultMessage: '请输入用户名',
  },
  enter_pwd: {
    id: 'app.require.login.enter_pwd',
    defaultMessage: '请输入密码',
  },
  select_site: {
    id: 'app.require.login.select_site',
    defaultMessage: '请选择站点',
  },
  select_language: {
    id: 'app.require.login.select_language',
    defaultMessage: '请选择语言',
  },
  staff: {
    id: 'page.login.text.staff',
    defaultMessage: '员工',
  },
  contractor: {
    id: 'page.login.text.contractor',
    defaultMessage: '承包商',
  },
  company_placeholder: {
    id: 'page.login.placeholder.company_placeholder',
    defaultMessage: '公司名称',
  },
  company_placeholder1: {
    id: 'page.login.placeholder.company_placeholder1',
    defaultMessage: '公司名称（需跟营业执照上的一致）',
  },
  address_placeholder: {
    id: 'page.login.placeholder.address_placeholder',
    defaultMessage: '公司地址',
  },
  Name_placeholder: {
    id: 'page.login.placeholder.Name_placeholder',
    defaultMessage: '联系人',
  },
  email_placeholder: {
    id: 'page.login.placeholder.email_placeholder',
    defaultMessage: '邮箱',
  },
  phone_placeholder: {
    id: 'page.login.placeholder.phone_placeholder',
    defaultMessage: '手机',
  },
  reason_placeholder: {
    id: 'page.login.placeholder.reason_placeholder',
    defaultMessage: '申请用途',
  },
  desc_placeholder: {
    id: 'page.login.placeholder.desc_placeholder',
    defaultMessage: '公司描述',
  },
  site_placeholder: {
    id: 'page.login.placeholder.site_placeholder',
    defaultMessage: '站点',
  },
  upload_placeholder: {
    id: 'page.login.placeholder.upload_placeholder',
    defaultMessage: '请上传营业执照或资质证明，图片格式jpg jpeg png',
  },
  enter_company: {
    id: 'page.login.required.enter_company',
    defaultMessage: '请输入公司名称!',
  },
  enter_company_address: {
    id: 'page.login.required.enter_company_address',
    defaultMessage: '请输入公司地址!',
  },
  enter_contact: {
    id: 'page.login.required.enter_contact',
    defaultMessage: '请输入联系人!',
  },
  email_format_error: {
    id: 'page.login.required.email_format_error',
    defaultMessage: '邮箱格式不正确!',
  },
  enter_email: {
    id: 'page.login.required.enter_email',
    defaultMessage: '请输入邮箱!',
  },
  enter_phone_number: {
    id: 'page.login.required.enter_phone_number',
    defaultMessage: '请输入手机!',
  },
  enter_reason: {
    id: 'page.login.required.enter_reason',
    defaultMessage: '请输入申请用途!',
  },
  choose_site: {
    id: 'page.login.required.choose_site',
    defaultMessage: '请选择站点',
  },
  PersNo_placeholder: {
    id: 'page.login.placeholder.PersNo_placeholder',
    defaultMessage: '工号',
  },
  password_placeholder: {
    id: 'page.login.placeholder.password_placeholder',
    defaultMessage: '密码',
  },
  username_placeholder: {
    id: 'page.login.placeholder.username_placeholder',
    defaultMessage: '姓名',
  },
  tel_placeholder: {
    id: 'page.login.placeholder.tel_placeholder',
    defaultMessage: '座机',
  },
  no_cost_center: {
    id: 'page.login.text.no_cost_center',
    defaultMessage: '无此成本中心',
  },
  cost_center: {
    id: 'page.login.placeholder.cost_center',
    defaultMessage: '成本中心',
  },
  select_site_first: {
    id: 'page.login.placeholder.select_site_first',
    defaultMessage: '(请先选择站点)',
  },
  select_search: {
    id: 'page.login.placeholder.select_search',
    defaultMessage: '(选择或者搜索)',
  },
  no_dept: {
    id: 'page.login.text.no_dept',
    defaultMessage: '无此部门',
  },
  department: {
    id: 'page.login.placeholder.department',
    defaultMessage: '部门',
  },
  select_costcenter_first: {
    id: 'page.login.placeholder.select_costcenter_first',
    defaultMessage: '(请先选择成本中心)',
  },
  enter_pers_no: {
    id: 'app.required.login.enter_pers_no',
    defaultMessage: '请输入工号',
  },
  max_pers_no: {
    id: 'app.required.login.max_pers_no',
    defaultMessage: '最大长度不能超过64个字节 / Max 64 bytes',
  },
  password_format: {
    id: 'app.required.login.password_format',
    defaultMessage: '密码要包含字母、数字或特殊字符，10-16位',
  },
  enter_name: {
    id: 'app.required.login.enter_name',
    defaultMessage: '请输入姓名',
  },
  max_enter_name: {
    id: 'app.required.login.max_enter_name',
    defaultMessage: '最大长度不能超过64个字节 / Max 64 bytes',
  },
  enter_tel_number: {
    id: 'app.required.login.enter_tel_number',
    defaultMessage: '请输入座机',
  },
  max_tel_number: {
    id: 'app.required.login.max_tel_number',
    defaultMessage: '最大长度不能超过32个字节 / Max 32 bytes',
  },
  max_enter_reason: {
    id: 'app.required.login.max_enter_reason',
    defaultMessage: '最大长度不能超过200个字节 / Max 200 bytes',
  },
});

// Main
@inject('appState','menuState') @observer @injectIntl
class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginConfirmLoading: false,
            redirect: _util.getParam('redirect') || '',
            formData: {},
            loading: false,
            spinLoading: true,
            account: null,
            isAgree: false,
            agreeVisible: false,
            password: null,
            pwdView: true,
            langs: '',
        }
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }


    componentDidUpdate() {
       
    }

    componentDidMount() {
        let language = _util.getStorage('langs') || _util.getCookie('django_language') || 'zh-Hans';
        _util.setCookie('django_language', language)
        menuState.setLanguage(language)
        _util.setStorage('langs', language)
        _util.removeStorage('token')
        _util.removeStorage('userInfo')
        _util.removeStorage('menu')
        _util.removeStorage('logo')
        _util.removeStorage('site_name')
        _util.removeStorage('permission')
        _util.removeStorage('orgpermission')
        _util.removeStorage('isCheckTrainingInfo')
        _util.removeStorage('userdata')
        _util.removeStorage('myadmin')//MJK管理员
        _util.removeStorage('admin')
        menuState.setLogin(false)
        this.setState({
            langs: language,
            spinLoading: false
        })
    }

    // 登录
    handleLoginSubmit(e){
        const { currentProject, isAgree } = this.state;//用户模式：上次选择的项目
        const { formatMessage } = this.props.intl
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            values.identity_type = 1;
            // values.password = _util.encryptRequest(values.password, this.state.passwordKey)
            let _this = this;
            if (!err) {
                if (!isAgree) {
                    message.error(formatMessage(messages.read_and_agree))    //登录前请先阅读并同意软件使用须知
                    return
                }
                _this.setState({
                    loginConfirmLoading: true
                })


                login(values).then((res) => {
                    _this.setState({
                        loginConfirmLoading: false
                    })
                    message.success(formatMessage(messages.login_successful));    //登陆成功
                    let data = res.data;
                    const {name,email,phone,need_change_password} = data;
                    _util.setStorage('token', data.access)
                    _util.setStorage('refresh', data.refresh)     
                    _util.setStorage('myadmin', data.super) //MJK管理员
                    _util.setStorage('lastLogin', Date.now())
                    _util.setStorage('last_project', data.last_project)
                    _util.setStorage('project_id', data.last_project)
                    _util.setStorage('userInfo', {name:name,email:email,phone:phone})
                    menuState.setLogin(true);
                    let admin = _util.getStorage('admin');
                    let myadmin = _util.getStorage('myadmin');
                    if(need_change_password){
                        this.props.history.push({
                            pathname: '/password'
                        }); 
                        return              
                    }

                    //跳转到用户主页
                    if(myadmin === true || admin === true) {
                        localStorage.removeItem("project");
                        localStorage.removeItem("project_id");
                    }
                    if (myadmin === true) {
                        _util.setStorage('userType', 1)
                        //MJK管理员
                        this.props.history.push({
                            pathname: '/myadmin/user'
                        })
                    } else if (admin === true) {
                        _util.setStorage('userType', 2)
                        //客户管理员
                        this.props.history.push({
                            pathname: '/admin/home'
                        })
                    } else {
                        _util.setStorage('userType', 3);
                        if (data.last_project && data.last_project > 0) {
                            if (_this.state.redirect && (_this.state.redirect.indexOf('login') == -1)) {
                                //跳转到指定的页面
                                _this.props.history.replace(_this.state.redirect)
                            } else {
                                this.props.history.push({
                                    pathname: '/'
                                })              
                            }
                        } else {
                            UserProject().then((res) => {
                                let project = res.data[0]
                                _util.setStorage('project', project);
                                _util.setStorage('project_id', project && project.id);
                                this.props.history.push({
                                    pathname: '/'
                                }) 
                            });
                        }
                    } 

                }).catch((error) => {
                    console.log(error);
                    _this.setState({
                        loginConfirmLoading: false
                    })
                });

            }

        });
    }

    textButton = () => {
        alert('123')
    }

   

    handleAgreehidden = () => {
        this.setState({
            agreeVisible: false
        })
    }

    //打开版权声明及使用须知
    lookAgree = (e) => {
        //版权声明及使用须知
        e.preventDefault()
        privacySearch({type: 1}).then(res => {    
            this.setState({
                privacy1: res.data.content,
                privacy1Id: res.data.id,
            })
            this.setState({
                agreeVisible: true
            })
        });
    }

    handleAgree = e => {
        this.setState({
            isAgree: e.target.checked
        })
    }



    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggleState = () => {
        this.setState({ pwdView: !this.state.pwdView });
    }


    openPolicy = () => {
      privacySearch({type: 2}).then(res => {
          this.setState({
              privacy2: res.data.content,
              privacy2Id: res.data.id
          })
          this.setState({
              policyShow: true
          })
      })
    }
    closePolicy = () => {
        this.setState({
            policyShow: false
        })
    }
    openBoschPolicy = () => {
      privacySearch({type: 3}).then(res => {
          this.setState({
              privacy3: res.data.content,
              privacy3Id: res.data.id
          })
          this.setState({
              boschPolicyShow: true
          })
      })
    }
    closeBoschPolicy = () => {
        this.setState({
            boschPolicyShow: false
        })
    }

    changeLang = (value) => {
        console.log(value);

        menuState.setLanguage(value)
        _util.setStorage('langs', value)
        _util.setCookie('django_language', value)
    }

    goToForget = () => {
        this.props.history.push('/forget')
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const {getFieldDecorator, getFieldValue} = this.props.form
        const {formatMessage} = this.props.intl
        const { loginConfirmLoading,  spinLoading, account,  password} = this.state

        return (
            <div className={styles.bjcover}>
                <div className={styles.loginctx}>
                    <div className={styles.login}>
                        <div className={styles.loginbox}>
                            <Row gutter={16} style={{
                                position: 'relative'
                            }}>
                                <Col span={8} offset={3} style={{overflow: 'hidden', height: '300px'}}>
                                <div style={{height: '300px', display: 'flex'}}>
                                <div
                                        className={_util.getENV() === 'prod' ? styles.qrcode : styles.qrcodemjk}
                                        style={{
                                            float: 'left',
                                            width: '90px',
                                            marginRight: '30px',
                                            paddingTop: '200px'}}>
                                <div style={{color: '#333', fontSize: '12px', textAlign: 'center', lineHeight: 1}}><FormattedMessage id="page.login.wechat_login" defaultMessage="微信登录" /></div>
                                </div>

                                <div style={{float: 'left', height: '300px', width: '75%', position: 'relative'}}>
                                <div className={styles.logoName} style={{
                                    position: 'absolute',
                                    top: '149px',
                                    transform: 'translateY(-50%)',
                                    margin: 0,
                                    width: '100%'
                                    }}>
                                        <p style={{fontSize: '26px', marginBottom: '10px', lineHeight: 1}}>
                                            <span >Welcome to </span>
                                            <span style={{color: 'rgba(3, 146, 69, 1)'}}>e</span>
                                            <span style={{color: 'rgba(50,103,147, 1)'}}>CM</span>
                                            <span style={{color: 'rgba(220,49,36, 1)'}}>S</span>
                                        </p>
                                        {/* <p style={{color: '#fff', marginBottom: 0, lineHeight: 1}}>Better solution from us</p> */}
                                    </div>
                                </div>

                                </div>
                                </Col>
                                <Col span={10} pull={2} style={{marginTop: 10}}>
                                    <div className={styles.loginForm}>
                                    
                                        <Spin spinning={spinLoading}>
                                            <Form onSubmit={this.handleLoginSubmit} className={`specific login_form`}
                                                  hideRequiredMark={true}>
                                                {
                                                    account ?
                                                        <FormItem {...formItemLayout}
                                                        //label="账  号"
                                                        label={<FormattedMessage id="page.login.account" defaultMessage="账  号" />}
                                                        // colon={false}
                                                        >
                                                            {getFieldDecorator('phone', {
                                                                initialValue: account,
                                                                rules: [{required: true, message: formatMessage(messages.enter_user) }],
                                                            })(
                                                                <Input prefix={<Icon type="user"
                                                                                     style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                                       autoComplete='off' placeholder="UserName" maxLength={11}/>
                                                            )}
                                                        </FormItem>
                                                        :
                                                        <FormItem {...formItemLayout}
                                                        label={<FormattedMessage id="page.login.account" defaultMessage="账  号" />}
                                                        // colon={false}
                                                        >
                                                            {getFieldDecorator('phone', {
                                                                rules: [{required: true, message: formatMessage(messages.enter_user) }],
                                                            })(
                                                                <Input 
                                                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                                    autoComplete='off' 
                                                                    placeholder="UserName" 
                                                                    maxLength={11}
                                                                />
                                                            )}
                                                        </FormItem>

                                                }

                                                <FormItem {...formItemLayout}
                                                //label="密  码"
                                                label={<FormattedMessage id="page.login.password" defaultMessage="密  码" />}
                                                // colon={false}
                                                >
                                                    {getFieldDecorator('password', {
                                                        rules: [{required: true, message: formatMessage(messages.enter_pwd) }],
                                                    })(
                                                        <div style={{paddingTop: 3}}>
                                                            <ViewPwd inputName="password" placeholder="Password" pwd={password} onChange={(e) => this.onChange(e)}/>
                                                        </div>

                                                    )}
                                                </FormItem>

                                                <FormItem {...formItemLayout}
                                                    label={<FormattedMessage id="page.login.language" defaultMessage="语  言" />}
                                                    // style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                                                >
                                                    {getFieldDecorator('langs', {
                                                        initialValue: this.state.langs,
                                                        rules: [{
                                                            required: true,
                                                            message: formatMessage(messages.select_language)   //请选择语言
                                                        }],
                                                    })(
                                                        <Select
                                                        // style={{ marginLeft: '16px' }}
                                                        onChange={this.changeLang}
                                                        >
                                                        <Option value="zh-Hans">
                                                            <span style={{display: 'flex',alignItems: 'center'}}>CN&nbsp;&nbsp;&nbsp;&nbsp;<img src={require('../../assets/locales/china.png')} /></span>
                                                        </Option>
                                                        <Option value="en">
                                                            <span style={{display: 'flex',alignItems: 'center'}}>EN&nbsp;&nbsp;&nbsp;&nbsp;<img src={require('../../assets/locales/uk.png')} /></span>
                                                        </Option>
                                                        </Select>
                                                    )}
                                                </FormItem>

                                                
                                      
                                                <FormItem {...tailFormItemLayout} style={{marginBottom: 10}}>
                                                    <div style={{lineHeight: 1, paddingTop: 4}}>
                                                    <span >
                                                    <Checkbox checked={this.state.isAgree}
                                                              style={{color: '#fff', fontSize: '12px'}}
                                                              onChange={this.handleAgree}> <FormattedMessage id="page.login.text.read_and_agree" defaultMessage="阅读并同意" /><a
                                                        onClick={(e) => this.lookAgree(e)} style={{color: '#dfe5ea'}}><FormattedMessage id="page.login.text.copyright" defaultMessage="《版权申明及使用须知》" /></a></Checkbox>
                                                    </span>
                                                    <a style={{color: '#dfe5ea',fontSize: '12px'}} onClick={this.openPolicy}><FormattedMessage id="page.login.text.privacy" defaultMessage="《隐私政策》" /></a>
                                                    <Link to='/forget'
                                                          style={{color: '#fff', marginLeft: '2px', fontSize: '12px'}}>
                                                        <FormattedMessage id="app.button.login.forget" defaultMessage="找回密码" />
                                                    </Link>
                                                    {/* <span onClick={() => this.goToForget()}><FormattedMessage id="app.button.login.forget" defaultMessage="找回密码" /></span> */}
                                                    </div>

                                                </FormItem>
                                                <Modal
                                                    title={<FormattedMessage id="app.modal.title.copyright" defaultMessage="《版权申明及使用须知》" />}
                                                    visible={this.state.agreeVisible}
                                                    onCancel={this.handleAgreehidden}
                                                    footer={null}
                                                >
                                                    {
                                                        this.state.privacy1
                                                        ? <div dangerouslySetInnerHTML={{
                                                            __html: this.state.privacy1
                                                        }}
                                                        style={{fontSize: 12}}></div>
                                                        : null
                                                    }                                               
                                                </Modal>
                                                <FormItem {...tailFormItemLayout} style={{marginTop: 12}} className="logbtn">
                                                    <Button style={{
                                                        backgroundColor: '#02a1c1',
                                                        color: '#fff',
                                                        border: 'none'
                                                    }} htmlType="submit" loading={loginConfirmLoading}><FormattedMessage id="app.button.login" defaultMessage="登录/Login" /></Button>                                          
                                                </FormItem>
                                            </Form>

                                            
                                            <Modal
                                                title={<FormattedMessage id="app.modal.title.privacy" defaultMessage="隐私政策" />}
                                                footer={null}
                                                onCancel={this.closeBoschPolicy}
                                                visible={this.state.boschPolicyShow}
                                                zIndex={99999999}>
                                                {
                                                    this.state.privacy3
                                                    ? <div dangerouslySetInnerHTML={{
                                                        __html: this.state.privacy3
                                                    }} style={{fontSize: 12}}></div>
                                                    : null
                                                }
                                            </Modal>
                                            <Modal
                                                title={<FormattedMessage id="app.modal.title.privacy" defaultMessage="隐私政策" />}
                                                footer={null}
                                                onCancel={this.closePolicy}
                                                visible={this.state.policyShow}
                                                zIndex={99999999}>
                                                {
                                                    this.state.privacy2
                                                    ? <div dangerouslySetInnerHTML={{
                                                        __html: this.state.privacy2
                                                    }} style={{fontSize: 12}}></div>
                                                    : null
                                                }
                                            </Modal>
                                        </Spin>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className={styles.loginbg}></div>
                    </div>

                    <div className={styles.record}>
                        <p><a href="http://www.beian.miit.gov.cn" target="_Blank">苏ICP备18027894号-1</a>&nbsp;&nbsp;&nbsp;&nbsp;©2019 <FormattedMessage id="app.component.side_layout.copyright" defaultMessage="苏州曼捷科智能科技有限公司版权所有"/> V2.0.1</p>
                    </div>
                </div>
                <div style={{
                    position: 'fixed',
                    left: '0',
                    top: '0',
                    right: '0',
                    bottom: '0',
                    display: this.state.loading ? 'block' : 'none',
                    zIndex: '1001',
                    background: 'rgba(0,0,0,0.1)'
                }}><Spin spinning={this.state.loading}
                         style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}/>
                </div>
            </div>

        )
    }
}

const Login = Form.create()(LoginForm)

export default Login

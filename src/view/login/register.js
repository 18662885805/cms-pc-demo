import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {
    Form,
    Button,
    Input as AntInput,
    Icon,
    Select,
    Checkbox,
    Tabs,
} from 'antd'
import {
    observer,
    inject
} from 'mobx-react'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import inputDecorate from '@component/input-decorate'
import ViewPwd from '@component/ViewPwd'
import styles from './index.css';

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
      defaultMessage: '请输入姓名',
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
class RegisterForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          contractorInfo:false,
          registerType: 2, //组织2，个人3
        }
    }


    componentDidMount() {
      
    }


    onChange = (value) => {

    }

    //勾选注册《隐私政策》
    handleContractorInfo = (e) => {
      this.setState({
          contractorInfo: e.target.checked
      })
    }

     //注册
  //    handleRegisterOk = () => {
  //     const { fileList, registerType, contractorInfo, code, phone } = this.state;
  //     const { formatMessage } = this.props.intl
  //     console.log(typeof code)
  //     if (registerType === 2) {
  //         if (!contractorInfo) {
  //             message.error(formatMessage(messages.before_register))   //注册前请阅读并勾选注册提示!
  //             return
  //         }

  //         //设置附件列表
  //         let source = []
  //         if (fileList instanceof Array) {
  //             fileList.forEach((value) => {
  //                 if (value && value.response && value.response.content && value.response.content.results) {
  //                     source.push(value.response.content.results.url)
  //                 }

  //             })
  //         }

  //         this.form_2.validateFields((err, values) => {
  //             if (!err) {
  //                 this.setState({
  //                     loading: true
  //                 })
  //                 values.code = code
  //                 values.is_contractor = true
  //                 values.source = source.length && source instanceof Array ? source.join(',') : ''
  //                 // values.source = 'souce/00001.png'
  //                 // values.password = _util.encryptRequest(values.password, this.state.passwordKey)
  //                 this.setState({
  //                     confirmLoading: true,
  //                 })
  //                 register(values).then((res) => {
  //                     message.success(formatMessage(messages.wait_for_review))    //申请成功, 请等待管理员审核
  //                     this.setState({
  //                         loading: false,
  //                         fileList: [],
  //                         registerVisible: false,
  //                     })
  //                 }).catch((error) => {
  //                     this.setState({
  //                         loading: false
  //                     })
  //                 });
  //             }
  //         })

  //     }

  //     if (registerType === 3) {//个人
  //         if (!contractorInfo) {
  //             message.error(formatMessage(messages.before_register))   //注册前请阅读并勾选注册提示!
  //             return
  //         }

  //         this.form_3.validateFields((err, values) => {
  //             if (!err) {
  //                 this.setState({
  //                     loading: true
  //                 });
  //                 this.setState({
  //                     confirmLoading: true,
  //                 })
  //                 values.is_contractor = false;
  //                 values.phone = phone;
  //                 values.code = code
  //                 register(values).then((res) => {
  //                     message.success(formatMessage(messages.wait_for_review))   //申请成功, 请等待管理员审核
  //                     this.setState({
  //                         loading: false,
  //                         registerVisible: false
  //                     })
  //                 }).catch((error) => {
  //                     this.setState({
  //                         loading: false
  //                     })
  //                 });
  //             }
  //         })
  //     }

  //     this.setState({
  //         confirmLoading: false,
  //     })
  // }



    render() {
        const {formatMessage} = this.props.intl;
        const {form} = this.props;
        const { password,contractorInfo,registerType} = this.state;
        const { getFieldDecorator } = form;


        return (
            <div className={styles.bjcover}>
                <div className={`login_form ${styles.registerForm}`}>    
                  <Form>
                    {
                      registerType === 2 ?
                      <div style={{display:'flex'}}>
                        <div style={{width:'300px'}}>
                          <FormItem label={'项目'}>
                              {getFieldDecorator('project', {
                                  rules: [{required: true, message: '请选择项目' }], 
                              })(
                                  <Select
                                      allowClear
                                      placeholder={'项目'}    //站点 / 项目
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    
                                  >
                                    <Option key={1} value={1}>1586415648</Option>
                                  </Select>
                              )}
                          </FormItem>
                          <FormItem label={'手机'} required>
                              <Input 
                                value={'110'} 
                                disabled 
                                prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              />
                          </FormItem>
                          <FormItem
                              label={<FormattedMessage id="page.login.password" defaultMessage="密  码" />}
                          >
                              {getFieldDecorator('password', {
                                  rules: [{ required: true, message: 'message' }],
                              })(
                                  <div style={{ paddingTop: 3 }}>
                                      <ViewPwd inputName="password" placeholder="Password" pwd={password} onChange={(e) => this.onChange(e)} />
                                  </div>

                              )}
                          </FormItem>
                          <FormItem
                              label={'姓名'}
                          >
                              {getFieldDecorator('username', {
                                  rules: [{ required: true, message:'message' }],
                              })(
                                  <Input prefix={<Icon type="user"
                                      style={{ color: 'rgba(0,0,0,.25)' }} />}
                                      autoComplete='off' placeholder="UserName" />
                              )}
                          </FormItem>
                          <FormItem label={'邮箱'}>
                              {getFieldDecorator('email', {
                                  rules: [
                                      { required: true, message:'请输入邮箱' },    //"请输入邮箱 / Please input your mail"
                                      { type: "email", message: '邮箱格式错误' }   //"邮箱格式错误 / The input is not valid E-mail"
                                  ],
                              })(
                                  <Input
                                      prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                      placeholder={'邮箱'}     //邮箱 / Email
                                      autoComplete='off' />
                              )}
                          </FormItem>
                        </div>
                        <div style={{width:'300px',marginLeft:'20px'}}>
                          <FormItem label={'项目'}>
                              {getFieldDecorator('project', {
                                  rules: [{required: true, message: '请选择项目' }], 
                              })(
                                  <Select
                                      allowClear
                                      placeholder={'项目'}    //站点 / 项目
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    
                                  >
                                    <Option key={1} value={1}>1586415648</Option>
                                  </Select>
                              )}
                          </FormItem>
                          <FormItem label={'手机'} required>
                              <Input 
                                value={'110'} 
                                disabled 
                                prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              />
                          </FormItem>
                          <FormItem
                              label={<FormattedMessage id="page.login.password" defaultMessage="密  码" />}
                          >
                              {getFieldDecorator('password', {
                                  rules: [{ required: true, message: 'message' }],
                              })(
                                  <div style={{ paddingTop: 3 }}>
                                      <ViewPwd inputName="password" placeholder="Password" pwd={password} onChange={(e) => this.onChange(e)} />
                                  </div>

                              )}
                          </FormItem>
                          <FormItem
                              label={'姓名'}
                          >
                              {getFieldDecorator('username', {
                                  rules: [{ required: true, message:'message' }],
                              })(
                                  <Input prefix={<Icon type="user"
                                      style={{ color: 'rgba(0,0,0,.25)' }} />}
                                      autoComplete='off' placeholder="UserName" />
                              )}
                          </FormItem>
                          <FormItem label={'邮箱'}>
                              {getFieldDecorator('email', {
                                  rules: [
                                      { required: true, message:'请输入邮箱' },    //"请输入邮箱 / Please input your mail"
                                      { type: "email", message: '邮箱格式错误' }   //"邮箱格式错误 / The input is not valid E-mail"
                                  ],
                              })(
                                  <Input
                                      prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                      placeholder={'邮箱'}     //邮箱 / Email
                                      autoComplete='off' />
                              )}
                          </FormItem>
                        </div>
                      </div>:
                      <div style={{width:'400px'}}>
                        <FormItem label={'项目'}>
                            {getFieldDecorator('project', {
                                rules: [{required: true, message: '请选择项目' }], 
                            })(
                                <Select
                                    allowClear
                                    placeholder={'项目'}    //站点 / 项目
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  
                                >
                                  <Option key={1} value={1}>1586415648</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={'手机'} required>
                            <Input 
                              value={'110'} 
                              disabled 
                              prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </FormItem>
                        <FormItem
                            label={<FormattedMessage id="page.login.password" defaultMessage="密  码" />}
                        >
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'message' }],
                            })(
                                <div style={{ paddingTop: 3 }}>
                                    <ViewPwd inputName="password" placeholder="Password" pwd={password} onChange={(e) => this.onChange(e)} />
                                </div>

                            )}
                        </FormItem>
                        <FormItem
                            label={'姓名'}
                        >
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message:'message' }],
                            })(
                                <Input prefix={<Icon type="user"
                                    style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    autoComplete='off' placeholder="UserName" />
                            )}
                        </FormItem>
                        <FormItem label={'邮箱'}>
                            {getFieldDecorator('email', {
                                rules: [
                                    { required: true, message:'请输入邮箱' },    //"请输入邮箱 / Please input your mail"
                                    { type: "email", message: '邮箱格式错误' }   //"邮箱格式错误 / The input is not valid E-mail"
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder={'邮箱'}     //邮箱 / Email
                                    autoComplete='off' />
                            )}
                        </FormItem>
                      </div>
                    }
                    
                    
                  </Form> 
                  <div style={{ display: 'flex' }}>
                      <div >
                          <Checkbox
                              checked={contractorInfo}
                              onChange={this.handleContractorInfo} />
                      </div>
                      <div style={{ marginLeft: 8 }}>
                          <div style={{ fontSize: 12, paddingTop: 3 }}>
                              <FormattedMessage id="page.login.text.read_and_know" defaultMessage="我已阅读并了解" />
                              <a onClick={this.openPolicy}>
                                  <FormattedMessage id="page.login.text.privacy" defaultMessage="《隐私政策》" />
                              </a>
                          </div>
                      </div>
                  </div>
                  <div style={{width:'100%',marginTop:'30px',display:'flex',justifyContent:'space-between'}}>
                    <Button type='primary' style={{width:'40%'}}>注册</Button> 
                    <Button type='primary' style={{width:'40%'}}>返回登录</Button>    
                  </div>
                                                                   
                </div>
                <div className={styles.record}>
                    <p style={{color:'#fff'}}><a style={{color:'#fff'}} href="http://www.beian.miit.gov.cn" target="_Blank">苏ICP备0000000号</a>&nbsp;&nbsp;&nbsp;&nbsp;©2020 <FormattedMessage id="app.component.side_layout.copyright" defaultMessage="苏州曼捷科智能科技有限公司版权所有"/> V1.0.0</p>
                </div>
            </div>
        )
    }
}

const Register = Form.create()(RegisterForm)

export default Register

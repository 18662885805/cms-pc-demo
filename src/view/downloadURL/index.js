import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Form, Button, Spin, message, Modal, Row, Col, Input, Icon } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { MsgCode} from '@apis/account/index'
import { DownLoadShare } from '@apis/document/register'
import CommonUtil from '@utils/common'
import {GetTemporaryKey} from "@apis/account/index"
import Downloader from 'js-file-downloader';
import styles from '../login/index.css'

const FormItem = Form.Item

let _util = new CommonUtil()

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
      spinLoading: false,
      step:1,
      url:'',
      project_id:'',
      name:'',
      phone:'',
      code:'',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    var url = this.getQueryString('url');
    var project_id = this.getQueryString('project_id');
    this.setState({
      url,project_id
    })
  }


  getQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
 }

  handleSubmit(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl;
    const {code, phone,name,url,project_id} = this.state;
    var data = {
      name:name,
      phone:phone,
      code:code,
      url:url,
      project_id:project_id,
    }
    DownLoadShare(data).then(res=> {
      if(res&&res.data){
        this.downloadFile(res.data)
      }
    })   
  }
  
  downloadFile = (source) => {
    var cos = _util.getCos(null,GetTemporaryKey);
    const source_list = _util.switchToJson(source);
    if(!(source_list&&source_list.length)){
      return
    }
    const file = source_list[0];
    const key = file.url ? file.url : '';
    const name = file.name ? file.name : '文档管理';
    if(!key){
      return
    }
    var fileType = this.getFileType(name)
    var url = cos.getObjectUrl({
        Bucket: 'ecms-1256637595',
        Region: 'ap-shanghai',
        Key:key,
        Sign: true,
    }, function (err, data) {
        if(data && data.Url){
          new Downloader({ 
            url: data.Url,
            filename:name
          }).then(function () {
            message.success(`${name}下载成功`);
          }).catch(function (error) {
            message.warning(`${name}下载失败`)
          });
        }else{
          message.warning(`${name}下载失败`)
        }
    });
  }

  //获取文件类型
  getFileType = (name) => {
    const full_name_list = name.split('.');
    let fileType;
    if(full_name_list&&(full_name_list.length>1)){
      fileType = full_name_list.pop();
    }else{
      fileType = '';
    }
    return fileType
  }

  getMsgCode = () => {
    const { phone } = this.state;
    if (phone) {
      MsgCode({ type: 5, phone,text:'', uuid:'' }).then(res => {
        message.success('验证码发送成功');
        this.timeFun();
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
    this.setState({
      [field]: value
    });
  }

  nextStep = () => {
    this.setState({step:2})
  }

  render() {
    const { confirmLoading, formData, spinLoading, active,  canNextStep, seconds } = this.state
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
            <Form className={styles.login_form2}>
                <div className={styles.logo} style={{marginBottom:'20px'}}>
                    <img src={require('./logo.png')} style={{height:'100%'}}></img>
                </div>
                  <FormItem 
                    colon={false}
                    required={false}
                  >
                    {getFieldDecorator('name', {
                    })(
                      <Input 
                        autoComplete='off' maxLength={64} onChange={e => this.handleFormChange(e.target.value, "name")} placeholder={'请输入姓名'} />
                    )}
                  </FormItem>
                  <FormItem 
                    colon={false}
                    required={false}
                  >
                    {getFieldDecorator('phone', {
                    })(
                      <Input 
                        autoComplete='off' maxLength={11} onChange={e => this.handleFormChange(e.target.value, "phone")} placeholder={'请输入手机号'} />
                    )}
                  </FormItem>
                  <FormItem  
                    colon={false}
                    required={false}
                  >
                    <Button
                      type='primary'
                      block
                      style={{ width: '100%', verticalAlign: 'middle',align:'center' }}
                      disabled={active ? true : false}
                      onClick={() => this.getMsgCode()}>
                      {active ? `${seconds}秒` : '获取验证码'}
                    </Button>
                  </FormItem>
                  <FormItem 
                    colon={false}
                    required={false}
                  >
                    <Input placeholder={'请输入短信验证码'} onChange={e => this.handleFormChange(e.target.value, "code")} disabled={!canNextStep}/>
                  </FormItem>


                  <FormItem 
                    colon={false}
                    required={false}>
                    <Button
                      type='primary'
                      block
                      loading={confirmLoading}
                      disabled={!canNextStep}
                      style={{
                        width: '100%',
                        verticalAlign: 'middle',
                        align:'center',
                      }} 
                      onClick={this.handleSubmit}
                    >
                        下载
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

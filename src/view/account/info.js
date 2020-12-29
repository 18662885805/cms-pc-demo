import React from 'react'
import {
    Popconfirm,
    Divider,
    message,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    Button,
    Spin,
    Icon
} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import GoBackButton from '@component/go-back'
import CardDetail from '@component/CardDetail'
import {SwitchProject} from "@apis/system/project";
import {GetTemporaryKey} from "@apis/account/index"
import {getURL} from '@apis/system/url'
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas'
import addressJson from '@utils/address.json'

let _util = new CommonUtil()

@inject('menuState') @observer @injectIntl
class UserInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            img_url:'',
            mark:'',
            org_mark:'',
            Content_Project: '/#/pages/org_register/index/?project_id=',
            Content_Org: '/#/pages/person_register/index/?project_id=',
            url:'',
            codevisible1: false,
            codevisible2: false,
            city_name:"",
            project_name:'',
            org_name:'',
            org_id:'',
        }
    }

    componentDidMount() {
        const project_id = _util.getStorage("project_id");
        
        if(project_id){
            this.setState({project_id})
            SwitchProject({project_id: project_id}).then(res => {
                //项目码
                if(res.data){
                    const {mark,name,city} = res.data
                    this.setState({mark,project_name:name,city})
                    if(city){
                        var city_obj_list = [];
                        addressJson.forEach(a=>{
                            if(a.code == city){
                                city_obj_list.push(a)
                            }else{
                                a.children.forEach(aa => {
                                    //console.log('0316',aa.code,'---',city)
                                    if(aa.code == city){
                                        city_obj_list.push(aa)
                                    }else{
                                        aa.children.forEach(aaa => {
                                            if(aaa.code==city){
                                                city_obj_list.push(aaa)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        if(city_obj_list.length){
                            this.setState({city_name:city_obj_list[0].label})
                        }
                    }
                }
                //组织码
                if(res.data&&res.data.user_info){
                    this.setState({...res.data.user_info});
                    if(res.data.user_info.avatar){
                        this.renderImg(res.data.user_info.avatar);
                    }
                    if(res.data.user_info.org){
                        const {mark,id,company} = res.data.user_info.org;
                        this.setState({org_mark:mark,org_id:id,org_name:company});
                    }
                }
            })
        }
        getURL().then(res => {
            if(res.data&&res.data.url){
              this.setState({ 
                url:res.data.url
              })
            }else{
              message.warning('获取URL失败')
            }  
        })
        
    }

    renderImg = (str) => {
        const fileList = this.switchToJson(str);
        if(fileList&&fileList.length){
            const key = fileList[0]['url'];
            var that = this;
            var cos = _util.getCos(null,GetTemporaryKey);
            var url = cos.getObjectUrl({
                Bucket: 'ecms-1256637595',
                Region: 'ap-shanghai',
                Key:key,
                Sign: true,
            }, function (err, data) {
                if(data && data.Url){    
                    that.setState({img_url:data.Url});
                }
            });
        }       
    }

    switchToJson = (str) => {
        return eval('(' + str + ')');
    }

    openProjectModal = () => {
        this.setState({ 
          codevisible1: true,
        })
    }

    openOrgModal = () => {
        this.setState({ 
            codevisible2: true,
          })
    }

    hideOrgModal = () => {
        this.setState({ 
          codevisible2: false,
        })
    }

    hideProjectModal = () => {
        this.setState({ 
          codevisible1: false,
        })
    }

    ClickDownLoad=()=>{
        const targetDom = document.getElementById("share_p");
        html2canvas(targetDom,{
          allowTaint: false,
          useCORS: true,
        }).then(canvas => {
          const container = document.querySelector('#view_p')
          while (container.hasChildNodes()) {
              container.removeChild(container.firstChild)
          }
          let dataImg = new Image();
          dataImg.src = canvas.toDataURL('image/png');
          const alink = document.createElement("a");
          document.querySelector('#view_p').appendChild(dataImg)
          alink.href=dataImg.src;
          alink.download = "code.jpg";
          alink.click();
        })
    }

    ClickDownLoad2=()=>{
        const targetDom = document.getElementById("share_p_2");
        html2canvas(targetDom,{
          allowTaint: false,
          useCORS: true,
        }).then(canvas => {
          const container = document.querySelector('#view_o')
          while (container.hasChildNodes()) {
              container.removeChild(container.firstChild)
          }
          let dataImg = new Image();
          dataImg.src = canvas.toDataURL('image/png');
          const alink = document.createElement("a");
          document.querySelector('#view_o').appendChild(dataImg)
          alink.href=dataImg.src;
          alink.download = "code.jpg";
          alink.click();
        })
    }



    render() {
        const myadmin = _util.getStorage('myadmin');
        const userInfo = _util.getStorage("userInfo");
        const {phone,name} = userInfo;
        const userdata = _util.getStorage('userdata');
        const {
            role_name,url,Content_Project,project_id,
            codevisible1,project_name,mark,city_name,
            codevisible2,org_mark,org_name,org_id,Content_Org
        } = this.state;
        const tableData = [
            {
                text: '组织',
                value: userdata&&userdata.org ? userdata.org.company :''
            }, 
            {
                text: '姓名',
                value: _util.getOrNull(name ? name : '')
            },    
            {
                text: '手机号',
                value: _util.getOrNull(phone ? phone : '')
            },
           
          
            {
                text: '角色',
                value:  myadmin ? 'MJK管理员' :(role_name&&role_name.length ? role_name.join(',') :'组织管理员')
            }, 
            // {
            //     text: '头像',
            //     value: <img src={img_url} style={{height:'100px'}}></img>
            // }, 
            {
                text: '项目二维码',
                value: project_id&&project_id > 0 ?<Button onClick={() => this.openProjectModal()}>查看</Button>:''            
            },  
            {
                text: '组织二维码',
                value: org_mark ? <Button onClick={() => this.openOrgModal()}>查看</Button>:''  
            },  
        ]

        return (
            <div>
                <MyBreadcrumb/>
                <div className="content-wrapper content-no-table-wrapper">
                    <CardDetail title={'个人信息'} data={tableData}  />
                    <GoBackButton 
                        style={{display: 'block', margin: '0 auto'}} 
                        props={this.props}
                        noConfirm />
                    <Modal
                        title={`项目二维码`}
                        visible={codevisible1}
                        onCancel={() => this.hideProjectModal()}
                        width={600}
                        footer={null}
                    >
                        <div id="share_p">             
                            <a download id='pId'>
                                <div class="p_name">
                                    <h2 style={{margin:0}}>
                                    {project_name}
                                    </h2>
                                    <h3 style={{margin:0}}>
                                    {city_name}
                                    </h3>                               
                                </div>
                                <QRCode id='qrid' value={`${url}${Content_Project}${project_id}&mark=${mark}`} size={200} />
                                <div class="linearbg_p"></div>
                                <h2 style={{fontSize: '0.8rem', padding: '10px 10px'}}>扫一扫,加入项目</h2>
                            </a>
                            <Icon type="cloud-download" style={{position: 'absolute', right: '10%'}} onClick={this.ClickDownLoad} />
                            <a id="view_p"></a>
                        </div>

                    </Modal>
                    <Modal
                        title={`组织二维码`}
                        visible={codevisible2}
                        onCancel={() => this.hideOrgModal()}
                        width={600}
                        footer={null}
                    >
                        <div id="share_p_2">             
                            <a download id='pId'>
                                <div class="p_name">
                                    <h2 style={{margin:0}}>
                                    {org_name}
                                    </h2>
                                    <h3 style={{margin:0}}>
                                    {city_name}
                                    </h3>                               
                                </div>
                                <QRCode id='qrid' value={`${url}${Content_Org}${project_id}&org_mark=${org_mark}&mark=${mark}`} size={200} />
                                <div class="linearbg_p"></div>
                                <h2 style={{fontSize: '0.8rem', padding: '10px 10px'}}>扫一扫,加入组织</h2>
                            </a>
                            <Icon type="cloud-download" style={{position: 'absolute', right: '10%'}} onClick={this.ClickDownLoad} />
                            <a id="view_o"></a>
                        </div>

                    </Modal>
                </div>
            </div>
        )
    }
}


export default UserInfo

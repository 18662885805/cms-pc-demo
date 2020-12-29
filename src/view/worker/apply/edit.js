import React from 'react'
import {
    Form,
    Button,
    Modal,
    message,
    Input as AntInput,
    InputNumber,
    Select,
    DatePicker,
    Upload,
    Icon,
    Row,
    Col, Card,Tree,Spin
} from 'antd';
import moment from 'moment'
import debounce from 'lodash/debounce'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {staffOrgDetail,staffPut,staffOrgPut, staffDetail,staffSearch,workerType,SearchStaffCertificate} from '@apis/staff/index'
import {orgRoleInfo} from '@apis/system/role'
import GoBackButton from '@component/go-back'
import styles from '@view/common.css';
import inputDecorate from '@component/input-decorate'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import {inject} from "mobx-react";
import {GetTemporaryKey} from "@apis/account/index"
import ViewPwd from "@component/ViewPwd";

const FormItem = Form.Item
const confirm = Modal.confirm
const {TextArea} = AntInput
const {Option} = Select
const TreeNode = Tree.TreeNode;
const Input = inputDecorate(AntInput)


let _util = new CommonUtil()

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
    save_success: {
      id: 'app.message.goods_record.save_success',
      defaultMessage: '保存成功',
    },
    goods: {
      id: 'app.goods_record.text.goods',
      defaultMessage: '物品',
    },
    goods_name: {
      id: 'app.goods_record.check.goods_name',
      defaultMessage: '请输入物品名称.',
    },
    goodsname: {
      id: 'app.placeholder.goods_record.goodsname',
      defaultMessage: '物品名称',
    },
    number: {
      id: 'app.placeholder.goods_record.number',
      defaultMessage: '请输入物品数量.',
    },
    reqpurpose: {
      id: 'app.goods_record.check.purpose',
      defaultMessage: '请输入携出目的',
    },
    purpose: {
      id: 'app.placeholder.goods_record.purpose',
      defaultMessage: '携出目的',
    },
    factory: {
      id: 'app.goods_record.check.factory',
      defaultMessage: '请选择厂区',
    },
    need_return: {
      id: 'app.goods_record.check.need_return',
      defaultMessage: '请选择是否归还',
    },
    take_person: {
      id: 'app.goods_record.check.take_person',
      defaultMessage: '请输入携出单位/人',
    },
    reqphone: {
      id: 'app.goods_record.check.reqphone',
      defaultMessage: '请输入携出人手机',
    },
    select: {
      id: 'app.placeholder.select',
      defaultMessage: '-- 请选择 --',
    },
    nodata: {
      id: 'app.placeholder.nodata',
      defaultMessage: '暂无数据',
    },
    upload_success: {
      id: 'app.message.goods_record.upload_success',
      defaultMessage: '上传成功',
    },
      workOrder6: {
          id: "page.component.breadcrumb.workOrder6",
          defaultMessage: "请输入11位手机号码",
      },
      workOrder7: {
          id: "page.component.breadcrumb.workOrder7",
          defaultMessage: "请输入中文或拼音姓名",
      },
      workOrder8: {
          id: "page.component.breadcrumb.workOrder8",
          defaultMessage: "例如:RBAC/PRS",
      },
      workOrder9: {
          id: "page.component.breadcrumb.workOrder9",
          defaultMessage: "例如:0512-62920000",
      },
      revise_success: {
          id: "page.component.carryout.reviseSuccess",
          defaultMessage: "修改成功",
      },
  });

@inject('menuState')
@injectIntl
class WorkerEditForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            goods: [],
            fileList: [],
            certificateData:[{name:'',no:'',valid_date:'',file:'',fileList:[]}],
            name: null,
            phone: null,
            is_search:false,
            owner:'',
            work_type_list:[],
            trees: [],
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            role_list:[],
            name_disabled:false,
            cardShow:false,
            avatar:[],
            fileList: [],
            img_url:'',
            certificateLoading:false,
            initial_role_ids:[]
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        const project_id = _util.getStorage('project_id');
        const organization_id = _util.getStorage('userdata') ? _util.getStorage('userdata').org.id : '';
        this.setState({project_id})
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            this.setState({id:this.props.location.state.id,organization_id})
            staffOrgDetail(project_id,{id:this.props.location.state.id,organization_id:organization_id}).then(res => {
                if(res.data){
                    const {phone,name,id_card,avatar,staff_type,work_type_id,extra_desc,password,role_info} = res.data;
                    this.setState({phone,name,id_card,staff_type,work_type_id,extra_desc,avatar,password,initial_work_type_id:work_type_id})
                    if(role_info&&role_info.length){
                        const {initial_role_ids} = this.state;
                        role_info.forEach(role => {
                            initial_role_ids.push(role.id)
                        });
                        this.setState({initial_role_ids})
                    }
                    // if(avatar){
                    //     this.renderImg(avatar);
                    // }
                }
            })
            let userdata = _util.getStorage('userdata');
            //获取证件信息
            SearchStaffCertificate({project_id:project_id,staff_id:this.props.location.state.id}).then((res) => {
                if(res.data&&res.data.length){
                    this.setState({cardShow:true,certificateLoading:true})
                    this.renderCertificate(res.data);
                }
            })
            //获取职务
            if(userdata.org){
                this.setState({
                    org_id:userdata.org.id ? userdata.org.id: ''
                });    
                workerType({project_id:project_id,org_id:userdata.org.id}).then(res => {
                    if(res&&res.data){
                        this.setState({work_type_list:res.data})
                    }
                })
            }


            //获取权限
            let permission = _util.getStorage('orgpermission') ? _util.getStorage('orgpermission') : _util.getStorage('permission');
            this.setState({ trees: this.getTreeData(permission) });
            //获取组织信息
            
            if(userdata.org){
                this.setState({
                    org_name:userdata.org.company ? userdata.org.company : '',
                    org_id:userdata.org.id ? userdata.org.id: ''
                });
                //获取角色信息     
                if(userdata.org.org_type){
                    var org_type = userdata.org.org_type;
                    //获取角色信息     
                    orgRoleInfo({project_id:project_id,org_type_id:org_type.id ? org_type.id :''}).then(res => {
                        if(res&&res.data){
                            this.setState({role_list:res.data})
                        }
                    })
                }
            }
        }
    }

    //设置头像
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

    //设置证件信息
    renderCertificate = (source) => {
        source.forEach(c => {
            c.fileList = []
        });
        const certificateData = source;
        this.setState({certificateData:certificateData,initial_certificateData:certificateData})
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        certificateData.map((c, cIndex) => {
            if(c.file && _util.switchToJson(c.file).length){
                //转换前端格式    
                if(!_util.switchToJson(c.file).length){
                    this.setState({certificateLoading:false})
                    return
                } 
                if(!_util.switchToJson(c.file)[0]['url']){
                    this.setState({certificateLoading:false})
                    return
                }    
                const file_list = _util.switchToJson(c.file);         
                if(file_list&&file_list.length){
                    file_list.map((s,sIndex) => {              
                        const key = s.url;
                        var url = cos.getObjectUrl({
                            Bucket: 'ecms-1256637595',
                            Region: 'ap-shanghai',
                            Key:key,
                            Sign: true,
                        }, function (err, data) {
                            if(data && data.Url){   
                                //获取成功
                                const {fileList} = c; 
                                const newFile =  {url:data.Url,name:s.name,uid:-(sIndex+1),status: "done",cosKey:s.url};  
                                const new_list = [...fileList,newFile];
                                const {certificateData} = that.state;
                                certificateData[cIndex]['fileList'] = new_list;
                                that.setState({certificateData,certificateLoading:false,initial_certificateData:certificateData})
                            }else{
                                //获取失败
                                that.setState({certificateLoading:false})
                            }
                        });                             
                    });
                }else{
                    this.setState({certificateData,certificateLoading:false,initial_certificateData:certificateData})
                }   
            }else{
                this.setState({certificateLoading:false})
                c.fileList = []
            }  
        });
    }

    switchToJson = (str) => {
        return eval('(' + str + ')');
    }

    getTreeData = (object) => {
        var values = [];
        for (var property in object) {
            values.push(object[property]);
        }
        var keys = [];
        for (var property in object) {
            keys.push(property);
        }
        var treeData = [];
        keys.forEach((key, index) => {
            var keyObj = { id: 'module' + index, name: key, children: values[index] };
            treeData.push(keyObj)
        });
        return treeData
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys, info) => {
        const { trees } = this.state
        const parent = checkedKeys.filter(item => {
            for (let i = 0; i < trees.length; i++) {
                if (trees[i].id == item) {
                    return true
                }
            }
        })

        let result = []
        checkedKeys.map((value, index) => {
            if (parent.indexOf(value) < 0) {
                result.push(value)
            }
        })
        this.setState({ checkedKeys: result });
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect',selectedKeys, info);
        this.setState({ selectedKeys });
    }


    handleSubmit(e) {
        e.preventDefault();
        const { formatMessage } = this.props.intl;
        const {certificateData,checkedKeys,org_id,avatar,cardShow,id,phone,name,password} =this.state;
        const project_id =  _util.getStorage('project_id');
        var can_submit = true
        let certificateInfo = []
        if(cardShow){
            certificateData.map((c,index) => {
                const submitFileList = _util.setSourceList(c.fileList);
                const submitObject = {
                    name:c.name,
                    no:c.no,
                    valid_date:c.valid_date,
                    file:JSON.stringify(submitFileList)
                }
                certificateInfo.push(submitObject)
            })
        }
        if(certificateInfo&&certificateInfo.length){
            //需要传附件、验证
            certificateInfo.forEach((c,cIndex) => {
                if(c.file){
                    var c_file_list = _util.switchToJson(c.file);
                    if(c_file_list&&c_file_list.length){
                        
                    }else{
                        var c_name = c.name ? c.name :''
                        message.warning(`请上传${c_name}附件!`) 
                        can_submit = false                      
                    }
                }
            })
        }
        
        if(!can_submit){
            return 
        }
        
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const _this = this;
                _this.setState({
                    confirmLoading: true
                })
                values.phone = phone;
                values.name = name;
                values.organization_id=org_id;
                values.password = '';
                values.work_type_id = parseInt(values.work_type_id);
                values.role_ids = values.role_ids.length ? values.role_ids.join(',') :'';
                values.certificate = cardShow ? JSON.stringify(certificateInfo) : null;
                values.id = id;
                
                confirm({
                    title: '确认提交?',
                    content: '单击确认按钮后，将会提交数据',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        staffOrgPut(project_id,values).then((res) => {
                            message.success('添加成功');
                            _this.props.history.goBack()
                        })
                    },
                    onCancel() {
                    },
                })
                
            }
            this.setState({
                confirmLoading: false
            })
        })
    }

    handlePostInfo(){
        alert('保存数据操作')
        return
        const { formatMessage } = this.props.intl; 
    }

    handleUploadChange(info) {
        const { formatMessage } = this.props.intl
        let {fileList} = info
        const status = info.file.status
        if (status !== 'uploading') {
            // console.log(info.file, info.fileList)
        }
        if (status === 'done') {
            message.success(`${info.file.name}`+ formatMessage(messages.upload_success))    //上传成功.
        } else if (status === 'error') {
            message.error(`${info.file.name} ${info.file.response}.`)
        }
        this.setState({fileList})
    }

    avtarUpload = (info) => {
        const that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        cos.putObject({
          Bucket: 'ecms-1256637595',
          Region: 'ap-shanghai',
          Key:`source/${info.file.uid}`,
          Body: info.file,
          onProgress: function (progressData) {
              console.log('上传中', JSON.stringify(progressData));
          },
        }, function (err, data) {
            if(data&&data.Location){
              //上传成功
              message.success(`${info.file.name}上传成功`)
              var url = cos.getObjectUrl({
                Bucket: 'ecms-1256637595',
                Region: 'ap-shanghai',
                Key:`source/${info.file.uid}`,
                Sign: true,
              }, function (err, data) {
                  if(data && data.Url){
                    const newFile  = [{
                      uid: -1,
                      name: info.file.name,
                      status: 'done',
                      url:data.Url,
                      cosKey: `source/${info.file.uid}`,
                    }]
                    that.setState({avatar:newFile});
                  }
              });
            }else{
              message.warning('上传失败,请重试')
            }
        });
    }

    handlePostData = (value, field) => {
        const { certificateData } = this.state;
        certificateData[field] = value;
        this.setState({
          certificateData
        })
      };
  
      handleGoodsData = (value,field,index) => {
        const { certificateData } = this.state;
        certificateData[index][field] = value;
        this.setState({
          certificateData
        })
      };
  
      addForm = (i) => {
          console.log(i);
          const { certificateData} = this.state;
          if(!certificateData[i].name){
              message.error('请输入证件名称！');
              return false
          }
          if(!certificateData[i].no){
              message.error('请输入证件编号！');
              return false
          }
          if(!certificateData[i].valid_date){
              message.error('请输入证件有效期！');
              return false
          }
          if(!certificateData[i].file){
              message.error('请输入证件附件！');
              return false
          }
          certificateData.push({
              name:'',
              no:'',
              valid_date:'',
              file:'',
              fileList:[]
          });
          this.setState({certificateData})
        };
  
        removeForm = index => {
          const { certificateData } = this.state;
          certificateData.splice(index, 1);
          this.setState({certificateData})
        };
  
        handleUploadFile = (info, index) => {
            let {fileList} = info;
            const status = info.file.status;
            const { formatMessage } = this.props.intl;
            const {certificateData} = this.state;
            if (status === 'done') {
                message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)
            } else if (status === 'error') {
                message.error(`${info.file.name} ${info.file.response}.`)
            }
            certificateData[index].file = JSON.stringify(fileList);
            certificateData[index].fileList = fileList;
            this.setState({certificateData});
        };
  
        handleRemove = (info, index) => {
          const {certificateData} = this.state;
          const {fileList} = certificateData[index];
          const new_fileList = fileList.filter(file => {
            return file.uid != info.uid
          })
          certificateData[index].file = JSON.stringify(new_fileList);
          certificateData[index].fileList = new_fileList;
          this.setState({certificateData});
        }
  
        handlePhone = (e) => {   
              const project_id =  _util.getStorage('project_id');
              const {phone} = this.state;
              if(e.target.value && e.target.value.length === 11){
                  if(e.target.value != phone){
                      this.setState({phone:e.target.value});
                      staffSearch(project_id,{phone:e.target.value}).then(res => {
                          if(res.data&&res.data.id){
                              this.setState({
                                  owner:res.data.id,
                                  name:res.data.name,
                                  is_search:true,
                                  name_disabled:true
                              })
                          }
                      })
                  }else{
                      this.setState({phone:e.target.value,name_disabled:false});
                  }         
              }else{
                  //未满11位
                  this.setState({name_disabled:false})
              }
              
        }
  
        setPersonType = (value) => {
          this.setState({person_type:value})
      }
  
      renderTreeNodes = (data) => {
          if (data && data instanceof Array) {
            return data.map((item) => {
              if (item.children) {
                return (
                  <TreeNode title={item.name} key={item.id} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                  </TreeNode>
                );
              }
              return <TreeNode title={item.name} key={item.id} dataRef={item}/>;
            });
          }
        }
  
    showCard = () => {
        const{cardShow} = this.state;
        this.setState({cardShow:!cardShow})
    }
    onChangePwd = (e) => {
        this.setState({password: e.target.value})
    }

    setWorkType = (value) => {   
        this.setState({work_type_id:value});
        const {initial_work_type_id,initial_certificateData} = this.state;
        console.log('0323',value,initial_work_type_id,initial_certificateData)
        if(initial_work_type_id== value){
            this.setState({certificateData:initial_certificateData,cardShow:true})
        }else{
            const{work_type_list} = this.state;
            const current_work_type = work_type_list.find(item => {
                return item.id == value
            })
            
            if(current_work_type&&current_work_type.certificate){
                console.log('0322',current_work_type.certificate,current_work_type.certificate.split('{|}'))
                //certificateData:[{name:'',no:'',valid_date:'',file:'',fileList:[]}],
                const initial_certificate_list = current_work_type.certificate.split('{|}');
                if(initial_certificate_list&&initial_certificate_list.length){
                    var certificate_list =[];
                    initial_certificate_list.forEach(c => {
                        const certificate_obj = {
                            name:c,no:'',valid_date:'',file:'',fileList:[]
                        }
                        certificate_list.push(certificate_obj);
                        this.setState({certificateData:certificate_list,cardShow:true})
                    })
                }else{
                    this.setState({certificateData:[{name:'',no:'',valid_date:'',file:'',fileList:[]}],cardShow:false})
                }
            }else{
                this.setState({certificateData:[{name:'',no:'',valid_date:'',file:'',fileList:[]}],cardShow:false})
            }
        }   
    }

    

    render() {
        const {getFieldDecorator,getFieldValue} = this.props.form
        const {
            confirmLoading, work_type_list,name,certificateData,trees,certificateLoading,password,initial_role_ids,
            role_list,name_disabled,cardShow,avatar,img_url,phone,id_card,staff_type,work_type_id,extra_desc,email
        } = this.state;
        const { formatMessage } = this.props.intl;
        const formItemInfo={labelCol:{sm: {span:8},xs: {span: 24}},wrapperCol:{sm: {span: 15,offset:1},xs: {span: 24}}};
        const roleOption = role_list instanceof Array && role_list.length ? role_list.map(d =>
            <Option key={d.id} value={d.id}>{d.name}</Option>) : [];
        const props2 = {
            multiple: true,
            accept: "image/*",
            action: _util.getServerUrl(`/upload/auth/`),
            headers: {
                Authorization: 'JWT ' + _util.getStorage('token')
            },
        }


        const bread = [
            {
                name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
                url: '/'
            },
            {
                name: '入场管理'
            },
            {
                name: '红码申请',
                url: '/staff/org'
            },
            {
                name: '修改',
                url: '/staff/org/edit'
            },
          ]
        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper content-no-table-wrapper" id="onestop">
                    <Card
                        title={'个人信息'}
                        style={{marginBottom: '15px',padding:'0 15px'}} bordered={false}>
                        <Row gutter={24}>
                            <Col span={8} >
                                    <FormItem {...formItemInfo}
                                        required
                                        label={<FormattedMessage id="page.carry.cardOperation.telPhone" defaultMessage="手机号"/>}
                                    >
                                        {getFieldDecorator('phone', {
                                            initialValue: phone,                                                                                    
                                        })(
                                            <Input required maxLength={11} disabled={true}/>
                                        )}
                                    </FormItem>
                            </Col>
                            <Col span={8} >
                                    <FormItem {...formItemInfo}
                                        label={'姓名'}
                                        required
                                    >
                                        {getFieldDecorator('name', {
                                            initialValue: name,                                         
                                        })(<Input required placeholder={'姓名'}  disabled={true} />)}
                                    </FormItem>
                            </Col>
                            
                            <Col span={8} >
                                <FormItem {...formItemInfo}
                                    required
                                    label={'密码'}
                                >
                                    {getFieldDecorator('password', {
                                    })(
                                        <ViewPwd pwd={'******'} onChange={(e) => this.onChangePwd(e)} disabled={true}/>
                                    )}
                                </FormItem>
                            </Col>
                           

                            <Col span={8} >
                                    <FormItem {...formItemInfo}
                                        label={'身份证号码'}
                                        required
                                    >
                                        {getFieldDecorator('id_card', {
                                            initialValue: id_card,
                                        })(
                                            <Input required maxLength={18} disabled={true}/>
                                        )}
                                    </FormItem>
                            </Col>

                            <Col span={8} >
                                    <FormItem {...formItemInfo}
                                        label={'邮箱'}
                                    >
                                        {getFieldDecorator('email', {
                                            initialValue: email,
                                            rules: [{
                                                type: 'email', message: '邮箱格式不正确!',
                                            }]
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                            </Col>

                            <Col span={8} >
                                    <FormItem {...formItemInfo} label={'人员类型'} required>
                                        {getFieldDecorator('staff_type', {
                                                initialValue: staff_type,
                                                rules: [{required: true, message:"请选择"}],
                                            })(
                                                <Select
                                                    style={{width:'100%'}}
                                                    onChange={this.setPersonType}
                                                >
                                                        <Option value={1}>管理人员</Option>
                                                        <Option value={2}>安全人员</Option>
                                                        <Option value={3}>特殊工种</Option>
                                                        <Option value={4}>普工</Option>
                                                </Select>
                                            )}
                                    </FormItem>
                            </Col>

                            <Col span={8} >
                                <FormItem {...formItemInfo} label={'职务'} required>
                                    {getFieldDecorator('work_type_id', { 
                                            initialValue: work_type_id,                                          
                                            rules: [{required: true, message:"请选择"}],
                                        })(
                                            <Select
                                                style={{width:'100%'}}
                                                onChange={this.setWorkType}
                                            >
                                                 {work_type_list.length ? work_type_list.map(d => (
                                                    <Option key={d.id} value={d.id}>{d.name}</Option>
                                                )) : []}
                                            </Select>
                                        )}
                                </FormItem>
                            </Col>

                            <Col span={8}>
                            <FormItem {...formItemInfo}
                                label={'补充描述'}
                            >
                                {getFieldDecorator('extra_desc', {
                                    initialValue: extra_desc    
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            </Col>

                            <Col span={8}>
                            <FormItem {...formItemInfo}
                                label={'角色'}
                            >
                                {getFieldDecorator('role_ids', {
                                    initialValue: initial_role_ids,   
                                    rules: [
                                        {
                                        required: true,
                                        message: "请选择",         
                                        },
                                    ],
                                    })(
                                    <Select
                                        style={{width:'100%'}}
                                        showSearch
                                        mode="multiple"
                                        placeholder={formatMessage(messages.select)}
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {roleOption}
                                    </Select>
                                    )}
                            </FormItem>
                            </Col>

                        </Row>
                        {/* <Row gutter={24}>
                        <Col span={8}>
                            <FormItem {...formItemInfo}
                                label={'头像'}
                                required
                            >
                                <img src={img_url} style={{height:'100px',border:'1px solid #d3d3d3'}}></img>
                            </FormItem>
                        </Col>
                        </Row>
                        <Row gutter={24}>
                        <Col span={8}>
                            <FormItem {...formItemInfo}
                                label={'证件'}
                            >
                                 <Button type='primary' onClick={() => this.showCard()}>
                                    {
                                        cardShow ? '删除' : '新增'
                                    }
                                </Button>
                            </FormItem>
                        </Col>
                        </Row> */}
                        
                    </Card>

                    {cardShow && certificateData.map((p, pIndex) => {
                        console.log('0403',p.valid_date)
                        return <Spin spinning={certificateLoading}>
                        <Card
                            title={p.name}
                            style={{marginBottom: '15px'}}
                            bordered={true}
                            // actions={
                            //   certificateData.length === 1
                            //   ? [<span style={{padding:'0 40%'}} onClick={() => this.addForm(pIndex)}><Icon type="plus"/> 添加</span>]
                            //   : certificateData.length - 1 === pIndex
                            //     ? [<span style={{padding:'0 40%'}} onClick={() => this.addForm(pIndex)}><Icon type="plus"/> 添加</span>,
                            //        <span style={{padding:'0 40%'}} onClick={() => this.removeForm(pIndex)}><Icon type="delete"/> 删除</span>,
                            //       ]
                            //       : [<span style={{padding:'0 40%'}} onClick={() => this.removeForm(pIndex)}><Icon type="delete"/> 删除</span>]
                            // }
                        >
                            <Row gutter={24}>
                                {/* <Col span={8}>
                                    <FormItem {...formItemInfo} required label={'证件名称'}>
                                        <Input name='name'
                                            value={p.name}
                                            placeholder={"请输入名称"}
                                            onChange={e => this.handleGoodsData(e.target.value, 'name',pIndex)}/>
                                    </FormItem>
                                </Col> */}

                                <Col span={8}>
                                    <FormItem {...formItemInfo} required label={'证件编号'}>
                                        <Input name='no'
                                            value={p.no}
                                            placeholder={"请输入编号"}
                                            onChange={e => this.handleGoodsData(e.target.value, 'no',pIndex)}/>
                                    </FormItem>
                                </Col>

                                <Col span={8}>
                                    <FormItem {...formItemInfo} required label={'证件有效期'}>
                                        <DatePicker
                                            value={p.valid_date&&moment(p.valid_date)}
                                            disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                                            format="YYYY-MM-DD" style={{width: '100%'}}
                                            onChange={val => this.handleGoodsData(val.format('YYYY-MM-DD'), 'valid_date',pIndex)}
                                        />
                                    </FormItem>
                                </Col> 
                                <Col span={8}>
                                    <FormItem {...formItemInfo} required label={'附件'}>
                                        <Upload
                                            {...props2}
                                            beforeUpload={_util.beforeUploadFile}
                                            onChange={info => this.handleUploadFile(info, pIndex)}
                                            //customRequest={info => this.handleUploadFile(info, pIndex)}
                                            //onRemove={info => this.handleRemove(info, pIndex)}
                                            fileList={p.fileList}
                                        >
                                            <Button><Icon type="upload"/>Upload</Button>
                                        </Upload>
                                    </FormItem>
                                </Col>                               
                            </Row>
                        </Card>
                        </Spin>
                    })}
                 

                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button type="primary" htmlType="submit" loading={confirmLoading}
                                style={{marginRight: '10px'}}
                                onClick={this.handleSubmit}
                        >
                            <FormattedMessage id="app.button.save" defaultMessage="保存" />
                        </Button>
                        <GoBackButton props={this.props}/>
                    </div>

                </div>
            </div>
        )
    }
}

const WorkerEdit = Form.create()(WorkerEditForm)

export default injectIntl(WorkerEdit)

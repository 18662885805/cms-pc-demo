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
    Col, Card,Tree
} from 'antd'
import moment from "moment/moment"
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {staffPost,staffSearch,workerType,staffOrgPost} from '@apis/staff/index'
import {orgRoleInfo} from '@apis/system/role'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import inputDecorate from '@component/input-decorate'
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
class WorkerAddForm extends React.Component {
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
            edit_img_url:'',
            password:'',
            id_card:'',
            id_num:'',
            disabledIdNum:false
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUploadChange = this.handleUploadChange.bind(this)
    }

    componentDidMount() {
        const project_id =  _util.getStorage('project_id') ?  _util.getStorage('project_id') : null;
        this.setState({project_id:project_id});

        //获取职务
        let userdata = _util.getStorage('userdata');
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
        console.log('0306',treeData)
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
        const {certificateData,is_search,owner,checkedKeys,org_id,cardShow,disabledIdNum} =this.state;
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

                var postData;
                if(is_search){
                    //搜索用户
                    postData = {
                        organization_id:org_id,
                        is_search:true,
                        owner:owner,
                        phone:values.phone,
                        name:values.name,
                        password:'',
                        id_card:disabledIdNum ? '' :values.id_card,
                        email:values.email,
                        staff_type:values.staff_type,
                        work_type_id:parseInt(values.work_type_id),
                        extra_desc:values.extra_desc ? values.extra_desc : '',
                        role_ids:values.role_ids.length ? values.role_ids.join(',') :'',
                        certificate : cardShow ? JSON.stringify(certificateInfo) : null,
                    }
                }else{
                    postData = {
                        organization_id:org_id,
                        is_search:false,
                        phone:values.phone,
                        name:values.name,
                        password:values.password,
                        id_card:values.id_card,
                        email:values.email,
                        staff_type:values.staff_type,
                        work_type_id:parseInt(values.work_type_id),
                        extra_desc:values.extra_desc ? values.extra_desc : '',
                        role_ids:values.role_ids.length ? values.role_ids.join(',') :'',
                        certificate : cardShow ? JSON.stringify(certificateInfo) : null,
                    }
                }
                console.log('0415',postData)
                confirm({
                    title: '确认提交?',
                    content: '单击确认按钮后，将会提交数据',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        staffOrgPost(project_id,postData).then((res) => {
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
                this.setState({phone:e.target.value});
                staffSearch(project_id,{phone:e.target.value}).then(res => {
                    if(res.data&&res.data.id){
                        //系统内用户
                        this.setState({
                            owner:res.data.id,
                            name:res.data.name,
                            password:'mjk_user_2020',
                            id_num:res.data.id_num ? res.data.id_num : '',
                            is_search:true,
                            name_disabled:true
                        });
                        if(res.data.id_num){
                            this.setState({disabledIdNum:true})
                        }
                    }else{
                        //非系统内用户
                        this.setState({
                            owner:'',
                            name:'',
                            password:'',
                            id_num:'',
                            is_search:false,
                            name_disabled:false,
                            disabledIdNum:false,
                        });
                    }
                })   
            }else{
                //未满11位
                this.setState({name_disabled:false,disabledIdNum:false,name:'',password:'',id_num:''})
            }   
        }



    setPersonType = (value) => {
        this.setState({person_type:value})
    }

    setWorkType = (value) => {
        this.setState({work_type_id:value});
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
                    that.setState({edit_img_url:data.Url});
                }
            });
        }       
    }

    switchToJson = (str) => {
        return eval('(' + str + ')');
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



      //测试用
      showCardInfo = () => {
          console.log('0305',this.state.checkedKeys)
      }


      //测试用
      testPost=()=>{
        const fileList = [{name:'image-1',url:'https://cn.bing.com/th?id=OIP.MXTJTrOYA9uX8evI556cEAHaEo&pid=Api&rs=1'}]
        const certificateInfo = [{
            name:'证件1',
            no:'123456',
            valid_date:'2050-01-01',
            file:JSON.stringify(fileList)
        }]
        const data = {
            name:'李老师',
            extra_desc:'123',
            phone:'13883882020',
            id_card:'320682199311112020',
            staff_type:4,
            is_search:false,
            organization_id:this.state.org_id,
            work_type_id:1,
            certificate:JSON.stringify(certificateInfo),
            owner:null,
            permission:'1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,109'

        }
        staffPost(_util.getStorage('project_id'),data)
    }

    render() {
        const {confirmLoading, work_type_list,name,certificateData,trees,
        role_list,name_disabled,cardShow,avatar,edit_img_url,password,id_card,id_num,disabledIdNum} = this.state
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const { formatMessage } = this.props.intl


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
                name: '新增',
                url: '/staff/org/add'
            },
          ]

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                {/* <Button onClick={()=>this.testPost()}>post</Button> */}
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
                                        rules: [{required: true, message:"请输入手机号"},
                                        ],
                                    })(
                                        <Input required maxLength={11} onChange={this.handlePhone}/>
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
                                        rules: [{required: true, message:"请输入姓名"}],
                                    })(<Input required  onChange={e => this.handlePostData(e.target.value, 'name')} disabled={name_disabled} />)}
                                </FormItem>
                            </Col>
                            
                            <Col span={8} >
                                <FormItem {...formItemInfo}
                                    required
                                    label={'密码'}
                                >
                                    {getFieldDecorator('password', {
                                        initialValue:password,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入密码"
                                            },
                                            {
                                                pattern: /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7e]{8,16}$/,
                                                message: "密码要包含字母、数字，8-16位"
                                            }
                                        ],
                                    })(
                                        <ViewPwd pwd={password} onChange={(e) => this.onChangePwd(e)} disabled={name_disabled}/>
                                    )}
                                </FormItem>
                            </Col>

                            

                            <Col span={8} >
                                    <FormItem {...formItemInfo}
                                        label={'身份证号码'}
                                        required
                                    >
                                        {getFieldDecorator('id_card', {
                                            //rules: [{required: true, message:"请输入身份证号码"}],
                                            initialValue:id_num,
                                        })(
                                            //<Input maxLength={18} disabled={name_disabled}/>
                                            <Input maxLength={18} disabled={disabledIdNum}/>
                                        )}
                                    </FormItem>
                            </Col>

                            <Col span={8} >
                                    <FormItem {...formItemInfo}
                                        label={'邮箱'}
                                    >
                                        {getFieldDecorator('email', {
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
                                            rules: [{required: true, message:"请选择"}],
                                        })(
                                            <Select
                                                style={{width:'100%'}}
                                                onChange={this.setWorkType}
                                            >
                                                 {work_type_list.length ? work_type_list.map(d => (
                                                    <Option key={d.id}>{d.name}</Option>
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
                                    
                                })(
                                    <Input required/>
                                )}
                            </FormItem>
                            </Col>

                            <Col span={8}>
                            <FormItem {...formItemInfo}
                                label={'角色'}
                            >
                                {getFieldDecorator('role_ids', {
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
                                {
                                    name_disabled?
                                    <img src={edit_img_url} style={{height:'100px',background:'#ffffff',padding:'5px'}}></img>:
                                    <Upload
                                        fileList={avatar}
                                        beforeUpload={_util.beforeUpload}
                                        customRequest={this.avtarUpload}
                                        accept='image/*'
                                        listType="picture-card"
                                    >
                                        {
                                        avatar&&avatar.length ? 
                                        <Button>
                                            <Icon type="upload" />修改
                                        </Button>:
                                        <Button>
                                            <Icon type="upload" />上传
                                        </Button>
                                        }
                                    
                                    </Upload>
                                }
                                
                            </FormItem>
                        </Col>
                        </Row> */}
                        {/* <Row gutter={24}>
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

                    {cardShow&&certificateData.map((p, pIndex) => {
                        return <Card
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

const WorkerAdd = Form.create()(WorkerAddForm)

export default WorkerAdd

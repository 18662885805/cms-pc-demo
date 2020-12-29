import React from "react";
import {
  Form, Button, Modal, Spin, message, Upload, Icon, Row, Col, Checkbox, Tree,Tooltip, Input
} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import debounce from "lodash/debounce";
import MyBreadcrumb from "@component/bread-crumb";
import ViewPwd from "@component/ViewPwd";
import {SearchUserPhone} from "@apis/system/user/index";
import {organizePost} from "@apis/system/organize";
import {getDepartment} from "@apis/system/department";
import {turnstileInfo} from '@apis/system/organize';
import GoBackButton from "@component/go-back";
import {orgtypeInfo} from "@apis/system/orgtype";
import { SearchProjectUser } from "@apis/system/user";
import {SwitchProject} from "@apis/system/project";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import COS from 'cos-js-sdk-v5'
import {GetTemporaryKey} from "@apis/account/index"
const FormItem = Form.Item;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class organizeAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      fileList: [],
      fileList2:[],
      previewVisible: false,
      previewImage: "",
      src: "",
      receive_msg: "1,2",
      hideDepartment: true,
      cropPics: [],
      roleList: [],
      
      treeData: [],
      typeoption: [],
      checkedKeys: [],
      is_active: 1,
      search_data: [],
      search_data1: [],
      search_data3:[],
      turnstile_list:[],
      edit_img_url:'',
      edit_source:null,
      edit_avatar:null,
      owner:'',
      name:'',
      phone:'',
      password:'',
      id_num:'',
      is_search: false,
      disabledIdNum:false
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadPreview = this.handleUploadPreview.bind(this);
    this.handleUploadCancel = this.handleUploadCancel.bind(this);
    this.imageuploaded = this.imageuploaded.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }

  componentDidMount() {

    orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
      this.setState({typeoption: res.data})
    })

    turnstileInfo({project_id: _util.getStorage('project_id') }).then(res => {
      if(res.data&&res.data.length){
        this.setState({turnstile_list:res.data});
        const search_data3 = res.data.map(user => ({
          name: user.name,
          id: user.id
        }));
        this.setState({ search_data3 });
      }
    })

    SwitchProject({project_id: _util.getStorage('project_id') }).then(res => {
      if(res.data&&res.data.permission){
        console.log('123',res.data)
        let data = []
        let permission =res.data.permission;
        console.log('123',permission)
        let arr0 = Object.keys(permission)
        let arr1 = Object.values(permission)
        if (permission instanceof Object) {
            arr0.map((d, index) => {
                data.push({ id: '', name: arr0[index], children: arr1[index] })
            })
        } else {
            permission.forEach(a => {
                data.push(getValue(a));
            });
        }
        let targetArr = []
        const getValue = (obj) => {
          const tempObj = {};
          tempObj.title = obj.name;
          tempObj.key = obj.id;
          if (obj.children&&obj.children.length) {
            tempObj.children = [];
            obj.children.map(o => {
              tempObj.children.push(getValue(o))
            });
          }
          return tempObj;
        };
        data.forEach(a => {
          targetArr.push(getValue(a));
        }); 
        this.setState({
          treeData: targetArr
        });
      }
    })

    this.setState({
      spinLoading: false
    });

    this.props.menuState.changeMenuCurrentUrl("/system/org");
    this.props.menuState.changeMenuOpenKeys("/system");
  }


  showPermission = (id) => {
    const {typeoption} = this.state;
    const currentPermission = typeoption.find(item => {
      return item.id == id
    })
    if(currentPermission.permission&&currentPermission.permission.length){
      this.setState({checkedKeys:currentPermission.permission})
    }else{
      this.setState({checkedKeys:[]})
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


  handleSubmit(e) {
    e.preventDefault();
    const {fileList2,disabledIdNum} = this.state;
    if(!fileList2.length){
      message.warning('请上传营业执照或资质证明')
      return
    }
    
    this.setState({
      confirmLoading: true
    });
    
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {owner,edit_source,is_search,name,phone,password,fileList2,checkedKeys} = this.state;
        //const permission = this.checkPermissionKeys(checkedKeys).join(",");
        let _this = this;
        const {formatMessage} = this.props.intl;
        //设置附件列表(腾讯云cos)
        let source = _util.setSourceList(fileList2)
        let data = {}
        const turnstile_list = values.turnstile;
        if(is_search){
          data = {
            owner: owner,
            org_type: values.org_type,
            company: values.company,
            address: values.address,
            desc: values.desc,
            phone: phone,
            id_num:disabledIdNum ? '' :values.id_num,
            //permission: permission,
            worker_approve: values.worker_approve ? values.worker_approve.join(',') : null,
            // application_approve: values.application_approve ? values.application_approve.join(',') : null,
            source: edit_source ? edit_source: JSON.stringify(source),
            is_search: true,
            status: values.status == 1 ? true : false,
            project_id: _util.getStorage('project_id'),
            turnstile:turnstile_list&&turnstile_list.length ? turnstile_list.join(',') :''
          }
        }else{
          data = {
            org_type: values.org_type,
            name: values.name,
            password: password,
            company: values.company,
            address: values.address,
            desc: values.desc,
            phone: phone,
            id_num:values.id_num,
            //permission: permission,
            worker_approve: values.worker_approve ? values.worker_approve.join(',') : null,
            // application_approve: values.application_approve ? values.application_approve.join(',') : null,
            source: edit_source ? edit_source: JSON.stringify(source),
            is_search: false,
            status: values.status == 1 ? true : false,
            project_id: _util.getStorage('project_id'),
            turnstile:turnstile_list&&turnstile_list.length ? turnstile_list.join(',') :''
          }
        }
        //console.log('0415',data)
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            values.project = _util.getStorage('project_id')
            organizePost(data).then((res) => {
              message.success(formatMessage(translation.saved));
              _this.props.history.goBack();
            });
          },
          onCancel() {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  }

  checkPermissionKeys = (list) => {
    var r = /^\d+$/;
    var checkedKeys_list = [];
    if(list&&list.length){
      list.forEach(k => {
        if(r.test(k)){
          checkedKeys_list.push(parseInt(k))
        }
      })
    }
    return checkedKeys_list;
  }


  setSourceList = (fileList) => {
    let source = []
    if (fileList instanceof Array) {
      fileList.forEach((value) => {
        source.push({name:value.name,url:value.cosKey})
      })
    }
    return source
  }

  handleUploadPreview(file) {
    _util.handleUploadPreview(file, this);
  }

  handleUploadCancel() {
    _util.handleUploadCancel(this);
  }

  imageuploaded(res) {
    if (res.errcode == 0) {
      this.setState({
        src: res.data.src
      });
    }
  }

  handleCostCenter = option => {
    const {formData} = this.state;
    const {setFieldsValue} = this.props.form;

    formData.content.forEach(con => {
      if (con.field === "department_id") {
        con.options = [];

        setFieldsValue({department_id: undefined});
      }
    });

    getDepartment(option).then(res => {
      console.log(res);
      const {results} = res.data;
      if (Array.isArray(results) && results.length > 0) {
        if (Array.isArray(formData.content) && formData.content.length > 0) {
          formData.content.forEach(con => {
            if (con.field === "department_id") {
              con.options = results;
              // setFieldsValue({
              //     department: ''
              // })
            }
          });
        }
      }
      this.setState({
        hideDepartment: false,
        formData
      });
    });
  }

  handleCrop = url => {
    this.setState({
      cropPics: url
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onChangePwd = (e) => {
    this.setState({password: e.target.value})
  }

  onCheck = (checkedKeys) => {
    this.setState({checkedKeys});
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  }

  renderTreeNodes = (data) => {
    if (data && data instanceof Array) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} />;
      });
    }
  }

  fetchUser = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ search_data: [], fetching: true, search_info: "", search_id: null });
    SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const search_data = res.data.map(user => ({
        name: user.name,
        org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id
      }));
      this.setState({ search_data, fetching: false });
    });
  }

  fetchUser1 = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ search_data1: [], fetching: true, search_info: "", search_id: null });
    SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const search_data1 = res.data.map(user => ({
        name: user.name,
        org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id
      }));
      this.setState({ search_data1, fetching: false });
    });
  }

  changeForm = (e, field) => {
    this.setState({phone: e.target.value});
    const _this = this;
    if (e.target.value.length === 11) {
      SearchUserPhone({
        phone: e.target.value,
        is_contractor: this.state.is_contractor,
        project_id: _util.getStorage('project_id')
      }).then((res) => {
        if(Object.keys(res.data).length > 0){
          this.setState({
            is_search: true,
            owner:res.data.id,
            name:res.data.name,
            id_num:res.data.id_num ? res.data.id_num :''
          });
          if(res.data.id_num){
            this.setState({disabledIdNum:true})
          }
        }else{
          this.setState({
            is_search: false,
            name:''
          })
        }
      });
    }
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

  fileUpload  = (info) => {
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
          var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:`source/${info.file.uid}`,
            Sign: true,
          }, function (err, data) {
              if(data && data.Url){
                const {fileList} = that.state;
                const newFile  = {
                  uid: -(fileList&&fileList.length ? fileList.length + 1 :1),
                  name: info.file.name,
                  status: 'done',
                  url:data.Url,
                  cosKey: `source/${info.file.uid}`,
                };
                const new_fileList = [...fileList,newFile]
                that.setState({fileList:new_fileList});
                console.log('0315',new_fileList)
              }
          });
        }
    });
  }

  handleRemove = (info) => {
    const {fileList} = this.state;
    const new_fileList = fileList.filter(file => {
      return file.uid != info.uid
    })
    this.setState({fileList:new_fileList})
  }

  //普通上传
  orgUpload = (info) => {
    let {fileList} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;
    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }

    this.setState({fileList2: fileList})
}

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, fileList, fileList2,avatar,previewImage, previewVisible, data, user, role, roleList, password, turnstile_list,search_data3,
      treeData, name, email, typeoption, owner, org_type, permission, search_data, search_data1, worker_approve, application_approve,is_search,
      edit_img_url,id_num,disabledIdNum
    } = this.state;
    const {formatMessage} = this.props.intl;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };

  let formData = []
  formData = [
    {
      field: "company",
      type: "char",
      icon: "",
      value: data ? data.company : null,
      text: "组织名称",
      placeholder: "组织名称",
      rules: [{required: true, message: "请输入组织名称"}, {max: 64, message: "最大长度不能超过64字节"}]
    },
    {
      field: "org_type",
      type: "select",
      icon: "",
      value: org_type ? org_type.id : null,
      text: "组织类型",
      placeholder: "组织类型",
      options: typeoption,
      rules: [{required: true, message: "请选择组织类型"}],
      onSelect: (value) => this.showPermission(value),
    },
    {
      field: "address",
      type: "char",
      icon: "",
      value: data ? data.address : null,
      text: "组织地址",
      placeholder: "组织地址",
      rules: [{required: true, message: "请输入组织地址"}]
    },
    {
      field: "desc",
      type: "textarea",
      icon: "",
      value: data ? data.desc : null,
      text: "组织描述",
      placeholder: "组织描述",
      rules: [{max: 64, message: "最大长度不能超过64字节"}]
    },

    // {
    //   field: "application_approve",
    //   type: "search",
    //   mode: "multiple",
    //   icon: "",
    //   value: data && data.application_approve ? data.application_approve.map(d => {return d.id+''}) : null,
    //   text: "绿码申请审批人",
    //   placeholder: "根据姓名、手机搜索项目用户",
    //   options: search_data1,
    //   fetchUser:  (value) => this.fetchUser1(value),
    //   rules: []
    // },
    {
      field: "turnstile",
      type: "select",
      mode: "multiple",
      icon: "",
      value: data && data.turnstile ? data.turnstile.map(d => {return d.id+''}) : null,
      text: "入场闸机",
      placeholder: "选择闸机",
      options: search_data3,
      rules: [{required: true, message: "请选择闸机"}]
    },
    {
      field: "status",
      type: "select",
      icon: "",
      value: this.state.is_active === 1 ? '1' : '2',
      text: "状态",
      placeholder: "状态",
      options: [
        {id: '1', name: '激活'},
        {id: '2', name: '禁用'}
      ],
      rules: [{required: true, message: "请选择是否启用"}]
    },
    ]
      
    const _this = this;
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="app.page.bread.system" defaultMessage="系统管理"/>
      },
      {
          name: <FormattedMessage id="app.page.bread.orgapply" defaultMessage="组织申请"/>,
          url: '/system/org'
      },
      {
          name: <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ]

    const props2 = {
      multiple: true,
      accept: "image/*",
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    }

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem  {...formItemLayout}
                  label={
                    <span>
                      手机号&nbsp;
                      <Tooltip title="组织注册成功后,使用此手机号登录系统,对该组织进行相关操作">
                        <Icon type="info-circle" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('phone', {
                        rules: [{required: true, message:'请输入手机号'}],
                    })(
                        <Input maxLength={11} placeholder={'手机号'}  onChange={e => this.changeForm(e, "phone")} />
                    )}   
                </FormItem> 
                <FormItem  {...formItemLayout}
                  label={'姓名'}
                >
                   {getFieldDecorator('name', {
                        rules: [{required: true, message:'请输入姓名'}],
                        initialValue: name ? name : null,
                    })(
                        <Input maxLength={64} placeholder={'姓名'} disabled={is_search}/>
                    )}   
                </FormItem>                           
                {/* <FormItem  {...formItemLayout}
                      label={'头像'}
                      required
                  >
                    {
                      is_search ?
                      <img src={edit_img_url} style={{height:'100px',background:'#ffffff',padding:'5px'}}></img>
                      :
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
                      
                  </FormItem> */}
                <FormItem  {...formItemLayout}
                  label={'密码'}
                >
                   {getFieldDecorator('password', {
                        rules: [
                          {   
                              required: is_search?false: true, 
                              message:'请输入密码'
                          },
                          {
                              pattern: /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7e]{8,16}$/,
                              message: "密码要包含字母、数字，8-16位"
                          }
                        ],
                    })(
                      <ViewPwd  placeholder={"请输入密码"} disabled={is_search} pwd={password} onChange={(e) => this.onChangePwd(e)}/>
                    )}   
                </FormItem>
                <FormItem  {...formItemLayout}
                  label={'身份证'}
                  required
                >
                   {getFieldDecorator('id_num', {
                        //rules: [{required: true, message:'请输入身份证号'}],
                        initialValue: id_num ? id_num : null,
                    })(
                        <Input maxLength={18} placeholder={'身份证号'} disabled={disabledIdNum}/>
                    )}   
                </FormItem>    
              {
                formData ? formData.map((item, index) => {
                  return (

                    item.type === "password" || item.type === "switch" || item.type === "checkbox" ?
                      <FormItem
                        key={index}
                        label={item.text}
                        {...formItemLayout}
                      >
                        {
                          item.value
                            ?
                            getFieldDecorator(item.field, {
                              initialValue: item.value,
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                            :
                            getFieldDecorator(item.field, {
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                        }
                      </FormItem>
                      :
                      item.type === "upload" ?
                      <FormItem
                        required
                        key={index}
                        label={item.text}
                        extra={item.extra}
                        {...formItemLayout}
                      >
                        {
                          item.value
                            ?
                            getFieldDecorator(item.field, {
                              initialValue: item.value,
                              // rules: 
                              // item.rules
                            })(
                              _util.switchItem(item, this)
                            )
                            :
                            getFieldDecorator(item.field, {
                              // rules: 
                              // item.rules
                            })(
                              _util.switchItem(item, this)
                            )
                        }
                      </FormItem>
                      :
                      <FormItem
                        key={index}
                        label={item.text=='手机号'?
                            <span>
                              手机号&nbsp;
                              <Tooltip title="组织注册成功后,使用此手机号登录系统,对该组织进行相关操作">
                                <Icon type="info-circle" />
                              </Tooltip>
                            </span>
                            :item.text}
                        extra={item.extra}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {
                          item.value
                            ?
                            getFieldDecorator(item.field, {
                              initialValue: item.value,
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                            :
                            getFieldDecorator(item.field, {
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                        }
                      </FormItem>
                  );
                }) : null
              }
              
              <FormItem  {...formItemLayout}
                  label={'附件'}
                  extra={'请上传营业执照或资质证明，图片格式jpg jpeg png'}     
                  required
              >
                  <Upload
                    {...props2}
                    fileList={fileList2}
                    beforeUpload={_util.beforeUpload} 
                    onChange={this.orgUpload}
                    //customRequest={this.fileUpload}
                    accept='image/*'
                    //onRemove={this.handleRemove}
                  >
                  <Button>
                      <Icon type="upload" />上传
                  </Button>
                  </Upload>
              </FormItem>


              

              <Row>
                <Col md={8} sm={24} offset={12}>
                  <div style={{width: "100%", marginBottom: "20px"}}>
                    <Button type="primary" htmlType="submit" loading={confirmLoading}
                            style={{marginRight: "10px"}}>
                      <FormattedMessage id="app.button.save" defaultMessage="保存"/>
                    </Button>
                    <GoBackButton
                      props={this.props}/>
                  </div>
                </Col>
              </Row>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const OrganizeAdd = Form.create()(organizeAddForm);

export default OrganizeAdd;

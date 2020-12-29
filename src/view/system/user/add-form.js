import React from "react";
import {
  Form,
  Button,
  Modal,
  Spin,
  message,
  Upload,
  Icon,
  Row,
  Col,
  Checkbox
} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {userForm, userPost, userDetail, userPut, SearchUserPhone} from "@apis/system/user/index";
import {getDepartment} from "@apis/system/department";
import {orgRoleInfo} from "@apis/system/role";
import GoBackButton from "@component/go-back";
import UploadPicWithCrop from "@component/UploadPicWithCrop";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class UserAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      fileList: [],
      previewVisible: false,
      previewImage: "",
      src: "",
      receive_msg: "1,2",
      hideDepartment: true,
      cropPics: [],
      roleList: [],
      is_search: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadChange = this.handleUploadChange.bind(this);
    this.handleUploadPreview = this.handleUploadPreview.bind(this);
    this.handleUploadCancel = this.handleUploadCancel.bind(this);
    this.imageuploaded = this.imageuploaded.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    if (id) {
      userDetail(id, {project_id: _util.getStorage('project_id')}).then((res) => {
        const {role, user} = res.data
        this.setState({
          role,
          user,
          data: res.data
        });
      });
    }


    this.setState({
      spinLoading: false
    });

    if(this.props.location.state && this.props.location.state.type){
      const { type } = this.props.location.state
      this.setState({
        is_contractor: type === 1 ? false : true,
        spinLoading: false
      });
    }

    this.props.menuState.changeMenuCurrentUrl("/system/user");
    this.props.menuState.changeMenuOpenKeys("/system");
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {is_contractor, fileList} = this.state;

        // values.avatar = cropPics.length ? cropPics[0] : "";
        let _this = this;
        const {formatMessage} = this.props.intl;
        let source = []
        if (fileList instanceof Array) {
          fileList.forEach((value) => {
            source.push({ name: value.name, url: value.response.url })
          })
        }
        let data = {}
        if(this.state.is_search == false){
          data = {
            name: values.name,
            password: values.password,
            company: values.company,
            address: values.address,
            desc: values.desc,
            phone: values.phone,
            email: values.email,
            role: values.role ? values.role.join(',') : null,
            is_contractor: is_contractor,
            source: JSON.stringify(source),
            is_search: this.state.is_search,
            project_id: _util.getStorage('project_id')
          }
        }else{
          data = {
            name: values.name,
            company: values.company,
            address: values.address,
            desc: values.desc,
            phone: values.phone,
            email: values.email,
            role: values.role ? values.role.join(',') : null,
            is_contractor: is_contractor,
            source: JSON.stringify(source),
            is_search: this.state.is_search,
            project_id: _util.getStorage('project_id')
          }
        }
        
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            // values.role = values.role ? values.role.join(",") : null;
            values.project = _util.getStorage('project_id')
            // values.receive_msg = values.receive_msg && values.receive_msg.join(",");
            const { id } = _this.props.match.params;
            if (id) {
              userPut(id, data).then(res => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
              return;
            }
            userPost(data).then((res) => {
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

  // handleUploadChange = ({fileList}) => {
  //   this.setState({fileList});
  //   console.log(this.state.fileList);
  // }

  handleUploadChange = (info) => {
    let { fileList } = info;

    const status = info.file.status;
    const { formatMessage } = this.props.intl;
    if (status !== "uploading") {
      // console.log(info.file, info.fileList)
    }
    if (status === "done") {
      message.success(`${info.file.name} ${formatMessage(translation.uploaded)}.`); //上传成功
    } else if (status === "error") {
      message.error(`${info.file.name} ${info.file.response.msg}.`);
    }
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = _util.getImageUrl(file.response.url);
      }
      return file;
    });
    this.setState({ fileList });
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

  changeForm = (e, field) => {
    const _this = this;
    console.log(e.target.value.length)
    if (e.target.value.length === 11) {
      SearchUserPhone({
        phone: e.target.value,
        is_contractor: this.state.is_contractor,
        project_id: _util.getStorage('project_id')
      }).then((res) => {
        if(Object.keys(res.data).length > 0){
          this.setState({
            is_search: true,
            password: 'abcdef12345',
            ...res.data
          })
        }
      });
    }
    // this.setState({
    //   [e.target.name]: e.target.value
    // });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, fileList, previewImage, previewVisible, data, user, role, roleList, password, is_contractor, name, email} = this.state;
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

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10}
      }
    };

    let arr = Array.isArray(role) && role.map(d => {
      return d.id
    })

    const props2 = {
      multiple: true,
      accept: "image/*",
      action: _util.getServerUrl(`/upload/contractor/?project_id=${_util.getStorage("project_id")}`),
      headers: {
        Authorization: "JWT " + _util.getStorage("token")
      },
      data: {
        // site_id: _util.getStorage("site"),
        project_id: _util.getStorage("project_id")
      },
      className: "upload-list-inline"
    };

    let pwd = []
    const {id} = this.props.match.params;
    if(!id){
      pwd = [
        {
          field: "password",
          type: "password",
          icon: "",
          value: user ? user.password : password,
          text: "密码",
          placeholder: "密码",
          onChange: (e) => this.onChange(e),
          rules: [
            {
              required: true,
              message: "请输入密码"
            },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[\x20-\x7e]{10,16}$/,
              message: "密码要包含字母、数字，10-16位"
            }
          ],
          disabled: this.state.is_search
        }
      ]
    }

    let formData = []

    if(is_contractor === false){
      formData = [
        // {
        //   field: "group",
        //   type: "char",
        //   icon: "",
        //   value: user ? user.group : null,
        //   text: "组织",
        //   placeholder: "组织",
        //   rules: []
        //   // rules: [{required: true, message: "请输入工号"}, {max: 64, message: "最大长度不能超过64字节"}]
        // },
        {
          field: "phone",
          type: "char",
          icon: "",
          value: user ? user.phone : null,
          text: "手机号",
          placeholder: "手机号",
          onChange: e => this.changeForm(e, "phone"),
          rules: [{required: true, message: "请输入手机"}, {max: 11, message: "手机格式错误"}]
        },
        ...pwd,
        {
          field: "name",
          type: "char",
          icon: "",
          value: user ? user.name : name,
          text: "姓名",
          placeholder: "姓名",
          rules: [{required: true, message: "请输入姓名"}, {max: 64, message: "最大长度不能超过64字节"}],
          disabled: this.state.is_search
        },
        // {
        //   field: "email",
        //   type: "char",
        //   icon: "",
        //   value: user ? user.email : email,
        //   text: "邮箱",
        //   placeholder: "邮箱",
        //   rules: [{required: true, message: "请输入邮箱"}, {max: 128, message: "最大长度不能超过128字节"}, {type: "email", message: "邮箱格式错误"}],
        //   disabled: this.state.is_search
        // },
        // {
        //   field: "role",
        //   type: "select",
        //   mode: "multiple",
        //   icon: "",
        //   value: role ? Array.isArray(role) && role.map(d => d.id) : null,
        //   text: "角色",
        //   // extra: "注：新权限在管理员审批通过后， 用户重新登录本账号方可生效。",
        //   placeholder: "角色",
        //   options: roleList,
        //   rules: [{required: true, message: "请选择角色"}],
        // }
      ];
    }

    if(is_contractor === true){
      formData = [
        {
          field: "phone",
          type: "char",
          icon: "",
          value: user ? user.phone : null,
          text: "手机号",
          placeholder: "手机号",
          onChange: e => this.changeForm(e, "phone"),
          rules: [{required: true, message: "请输入手机"}, {min: 11, message: "手机格式错误"}, {max: 11, message: "手机格式错误"}]
        },
        {
          field: "company",
          type: "char",
          icon: "",
          value: user ? user.company : null,
          text: "公司名称",
          placeholder: "公司名称（需跟营业执照上的一致）",
          rules: [{required: true, message: "请输入公司名称"}, {max: 64, message: "最大长度不能超过64字节"}]
        },
        ...pwd,
        {
          field: "address",
          type: "char",
          icon: "",
          value: user ? user.address : null,
          text: "公司地址",
          placeholder: "公司地址",
          rules: [{required: true, message: "请输入公司地址"}]
        },
        {
          field: "name",
          type: "char",
          icon: "",
          value: user ? user.name : name,
          text: "联系人",
          placeholder: "联系人",
          rules: [{required: true, message: "请输入联系人"}, {max: 64, message: "最大长度不能超过64字节"}],
          disabled: this.state.is_search
        },
        {
          field: "email",
          type: "char",
          icon: "",
          value: user ? user.email : email,
          text: "邮箱",
          placeholder: "邮箱",
          rules: [{required: true, message: "请输入邮箱"}, {max: 128, message: "最大长度不能超过128字节"}, {type: "email", message: "邮箱格式错误"}],
          disabled: this.state.is_search
        },
        {
          field: "desc",
          type: "char",
          icon: "",
          value: user ? user.desc : null,
          text: "公司描述",
          placeholder: "公司描述",
          rules: []
        },
        {
          field: "role",
          type: "select",
          mode: "multiple",
          icon: "",
          value: role ? role.map(d => d.id) : null,
          text: "角色",
          // extra: "注：新权限在管理员审批通过后， 用户重新登录本账号方可生效。",
          placeholder: "角色",
          options: roleList,
          rules: [{required: true, message: "请选择角色"}],
        },
        // {
        //   field: "status",
        //   type: "select",
        //   // mode: "multiple",
        //   icon: "",
        //   value: user ? user.status : null,
        //   text: "身份",
        //   placeholder: "身份",
        //   options: [
        //     {id: 1, name: "个人"},
        //     // {id: 2, name: "承包商", disabled: true},
        //     {id: 2, name: "组织"},
        //     {id: 3, name: "组织员工"}
        //   ],
        //   rules: [{required: true, message: "请选择身份"}],
        //   // disabled: true
        // },
        {
          field: "file",
          type: "upload",
          icon: "",
          value: null,
          text: "附件",
          extra: '请上传营业执照或资质证明，图片格式jpg、jpeg、png',
          placeholder: "",
          maxlength: 5,
          beforeUpload: (file, files) => _util.beforeUpload(file),
          onChange: this.handleUploadChange,
          props: props2,
          fileList: fileList
        }
      ];
    }

    const _this = this;
    const uploadButton = (
      <div>
        <Icon type='plus'/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const props = {
      action: _util.getServerUrl("/upload/avatar/"),
      headers: {
        Authorization: "JWT " + _util.getStorage("token")
      },
      data: {
        site_id: _util.getStorage("site")
      },
      listType: "picture",
      defaultFileList: [...fileList],
      className: "upload-list-inline"
    };

    // const { id } = this.props.match.params
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="app.page.bread.system" defaultMessage="系统管理"/>
      },
      {
          name: <FormattedMessage id="app.page.bread.user" defaultMessage="用户管理"/>,
          url: '/system/user'
      },
      {
          name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

            <FormItem label="组织" {...formItemLayout}>
                <span>{data ? data.org : null}</span>    
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
                              rules: item.rules
                            })(
                              _util.switchItem(item, this)
                            )
                            :
                            getFieldDecorator(item.field, {
                              rules: item.rules
                            })(
                              _util.switchItem(item, this)
                            )
                        }
                      </FormItem>
                      :
                      <FormItem
                        key={index}
                        label={item.text}
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

              {/* <FormItem {...formItemLayout}
                        label={<FormattedMessage id="page.system.reason.head" defaultMessage="上传头像"/>}
                        extra={<FormattedMessage id="app.userinfo.size_format"
                                                 defaultMessage="图片大小限制3M，格式限制jpg jpeg png gif bmp"/>}>
                <UploadPicWithCrop
                  onChange={this.handleCrop}
                  prePics={ this.state.cropPics}/>

              </FormItem> */}
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

const UserAdd = Form.create()(UserAddForm);

export default UserAdd;

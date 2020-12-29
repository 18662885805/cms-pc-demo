import React from 'react'
import {
    Form,
    Button,
    Modal,
    Spin,
    Tree,
    Select,
    message,
    DatePicker,
    Input,
    Row,
    Col,
    Dropdown,
    Menu,
    Icon,
    Switch,
    Upload,
} from 'antd'

import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { project, projectPost, projectPermission, userSearch } from '@apis/myadmin/project';
import GoBackButton from '@component/go-back'
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import debounce from 'lodash/debounce'
import moment from 'moment'
import values from 'postcss-modules-values';
import COS from 'cos-js-sdk-v5'
import {GetTemporaryKey} from "@apis/account/index"
const FormItem = Form.Item
const confirm = Modal.confirm
const { TreeNode } = Tree;
const { Option } = Select;
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
    projectname: {
        id: 'app.page.admin.projectname',
        defaultMessage: '项目名称',
    },
});

@injectIntl
class ProjectAddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            formData: {},
            spinLoading: true,
            trees: [],
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            personList: [],
            fetching: false,
            admin_user: [],
            name_langs: 'zh-Hans',
            desc_langs: 'zh-Hans',
            data: {},
            copyChecked: false,
            projectList: [],
            fileList: null,
            name: null,
            name_en: null,
            desc: null,
            desc_en: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    componentDidMount() {
        projectPermission().then((res) => {
            this.setState({ trees: this.getTreeData(res.data) });
        });
        project().then((res) => {
            this.setState({ projectList: res.data.results });
        })
        this.setState({
            spinLoading: false,
        })
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



    handleSubmit(e) {
        e.preventDefault()
        this.setState({
            confirmLoading: true
        })
        const { admin_user, checkedKeys, data, fileList, copyChecked } = this.state;
        //设置附件列表
        let source = []
        if (fileList instanceof Array) {
            fileList.forEach((value) => {
                source.push({ name: value.name, url: value.response.url })
            })
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this
                const { formatMessage } = this.props.intl;
                const testFile = [{name:'project',url:'https://cn.bing.com/th?id=OIP.7vmkStoJbpisFoRScpTXdAHaHa&pid=Api&rs=1'}]
                const data = {
                    name: values.name ? values.name : '',
                    name_en: values.name_en ? values.name_en : '',
                    desc: values.desc ? values.desc : '',
                    desc_en: values.desc_en ? values.desc_en : '',
                    start_day: values.start_day ? moment(values.start_day).format("YYYY-MM-DD") : "",
                    end_day: values.end_day ? moment(values.end_day).format("YYYY-MM-DD") : "",
                    contact_person: values.contact_person ? values.contact_person : '',
                    contact_email: values.contact_email ? values.contact_email : '',
                    contact_phone: values.contact_phone ? values.contact_phone : '',
                    permission: checkedKeys.filter(k => k && k.indexOf("module") < 0).join(','),
                    admin_user: admin_user.join(','),
                    province: values.location[0],
                    city: values.location[1],
                    area: values.location[2],
                    address: values.address,
                    // is_copy_role: copyChecked,
                    // copy_project_id: values.copy_project_id ? values.copy_project_id.key : '',
                    source:JSON.stringify(testFile)
                    //source: source.length && source instanceof Array ? JSON.stringify(source) : ''
                };
                confirm({
                    title: '确认提交?',
                    content: '单击确认按钮后，将会提交数据',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        projectPost(data).then((res) => {
                            message.success('保存成功')
                            //_this.props.history.goBack()
                            window.location.replace('/myadmin/project')
                        })
                    },
                    onCancel() {
                    },
                })
            } else {
                console.log('0219', err)
            }
            this.setState({
                confirmLoading: false
            })
        })
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
        this.setState({ selectedKeys });
    }

    renderTreeNodes = data => {
        if (data && data.length) {
            return data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode title={item.name} key={item.id} dataRef={item}>
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.id} title={item.name} dataRef={item} />;
            });
        }
    }


    fetchUser = (value) => {
        this.setState({ personList: [], fetching: true });
        userSearch({ q: value }).then((res) => {
            if (res.data) {
                this.setState({ personList: res.data, fetching: false });
            }
        })
    };

    handleChange = value => {
        this.setState({
            personList: [],
            fetching: false,
        })
        var userList = [];
        if (value && value.length) {
            value.map((item) => {
                userList.push(item.key)
            });
            this.setState({
                admin_user: userList
            });
        }
    };

    changeNameLang = ({ key }) => {
        this.setState({ name_langs: key })
    }

    changeDescLang = ({ key }) => {
        this.setState({ desc_langs: key })
    }

    setCopyProject = (value) => {
        this.setState({ copyChecked: value })
    }

    handleUploadChange = (info) => {
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
            console.log(err, data);
            if(data&&data.Location){
              var url = cos.getObjectUrl({
                Bucket: 'ecms-1256637595',
                Region: 'ap-shanghai',
                Key:`source/${info.file.uid}`,
                Sign: true,
              }, function (err, data) {
                  console.log(err || data && data.Url);
                  if(data && data.Url){
                    const newFile  = [{
                      uid: -1,
                      name: info.file.name,
                      status: 'done',
                      url: `source/${info.file.uid}`,
                      response: {
                        content: {
                          results: {
                            url: `source/${info.file.uid}`
                          }
                        }
                      }
                    }]
                    that.setState({fileList:newFile});
                    console.log('fileList',fileList)
                  }
              });
            }
        });
        // const { formatMessage } = this.props.intl
        // let { fileList } = info
        // const status = info.file.status
        // if (status !== 'uploading') {
        // }
        // if (status === 'done') {
        //     message.success(`${info.file.name} ${formatMessage(messages.upload_success)}.`)     //上传成功
        // } else if (status === 'error') {
        //     message.error(`${info.file.name} ${info.file.response}.`)
        // }
        // fileList = fileList.map(file => {
        //     if (file.response) {
        //         // Component will show file.url as link
        //         file.url = _util.getImageUrl(file.response.url);
        //     }
        //     return file;
        // });
        // this.setState({ fileList })
    }

    handleAddData = (value, field) => {
        this.setState({
            field: value
        })
    }

    testLoad = () => {
        window.location.replace('/myadmin/project')
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const { confirmLoading, spinLoading, trees, data, personList, projectList, fetching, name_langs, desc_langs, copyChecked,
            name, name_en, desc, desc_en } = this.state
        const _this = this;


        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 10 }
            }
        };
        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 10 }
            }
        };

        const formData = [
            {
                field: "project",
                type: "char",
                icon: "",
                value: null,
                text: "项目名称",
                disabled: true,
                placeholder: formatMessage(messages.projectname),
                rules: [{ required: true, message: formatMessage(messages.name) }]
            },
            {
                field: "desc",
                type: "textarea",
                icon: "",
                value: null,
                text: "项目描述",
                disabled: true,
                placeholder: formatMessage(messages.desc),
                rules: [{ required: true, message: formatMessage(messages.desc) }]
            },
            {
                field: "location",
                type: "cascader",
                icon: "",
                // value: data ? [data.province, data.city, data.area] : null,
                value: null,
                text: "省市区",
                placeholder: formatMessage(messages.location),
                options: treeData,
                rules: [{ required: true, message: formatMessage(messages.location) }]
            },
            {
                field: "address",
                type: "char",
                icon: "",
                value: data ? data.address : null,
                text: "详细地址",
                placeholder: formatMessage(messages.address),
                rules: [{ required: true, message: formatMessage(messages.address) }]
            },
            {
                field: "banner",
                type: "banner",
                icon: "",
                value: null,
                text: "轮播图",
                placeholder: ''
            },
        ]

        const props2 = {
            multiple: true,
            accept: "image/*",
            action: _util.getServerUrl(`/upload/project/`),
            headers: {
                Authorization: 'JWT ' + _util.getStorage('token')
            },
            listType: 'picture',
            className: 'upload-list-inline',
        }

        return (
            <div>
                <div className="content-wrapper content-no-table-wrapper">
                    <Spin spinning={spinLoading}>
                        <Form onSubmit={this.handleSubmit}>

                            {
                                formData ? formData.map((item, index) => {
                                    return (

                                        item.type === "project" ?
                                            <FormItem label="项目名" {...formItemLayout}>
                                                <Row gutter={8}>
                                                    <Col span={22}>
                                                        {
                                                            this.state.menu_langs == 'zh-Hans' ?
                                                                getFieldDecorator('name', {
                                                                    rules: [{ required: true, message: "请输入项目名", whitespace: true }],
                                                                })(
                                                                    <Input placeholder="项目名" />
                                                                )
                                                                :
                                                                getFieldDecorator('name_en', {
                                                                    rules: [{ required: true, message: "Please Enter Menu Name!", whitespace: true }],
                                                                })(
                                                                    <Input placeholder="Menu Name" />
                                                                )
                                                        }
                                                    </Col>
                                                    <Col span={2}>
                                                        <ul>
                                                            <li style={{ marginRight: 0 }}>
                                                                <Dropdown overlay={
                                                                    <Menu
                                                                        selectedKeys={[this.state.menu_langs]}
                                                                        onClick={this.changeEditorLang}>
                                                                        <Menu.Item className="lang" key='zh-Hans'>
                                                                            <img src={require('../../../assets/locales/china.png')} />
                                                                            <span className="lang-txt">CN</span>
                                                                        </Menu.Item>
                                                                        <Menu.Item className="lang" key='en'>
                                                                            <img src={require('../../../assets/locales/uk.png')} />
                                                                            <span className="lang-txt">EN</span>
                                                                        </Menu.Item>
                                                                    </Menu>
                                                                }>
                                                                    <div className="current" style={{ cursor: 'pointer' }}>
                                                                        {
                                                                            this.state.menu_langs == 'zh-Hans' ?
                                                                                <img src={require('../../../assets/locales/china.png')} />
                                                                                :
                                                                                <img src={require('../../../assets/locales/uk.png')} />
                                                                        }
                                                                        {
                                                                            this.state.menu_langs == 'zh-Hans' ?
                                                                                <span className="lang-txt">CN</span>
                                                                                :
                                                                                <span className="lang-txt">EN</span>
                                                                        }

                                                                        <Icon type="down" style={{ font: 'normal normal normal 14px/1 FontAwesome', color: '#D5D6E2' }} />

                                                                    </div>

                                                                </Dropdown>
                                                            </li>
                                                        </ul>
                                                    </Col>
                                                </Row>
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

                        </Form>
                    </Spin>
                </div>
            </div>
        )
    }
}

const ProjectAdd = Form.create()(ProjectAddForm)

export default ProjectAdd

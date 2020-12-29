import React from 'react'
import {
    Form, Button, Modal, Spin, Tree, Select, message, DatePicker, Input, Row, Col, Dropdown, Menu, Icon, Switch, Upload, Cascader
} from 'antd'
import {inject, observer} from "mobx-react/index";
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { project, projectPost, projectPermission, userSearch } from '@apis/myadmin/project';
import GoBackButton from '@component/go-back'
import {GetTemporaryKey} from "@apis/account/index"
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import debounce from 'lodash/debounce'
import moment from 'moment'
import values from 'postcss-modules-values';
import address from '@utils/address.json'
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
        defaultMessage: '请上传订单、营业执照或资质证明，图片格式jpg jpeg png',
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

@inject("menuState") @injectIntl
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
            desc_en: null,
            options: [],
            treeData: [],
            fileList:[],
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
        const getValue = (obj) => {
            const tempObj = {};
            tempObj.label = obj.label;
            tempObj.value = obj.code;
            tempObj.key = obj.code;
            if (obj.children) {
                tempObj.children = [];
                obj.children.map(o => {
                    tempObj.children.push(getValue(o))
                });
            }
            return tempObj;
        };
        const targetArr = [];
        address.forEach(a => {
            targetArr.push(getValue(a));
        });

        this.setState({
            treeData: targetArr,
            spinLoading: false
        });
        this.props.menuState.changeMenuCurrentUrl("/myadmin/project");
        this.props.menuState.changeMenuOpenKeys("/myadmin");
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
        let source = _util.setSourceList(fileList);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this
                const { formatMessage } = this.props.intl;
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
                    source: source.length && source instanceof Array ? JSON.stringify(source) : '',
                    is_active: !values.is_active
                };
                confirm({
                    title: '确认提交?',
                    content: '单击确认按钮后，将会提交数据',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        projectPost(data).then((res) => {
                            message.success('保存成功')
                            _this.props.history.goBack()
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
        const { formatMessage } = this.props.intl
        let { fileList } = info
        const status = info.file.status
        if (status !== 'uploading') {
        }
        if (status === 'done') {
            message.success(`${info.file.name} ${formatMessage(messages.upload_success)}.`)     //上传成功
        } else if (status === 'error') {
            message.error(`${info.file.name} ${info.file.response}.`)
        }
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });
        this.setState({ fileList })
    }

    //腾讯云cos上传文件
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
              message.success(`${info.file.name}上传成功`)
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
                  }
              });
            }
        });
    }

    //删除已上传文件  腾讯云cos
    handleRemove = (info) => {
        const {fileList} = this.state;
        const new_fileList = fileList.filter(file => {
        return file.uid != info.uid
        })
        this.setState({fileList:new_fileList})
    }

    //普通上传
    projectUpload = (info) => {
        let {fileList} = info;
        const status = info.file.status;
        const { formatMessage } = this.props.intl;
        if (status === 'done') {
            message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)
        } else if (status === 'error') {
            message.error(`${info.file.name} ${info.file.response}.`)
        }
        this.setState({fileList: fileList})
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
        const { confirmLoading, spinLoading, trees, fileList,data, personList, projectList, fetching, name_langs, desc_langs, copyChecked,
            name, name_en, desc, desc_en, treeData } = this.state
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

        const props2 = {
            multiple: true,
            accept: "image/*",
            action: _util.getServerUrl(`/upload/auth/`),
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
                            <FormItem label={'项目名'} {...formItemLayout}>
                                <Row gutter={12}>
                                    <Col span={20}>
                                        {
                                            name_langs == 'zh-Hans' ?
                                                <div>
                                                    {getFieldDecorator('name', {
                                                        //initialValue: data.name ? data.name : null,
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入项目名称',
                                                        }],
                                                    })(<Input placeholder="项目名称" />)}
                                                </div>
                                                :
                                                <div>
                                                    {getFieldDecorator('name_en', {
                                                        //initialValue: data.name_en ? data.name_en : null,
                                                        rules: [{
                                                            required: true,
                                                            message: 'Pls input project name',
                                                        }],
                                                    })(<Input placeholder="Project Name" />)}
                                                </div>
                                        }
                                    </Col>
                                    <Col span={4}>
                                        <ul>
                                            <li style={{ marginRight: 0 }}>
                                                <Dropdown overlay={
                                                    <Menu
                                                        selectedKeys={[name_langs]}
                                                        onClick={this.changeNameLang}>
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
                                                    <div className="current" style={{
                                                        lineHeight: '30px',
                                                        height: 30,
                                                        cursor: 'pointer',
                                                        boxSizing: 'borderBox',
                                                    }}>
                                                        {
                                                            name_langs == 'zh-Hans' ?
                                                                <img src={require('../../../assets/locales/china.png')} />
                                                                :
                                                                <img src={require('../../../assets/locales/uk.png')} />
                                                        }
                                                        {
                                                            name_langs == 'zh-Hans' ?
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

                            <FormItem label={'描述'} {...formItemLayout}>
                                <Row gutter={12}>
                                    <Col span={20}>
                                        {
                                            desc_langs == 'zh-Hans' ?
                                                <div>
                                                    {getFieldDecorator('desc', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入项目描述',
                                                        }],
                                                    })(<Input placeholder="项目描述" />)}
                                                </div>
                                                :
                                                <div>
                                                    {getFieldDecorator('desc_en', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入项目描述',
                                                        }],
                                                    })(<Input placeholder="Project description" />)}
                                                </div>
                                        }
                                    </Col>
                                    <Col span={4}>
                                        <ul>
                                            <li style={{ marginRight: 0 }}>
                                                <Dropdown overlay={
                                                    <Menu
                                                        selectedKeys={[desc_langs]}
                                                        onClick={this.changeDescLang}>
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
                                                    <div className="current" style={{
                                                        lineHeight: '30px',
                                                        height: 30,
                                                        cursor: 'pointer',
                                                        boxSizing: 'borderBox',
                                                    }}>
                                                        {
                                                            desc_langs == 'zh-Hans' ?
                                                                <img src={require('../../../assets/locales/china.png')} />
                                                                :
                                                                <img src={require('../../../assets/locales/uk.png')} />
                                                        }
                                                        {
                                                            desc_langs == 'zh-Hans' ?
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
                            <FormItem label={'权限配置'} {...formItemLayout} required>
                                {getFieldDecorator('permission', {
                                    // rules: [{
                                    //     required: true,
                                    //     message: '请设置权限！',      
                                    // }],
                                })(
                                    <Tree
                                        checkable
                                        expandedKeys={this.state.expandedKeys}
                                        autoExpandParent={this.state.autoExpandParent}
                                        onCheck={this.onCheck}
                                        checkedKeys={this.state.checkedKeys}
                                        onExpand={this.onExpand}
                                        onSelect={this.onSelect}
                                        selectedKeys={this.state.selectedKeys}
                                    >
                                        {this.renderTreeNodes(trees)}
                                    </Tree>
                                )}
                            </FormItem>

                            {/* <FormItem label={'项目管理员'} {...formItemLayout} required>
                                <Select
                                    mode="multiple"
                                    labelInValue
                                    placeholder="选择用户"
                                    notFoundContent={fetching ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={this.fetchUser}
                                    onChange={this.handleChange}
                                    style={{ width: '100%' }}
                                >
                                    {personList.map(d => (
                                        <Option key={d.id}>{d.name}</Option>
                                    ))}
                                </Select>
                            </FormItem> */}

                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="page.admin.management.start_time" defaultMessage="开始时间" />}>

                                {getFieldDecorator("start_day", {
                                    // initialValue: moment(new Date(), "YYYY-MM-DD").add(1, "days"),
                                    rules: [{ required: true, message: '请选择项目开始时间' }]
                                })(
                                    <DatePicker
                                        // placeholder={formatMessage(messages.select_start_date)} //请选择开始日期
                                        placeholder="请选择项目开始时间"
                                        //disabledDate={(current) => moment(current).isBefore(moment(new Date()).format("YYYY-MM-DD"))}
                                        format="YYYY-MM-DD" style={{ width: "100%" }}
                                    />
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="page.admin.management.end_time" defaultMessage="结束时间" />}>

                                {getFieldDecorator("end_day", {
                                    // initialValue: moment(new Date(), "YYYY-MM-DD").add(1, "days"),
                                    rules: [{ required: true, message: '请选择项目结束时间' }]
                                })(
                                    <DatePicker
                                        // placeholder={formatMessage(messages.select_end_date)} //请选择结束日期
                                        placeholder="请选择项目结束时间"
                                        disabledDate={(current) => moment(current).isBefore(moment(new Date()).add(1, "days").format("YYYY-MM-DD"))}
                                        format="YYYY-MM-DD" style={{ width: "100%" }}
                                    />
                                )}

                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="page.admin.management.location" defaultMessage="省市区" />}>

                                {getFieldDecorator("location", {
                                    // initialValue: moment(new Date(), "YYYY-MM-DD").add(1, "days"),
                                    rules: [{ required: true, message: '请选择省市区' }]
                                })(
                                    <Cascader
                                        options={treeData}
                                        fieldNames={
                                            treeData.length > 0 && treeData[0].hasOwnProperty("id") && treeData[0].hasOwnProperty("name")
                                                ?
                                                {
                                                    label: "name",
                                                    value: "id"
                                                }
                                                :
                                                {
                                                    label: "label",
                                                    value: "value",
                                                    children: "children"
                                                }
                                        }
                                        // onChange={(value, selectedOptions) => {console.log(value)}}
                                        placeholder={'省市区'}
                                        onChange={_this.onLocationChange}
                                    />
                                )}

                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'地点描述'}>

                                {getFieldDecorator("address", {
                                    rules: [{ required: true, message: '请输入项目地址' }]
                                })(
                                    <Input placeholder={'请输入项目地址'} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'联系人'}>

                                {getFieldDecorator("contact_person", {
                                    rules: [{ required: true, message: '请输入联系人' }]
                                })(
                                    <Input placeholder={'请输入联系人'} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'联系人手机'}>

                                {getFieldDecorator("contact_phone", {
                                    rules: [{ required: true, message: '请输入联系人手机号' }]
                                })(
                                    <Input placeholder={'请输入联系人手机号'} maxLength={11} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'联系人邮箱'}>

                                {getFieldDecorator("contact_email", {
                                    rules: [{
                                        type: 'email', message: '邮箱格式不正确!',
                                    }, { required: true, message: '请输入联系人邮箱' }]
                                })(
                                    <Input placeholder={'请输入联系人邮箱'} />
                                )}
                            </FormItem>
                            <FormItem 
                                 {...formItemLayout}
                                label={'是否归档'}
                                required={true}
                            >
                                {getFieldDecorator("is_active")(
                                    <Switch defaultChecked={false}  />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label='附件'
                                extra={formatMessage(messages.upload_placeholder)}     //请上传营业执照或资质证明，图片格式jpg jpeg png
                            >
                                <Upload
                                    {...props2}
                                    fileList={fileList}
                                    beforeUpload={_util.beforeUpload} 
                                    onChange={this.projectUpload}
                                    //customRequest={this.fileUpload}
                                    //onRemove={this.handleRemove}
                                    accept='image/*'
                                >
                                <Button>
                                    <Icon type="upload" />上传
                                </Button>
                                </Upload>
                            </FormItem>

                            {/* <FormItem
                                {...formItemLayout}
                                label={'拷贝角色'}
                            >
                                {getFieldDecorator("is_copy_role")(
                                    <Switch defaultChecked={false} onChange={this.setCopyProject} checked={copyChecked} />
                                )}
                            </FormItem>
                            {
                                copyChecked ?
                                    <FormItem
                                        label={'拷贝项目'} {...formItemLayout}
                                    >
                                        {getFieldDecorator("copy_project_id", {
                                            rules: [{ required: true, message: '请选择拷贝项目' }]
                                        })(
                                            <Select
                                                labelInValue
                                                placeholder="选择项目"
                                            >
                                                {projectList && projectList.length ? projectList.map(p => (
                                                    <Option key={p.id} value={p.id}>{p.name}</Option>
                                                )) : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                    : null
                            } */}

                            <FormItem {...submitFormLayout}>
                                <div style={{ width: '100%', marginBottom: '20px' }}>
                                    <Button type="primary" htmlType="submit" loading={confirmLoading}
                                        style={{ marginRight: '10px' }}>
                                        <FormattedMessage id="app.button.save" defaultMessage="保存" />
                                    </Button>
                                    <GoBackButton props={this.props} />
                                </div>
                            </FormItem>
                        </Form>
                    </Spin>
                </div>
            </div>
        )
    }
}

const ProjectAdd = Form.create()(ProjectAddForm)

export default ProjectAdd

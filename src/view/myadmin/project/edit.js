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
    Cascader
} from 'antd'

import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { project, projectPut, projectPermission, userSearch, projectDetail } from '@apis/myadmin/project';
import GoBackButton from '@component/go-back'
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import debounce from 'lodash/debounce'
import moment from 'moment'
import address from '@utils/address.json'
import {GetTemporaryKey} from "@apis/account/index"
const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option
const { TreeNode } = Tree;
let _util = new CommonUtil();

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
        id: 'app.message.save_success',
        defaultMessage: '保存成功',
    },
    upload_success: {
        id: 'app.message.upload_success',
        defaultMessage: '上传成功',
    },
    format_incorrect: {
        id: 'app.message.material.format_incorrect',
        defaultMessage: '附件格式不正确',
    },
    oversize: {
        id: 'app.message.material.oversize',
        defaultMessage: '附件大小不超过100MB!',
    },
    material_name: {
        id: 'app.placeholder.material.material_name',
        defaultMessage: '资料名称',
    },
    material_name_check: {
        id: 'app.material.check.material_name_check',
        defaultMessage: '请输入资料名称',
    },
    paper_name_check: {
        id: 'app.material.check.paper_name_check',
        defaultMessage: '请输入试卷名称',
    },
    paper_name: {
        id: 'app.material.check.paper_name',
        defaultMessage: '请选择试卷',
    },
    desc: {
        id: 'app.placeholder.material.desc',
        defaultMessage: '描述',
    },
    select: {
        id: 'app.placeholder.select',
        defaultMessage: '-- 请选择 --',
    },
    nodata: {
        id: 'app.placeholder.nodata',
        defaultMessage: '暂无数据',
    },

});

@injectIntl
class ProjectEditForm extends React.Component {
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
            fileList: [],
            copyChecked: false,
            projectList: [],
            previewVisible: false,
            previewImage: "",
            previewWxVisible: false,
            previewWxImage: "",
            treeData: [],
            fileList:[],
            file_loading:false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    componentDidMount() {
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            projectDetail({ id: this.props.location.state.id }).then((res) => {
                const { permission, admin_user, source } = res.data;
                var defaultAdminUser = [];
                if (admin_user) {
                    admin_user.map(item => {
                        defaultAdminUser.push(item.id.toString())
                    })
                }
                this.setState({ data: res.data, is_active: res.data.is_active,checkedKeys: permission.map(c => c + ''), personList: admin_user, admin_user: defaultAdminUser });
                //附件(腾讯云cos)
                if (source) {
                    //转换前端格式
                    var that = this;
                    var cos = _util.getCos(null,GetTemporaryKey);
                    const source_list = JSON.parse(source);
                    if(source_list&&source_list.length){
                        this.setState({file_loading:true})
                        source_list.map((obj, index) => {
                            const key = obj.url;
                            var url = cos.getObjectUrl({
                                Bucket: 'ecms-1256637595',
                                Region: 'ap-shanghai',
                                Key:key,
                                Sign: true,
                            }, function (err, data) {
                                if(data && data.Url){    
                                    const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};             
                                    const new_list = [...that.state.fileList,file_obj];
                                    that.setState({fileList:new_list});
                                    if(index == source_list.length - 1){
                                        that.setState({file_loading:false});
                                    }
                                }
                            });
                        });
                    }            
                }             
            })

            project().then((res) => {
                this.setState({ projectList: res.data.results });
            })

            projectPermission({ project_id: _util.getStorage('project_id') }).then((res) => {
                let data = []
                let arr0 = Object.keys(res.data)
                let arr1 = Object.values(res.data)
                if (res.data instanceof Object) {
                    arr0.map((d, index) => {
                        data.push({ id: '', name: arr0[index], children: arr1[index] })
                    })
                } else {
                    res.data.forEach(a => {
                        data.push(getValue(a));
                    });
                }

                let targetArr = []
                const getValue = (obj) => {
                    const tempObj = {};
                    tempObj.title = obj.name;
                    tempObj.key = obj.id;
                    if (obj.children) {
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

                console.log(targetArr)

                this.setState({
                    trees: targetArr
                });
            });

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
                id: this.props.location.state.id,
                treeData: targetArr,
                spinLoading: false
            })
        }

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

    handleSubmit(e) {
        e.preventDefault()
        this.setState({
            confirmLoading: true
        })
        const { id,fileList,checkedKeys } = this.state;
        const permission = this.checkPermissionKeys(checkedKeys).join(",");
        let source = _util.setSourceList(fileList)
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this
                const { formatMessage } = this.props.intl;
                const data = {
                    name: values.name ? values.name : '',
                    name_en: values.name_en ? values.name_en : '',
                    desc: values.desc ? values.desc : '',
                    desc_en: values.desc_en ? values.desc_en : '',
                    permission: permission,
                    start_day: values.start_day ? moment(values.start_day).format("YYYY-MM-DD") : "",
                    end_day: values.end_day ? moment(values.end_day).format("YYYY-MM-DD") : "",
                    contact_person: values.contact_person ? values.contact_person : '',
                    contact_email: values.contact_email ? values.contact_email : '',
                    contact_phone: values.contact_phone ? values.contact_phone : '',
                    // admin_user: admin_user.join(','),
                    province: values.location[0],
                    city: values.location[1],
                    area: values.location[2],
                    address: values.address,
                    source:JSON.stringify(source),
                    is_active: this.state.is_active
                };
                confirm({
                    title: '确认提交?',
                    content: '单击确认按钮后，将会提交数据',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        projectPut(id, data).then((res) => {
                            message.success('保存成功')
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
                if (trees[i].key == item) {
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
        this.setState({ checkedKeys, checkedMenu: result });
    }

    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    }

    // renderTreeNodes = data => {
    //     if (data && data.length) {
    //         return data.map(item => {
    //             if (item.children) {
    //                 return (
    //                     <TreeNode title={item.name} key={item.id} dataRef={item}>
    //                         {this.renderTreeNodes(item.children)}
    //                     </TreeNode>
    //                 );
    //             }
    //             return <TreeNode key={item.id} title={item.name} dataRef={item} />;
    //         });
    //     }
    // }
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
        console.log('0115', value)
        this.setState({ personList: [], fetching: true });
        userSearch({ q: value }).then((res) => {
            if (res.data) {
                this.setState({ personList: res.data, fetching: false });
            }
        })
    };

    handleChange = value => {
        const { personList } = this.state;
        var newPersonList = [];
        value.forEach(val => {
            var user = personList.find(person => {
                return person.id == val
            });
            newPersonList.push(user);
        })
        console.log('0115', value, this.state.personList)
        this.setState({
            personList: [],
            fetching: false,
            admin_user: value
        })
    };

    renderDefaultAdminUser = () => {
        const { data } = this.state;
        if (data && data.admin_user) {
            const { admin_user } = data;
            var admin_user_list = [];
            admin_user.map(item => {
                admin_user_list.push(item.id.toString());
            });
            return admin_user_list
        } else {
            return [];
        }
    }

    changeNameLang = ({ key }) => {
        this.setState({ name_langs: key })
    }

    changeDescLang = ({ key }) => {
        this.setState({ desc_langs: key })
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
                // file.url = _util.getImageUrl(file.response.url);
                file.url = file.response.url
            }
            return file;
        });
        this.setState({ fileList })
    }

    setCopyProject = (value) => {
        this.setState({ copyChecked: value })
    }

    //文件上传  腾讯云cos
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
          //获取cos URL
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
                }
                const new_fileList = [...fileList,newFile]//文件列表，单个文件直接new_fileList = [newFile]
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

    onActiveChange = (checked) => {
        console.log(checked)
        this.setState({
            is_active: !checked
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl;
        const { confirmLoading, spinLoading, trees, data, personList, projectList, fetching, admin_user, name_langs, desc_langs, fileList,
            copyChecked, previewWxVisible, previewWxImage, treeData,file_loading } = this.state

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

        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div>
                <div className="content-wrapper content-no-table-wrapper">
                    <Spin spinning={spinLoading}>
                        <Form onSubmit={this.handleSubmit} layout={formItemLayout}>
                            <FormItem label={'项目名'} {...formItemLayout}>
                                <Row gutter={12}>
                                    <Col span={20}>
                                        {
                                            name_langs == 'zh-Hans' ?
                                                <div>
                                                    {getFieldDecorator('name', {
                                                        initialValue: data.name ? data.name : null,
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入！',
                                                        }],
                                                    })(<Input />)}
                                                </div>
                                                :
                                                <div>
                                                    {getFieldDecorator('name_en', {
                                                        initialValue: data.name_en ? data.name_en : null,
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入！',
                                                        }],
                                                    })(<Input />)}
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
                                                        initialValue: data.desc ? data.desc : null,
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入！',
                                                        }],
                                                    })(<Input />)}
                                                </div>
                                                :
                                                <div>
                                                    {getFieldDecorator('desc_en', {
                                                        initialValue: data.desc_en ? data.desc_en : null,
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入！',
                                                        }],
                                                    })(<Input />)}
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

                            <FormItem label={'权限配置'} {...formItemLayout}>
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
                            </FormItem>
                            {/* <FormItem label={'项目管理员'} {...formItemLayout}>
                                <Select
                                    mode="multiple"
                                    placeholder="Select users"
                                    notFoundContent={fetching ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={this.fetchUser}
                                    onChange={this.handleChange}
                                    style={{ width: '100%' }}
                                    value={admin_user}
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
                                    initialValue: data ? moment(data.start_day, "YYYY-MM-DD") : null,
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
                                    initialValue: data ? moment(data.end_day, "YYYY-MM-DD") : null,
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
                                    initialValue: data ? [data.province, data.city, data.area] : null,
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
                                        onChange={this.onLocationChange}
                                    />
                                )}

                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'地点描述'}>

                                {getFieldDecorator("address", {
                                    initialValue: data ? data.address : null,
                                    rules: [{ required: true, message: '请输入项目地址' }]
                                })(
                                    <Input placeholder={'请输入项目地址'} />
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label={'联系人'}>

                                {getFieldDecorator("contact_person", {
                                    initialValue: data ? data.contact_person : null,
                                    rules: [{ required: true, message: '请输入姓名' }]
                                })(
                                    <Input placeholder={'请输入姓名'} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'联系人手机'}>

                                {getFieldDecorator("contact_phone", {
                                    initialValue: data ? data.contact_phone : null,
                                    rules: [{ required: true, message: '请输入手机号' }]
                                })(
                                    <Input placeholder={'请输入手机号'} maxLength={11} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'请输入邮箱'}>

                                {getFieldDecorator("contact_email", {
                                    initialValue: data ? data.contact_email : null,
                                    rules: [{
                                        type: 'email', message: '邮箱格式不正确!',
                                    }, { required: true, message: '请输入邮箱' }]
                                })(
                                    <Input placeholder={'请输入邮箱'} />
                                )}
                            </FormItem>
                            <FormItem 
                                 {...formItemLayout}
                                label={'是否归档'}
                                required={true}
                            >
                                
                                <Switch checked={!this.state.is_active} onChange={this.onActiveChange}/>
                                
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label='附件'
                                extra={'请上传订单、营业执照或资质证明，图片格式jpg jpeg png'}     //请上传营业执照或资质证明，图片格式jpg jpeg png
                            >
                                <Spin spinning={file_loading}>     
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
                                        <Icon type="upload" /> upload
                                    </Button>
                                </Upload>
                                </Spin>
                                <Modal visible={previewWxVisible} footer={null} onCancel={this.handleWxCancel}>
                                    <img alt='' style={{ width: "100%" }} src={previewWxImage} />
                                </Modal>

                            </FormItem>

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

const ProjectAdd = Form.create()(ProjectEditForm)

export default ProjectAdd

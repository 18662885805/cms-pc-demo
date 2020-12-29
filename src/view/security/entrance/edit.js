import React from 'react'
import {
    Form, Button, Modal, Spin, Tree, Select, message,  Input, Row, Col, Switch, 
} from 'antd'
import {inject, observer} from "mobx-react/index";
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { SearchProjectUser } from "@apis/system/user";
import GoBackButton from '@component/go-back'
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import debounce from 'lodash/debounce'
import moment from 'moment'
import address from '@utils/address.json'
const FormItem = Form.Item
const confirm = Modal.confirm
const { TreeNode } = Tree;
const { Option } = Select;
let _util = new CommonUtil()


@inject("menuState") @injectIntl
class EntranceEditForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            formData: {},
            spinLoading: true,
            personList: [],
            fetching: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    componentDidMount() {
        this.setState({
            spinLoading: false
        });
    }


    handleSubmit(e) {
        e.preventDefault()
        this.setState({
            confirmLoading: true
        })
        const { } = this.state;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this
                const { formatMessage } = this.props.intl;
                const data = {
                   
                };
                confirm({
                    title: '确认提交?',
                    content: '单击确认按钮后，将会提交数据',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                    },
                    onCancel() {
                    },
                })
            } else {
            }
            this.setState({
                confirmLoading: false
            })
        })
    }


    fetchUser = (value) => {
        this.setState({ personList: [], fetching: true});
        SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
            if(res.data){
                this.setState({ personList: res.data, fetching: false });
            }           
        });
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

    



    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const { confirmLoading, spinLoading,fetching,personList} = this.state
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



        return (
            <div>
                <MyBreadcrumb />
                <div className="content-wrapper content-no-table-wrapper">
                    <Spin spinning={spinLoading}>
                        <Form onSubmit={this.handleSubmit}>                           
                             <FormItem label={'审批人'} {...formItemLayout} required>
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
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'是否参加入场培训'}>

                                {getFieldDecorator("need_training", {
                                    rules: [{ required: true, message: '' }]
                                })(
                                    <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout}
                                label={'入场培训'}
                            >
                                {getFieldDecorator('training', {
                                    rules: [{required: true, message:''
                                    }],
                                })(
                                    <Select  style={{ width: 120 }}>
                                        <Option value={1}>入场培训1</Option>
                                        <Option value={2}>入场培训2</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={'备注'}>
                                {getFieldDecorator("desc", {
                                })(
                                    <Input placeholder={'请输入备注'} />
                                )}
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

const EntranceEdit = Form.create()(EntranceEditForm)

export default EntranceEdit

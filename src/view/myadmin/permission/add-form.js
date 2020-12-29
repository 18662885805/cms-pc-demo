import React from 'react'
import {
  Form,
  Button,
  Modal,
  Spin,
  message
} from 'antd'
import {inject, observer} from "mobx-react/index";
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { permissionPost, permissionPut, permissionDetail, permissionList } from '@apis/myadmin/permission/index'
import GoBackButton from '@component/go-back'
import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import messages from '@utils/formatMsg'
const FormItem = Form.Item
const confirm = Modal.confirm

let _util = new CommonUtil()

@inject("menuState")
class PermissionAddForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      permissionArr: [],
      spinLoading: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {

    const {id} = this.props.match.params;
    if (id) {
      permissionDetail(id).then((res) => {
        this.setState({
          data: res.data
        });
      });
    }
    permissionList().then((res) => {
      // console.log(res)
      this.setState({
        permissionArr: res.data
      })
    })
    this.setState({
      spinLoading: false
    })
    this.props.menuState.changeMenuCurrentUrl("/myadmin/permission");
    this.props.menuState.changeMenuOpenKeys("/myadmin");
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({
      confirmLoading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        const { formatMessage } = this.props.intl;
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            const { id } = _this.props.match.params;
            if (id) {
              permissionPut(id, values).then(res => {
                message.success('保存成功');
                _this.props.history.goBack();
              });
              return;
            }
            
            permissionPost(values).then((res) => {
              message.success(formatMessage(messages.alarm7))
              _this.props.history.goBack()
            })
          },
          onCancel () {}
        })
      }
      this.setState({
        confirmLoading: false
      })
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { confirmLoading, spinLoading, data, permissionArr } = this.state
    // const formItemLayout = formData.formItemLayout
    // const tailFormItemLayout = formData.tailFormItemLayout
    const _this = this

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10}
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    const formData = [
      {
        field: "module",
        type: "char",
        icon: "",
        value: data ? data.module : null,
        text: "模块名称",
        placeholder: "模块名称",
        rules: []
      },
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "权限名称",
        placeholder: "权限名称",
        rules: [{required: true, message: "请输入权限名称"}]
      },
      {
        field: "parent",
        type: "select",
        icon: "",
        value: data ? data.parent : null,
        text: "上级权限",
        placeholder: "上级权限",
        options: permissionArr,
        rules: []
      },
      {
        field: "url",
        type: "char",
        icon: "",
        value: data ? data.url : null,
        text: "接口地址url",
        placeholder: "接口地址",
        rules: []
      },
      {
        field: "action",
        type: "select",
        icon: "",
        value: data ? data.action : -1,
        text: "请求方式",
        placeholder: "请求方式",
        options: [   //ACTION_GET 1,  ACTION_POST 2, ACTION_PUT 3, ACTION_DELETE 4,  ACTION_UNDEFINED -1
          {id: -1, name: 'UNDEFINED'},
          {id: 1, name: 'GET'},
          {id: 2, name: 'POST'},
          {id: 3, name: 'PUT'},
          {id: 4, name: 'DELETE'}
        ],
        rules: []
      },
    ]

    return (
      <div>
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              {
                formData ? formData.map((item, index) => {
                  return (
                    <FormItem
                      key={index}
                      label={item.text}
                      hasFeedback
                      {...formItemLayout}
                    >
                      {
                        item.value
                          ? getFieldDecorator(item.field, {
                            initialValue: item.value,
                            rules: item.rules
                          })(
                            _util.switchItem(item, _this)
                          )
                          : getFieldDecorator(item.field, {
                            rules: item.rules
                          })(
                            _util.switchItem(item, _this)
                          )
                      }
                    </FormItem>
                  )
                }) : null
              }
              <FormItem {...tailFormItemLayout}>
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading} style={{ marginRight: '10px' }}>
                       <FormattedMessage id="page.construction.location.yesSubmit" defaultMessage="提交"/>
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

const PermissionAdd = Form.create()(PermissionAddForm)

export default injectIntl(PermissionAdd)

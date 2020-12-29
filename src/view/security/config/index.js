import React from "react";
import {
  Form, Button, Modal, Input, Select, Spin, Icon, message, Row, Col, Upload
} from "antd";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import debounce from "lodash/debounce";
import moment from "moment";
import { cloneDeep } from "lodash";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import { SearchProjectUser } from "@apis/system/user";
import { projectInfoList,projectConfig, projectPut } from "@apis/system/project";
import { entranceConfig, entranceConfigPost,entranceConfigPut } from "@apis/security/factoryapply";
import address from '@utils/address.json'
import GoBackButton from "@component/go-back";
import translation from "../translation.js";
import {GetTemporaryKey} from "@apis/account/index"

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const confirm = Modal.confirm;
let _util = new CommonUtil();



@injectIntl
class EntranceConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      phone: null,
      fetching: false,
      visible: false,
      treeData: [],
      location_list: [],
      previewVisible: false,
      previewImage: "",
      fileList: [],
      previewWxVisible: false,
      previewWxImage: "",
      search_id: _util.getStorage("userInfo").id || null,
      searchOptions: [{
        id: _util.getStorage("userInfo").id,
        name: _util.getStorage("userInfo").real_name,
        tel: _util.getStorage("userInfo").tel,
        department: _util.getStorage("userInfo").department
      }],
      project_obj: _util.getStorage('project'),
      search_data: [],
      fileList: []
    };

    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }


  componentDidMount() {
    entranceConfig({project_id: _util.getStorage('project_id')}).then((res) => {
      if(res.data.results.length > 0) {
        let data = res.data.results[0]
        const {approve_list} = data
        this.setState({
          data,
          id: data.id,
          search_data:approve_list,
        })
      }
    })

    this.setState({
      spinLoading: false
    });
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

  handleSubmit(e) {
    e.preventDefault();
    const { formatMessage } = this.props.intl; 
    const { id } = this.state;
    var project_id = _util.getStorage('project_id');
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this;
        const data = {
          approve: values.approve_list ? values.approve_list.join(',') : null,
        };
        confirm({
          title: formatMessage(translation.confirm_title),
          content: formatMessage(translation.confirm_content),
          okText: formatMessage(translation.okText),
          cancelText: formatMessage(translation.cancelText),
          onOk() {
            if (id) {
                data.id = id;
                entranceConfigPut(project_id, data).then(res => {
                message.success(formatMessage(translation.saved)); //保存成功
              });
              return;
            }
            entranceConfigPost(project_id,data).then((res) => {
              message.success(formatMessage(translation.saved)); //保存成功
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

  handleCancel = () => {
    this.setState({
      visible: false,
      ques: {
        name: "",
        content: []
      }
    });
  }

  handleNumChange = (field, e) => {
    const { value } = e.target;
    this.setState({
      [field]: value
    });
  };


  changeNumberForm = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  InputForm = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
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
        // org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id,
      }));
      this.setState({ search_data, fetching: false });
    });
  }


  handleCancel() {
    this.setState({ previewVisible: false });
  }

  handleWxCancel = () => {
    this.setState({ previewWxVisible: false });
  }

  handlePreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }

  handleWxPreview = file => {
    this.setState({
      previewWxImage: file.url || file.thumbUrl,
      previewWxVisible: true
    });
  }

  handleFormChange = (value, field) => {
    console.log(value, field);
    if (field === "person_no") {
      const { search_data } = this.state;
      const { name, pers_no, cost_center, department } = search_data.filter(o => o.id === value)[0];
      this.setState({
        name,
        pers_no,
        cost_center,
        department
      });
    }
    this.setState({
      [field]: value
    });
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      confirmLoading, spinLoading,  fileList, search_data, data
    } = this.state;
    const { formatMessage } = this.props.intl;
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

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    const formData = [
      {
        field: "approve_list",
        type: "search",
        mode: "multiple",
        icon: "",
        value: data && data.approve_list ? data.approve_list.map(d => {return d.id+''}) : null,
        text: <FormattedMessage id="system.setting.entry.approver" defaultMessage="绿码申请审批人" />,
        placeholder: <FormattedMessage id="search-user" defaultMessage="根据姓名、手机搜索项目用户" />,
        options: search_data,
        fetchUser:  (value) => this.fetchUser(value),
        rules: [{ required: true, message: '请选择绿码申请审批人' }]
      },
    ];
    const _this = this;

    const bread = [
        {
            name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
            url: '/'
        },
        {
            name: '入场管理'
        },
        {
            name: '入场配置',
            url: '/staff/config'
        }
        
      ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              {
                formData ? formData.map((item, index) => {
                  return (
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

              <FormItem {...tailFormItemLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                    style={{ marginRight: "10px" }}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                </div>
              </FormItem>
            </Form>

          </Spin>
        </div>
      </div>
    );
  }
}

export default EntranceConfig = Form.create()(EntranceConfig);

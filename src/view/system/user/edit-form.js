import React from "react";
import {
  Form,
  Button,
  Modal,
  Spin,
  message, Icon, InputNumber, DatePicker, TimePicker, Select, Cascader, Checkbox, Row, Col, Switch,Input
} from "antd";

import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {userDetail, userForm, userPut} from "@apis/system/user/index";
import {getDepartment} from "@apis/system/department";
import GoBackButton from "@component/go-back";
import UploadPicWithCrop from "@component/UploadPicWithCrop";
import ViewPwd from "@component/ViewPwd";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";

import intl from "react-intl-universal";
import moment from "../../../utils/common";
const FormItem = Form.Item;
const confirm = Modal.confirm;
let _util = new CommonUtil();

class UserEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      fileList: [],
      previewVisible: false,
      previewImage: "",
      positionInfo: null,
      src: "",
      hideDepartment: true,
      cropperImg: "",
      uploadedImg: "",
      oldAvatar: "",
      cropPics: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {

      userDetail(this.props.location.state.id).then((res) => {
        this.setState({
          receive_msg: res.data.results.receive_msg
        });
      });

      userForm({id: this.props.location.state.id}).then((res) => {
        const {old_data} = res.data.results;

        if (old_data.avatar) {
          this.setState({
            oldAvatar: old_data.avatar,
            cropPics: [old_data.avatar]
          });
        }

        this.setState({
          formData: res.data.results,
          fileList: res.data.results.old_data.avatar ? [{
            uid: -1,
            name: "avatar.jpg",
            status: "done",
            url: _util.getImageUrl(res.data.results.old_data.avatar),
            response: {
              url: res.data.results.old_data.avatar
            }
          }] : []
        });
      });
      this.setState({
        spinLoading: false,
        id: this.props.location.state.id
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {cropPics} = this.state;
        console.log(values);

        values.avatar = cropPics.length ? cropPics[0] : "";
        let _this = this;
        const { formatMessage } = this.props.intl;
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            values.role = values.role.join(",");
            values.receive_msg = values.receive_msg && values.receive_msg.join(",");
            _this.setState({
              confirmLoading: true
            });

            userPut(_this.state.id, values).then((res) => {
              message.success('保存成功');
              _this.setState({
                confirmLoading: false
              });
              _this.props.history.goBack();
            }).catch(err => {
              _this.setState({
                confirmLoading: false
              });
            });
          },
          onCancel() {
          }
        });
      }

    });
  }

    handleCostCenter = option => {
      console.log(1+option);
      const {formData} = this.state;
      const {setFieldsValue} = this.props.form;
      // console.log(formData);
      formData.content.forEach(con => {
        if (con.field === "department_id") {
          con.options = [];

          setFieldsValue({department_id:undefined});
        }
      });

      getDepartment(option).then(res => {
        // console.log(res);
        const {results} = res.data;
        if (Array.isArray(results) && results.length > 0) {
          if (Array.isArray(formData.content) && formData.content.length > 0) {
            formData.content.forEach(con => {
              if (con.field === "department_id") {
                con.options = results;
                // setFieldsValue({
                //     department_id: ''
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
    };

    handleCrop = url => {
      this.setState({
        cropPics: url
      });
    };

    render() {
      const {getFieldDecorator} = this.props.form;
      const {confirmLoading, formData, spinLoading} = this.state;
      const formItemLayout = formData.formItemLayout;
      const _this = this;

      return (
        <div>
          <MyBreadcrumb/>
          <div className="content-wrapper content-no-table-wrapper">
            <Spin spinning={spinLoading}>
              <Form onSubmit={this.handleSubmit}>
                {
                  formData.content ? formData.content.map((item, index) => {
                    return (
                      item.field == "password" ?
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
                              item.value === 0 ? getFieldDecorator(item.field, {
                                initialValue: item.value,
                                rules: item.rules
                              })(
                                _util.switchItem(item, _this)
                              ) : getFieldDecorator(item.field, {
                                rules: item.rules
                              })(
                                _util.switchItem(item, _this)
                              )
                          }
                        </FormItem>
                        :
                        <FormItem
                          key={index}
                          label={item.text}
                          // hasFeedback
                          {...formItemLayout}
                          extra={item.text === "角色" ? "注：新权限在管理员审批通过后， 用户重新登录本账号方可生效。" : ""}
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
                              item.value === 0 ? getFieldDecorator(item.field, {
                                initialValue: item.value,
                                rules: item.rules
                              })(
                                _util.switchItem(item, _this)
                              ) : getFieldDecorator(item.field, {
                                rules: item.rules
                              })(
                                _util.switchItem(item, _this)
                              )
                          }
                        </FormItem>

                    );
                  }) : ""
                }

                <FormItem {...formItemLayout}
                  label={<FormattedMessage id="page.system.reason.head" defaultMessage="上传头像"/>}
                  extra={<FormattedMessage id="page.system.reason.picSize" defaultMessage="图片大小限制3M，格式限制jpg jpeg png gif bmp"/>}>
                  <UploadPicWithCrop
                    onChange={this.handleCrop}
                    prePics={ this.state.cropPics}/>

                </FormItem>

                <FormItem style={{display: "flex", justifyContent: "center"}}>
                  <div style={{width: "100%", marginBottom: "20px"}}>
                    <Button type="primary" htmlType="submit" loading={confirmLoading}>
                      <FormattedMessage id="page.construction.location.yesSubmit" defaultMessage="提交"/>
                    </Button>
                    <GoBackButton props={this.props} style={{marginLeft: 10}}/>
                  </div>
                </FormItem>
              </Form>
            </Spin>
          </div>
        </div>
      );
    }
}

const UserEdit = Form.create()(UserEditForm);

export default injectIntl(UserEdit);

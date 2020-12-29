import React, { Component } from "react";
import {
  Button,
  Card, Checkbox, Col, Input, Radio, Row, Select, Spin, Form, Modal
} from "antd";
import {FormattedMessage} from "react-intl";
import CommonUtil from "@utils/common";
import SearchUserTransfer from '@component/searchUserTransfer'
import SearchUserSelect from '@component/searchUserSelect'
import styles from "../../view/common.css";
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;
let _util = new CommonUtil();

class approvalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getSponsor=(val)=>{
    return true
  };

  getUser=(val)=>{
    return true
  };

  render () {
    const {getFieldDecorator} = this.props.form;
    const { postData,type } = this.props;

    console.log(postData);

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

    const radioStyle = {
      display: 'inline-block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
        <div className={type==='record'||type==='wait'?styles.recordInfo:null}>
           <Form {...formItemLayout} >
            <Form.Item label="模板名称">
              {getFieldDecorator('name', {
                initialValue:postData?postData.name:undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入模板名称',
                  },
                ],
              })(<Input placeholder={'请输入模板名称'} value={postData&&postData.name} disabled={true}/>)}
            </Form.Item>
            <Form.Item label="工作流发起人">
                      <Row gutter={16}>
                        <Col span={12} >
                          <Select placeholder={'请选择'} value={postData&&postData.sponsor_condition} disabled={true}>
                              <Option value={1}>所有人员</Option>
                              <Option value={2}>具体的人</Option>
                          </Select>
                        </Col>
                        <Col span={12}>
                          <SearchUserTransfer getSponsor={this.getSponsor} dis_info={true} conditionType={postData&&postData.sponsor_condition} sponsor={postData&&postData.sponsor}/>
                        </Col>
                      </Row>
                    </Form.Item>

            <Form.Item label="工作流发起人选项">
              <Checkbox checked={postData&&postData.is_begin_can_edit} disabled={true}>当工作流开始时,发起人可以编辑步骤的期限和参与者</Checkbox>       
            </Form.Item>

            <Form.Item label="最终传送–其他(抄送)收件人">
              <SearchUserSelect getUser={this.getUser} dis_info={true} cc={postData&&postData.cc}/>
            </Form.Item>

            </Form>
        </div>
    )
  }
}

const approvalInfoShow = Form.create()(approvalInfo);

export default approvalInfoShow;
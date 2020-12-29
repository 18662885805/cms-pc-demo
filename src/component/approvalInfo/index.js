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

            <Form.Item label="描述">
              <TextArea placeholder={'请输入模板描述'} value={postData&&postData.desc} disabled={true}/>
            </Form.Item>

            <Form.Item label="工作流结果由以下决定">
              {getFieldDecorator('final_result', {
                initialValue:postData?postData.final_result:undefined,
                rules: [
                    {
                    required: true,
                    message: '请选择工作流结果的决定因素',
                  },
                ],
              })(
                  <Radio.Group disabled={true} value={postData&&postData.final_result}>
                    <Radio style={radioStyle} value={1}>
                      最终步骤结果（由主审核员决定）
                    </Radio>
                    <Radio style={radioStyle} value={2}>
                      所有步骤的最终结果
                    </Radio>
                  </Radio.Group>
              )}
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
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form>
                            <Form.Item label="当工作流开始时">
                              <Checkbox checked={postData&&postData.is_begin_can_edit} disabled={true}>发起人可以编辑步骤的期限和参与者</Checkbox>
                            </Form.Item>
                          </Form>
                        </Col>

                        <Col span={12}>
                            <Form>
                              <Form.Item label="当工作流正在进行时">
                                <Checkbox checked={postData&&postData.is_process_can_edit} disabled={true}>发起人可以编辑步骤参与者</Checkbox>
                                <Checkbox checked={postData&&postData.is_process_can_jump} disabled={true}>发起人可以跳过步骤</Checkbox>
                              </Form.Item>
                            </Form>
                        </Col>
                      </Row>
                    </Form.Item>

            <Form.Item label="默认步骤完成规则">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form>
                            <Form.Item label="并行步骤完成当">
                              <Select placeholder={'请选择'} disabled={true} value={1}>
                                <Option value={1}>所有步骤完成时</Option>
                                <Option value={2}>任何步骤完成时</Option>
                                {/*<Option value={3}>除被否决外的所有步骤完成时</Option>*/}
                              </Select>
                            </Form.Item>
                          </Form>
                        </Col>

                        <Col span={12}>
                          <Form>
                            <Form.Item label="当被否决时" >
                              <Select placeholder={'请选择'} value={2} disabled={true}>
                                <Option value={1}>返回工作流发起人</Option>
                                <Option value={2}>继续下个步骤</Option>
                              </Select>
                            </Form.Item>
                          </Form>
                        </Col>
                      </Row>
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
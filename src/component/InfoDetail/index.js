import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Card,
  Timeline,
  Input,
  Tag,
  Icon
} from "antd";

import chunk from "lodash/chunk";
import moment from "moment";
import CommonUtil from "@utils/common";
import * as userForms from "../../view/onestop/card-operation/userForms";

const _util = new CommonUtil();

class InfoDetail extends Component {

    _sort = arr => {
      let sourceIndex = -1;
      let numberIndex = -1;
      const len = arr.length;

      for (let i = 0; i < len; i++) {
        if (arr[i] === "source") {
          sourceIndex = i;
        }
        if (arr[i] === "number" || arr[i] === "new_number") {
          numberIndex = i;
        }

      }

      if (numberIndex > -1) {
        if (sourceIndex > -1) {
          [arr[len-2], arr[sourceIndex]] = [arr[sourceIndex], arr[len-2]];
        }
        [arr[len-1], arr[numberIndex]] = [arr[numberIndex], arr[len-1]];
      } else {
        if (sourceIndex > -1) {
          [arr[len-1], arr[sourceIndex]] = [arr[sourceIndex], arr[len-1]];
        }
      }

      return arr;
    }

    render() {
      const { infoList, auditList, getNumber, card_status, operation_status } = this.props;
      const number_data = infoList && infoList.number_data;
      const fieldLabel = infoList && infoList.fieldLabel;
      const infoTitle = infoList && infoList.title;

      const infoListCard = (
        <Card title={infoTitle} style={ this.props.style ? null : { width: "80%", margin: "0 auto 10px" }}>
          {
            Array.isArray(number_data) && number_data.map((first, firstIndex) => {

              if (!first) return null;

              let { card_type } = first;
              let { card_type_desc } = first;

              let userForm = userForms["userForm" + card_type];

              const childfieldLabel ={};

              let childinfoList = {};

              Array.isArray(userForm) && userForm.forEach(u => {
                childfieldLabel[u.field] = u.label;
              });

              childinfoList = {
                title: `补办${card_type_desc}信息`,
                number_data: [first.number_data],
                fieldLabel: childfieldLabel
              };


              return (
                <div key={firstIndex} style={{
                  padding: "10px 0",
                  borderBottom: firstIndex === number_data.length - 1 ? "" : "1px solid #e8e8e8"
                }}>
                  {
                    chunk(this._sort(Object.keys(first).filter(f => fieldLabel[f] && first[f])), 4).map((seconde, secondeIndex) => {

                      return (
                        <Row key={secondeIndex} gutter={5}>
                          {
                            seconde.map((third, thirdIndex) => {
                              if (fieldLabel) {

                                if (!fieldLabel[third]) return null;

                                if (third === "entry_date") {
                                  first[third] = moment(first[third]).format("YYYY-MM-DD");
                                }

                                if (third === "start_hour" || third === "end_hour") {
                                  let formatTime = moment(first[third]).format("HH:mm");

                                  if (formatTime !== "Invalid date") {
                                    first[third] = formatTime;
                                  }
                                }


                                if (card_status === 4 && third === "type") {

                                  if (first[third] == 1) {
                                    first[third] = "新增";
                                  }
                                  if (first[third] == 2) {
                                    first[third] = "充值";
                                  }
                                }

                                if (third === "reason") {
                                  let tempText = first[third];

                                  if (first[third] == 1) {
                                    tempText = "更换";
                                  }
                                  if (first[third] == 2) {
                                    tempText = "遗失";
                                  }
                                  if (first[third] == 3) {
                                    tempText = "离职";
                                  }
                                  if (first[third] == 4) {
                                    tempText = "其他";
                                  }

                                  return (tempText ?
                                    <Col span={6} key={thirdIndex}>
                                      {fieldLabel[third]}:&emsp;{tempText}
                                    </Col> : null
                                  );
                                }

                                if (third === "card_no") {
                                  return first[third] ?(
                                    <Col span={6} key={thirdIndex}>
                                      {fieldLabel[third]}:&emsp;<Tag color='#f50'><Icon type="credit-card" style={{marginRight: "7px"}}/>{first[third]}</Tag>
                                    </Col>
                                  ) : null;
                                }

                                if (third === "number") {

                                  if (typeof getNumber === "function" && first["type"] !== "充值" && operation_status !== 5) {

                                    return (
                                      <Col span={24} key={thirdIndex} style={{marginTop: "10px"}}>
                                        {fieldLabel[third]}:&emsp;
                                        <Input
                                          style={{width: "30%"}}

                                          onChange={e => getNumber(e, firstIndex)}
                                          placeholder='请填写' />
                                      </Col>
                                    );
                                  }
                                  return first[third] ?(
                                    <Col span={24} key={thirdIndex} style={{marginTop: "10px"}}>
                                      {fieldLabel[third]}:&emsp;<Tag color='#87d068'><Icon type="credit-card" style={{marginRight: "7px"}}/>{first[third]}</Tag>
                                    </Col>
                                  ) : null;

                                }


                                if (third === "new_number") {

                                  if (typeof getNumber === "function" && first["reason"] !== "离职") {

                                    return (
                                      <Col span={24} key={thirdIndex} style={{marginTop: "10px"}}>
                                        {fieldLabel[third]}:&emsp;
                                        <Input
                                          style={{width: "30%"}}

                                          onChange={e => getNumber(e, firstIndex)}
                                          placeholder='请填写' />
                                      </Col>
                                    );
                                  }
                                  return (first[third] && first[third] !== " " ) ?(
                                    <Col span={24} key={thirdIndex} style={{marginTop: "10px"}}>
                                      {fieldLabel[third]}:&emsp;<Tag color='#87d068'><Icon type="credit-card" style={{marginRight: "7px"}}/>{first[third]}</Tag>
                                    </Col>
                                  ) : null;

                                }

                                if (third === "source") {
                                  return Array.isArray(first[third]) && first[third].length > 0 ?
                                    <Col span={24} key={thirdIndex} >
                                      {fieldLabel[third]}:&emsp;
                                      {
                                        first[third].map((f, fIndex) => {
                                          return <img key={fIndex} src={_util.getImageUrl(f)} style={{
                                            width: "50px",
                                            height: "50px",
                                            marginRight: "5px"
                                          }} />;
                                        })
                                      }
                                    </Col>
                                    :
                                    null;
                                }

                                return (first[third] ?
                                  <Col span={6} key={thirdIndex}>
                                    {fieldLabel[third]}:&emsp;{first[third]}
                                  </Col> : null
                                );
                              }

                            })
                          }
                        </Row>
                      );
                    })
                  }
                  {
                    first["number_data"]
                      ?
                      <div id='card-service' style={{marginTop: "5px", marginBottom: "-20px"}}>
                        <InfoDetail
                          // {...this.props}
                          infoList={childinfoList}
                          style={{width: "100%", marginTop: "5px"}}
                          card_status={first["card_status"]} /></div> :
                      null
                  }

                  {
                    (card_status === 6)
                      ?
                      first["goods_info"] && Array.isArray(first["goods_info"]) && first["goods_info"].map((info, index) => {
                        return <Row key={index} gutter={24}>
                          <Col span={8}>
                            <span style={{marginRight: "3px"}}>固定资产号:</span>&emsp;{info.fixed_asset_number}
                          </Col>
                          <Col span={8}>
                            <span style={{marginRight: "3px"}}>电脑型号:</span> &emsp;{info.model_number}
                          </Col>
                          <Col span={8}>
                            <span style={{marginRight: "3px"}}>序列号:</span>&emsp;{info.serial_number}
                          </Col>
                        </Row>;
                      })
                      :
                      null
                  }
                  {
                    (card_status === 7)
                      ?
                      first["goods_info"] && Array.isArray(first["goods_info"]) && first["goods_info"].map((info, index) => {
                        return <Row key={index} gutter={24}>
                          <Col span={8}>
                            <span style={{marginRight: "3px"}}>设备名称:</span>&emsp;{info.name}
                          </Col>
                          <Col span={8}>
                            <span style={{marginRight: "3px"}}>序列号:</span>&emsp;{info.serial_number}
                          </Col>
                        </Row>;
                      })
                      :
                      null
                  }
                </div>

              );
            })
          }
        </Card>
      );

      const audit_info_list = auditList && auditList.audit_info_list;
      const auditTitle = auditList && auditList.title;

      const auditListCard = (
        <Card title={auditTitle} style={ this.props.style ? null : { width: "80%", margin: "0 auto 10px" }}>
          <Timeline>
            {
              Array.isArray(audit_info_list) && audit_info_list.map((audit, index) => {
                return (
                  <Timeline.Item key={index}
                    color={
                      (audit.status === "审批未通过"
                                        ||
                                        audit.status === "退回"
                                        ||
                                        audit.status === "撤回") ? "red" : "green"}>
                    <Row style={{
                      marginBottom: "5px"
                    }}>
                      {
                        index === 0
                          ?
                          <Fragment>
                            <Col span={12}>
                              <span>创建人:</span>{audit.operation_name}</Col>
                            <Col span={12}>
                              <span>操作:</span>{audit.status}</Col>
                          </Fragment>
                          :
                          <Fragment>
                            <Col span={12}>
                              <span>审批人:</span>{audit.operation_name}</Col>
                            <Col span={12}>
                              <span>操作:</span>{audit.status}</Col>
                            <Col span={12}>
                              <span>审批时间:</span>{audit.operation_time}</Col>
                            <Col span={12}>
                              <span>备注:</span>{audit.remarks ? audit.remarks : "无"}</Col>
                          </Fragment>
                      }

                    </Row>
                  </Timeline.Item>
                );
              })
            }
          </Timeline>
        </Card>
      );


      return (
        <Fragment>
          {
            number_data
              ?
              infoListCard
              :
              null
          }
          {
            audit_info_list
              ?
              auditListCard
              :
              null
          }
          {/* <Card style={{width: '80%', margin: '0 auto 10px'}}></Card> */}
        </Fragment>
      );
    }
}

export default InfoDetail;
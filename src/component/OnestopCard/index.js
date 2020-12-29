import React, { Component } from "react";
import { Tag } from "antd";
import PicList from "@component/PicList";
import CommonUtil from "@utils/common";
import processNumberData from "../../view/onestop/card-operation/userForms";
import { cloneDeep } from "lodash";

let _util = new CommonUtil();

class OnestopCard extends Component {
  render () {
    const { card_type, card_type_desc, opt_type_desc, opt_type } = this.props;
    let { userForm, number_data } = this.props;

    if (!userForm) return null;

    let copyUserForm = cloneDeep(userForm);

    number_data = processNumberData(card_type, number_data, opt_type);

    if (card_type === 6 || card_type === 7) {
      let dividerIndex;

      for (let i = 0, len = copyUserForm.length; i < len; i++) {
        if (copyUserForm[i].field === "divider") {
          dividerIndex = i;
        }
      }

      if (dividerIndex) {
        copyUserForm = [...copyUserForm.slice(0, dividerIndex), { field: "goods_info", label: "物品信息" }, ...copyUserForm.slice(dividerIndex + 1)];
      }
    }

    if (number_data.number && !copyUserForm.some(u => u.field === "number")) {
      copyUserForm.push({
        field: "number",
        label: "卡号"
      });
    }

    for (let i = 0, len = userForm.length; i < len; i++) {
      if (copyUserForm[i].field === "number") {
        [copyUserForm[i], copyUserForm[len - 1]] = [copyUserForm[len - 1], copyUserForm[i]];
      }
      if (copyUserForm.some(u => u.field === "number") && copyUserForm[i].field === "source") {
        [copyUserForm[i], copyUserForm[len - 2]] = [copyUserForm[len - 2], copyUserForm[i]];
      }
      if (!copyUserForm.some(u => u.field === "number") && copyUserForm[i].field === "source") {
        [copyUserForm[i], copyUserForm[len - 1]] = [copyUserForm[len - 1], copyUserForm[i]];
      }
    }

    return (
      <div
        style={{
          overflow: "hidden"
        }}>
        {
          number_data.use_status
            ? <span style={{
              float: "left",
              lineHeight: "22px",
              fontSize: "12px",
              padding: "0 7px",
              borderRadius: "4px",
              margin: "0 8px 0 0"
            }}
            key='card_type'>
                        状态:&nbsp;{number_data.use_status}
            </span>
            : null
        }
        <span style={{
          float: "left",
          lineHeight: "22px",
          fontSize: "12px",
          padding: "0 7px",
          borderRadius: "4px",
          margin: "0 8px 0 0"
        }}
        key='card_type'>
                    卡片类型:&nbsp;{card_type_desc}
        </span>
        {
          opt_type_desc
            ? <span style={{
              float: "left",
              lineHeight: "22px",
              fontSize: "12px",
              padding: "0 7px",
              borderRadius: "4px",
              margin: "0 8px 0 0"
            }}
            key='opt_type'>
                        操作类型:&nbsp;{opt_type_desc}
            </span>
            : null
        }

        {
          Array.isArray(copyUserForm) ? copyUserForm.map((u, uIndex) => {

            if (!number_data[u.field]) return null;

            if (u.field === "goods_info" && Array.isArray(number_data[u.field])) {
              return (
                <span style={{
                  float: "left",
                  lineHeight: "22px",
                  fontSize: "12px",
                  padding: "0 7px",
                  borderRadius: "4px",
                  margin: "0 8px 0 0"
                }} key={uIndex}>
                                    物品信息:&nbsp;
                  {
                    card_type === 7
                      ? number_data[u.field].map((a, aIndex) => {
                        return (
                          <span key={aIndex}>
                                                        [设备名称:{a.name}&nbsp;序列号:{a.serial_number}]
                          </span>
                        );
                      })
                      : null
                  }
                  {
                    card_type === 6
                      ? number_data[u.field].map((a, aIndex) => {
                        return (
                          <span key={aIndex}>
                                                        [固定资产号:{a.fixed_asset_number}
                                                        &nbsp;
                                                                电脑型号:{a.model_number}
                                                        &nbsp;
                                                                序列号:{a.serial_number}]
                          </span>
                        );
                      })
                      : null
                  }
                </span>
              );
            }

            if (u.field === "source" && number_data[u.field] && number_data[u.field] !== "无") {

              return (
                <div style={{
                  width: "100%",
                  float: "left",
                  fontSize: "12px",
                  padding: "0 7px"
                }} key={uIndex}>
                  <div>附件:&nbsp;</div>
                  <PicList fileList={number_data[u.field].split(",").map(pic => {
                    return {
                      uid: pic,
                      url: _util.getImageUrl(pic)
                    };
                  })} />

                </div>
              );
            }

            if (u.field === "number") {
              return <span style={{
                float: "left",
                lineHeight: "22px",
                fontSize: "12px",
                padding: "0 7px",
                borderRadius: "4px",
                margin: "0 8px 0 0"
              }} key={uIndex}>
                {u.label}:&nbsp;<Tag>{number_data[u.field]}</Tag>
              </span>;
            }

            return (
              <span style={{
                float: "left",
                lineHeight: "22px",
                fontSize: "12px",
                padding: "0 7px",
                borderRadius: "4px",
                margin: "0 8px 0 0"
              }} key={uIndex}>
                {u.label}:&nbsp;{number_data[u.field]}
              </span>
            );
          })
            : null
        }
      </div>
    );
  }
}

export default OnestopCard;

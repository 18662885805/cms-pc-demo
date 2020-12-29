import React, { Component } from "react";
import PicList from "@component/PicList";
import CommonUtil from "@utils/common";
import moment from "moment";
import { FormattedMessage, injectIntl, defineMessages, intlShape } from "react-intl";

let _util = new CommonUtil();

class KeysCard extends Component {
  render () {
    const { data } = this.props;
    const {
      factory_name,
      location_name,
      floor_name,
      room_name,
      door_name,
      lock_name,
      reason,
      return_time,
      source
    } = data;

    return (
      <div
        style={{
          overflow: "hidden"
        }}>
        <span style={{
          float: "left",
          lineHeight: "22px",
          fontSize: "12px",
          padding: "0 7px",
          borderRadius: "4px",
          margin: "0 8px 0 0"
        }}>
                    厂区:&nbsp;{factory_name}
        </span>
        <span style={{
          float: "left",
          lineHeight: "22px",
          fontSize: "12px",
          padding: "0 7px",
          borderRadius: "4px",
          margin: "0 8px 0 0"
        }}>
                    建筑:&nbsp;{location_name}
        </span>
        <span style={{
          float: "left",
          lineHeight: "22px",
          fontSize: "12px",
          padding: "0 7px",
          borderRadius: "4px",
          margin: "0 8px 0 0"
        }}>
                    楼层:&nbsp;{floor_name}
        </span>
        <span style={{
          float: "left",
          lineHeight: "22px",
          fontSize: "12px",
          padding: "0 7px",
          borderRadius: "4px",
          margin: "0 8px 0 0"
        }}>
                    房间:&nbsp;{room_name}
        </span>
        <span style={{
          float: "left",
          lineHeight: "22px",
          fontSize: "12px",
          padding: "0 7px",
          borderRadius: "4px",
          margin: "0 8px 0 0"
        }}>
                    门:&nbsp;{door_name}
        </span>
        <span style={{
          float: "left",
          lineHeight: "22px",
          fontSize: "12px",
          padding: "0 7px",
          borderRadius: "4px",
          margin: "0 8px 0 0"
        }}>
                    锁芯:&nbsp;{lock_name || "无"}
        </span>
        {
          this.props.keyName
            ? <span style={{
              float: "left",
              lineHeight: "22px",
              fontSize: "12px",
              padding: "0 7px",
              borderRadius: "4px",
              margin: "0 8px 0 0"
            }}>
                        钥匙:&nbsp;{this.props.keyName}
            </span>
            : null
        }
        {
          this.props.aunual
            ? null
            : <span style={{
              float: "left",
              lineHeight: "22px",
              fontSize: "12px",
              padding: "0 7px",
              borderRadius: "4px",
              margin: "0 8px 0 0"
            }}>
                        理由:&nbsp;{reason}
            </span>
        }
        {
          this.props.aunual
            ? null
            : <span style={{
              float: "left",
              lineHeight: "22px",
              fontSize: "12px",
              padding: "0 7px",
              borderRadius: "4px",
              margin: "0 8px 0 0"
            }}>
                        预计归还日期:&nbsp;{return_time}
            </span>
        }
        {
          this.props.aunual
            ? null
            : source && source.split(",").length > 0
              ? <div style={{
                width: "100%",
                float: "left",
                fontSize: "12px",
                padding: "0 7px"
              }}>
                <div>附件:</div>
                <PicList fileList={
                  source.split(",").map(pic => {
                    return {
                      uid: pic,
                      url: _util.getImageUrl(pic)
                    };
                  })} />
              </div>
              : <span style={{
                float: "left",
                lineHeight: "22px",
                fontSize: "12px",
                padding: "0 7px",
                borderRadius: "4px",
                margin: "0 8px 0 0"
              }}>
                            附件:&nbsp;无
              </span>

        }

      </div>
    );
  }
}

function KeysRecordCard (props) {
  const { data, withKey } = props;
  const {
    created,
    created_cost_center,
    created_department,
    created_time,
    operation_cost_center,
    operation_department,
    operation_name,
    status_desc,
    key_name
  } = data;

  return (
    <div
      style={{
        overflow: "hidden"
      }}>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                借出人:&nbsp;{_util.getOrNull(operation_name)}
      </span>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                借出人成本中心:&nbsp;{_util.getOrNull(operation_cost_center)}
      </span>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                借出人部门:&nbsp;{_util.getOrNull(operation_department)}
      </span>
      {
        withKey
          ? <span style={{
            float: "left",
            lineHeight: "22px",
            fontSize: "12px",
            padding: "0 7px",
            borderRadius: "4px",
            margin: "0 8px 0 0"
          }}>
                    钥匙:&nbsp;{_util.getOrNull(key_name)}
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
      }}>
                钥匙状态:&nbsp;{_util.getOrNull(status_desc)}
      </span>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                操作时间:&nbsp;{_util.getOrNull(created_time)}
      </span>
    </div>
  );
}

function KeysAnnualCard (props) {
  const { data } = props;
  const {
    created,
    created_cost_center,
    created_department,
    created_time,
    remarks,
    source,
    serial_number,
    status_desc
  } = data;

  return (
    <div
      style={{
        overflow: "hidden"
      }}>
      {/* <span style={{
                float: 'left',
                lineHeight: '22px',
                fontSize: '12px',
                padding: '0 7px',
                borderRadius: '4px',
                margin: '0 8px 0 0'
            }}>
                操作人:&nbsp;{_util.getOrNull(created)}
            </span>
            <span style={{
                float: 'left',
                lineHeight: '22px',
                fontSize: '12px',
                padding: '0 7px',
                borderRadius: '4px',
                margin: '0 8px 0 0'
            }}>
                操作人成本中心:&nbsp;{_util.getOrNull(created_cost_center)}
            </span>
            <span style={{
                float: 'left',
                lineHeight: '22px',
                fontSize: '12px',
                padding: '0 7px',
                borderRadius: '4px',
                margin: '0 8px 0 0'
            }}>
                操作人部门:&nbsp;{_util.getOrNull(created_department)}
            </span>
            <span style={{
                float: 'left',
                lineHeight: '22px',
                fontSize: '12px',
                padding: '0 7px',
                borderRadius: '4px',
                margin: '0 8px 0 0'
            }}>
                操作人时间:&nbsp;{_util.getOrNull(created_time)}
            </span> */}
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                钥匙编号:&nbsp;{_util.getOrNull(serial_number)}
      </span>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                钥匙状态:&nbsp;{_util.getOrNull(status_desc)}
      </span>

      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                年审时间:&nbsp;{_util.getOrNull(created_time)}
      </span>

      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
                备注:&nbsp;{_util.getOrNull(remarks)}
      </span>
      {
        source && source.split(",").length > 0
          ? <div style={{
            width: "100%",
            float: "left",
            fontSize: "12px",
            padding: "0 7px"
          }}>
            <div>附件</div>
            <PicList fileList={
              source.split(",").map(pic => {
                return {
                  uid: pic,
                  url: _util.getImageUrl(pic)
                };
              })} />
          </div>
          : <span style={{
            float: "left",
            lineHeight: "22px",
            fontSize: "12px",
            padding: "0 7px",
            borderRadius: "4px",
            margin: "0 8px 0 0"
          }}>
                    附件:&nbsp;无
          </span>
      }

    </div>
  );
}

function OnestopAnnualCard (props) {
  const { data } = props;
  const {
    own_name,
    department_name,
    cost_center_name,
    created_time,
    is_sure,
    is_reissue,
    sure_time,
    reissue_time
  } = data;

  return (
    <div
      style={{
        overflow: "hidden"
      }}>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
        <FormattedMessage id="page.onestop.keyCard.time1" defaultMessage="年审创建时间"/>:&nbsp;{_util.getOrNull(created_time)}
      </span>
      {
        is_sure && sure_time
          ? <span style={{
            float: "left",
            lineHeight: "22px",
            fontSize: "12px",
            padding: "0 7px",
            borderRadius: "4px",
            margin: "0 8px 0 0"
          }}>
            <FormattedMessage id="page.onestop.keyCard.time2" defaultMessage="年审确认时间"/>:&nbsp;{_util.getOrNull(moment(sure_time).format("YYYY-MM-DD HH:mm:ss"))}
          </span>
          : null
      }
      {
        is_reissue && reissue_time
          ? <span style={{
            float: "left",
            lineHeight: "22px",
            fontSize: "12px",
            padding: "0 7px",
            borderRadius: "4px",
            margin: "0 8px 0 0"
          }}>
            <FormattedMessage id="page.onestop.keyCard.time3" defaultMessage="年审补办时间"/>:&nbsp;{_util.getOrNull(moment(reissue_time).format("YYYY-MM-DD HH:mm:ss"))}
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
      }}>
        <FormattedMessage id="page.onestop.keyCard.time4" defaultMessage="卡证所属人"/>:&nbsp;{_util.getOrNull(own_name)}
      </span>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
        <FormattedMessage id="page.onestop.keyCard.time5" defaultMessage="卡证所属人成本中心"/>:&nbsp;{_util.getOrNull(cost_center_name)}
      </span>
      <span style={{
        float: "left",
        lineHeight: "22px",
        fontSize: "12px",
        padding: "0 7px",
        borderRadius: "4px",
        margin: "0 8px 0 0"
      }}>
        <FormattedMessage id="page.onestop.keyCard.time6" defaultMessage="卡证所属人部门"/>:&nbsp;{_util.getOrNull(department_name)}
      </span>
    </div>
  );
}

export { KeysRecordCard, KeysAnnualCard, OnestopAnnualCard };
export default KeysCard;

import React from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  message,
  Tag
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {
  privacy,
  privacyDelete,
} from "@apis/myadmin/privacy";
import privacyTypes from "./privacyTypes";
import TablePage from "@component/TablePage";
import {FormattedMessage,injectIntl, defineMessages, intlShape} from "react-intl";
import messages from "@utils/formatMsg";
import {inject, observer} from "mobx-react/index";
import moment from 'moment'
const _util = new CommonUtil();

@inject("appState") @observer
class Privacy extends React.Component {
  state = {
    column: [
      {
        title: <FormattedMessage id="app.table.column.No" defaultMessage="序号"/>,
        width: 40,
        maxWidth: 40,
        dataIndex: "efm-index",
        render: (text, record, index) => {
          return (index + 1);
        }
      },
      {
        title: <FormattedMessage id="page.system.accessType.title" defaultMessage="标题"/>,
        dataIndex: "title",
        sorter: _util.sortString,
        render: (text, record) => {
          const id = record.id;
          let path = {
            pathname: '/myadmin/privacy/detail',
            state: {
              id: id
            }
          }
          return (
            <Link to={path} onClick={this.setScrollTop}>{_util.getOrNullList(text)}</Link>
          )
        }
      },
      {
        title:<FormattedMessage id="page.system.accessType.type" defaultMessage="种类"/>,
        dataIndex: "p_type",
        sorter: _util.sortString,
        render: text => {
          const privacyType = privacyTypes.filter(privacy => privacy.id === text);

          if (privacyType.length > 0) {
            return privacyType[0].name;
          } else {
            return "无";
          }

        }
      },
      {
        title: <FormattedMessage id="page.system.accessType.createdTime" defaultMessage="创建时间"/>,
        dataIndex: "created_time",
        filterType: "range-date",
        sorter: _util.sortDate,
        render: record => _util.getOrNullList(record  ?  moment(record).format('YYYY-MM-DD') : null)
      },
      {
        title: <FormattedMessage id="page.construction.staff.updatedTime" defaultMessage="上次修改时间"/>,
        dataIndex: "updated_time",
        filterType: "range-date",
        sorter: _util.sortDate,
        render: record => _util.getOrNullList(record  ?  moment(record).format('YYYY-MM-DD') : null)
      },
      {
        title: <FormattedMessage id="page.system.accessType.operate" defaultMessage="操作"/>,
        dataIndex: "operate",
        width: 80,
        minWidth: 80,
        maxWidth: 80,
        render: (text, record, index) => {
          const id = record.id;
          let path = {
            pathname: '/myadmin/privacy/edit',
            state: {
              id: id
            }
          }
          return (
            <div>
              <Link to={path} onClick={this.setScrollTop}><FormattedMessage id="global.revise" defaultMessage="修改"/></Link>
              <Divider type='vertical' />
              <a style={{ color: "#f5222d" }} onClick={e => this.onDeleteOne(id)}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
            </div>
          );
        }
      }
    ]
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  }
  onDeleteOne = (id) => {
    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    privacyDelete(id).then((res) => {
      message.success(formatMessage(messages.alarm9));
      this.setState({ refresh: true });
    });
  }
  render() {
    const { column, refresh } = this.state;

    return (
      <div>
        <div className="content-wrapper" style={{ background: "#fff" }}>
          <TablePage
            refresh={refresh}
            getFn={privacy}
            columns={column}
            addPath={"/myadmin/privacy/add"}
            excelName={<FormattedMessage id="page.system.accessType.privacy" defaultMessage="隐私条款"/>}
            noProjectId
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(Privacy);
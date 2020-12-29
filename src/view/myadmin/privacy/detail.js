import React from "react";
import { Tag } from "antd";
import MyBreadcrumb from "@component/bread-crumb";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import { privacyDetail } from "@apis/myadmin/privacy";
import {
  observer,
  inject
} from "mobx-react";
import privacyTypes from "./privacyTypes";
import {FormattedMessage,injectIntl, defineMessages, intlShape} from "react-intl";
import messages from "@utils/formatMsg";
import moment from 'moment'
const _util = new CommonUtil();

@inject("menuState") @observer
class PrivacyDetail extends React.Component {
  state = {}

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else{
      privacyDetail(this.props.location.state.id).then(res => {
        this.setState({...res.data});
      });
    }
  }

  render() {
    const { p_type, title, content, created_time, updated_time } = this.state;
    const privacyType = privacyTypes.filter(privacy => privacy.id == p_type);
    const tableData = [
      {
        text: <FormattedMessage id="page.system.accessType.type" defaultMessage="种类"/>,
        value: privacyType.length > 0 ? privacyType[0].name : ""
      },
      {
        text: <FormattedMessage id="page.system.accessType.title" defaultMessage="标题"/>,
        value: _util.getOrNull(title)
      },
      {
        text: <FormattedMessage id="page.system.accessType.content" defaultMessage="内容"/>,
        value: <div dangerouslySetInnerHTML={{ __html: content }} />
      },
      {
        text: <FormattedMessage id="page.system.accessType.createdTime" defaultMessage="创建时间"/>,
        value: _util.getOrNull(created_time  ?  moment(created_time).format('YYYY-MM-DD') : null)
      },
      {
        text: <FormattedMessage id="page.construction.staff.updatedTime" defaultMessage="上次修改时间"/>,
        value: _util.getOrNull(updated_time  ?  moment(updated_time).format('YYYY-MM-DD') : null)
      }
    ];
    const bread = [
      {
        name: <FormattedMessage id="menu.homepage" defaultMessage="首页"/>,
        url: "/"
      },
      {
        name: <FormattedMessage id="page.system.accessType.systemManage" defaultMessage="系统管理"/>
      },
      {
        name: <FormattedMessage id="page.system.accessType.privacy" defaultMessage="隐私条款"/>,
        url: "/system/privacy"
      },
      {
        name: <FormattedMessage id="page.system.action.detail" defaultMessage="详情"/>
      }
    ];

    return (
      <div>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="page.system.accessType.privacyDetail" defaultMessage="隐私条款详情"/>} data={tableData} />
          <GoBackButton
            style={{ display: "block", margin: "0 auto" }}
            props={this.props}
            noConfirm />
        </div>
      </div>
    );
  }
}

export default injectIntl(PrivacyDetail);
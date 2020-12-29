import React from "react";
import {inject, observer} from "mobx-react/index";
import MyBreadcrumb from "@component/bread-crumb";
import {roleDetail} from "@apis/system/role";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
let _util = new CommonUtil();

@inject("menuState") @observer
class PermissionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      roleDetail(this.props.location.state.id, {project_id: _util.getStorage('project_id')}).then((res) => {
        this.setState({
          ...res.data
        });
        this.props.menuState.changeMenuCurrentUrl("/staff/role");
        this.props.menuState.changeMenuOpenKeys("/staff");
      });
    }
  }

  render() {
    const {name, desc, principal, created, created_time, updated, updated_time} = this.state;

    const tableData = [
      {
        text: <FormattedMessage id="page.system.user.roleName" defaultMessage="角色名称"/>,
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="page.system.user.roleDesc" defaultMessage="角色描述"/>,
        value: _util.getOrNull(desc)
      },
      {
        text: <FormattedMessage id="page.system.user.roleDesc" defaultMessage="创建人"/>,
        value: _util.getOrNull(created)
      },
      {
        text: <FormattedMessage id="page.system.user.created_time" defaultMessage="创建日期"/>,
        value: _util.getOrNull(created_time)
      },
      {
        text: <FormattedMessage id="page.system.user.updated" defaultMessage="上次修改人"/>,
        value: _util.getOrNull(updated)
      },
      {
        text: <FormattedMessage id="page.system.user.updated_time" defaultMessage="修改日期"/>,
        value: _util.getOrNull(updated_time)
      }
    ];
    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="page.system.user.roleDetail" defaultMessage="角色详情"/>} data={tableData} />
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}

export default PermissionDetail;

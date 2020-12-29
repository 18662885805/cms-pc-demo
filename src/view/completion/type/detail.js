import React from "react";
import {inject, observer} from "mobx-react/index";
import MyBreadcrumb from "@component/bread-crumb";
import { MeetingTypeDetail } from "@apis/meeting/type";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
let _util = new CommonUtil();

@inject("menuState") @observer
class TypeDetail extends React.Component {
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
      MeetingTypeDetail(this.props.location.state.id, {project_id: _util.getStorage('project_id')}).then((res) => {
        this.setState({
          ...res.data
        });
        this.props.menuState.changeMenuCurrentUrl("/completion/type");
        this.props.menuState.changeMenuOpenKeys("/completion");
      });
    }
  }

  render() {
    const {name, abbr, owner, created, created_time, updated, updated_time} = this.state;

    const tableData = [
      {
        text: <FormattedMessage id="page.meeting.minutes.typename" defaultMessage="类型名称"/>,
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="page.meeting.minutes.abbr" defaultMessage="缩写"/>,
        value: _util.getOrNull(abbr)
      },
      {
        text: <FormattedMessage id="page.meeting.minutes.owner" defaultMessage="所有人"/>,
        value: Array.isArray(owner) && owner.map(d => {return d.name}).join(',')
      },
      {
        text: <FormattedMessage id="page.meeting.minutes.roleDesc" defaultMessage="创建人"/>,
        value: _util.getOrNull(created)
      },
      {
        text: <FormattedMessage id="page.meeting.minutes.created_time" defaultMessage="创建日期"/>,
        value: _util.getOrNull(created_time)
      },
      {
        text: <FormattedMessage id="page.meeting.minutes.updated" defaultMessage="上次修改人"/>,
        value: _util.getOrNull(updated)
      },
      {
        text: <FormattedMessage id="page.meeting.minutes.updated_time" defaultMessage="修改日期"/>,
        value: _util.getOrNull(updated_time)
      }
    ];
    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={"详情"} data={tableData} />
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}

export default TypeDetail;

import React from "react";
import {
  inject,
  observer
} from "mobx-react";
import MyBreadcrumb from "@component/bread-crumb";
import {documentDirectoryDetail} from "@apis/document/directory";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import messages from "@utils/formatMsg";
import moment from 'moment'
let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class DirectoryDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const project_id = _util.getStorage('project_id');
    this.setState({project_id});
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      documentDirectoryDetail(project_id,{id:this.props.location.state.id}).then(res => {
        if(res.data){
            this.setState({...res.data})
        }
      })
    }
  }

  render() {
    const {name,owner,publisher,reader_condition,reader,
    created,created_time,updated,updated_time} = this.state;


    const tableData = [
      {
        text: '目录名',
        value: _util.getOrNull(name)
      },
      {
        text: '目录所有人名',
        value: Array.isArray(owner) && owner.map(d => {return d.name}).join(',')
      },
      {
        text: '发布人',
        value: Array.isArray(publisher) && publisher.map(d => {return d.name}).join(',')
      },
      {
        text: '查看方式',
        value: reader_condition == 1 ?'所有人':'固定人员'
      },
      {
        text: '查看人',
        value: Array.isArray(reader) && reader.map(d => {return d.name}).join(',')
      },
      {
        text: <FormattedMessage id="page.training.material.created" defaultMessage="创建者" />,
        value: _util.getOrNull(created)
    },
    {
        text: <FormattedMessage id="page.training.material.created_time" defaultMessage="创建时间" />,
        value: _util.getOrNull(created_time ? moment(created_time).format('YYYY-MM-DD') : null)
    },
    {
        text: <FormattedMessage id="page.training.material.updated" defaultMessage="上次修改人" />,
        value: _util.getOrNull(updated)
    },
    {
        text: <FormattedMessage id="page.training.material.updated_time" defaultMessage="修改日期" />,
        value: _util.getOrNull(updated_time ? moment(updated_time).format('YYYY-MM-DD') : null)
    },
    ];

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情"/>} data={tableData} />
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}

export default DirectoryDetail;

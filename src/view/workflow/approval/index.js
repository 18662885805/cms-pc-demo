import React from "react";
import { Link } from "react-router-dom";
import {
  Popconfirm,
  Divider,
  message
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { approval, approvalDelete } from "@apis/workflow/approval";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import {inject, observer} from "mobx-react/index";
import moment from 'moment'
const _util = new CommonUtil();

const messages = defineMessages({
  typeName: {
    id: 'app.page.system.typeName',
    defaultMessage: '职务名称',
  },
  orgtype: {
    id: 'app.page.system.orgtype',
    defaultMessage: '组织类型',
  },
})

@inject("appState") @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      column: [
        {
          title: formatMessage(translation.No),   //序号
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return (index + 1);
          }
        },
          {
          title:'模板名称',
          dataIndex: "name",
          sorter: _util.sortString,
          render: (text, record) => {return record.name}
        },
        {
          title: formatMessage(translation.created),  //创建人
          dataIndex: "created",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.created_time),  //创建时间
          dataIndex: "created_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.updated),  //上次修改人
          dataIndex: "updated",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.updated_time),  //修改时间
          dataIndex: "updated_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.operate),   //操作
          dataIndex: "operate",
          minWidth: 80,
          maxWidth: 110,
          render: (text, record, index) => {
            const id = record.id;

            let path = `/workflow/approval/edit/${id}`;
            const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
            const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");

            return (
              <div>
                {
                  canEdit? <Link to={path} onClick={this.setScrollTop}>
                              <FormattedMessage id="global.revise" defaultMessage="修改"/>
                            </Link>:null
                }
                <Divider type="vertical"/>
                {
                  canDelete?<Popconfirm placement="topRight"
                              title={<p><FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/></p>}
                              okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                              cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                              onConfirm={() => {
                                this.onDeleteOne(id);
                              }}>
                              <a style={{color: "#f5222d"}}><FormattedMessage id="global.delete"
                                defaultMessage="删除"/></a>
                            </Popconfirm>:null
                }

              </div>
            );
          }
        }
      ],
      check: _util.check()
    };
  }

  onDeleteOne(id) {
    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    approvalDelete(id, {project_id: _util.getStorage('project_id') }).then((res) => {
      if(res){
        message.success(formatMessage(translation.deleted));
        this.setState({ refresh: true });
      }
    });
  };

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  };

  render() {
    const { column, check, refresh } = this.state;
    const { formatMessage } = this.props.intl;
    const bread = [
      {
        name: formatMessage({
          id: "menu.homepage",
          defaultMessage: "首页"
        }),
        url: "/"
      },
      {
        name: formatMessage({
          id: "page.system.workFlow.systemManage",
          defaultMessage: "工作流管理"
        })
      },
      {
        name: formatMessage({
          id: "page.component.workFlow.approval1",
          defaultMessage: "审批流配置"
        }),
        url: "/approval/flow/template"
      }
    ];

    const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <TablePage
            // param={params}
            refresh={refresh}
            getFn={approval}
            columns={column}
            addPath={canAdd &&"/workflow/approval/add"}
            excelName={'审批流配置'}
            dataMap={data => {
              data.forEach((d,index) => {
                if(d.org_type){
                  d.orgtype = d.org_type.name
                }
              });
            }}
          />
        </div>
      </div>
    );
  }
}
import React from "react";
import { Link } from "react-router-dom";
import {
  Popconfirm,
  Divider,
  message
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { workType, workTypeDelete } from "@apis/system/worktype";
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
          title: formatMessage(messages.typeName),    //职务名称
          dataIndex: "name",
          sorter: _util.sortString,
          render: (text, record) => {
            return <Link to={{
              pathname: "/system/work/type/detail",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{_util.getOrNullList(record.name)}</Link>;
          }
        },
        {
          title: formatMessage(messages.orgtype),    //组织类型
          dataIndex: "orgtype",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
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

            let path = `/system/work/type/add/${id}`
            return (
              <div>

                <Link to={path} onClick={this.setScrollTop}>
                  <FormattedMessage id="global.revise" defaultMessage="修改"/>
                </Link>
                <Divider type="vertical"/>
                <Popconfirm placement="topRight"
                  title={<p><FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/></p>}
                  okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                  cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                  onConfirm={() => {
                    this.onDeleteOne(id);
                  }}>
                  <a style={{color: "#f5222d"}}><FormattedMessage id="global.delete"
                    defaultMessage="删除"/></a>
                </Popconfirm>
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
    workTypeDelete({ id: id, project_id: _util.getStorage('project_id') }).then((res) => {
      message.success(formatMessage(translation.deleted));
      this.setState({ refresh: true });
    });
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  }
  render() {
    const { column, check, refresh } = this.state;
    const { formatMessage } = this.props.intl;
    // let params = {project_id: _util.getStorage('project_id')}
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
          id: "page.system.accessType.systemManage",
          defaultMessage: "系统管理"
        })
      },
      {
        name: formatMessage({
          id: "page.component.breadcrumb.worktype",
          defaultMessage: "职务管理"
        }),
        url: "/system/work/type"
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <TablePage
            // param={params}
            refresh={refresh}
            getFn={workType}
            columns={column}
            addPath={"/system/work/type/add"}
            excelName={check(this, "excel") && '职务管理'}
            dataMap={data => {
              data.forEach((d,index) => {
                if(d.org_type){
                  d.orgtype = d.org_type.name
                }
                // d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                // d.updated_time = d.updated_time ? moment(d.updated_time).format('YYYY-MM-DD HH:mm') : '-'
              });
            }}
          />
        </div>
      </div>
    );
  }
}
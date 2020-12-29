import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "antd";

import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { orgapply } from "@apis/system/orgapply";
import TablePage from "@component/TablePage";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import {inject, observer} from "mobx-react/index";
import moment from 'moment'
const _util = new CommonUtil();

const messages = defineMessages({
  organize_name: {
    id: 'page.system.organize.organize_name',
    defaultMessage: '组织名称',
  },
  organize_type: {
    id: 'page.system.organize.organize_type',
    defaultMessage: '组织类型',
  },
  address: {
    id: 'page.system.organize.address',
    defaultMessage: '组织地址',
  },
  name: {
    id: 'page.system.organize.name',
    defaultMessage: '联系人',
  },
  phone: {
    id: 'page.system.organize.phone',
    defaultMessage: '联系人手机号',
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
          title: <FormattedMessage id="No"/>,
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return (index + 1);
          }
        },
        {
          title: <FormattedMessage id="system.setting.org.name"/>,     //组织名称
          dataIndex: "company",
          sorter: _util.sortString,
          filterType: 'select',
          render: (text, record) => {
            return <Link to={{
              pathname: "/system/org/application/detail",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{_util.getOrNullList(record.company)}</Link>;
          }
        },
        {
          title: <FormattedMessage id="system.setting.org.type"/>,     //组织类型
          dataIndex: "type_desc",
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="system.setting.org.address"/>,     //组织地址
          dataIndex: "address",
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="desc"/>,     
          dataIndex: "desc",
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="system.setting.org.contact"/>,     //联系人
          dataIndex: "name",
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="phone-number"/>,    //联系人手机号
          dataIndex: "phone",
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="created_time"/>,
          dataIndex: "created_time",
          sorter: _util.sortDate,
          filterType: 'range-date',
          render: record => _util.getOrNullList(record  ?  moment(record).format('YYYY-MM-DD') : null)
        },
        {
          title: <FormattedMessage id="approve_time"/>,
          dataIndex: "operation_time",
          sorter: _util.sortDate,
          filterType: 'range-date',
          render: record => _util.getOrNullList(record  ?  moment(record).format('YYYY-MM-DD') : null)
        },

        {
          title:<FormattedMessage id="status"/>,
          dataIndex: "status_desc",
          width: 80,
          minWidth: 80,
          maxWidth: 80,
          sorter: _util.sortString,
          filterType: 'select',
          render: (val, record) => {
            return <Tag color={_util.getColor(record.status)}>{val}</Tag>;
          }
        },
        {
          title: <FormattedMessage id="operation"/>,
          dataIndex: "operate",
          // width: 60,
          minWidth: 60,
          // maxWidth: 60,
          render: (text, record, index) => {
            const id = record.id;

            return (
              <div>
                {
                  record.status === 3 ?
                  <Link to={{
                    pathname: `/system/org/application/audit/${id}`
                  }} onClick={this.setScrollTop}><FormattedMessage id="app.page.text.approval" defaultMessage="审批"/></Link>
                  :
                  null
                }
              </div>
            );
          }
        }
      ],
      check: _util.check()
    };
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  }

  render() {
    const { column, refresh, check } = this.state;
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
          id: "menu.system.org-audit",
          defaultMessage: "组织审批"
        }),
        url: "/system/org/application"
      }
    ];
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={orgapply}
            columns={column}
            excelName={'组织审批'}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach((d,index) => {
                d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                d.status_desc = _util.genStatusDesc(d.status)
                if(d.role){
                  d.role_name = Array.isArray(d.role) && d.role.map(c => {return c.name}).join(',')
                }
                if(d.created){
                  d.real_name = d.created.name
                  d.phone = d.created.phone
                }
                if(d.org_type){
                  d.type_desc = d.org_type.name
                }
              });
            }}
          />
        </div>
      </div>
    );
  }
}

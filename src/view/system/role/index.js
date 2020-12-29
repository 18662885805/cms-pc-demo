import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Popconfirm, Divider, message } from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { role, roleDelete } from "@apis/system/role";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from "../translation";
import {inject, observer} from "mobx-react/index";
import moment from 'moment'
const _util = new CommonUtil();
const roles = ["组织", "员工", "hr", "环境安全", "承包商", "前台", "门卫", "员工注册审批", "承包商注册审批"];


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
          title: formatMessage(translation.rolename),    //角色名称
          dataIndex: "name",
          sorter: _util.sortString,
          render: (text, record) => {
            return <Link to={{
              pathname: "/staff/role/detail",
              state: {
                id: record.id
              }
            }} style={{
              // color: roles.indexOf(text) > -1 ? "rgb(245, 34, 45)" : "#40a9ff"
            }} onClick={this.setScrollTop}>{_util.getOrNullList(record.name)}</Link>;
          }
        },
        {
          title: '组织',    //组织
          dataIndex: "org",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record.company ? record.company : null)
        },
        {
          title: formatMessage(translation.roledesc),    //角色描述
          dataIndex: "desc",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.created),     //创建人
          dataIndex: "created",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.created_time),    //创建日期
          dataIndex: "created_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.updated),   //上次修改人
          dataIndex: "updated",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.updated_time),    //修改日期
          filterType: "range-date",
          dataIndex: "updated_time",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage({ id:"page.system.user.operate", defaultMessage:"操作"}),
          dataIndex: "operate",
          // width: 80,
          minWidth: 80,
          maxWidth: 110,
          render: (text, record, index) => {
            const id = record.id;
            // let path = {
            //   pathname: "/system/role/edit",
            //   state: {
            //     id: id
            //   }
            // };
            let path = `/staff/role/add/${id}`
            const {name} = record;

            return (
              <div>
                <Link to={path} onClick={this.setScrollTop}>
                  <FormattedMessage id="global.revise" defaultMessage="修改"/>
                </Link>
                <Divider type="vertical"/>
                <Popconfirm
                  title="删除后相关账号会失去角色的权限，请确认？"
                  okText='确认'
                  cancelText='取消'
                  onConfirm={() => {
                    this.onDeleteOne(id);
                  }}>
                  <a style={{color: "#f5222d"}}><FormattedMessage id="global.delete"
                    defaultMessage="删除"/></a>
                </Popconfirm>
                {/* {
                  roles.indexOf(name) < 0
                    ? <Fragment>
                      <Divider type="vertical"/>
                      <Popconfirm
                        title="删除后相关账号会失去角色的权限，请确认？"
                        okText='确认'
                        cancelText='取消'
                        onConfirm={() => {
                          this.onDeleteOne(id);
                        }}>
                        <a style={{color: "#f5222d"}}><FormattedMessage id="global.delete"
                          defaultMessage="删除"/></a>
                      </Popconfirm>
                    </Fragment>
                    : null
                } */}

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
  onDeleteOne = id => {
    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    roleDelete(id, {project_id: _util.getStorage('project_id')}).then((res) => {
      message.success(formatMessage(translation.deleted));   //已删除
      this.setState({ refresh: true });
    });
  }
  render() {
    const { column, refresh, check } = this.state;
    const { formatMessage } = this.props.intl;
    let params = {project_id: _util.getStorage('project_id')}
    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <TablePage
            // testdata
            param={params}
            refresh={refresh}
            getFn={role}
            columns={column}
            addPath={"/staff/role/add"}
            excelName={check(this, "excel") && formatMessage({ id:"page.system.user.roleManagement", defaultMessage:"角色管理"})}
            dataMap={data => {
              data.forEach((d,index) => {
                d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                d.updated_time = d.updated_time ? moment(d.updated_time).format('YYYY-MM-DD HH:mm') : '-'
                // d.name = ["员工", "承包商", "门卫", "承包商员工"][index]
                // d.username = '1889' + Math.floor(Math.random()*10000000)
                // d.real_name = Math.random().toString(36).substring(2);
                // d.tel = '0512-6286' + `${Math.floor(Math.random()*10000)}`
                // d.email = Math.floor(Math.random()*1000000) + '@163.com'
                // d.created = 'dwa'
                // if(d.company){
                //   d.company = '20200108189' + Math.floor(Math.random()*1000)
                // }
                // if(d.real_name){
                //   d.real_name = Math.random().toString(36).substring(2);
                // }
              });
            }}
          />
        </div>
      </div>
    );
  }
}
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Popconfirm,
  Divider,
  message,
  Tag
} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { permission, permissionDelete } from '@apis/myadmin/permission'
import TablePage from '@component/TablePage'
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";

import {inject, observer} from 'mobx-react/index'
const _util = new CommonUtil()

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  title: formatMessage({ id:"app.table.column.No", defaultMessage:"序号"}),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  title: formatMessage({ id:"page.system.accessType.permissionName", defaultMessage:"权限名称"}),
                  dataIndex: 'name',
                  sorter: _util.sortString,
                  render: (text, record, index) => this.renderPermissionName(record)
              },
              {
                  title: formatMessage({ id:"page.system.accessType.menuName", defaultMessage:"菜单名称"}),
                  dataIndex: 'menu',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: formatMessage({ id:"page.system.accessType.url", defaultMessage:"接口地址"}),
                  dataIndex: 'url',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: formatMessage({ id:"page.system.accessType.action", defaultMessage:"请求方式"}),
                  dataIndex: 'action',
                  sorter: _util.sortString,
                  render: record => _util.getRequestType(record)
              },
              {
                  title: formatMessage({ id:"page.system.accessType.operate", defaultMessage:"操作"}),
                  dataIndex: 'operate',
                  width: 80,
                  minWidth: 80,
                  maxWidth: 80,
                  render: (text, record, index) => {
                      const id = record.id
                      let path = `/myadmin/permission/add/${id}`
                      return (
                          <div>
                              <Link to={path} onClick={this.setScrollTop}>
                                  <FormattedMessage id="global.revise" defaultMessage="修改"/>
                              </Link>
                              <Divider type="vertical"/>
                              <Popconfirm
                                  title={<FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/>}
                                  okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                                  cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                                  onConfirm={() => {
                                      this.onDeleteOne(id)
                                  }}>
                                  <a style={{color: '#f5222d'}}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
                              </Popconfirm>
                          </div>
                      )
                  }
              }
          ]
      }
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }
  onDeleteOne = (id) => {
    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    permissionDelete(id).then((res) => {
      message.success('已删除')
      this.setState({ refresh: true })
    })
  }

  renderPermissionName = (record) => {
    if(record.module){
    return <Tag color="#108ee9">{record.module} / {record.name}</Tag>
    }else{
      return record.name
    }
  }


  render() {
    const { column, refresh } = this.state

    return (
      <div>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={permission}
            columns={column}
            addPath={'/myadmin/permission/add'}
            excelName={<FormattedMessage id="page.system.accessType.permissionManage" defaultMessage="权限管理"/>}
            rememberPosition={true}
          />
        </div>
      </div>
    )
  }
}
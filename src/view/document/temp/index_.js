import React from 'react'
import { Link } from 'react-router-dom'
import { Tag } from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { workType } from '@apis/document/temp'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import {inject, observer} from 'mobx-react/index'
const _util = new CommonUtil()

const all = defineMessages({
  title1: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  title2: {
      id:"page.doc.allDoc.title2",
      defaultMessage:"文档编号"

  },
  title3: {
      id:"page.doc.allDoc.title3",
      defaultMessage:"文档名称"
  },
  title4: {
    id: 'page.doc.allDoc.title4',
    defaultMessage: '文档模板',
  },
  title5: {
    id: 'page.doc.allDoc.title5',
    defaultMessage: '文档描述',
  },
  title6: {
    id: 'page.doc.allDoc.title6',
    defaultMessage: '文档开始时间',
  },
  title7: {
    id: 'page.doc.allDoc.title7',
    defaultMessage: '是否可审批',
  },
  title8: {
    id: 'page.oneStop.cardOperation.status',
    defaultMessage: '状态',
  },
  title9: {
    id: 'page.oneStop.cardAnnual.createdTime',
    defaultMessage: '创建时间',
  },
    title10: {
    id: 'page.oneStop.cardAnnual.updatedTime',
    defaultMessage: '上次修改时间',
  },
})

@inject('appState') @observer  @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  title: '序号',
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  title: '文档编号',
                  dataIndex: 'code',
                  sorter: _util.sortString,
                  render: (value, record) => <Link to={`/document/alldocument/detail/${record.id}`} onClick={this.setScrollTop}>{value}</Link>
              },
              {
                  title: '文档名称',
                  dataIndex: 'name',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: '文档模板',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record && record.template.name)
              },
              {
                  title: '文档描述',
                  dataIndex: 'desc',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: '文档开始时间',
                  dataIndex: 'start_day',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: '是否可审批',
                  sorter: _util.sortString,
                  render: (_, record) => {
                      return record.is_audit ? '是' : '否'
                  }
              },
              {
                  title: '状态',
                  sorter: _util.sortString,
                  render: (_, record) => {
                      if (record.is_audit) {
                          return <Tag color={_util.getColor(record.status)}>{record.status_desc}</Tag>
                      }
                  }
              },
              {
                  title: '创建时间',
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: '上次修改时间',
                  dataIndex: 'updated_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
          ],
          check: _util.check(),
      }
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  render() {
    const { column, check } = this.state;
    const { formatMessage } = this.props.intl;
    const bread = [
      {
        name:<FormattedMessage id="menu.homepage" defaultMessage="首页" />,
        url: '/'
      },
      {
        name: <FormattedMessage id="page.doc.allDoc.title16" defaultMessage="文档管理" />
      },
      {
        name: <FormattedMessage id="page.component.breadcrumb.alldoc" defaultMessage="所有文档" />,
        url: '/document/alldocument'
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <TablePage
            getFn={workType}
            columns={column}
            addPath={check(this, 'add') && '/system/costcenter/add'}
            excelName={check(this, 'excel') && formatMessage({ id:"page.component.breadcrumb.alldoc", defaultMessage:"所有文档"})}
          />
        </div>
      </div>
    )
  }
}

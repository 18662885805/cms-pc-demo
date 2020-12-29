import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
    Divider,
    Popconfirm,
    message, Tag, Icon, Button
} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {rule, ruleDelete, rulePost} from '@apis/workorder/rule'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {inject, observer} from 'mobx-react/index'
const _util = new CommonUtil();

const type = defineMessages({
  title1: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  title2: {
      id:"page.work.my.title26",
      defaultMessage:"接单人"
  },
  title3: {
      id:"page.doc.temp.title3",
      defaultMessage:"报修类型"
  },
  title4: {
    id: 'page.doc.allDoc.title7',
    defaultMessage: '创建人',
  },
  title5: {
    id: 'page.oneStop.cardAnnual.createdTime',
    defaultMessage: '创建时间',
  },
    title6: {
    id: 'page.construction.contractor.lastReviser',
    defaultMessage: '上次修改人',
  },
    title7: {
    id: 'page.oneStop.cardAnnual.updatedTime',
    defaultMessage: '上次修改时间',
  },
    title8: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
     title9: {
    id: 'page.order.type.factoryName',
    defaultMessage: '工厂',
  },
      title10: {
    id: 'page.order.type.weekend',
    defaultMessage: '周末是否接单',
  },
      title11: {
    id: 'page.walkthrough.status',
    defaultMessage: '状态',
  },
});

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  //title: '序号',
                  title:formatMessage(type.title1),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  //title: '工单类型',
                  title:'组织',
                  dataIndex: 'org_name',
                  sorter: _util.sortString,
                    render: (text, record) => {
                      return <Link to={{
                          pathname: '/assignment/rule/detail',
                          state: {
                              id: record.id
                          }
                      }} onClick={this.setScrollTop}>{_util.getOrNullList(text)}</Link>
                  }

              },
              {   title:'执行人',
                  dataIndex: 'users',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record.map(a=>a.name).join(','))
              },
              {   title:'规则数目',
                  dataIndex: 'rules',
                  sorter: _util.sortString,
                  render: (text,record) => _util.getOrNullList(record.rules.length)
              },
              {
                  //title: '创建人',
                  title:formatMessage(type.title4),
                  dataIndex: 'created',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '创建日期',
                  title:formatMessage(type.title5),
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '上次修改人',
                  title:formatMessage(type.title6),
                  dataIndex: 'updated',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '创建日期',
                  title:'上次修改日期',
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '操作',
                  title:formatMessage(type.title8),
                  dataIndex: 'operate',
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  render: (text, record) => {
                      const {id} = record
                      const path = {
                          pathname: '/assignment/rule/add',
                          state: {
                              id: record.id,
                          }
                      };

                      const { formatMessage } = this.props.intl;
                      const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
                      const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");

                      return <Fragment>
                          {
                              canEdit?<Fragment>
                                  <Link to={path} onClick={this.setScrollTop}><FormattedMessage id="app.text.myproject.modify" defaultMessage="修改"/></Link>
                                  <Divider type='vertical'/>
                              </Fragment>:null
                          }
                          {
                              canDelete?<Popconfirm
                              title={<p>确定删除?</p>}
                              placement="topRight"
                              okText={formatMessage(messages.alarm3)}
                              cancelText={formatMessage(messages.alarm4)}
                              onConfirm={() => {
                                  this.onDeleteOne(id)
                              }}>
                              <a style={{color: '#f5222d'}}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
                          </Popconfirm>:null
                          }
                      </Fragment>
                  }
              }
          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
      }
  }
  onDeleteOne = id => {
    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    ruleDelete(id,{project_id:_util.getStorage("project_id")}).then((res) => {
      message.success(formatMessage(messages.alarm9))
      this.setState({ refresh: true })
    })
  };

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  };

  render() {
    const { column, check, refresh } = this.state;
    const { formatMessage } = this.props.intl;
    const canAdd = _util.getStorage('is_project_admin') || this.state.check(this, "add");
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
          id: "page.system.task.systemManage",
          defaultMessage: "任务管理"
        })
      },
      {
        name:'执行规则',
        url: "/assignment/rule"
      }
    ];
    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={rule}
            columns={column}
            addPath={canAdd && '/assignment/rule/add'}
            excelName={true && '执行规则'}
            onSelectChange={this.onSelectChange}   //选择行
          >
          </TablePage>
        </div>
      </div>
    )
  }
}

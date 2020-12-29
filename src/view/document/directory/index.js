import React from 'react'
import { Link } from 'react-router-dom'
import { Tag,Popconfirm, message  } from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { documentDirectory,documentDirectoryDelete } from '@apis/document/directory'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { inject, observer } from 'mobx-react/index'
import translation from '../translation'
import moment from 'moment'
const _util = new CommonUtil()

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
    this.state = {
      check: _util.check(),
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
          title: '目录名称',
          dataIndex: 'name',
          sorter: _util.sortString,
          render: (value, record) => {
            const id = record.id
            let path = {
              pathname: '/document/directory/detail',
              state: {
                id: id
              }
            };
            return (
                <Link to={path}>
                  {value}
                </Link>
            )
          } 
        },
        {
          title: '目录所有人',
          dataIndex: 'owner',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '发布人',
          dataIndex: 'publisher',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '查看人',
          dataIndex: 'reader_condition',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.created),
          dataIndex: 'created',
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: '创建时间',
          dataIndex: 'created_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.updated),
          dataIndex: 'updated',
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: '上次修改时间',
          dataIndex: 'updated_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.operate),    //操作
          dataIndex: 'operate',
          width: 120,
          minWidth: 120,
          maxWidth: 120,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/document/directory/edit',
              state: {
                id: id
              }
            }
            const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
            const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
            return (
              <div
              >
                {
                  canEdit ?
                  <Link to={path} style={{ marginRight: '10px' }} onClick={this.setScrollTop}>
                    <FormattedMessage id="app.page.text.modify" defaultMessage="修改" />
                  </Link> :''
                }
                {
                  canDelete ?
                  <Popconfirm
                    title={<FormattedMessage id="app.pop.title.delete" defaultMessage="确认删除？" />}
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}
                    cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}
                    onConfirm={() => {
                      this.onDeleteOne(id)
                  }}>
                    <a style={{ color: '#f5222d' }}> <FormattedMessage id="app.page.text.delete" defaultMessage="删除" /> </a>
                  </Popconfirm> :''
                }      
              </div>
            )
          }
        }
      ],
      refresh:false
    }
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if (scrollTopPosition) {
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  onDeleteOne = id => {
    const {formatMessage} = this.props.intl;
    const project_id =  _util.getStorage('project_id');
    this.setState({ refresh: false })
    documentDirectoryDelete(project_id,{id:id}).then((res) => {
      message.success('已删除')      //已删除
      this.setState({ refresh: true })
    })
}

  render() {
    const { column, check,refresh } = this.state;
    const { formatMessage } = this.props.intl;
    const bread = [
      {
        name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页" />,
        url: '/'
      },
      {
        name: <FormattedMessage id="app.page.bread.document" defaultMessage="文档管理" />
      },
      {
        name: <FormattedMessage id="app.page.bread.directory" defaultMessage="目录管理" />,
        url: '/document/directory'
      }
    ];
    const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <TablePage
            getFn={documentDirectory}
            refresh={refresh}
            columns={column}
            addPath={canAdd && '/document/directory/add'}
            excelName={formatMessage({ id: "page.component.breadcrumb.alldoc", defaultMessage: "目录管理" })}
            dataMap={data => {
              data.forEach((d,index) => {
                d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                d.updated_time = d.updated_time ? moment(d.updated_time).format('YYYY-MM-DD HH:mm') : '-'
                d.reader_condition = d.reader_condition == 1 ? '所有人' :'固定人员'
                d.owner = d.owner&&d.owner.length ? _util.renderListToString(d.owner,'name')  :''
                d.publisher = d.publisher&&d.publisher.length ? _util.renderListToString(d.publisher,'name')  :''
              });
            }}
          />
        </div>
      </div>
    )
  }
}

import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Button, Input, Select, Modal, Spin, Divider, Popconfirm, message} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {debounce} from 'lodash'
import { Types, TypeDelete } from '@apis/facility/types'
import moment from 'moment'
import TablePage from '@component/TablePage'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import {inject, observer} from 'mobx-react/index'

const {Search} = Input
const {TextArea} = Input
const _util = new CommonUtil()
const {Option} = Select;

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  type: {
    id: 'page.walkthrough.types.type',
    defaultMessage: '类型',
  },
  abbr: {
    id: 'page.walkthrough.abbr',
    defaultMessage: '简写',
  },
  desc: {
    id: 'page.walkthrough.types.desc',
    defaultMessage: '描述',
  },
  created: {
    id: 'page.walkthrough.created_name',
    defaultMessage: '创建人',
  },
  created_time: {
    id: 'page.walkthrough.created_time',
    defaultMessage: '创建时间',
  },
  updated: {
    id: 'page.walkthrough.updated_name',
    defaultMessage: '上次修改人',
  },
  updated_time: {
    id: 'page.walkthrough.updated_time',
    defaultMessage: '修改时间',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  deleted: {
    id: 'app.message.walkthrough.deleted',
    defaultMessage: '已删除',
  },
  maintenanceType: {
    id: 'app.excel.export.maintenanceType',
    defaultMessage: '维护类型',
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
          title: formatMessage(messages.No),  //序号
          width: 40,
          maxWidth: 40,
          dataIndex: 'efm-index',
          render: (text, record, index) => {
            return (index + 1)
          }
        },
        {
          title: formatMessage(messages.type),  //类型
          dataIndex: 'name',
          sorter: _util.sortString,
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/mtype/detail',
              state: {
                id: record.id
              }
            }
            return (

              <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}} onClick={this.setScrollTop}>
                {record.name}
              </Link>

            );
          }
        },
        {
          title: formatMessage(messages.abbr),    //简写
          dataIndex: 'abbr',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.desc),    //描述
          dataIndex: 'desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),    //创建人
          dataIndex: 'created_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created_time),    //创建时间
          dataIndex: 'created_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              record.created_time ? moment(record.created_time).format('YYYY-MM-DD HH:mm') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.updated),    //上次修改人
          dataIndex: 'updated_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated_time),    //修改时间
          dataIndex: 'updated_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.operate),   //操作
          width: 80,
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/mtype/edit',
              state: {
                id: id
              }
            }
            return (
              <div>
                <Link to={path} onClick={this.setScrollTop}>
                  <FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" />
                </Link>
                <Divider type="vertical"/>

                <Popconfirm placement="topRight"
                    title={<FormattedMessage id="app.confirm.title.delete" defaultMessage="是否删除，请确认？" />}
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}
                    cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}
                    onConfirm={() => {
                  this.onDeleteOne(id)
                }}>
                  <a style={{color: '#f5222d'}}><FormattedMessage id="app.walkthrough.text.delete" defaultMessage="删除" /></a>
                </Popconfirm>

              </div>
            );
          }
        }
      ],
      data: [],
      pagination: {
        pageSize: _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: 1
      },
      loading: false,
      selectedRowKeys: null,
      search: null,
      selectedRows: [],
      fetching: false,
      searchOptions: [],
      searchOptionsNew: [],
      typeOptions: [],
      modalVisible: false,
      check: _util.check(),
      typeObj: {},
      postData: {}
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.exportExcel = this.exportExcel.bind(this)
    this.lastFetchId = 0
    this.lastFetchIdNew = 0
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  getInfo(params) {
    this.setState({
      loading: true
    })
    Types(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  onDeleteOne = (id) => {
    const { formatMessage } = this.props.intl
    this.setState({refresh: false})
    TypeDelete(id).then((res) => {
      message.success(formatMessage(messages.deleted))   //已删除
      this.setState({refresh: true})
      // _util.onDeleteOne(res, this)
    })
  }

  componentDidMount() {
    // _util.fixTableHead()
    // this.getInfo()

  }

  handleTableChange(pagination, filters, sorter) {
    _util.handleTableChange(pagination, filters, sorter, this)
  }

  handleSearch(value) {
    _util.handleSearch(value, this)
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows
    })
  }

  exportExcel() {
    const { formatMessage } = this.props.intl
    const {selectedRows, column} = this.state

    _util.exportExcel(selectedRows, column, formatMessage(messages.maintenanceType))   //维护类型

  }

  render() {
    const {selectedRowKeys, refresh, column, check} = this.state
    const { formatMessage } = this.props.intl
    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={Types}
            columns={column}
            excelName={check(this, 'excel') && formatMessage(messages.maintenanceType)}
            dataMap={data => {
              data.forEach(d => {
                if(d.updated_time){
                  d.updated_time = moment(d.updated_time).format('YYYY-MM-DD HH:mm')
                }
              })
            }}
          >
            {
              this.state.check(this, 'add')
                ?
                <Link to="/eqp/mtype/add" onClick={this.setScrollTop}>
                  <Button type="primary"><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>
                </Link>
                :
                null
            }
          </TablePage>
        </div>
      </div>
    )
  }
}


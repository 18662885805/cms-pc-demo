import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Input, Tag, Tooltip} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {RuleSearchEqpt} from '@apis/facility/syseqpt'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable2'
import GoBackButton from '@component/go-back'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'

let _util = new CommonUtil()
const {RangePicker} = DatePicker
const {Option} = Select
const {Search} = Input

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  type_desc: {
    id: 'page.walkthrough.common.type_desc',
    defaultMessage: '类型',
  },
  trade_key: {
    id: 'page.walkthrough.common.trade_key',
    defaultMessage: '类KEY',
  },
  system_eqpt_key: {
    id: 'page.walkthrough.common.system_eqpt_key',
    defaultMessage: '系统/设备KEY',
  },
  system_eqpt_name: {
    id: 'page.walkthrough.common.system_eqpt_name',
    defaultMessage: '系统/设备名称',
  },
  code: {
    id: 'page.walkthrough.common.code',
    defaultMessage: '系统/设备编号',
  },
  relatedpackage: {
    id: 'page.walkthrough.common.relatedpackage',
    defaultMessage: '关联任务包',
  },
  created: {
    id: 'page.walkthrough.created_name',
    defaultMessage: '创建人',
  },
  updated_name: {
    id: 'page.walkthrough.updated_name',
    defaultMessage: '上次修改人',
  },
  updated_time: {
    id: 'page.walkthrough.updated_time',
    defaultMessage: '修改时间',
  },
  norelated: {
    id: 'page.walkthrough.norelated',
    defaultMessage: '未关联',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
});

@injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
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
          title: formatMessage(messages.type_desc),   //类型
          width: 80,
          sorter: _util.sortString,
          dataIndex: 'type_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.trade_key),     //类KEY
          sorter: _util.sortString,
          dataIndex: 'trade_key_abbr',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.system_eqpt_key),    //系统/设备KEY
          sorter: _util.sortString,
          dataIndex: 'related_key_abbr',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.system_eqpt_name),    //系统/设备名称
          dataIndex: 'name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.code),    //系统/设备编号
          minWidth: 220,
          sorter: _util.sortString,
          dataIndex: 'sys_eqp_no',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.relatedpackage),   //关联任务包
          dataIndex: 'package',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),    //创建人
          sorter: _util.sortString,
          dataIndex: 'created_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated_name),   //上次修改人
          sorter: _util.sortString,
          dataIndex: 'updated_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated_time),    //修改时间
          dataIndex: 'updated_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              <Tooltip
                title={record.updated_time ? moment(record.updated_time).format('YYYY-MM-DD HH:mm') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                {record.updated_time ? moment(record.updated_time).format('YYYY-MM-DD HH:mm') : '-'}
              </Tooltip>
            )
          }
        },
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
      selectedRows: [],
      check: _util.check(),
      search: null,
      search_data: [],
      search_id: null,
      search_info: '',
      visible: false,
      approve_list: [],
    }

    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.onDeleteOne = this.onDeleteOne.bind(this)
    this.openNotification = this.openNotification.bind(this)
    this.getInfo = this.getInfo.bind(this)
    this.exportExcel = this.exportExcel.bind(this)
  }

  getInfo(params) {
    this.setState({
      loading: true
    });
    let _this = this
    RuleSearchEqpt(params).then((res) => {
      // _util.getInfo(res, this)
        let data = res.data
        if (typeof data === 'string') return

        const pagination = {..._this.state.pagination}
        // pagination.total = data.count
        let data_array = data.results
        let result = []
        if (data_array && data_array.length && data_array instanceof Array) {
            data_array.map((value, index, array) => {
                return result.push({
                    ...value
                })
            })
        }

        document.getElementById('root').scrollTop = 0
        // console.log(pagination.current)
        // console.log(result[1].not_assign_data)
        pagination.total = result[1].not_assign_data.length
        // console.log(result[1].not_assign_data.length)
        _this.setState({
            data: result[1].not_assign_data,
            loading: false,
            pagination: pagination,
        })
    });

    this.setState({
      rule_id: this.props.location.state.id
    })
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      console.log(this.props.location.state.id)

     // _util.fixTableHead()
      this.getInfo({
        // page:this.state.pagination.current,
        page_size: this.state.pagination.pageSize,
        rule_id: this.props.location.state.id
        // record_id:"e575b28a-42ae-4b69-8b05-dea8088f1bf1"
      })
    }
  }

  handleTableChange(pagination, filters = {}, sorter) {
    if (this.state.card_type) {
      filters.card_type = this.state.card_type
    }
    _util.handleTableChange(pagination, filters, sorter, this)
  }

  handleSearch(value) {
    _util.handleSearch(value, this)
  }

  openNotification(msg) {
    _util.openNotification(msg)
  }

  onDeleteOne(id) {
    // annualtrialDelete(id).then((res) => {
    //   _util.onDeleteOne(res, this)
    // })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
      selectedRows
    })
  }

  exportExcel = () => {
    const { formatMessage } = this.props.intl
    const {selectedRows, column} = this.state

    _util.exportExcel(selectedRows, column, formatMessage(messages.norelated))    //未关联

  }

  enabled = () => {
    const {selectedRowKeys, pagination} = this.state
    const {enabledText} = this.props
    if (selectedRowKeys && selectedRowKeys.length) {
      // enabledPost({ids: selectedRowKeys.join(',')}).then((res) => {
      //   this.setState({
      //     searchValue: ''
      //   })
      //   message.success(enabledText ? `${enabledText}成功` : '启用成功')
      //   this.onSelectChange([], [])
      //   this.getInfo({
      //     page_size: pagination.pageSize,
      //     page: pagination.current,
      //   })
      // })
    } else {
      message.warning('请选择要提交的数据')
    }
  }

  doFilter = () => {
    const {column, filtering} = this.state

    if (!filtering) {
      column.forEach(c => {
        if (c.dataIndex !== 'operate' && c.dataIndex !== 'efm-index' && c.dataIndex !== 'operate1') {
          c.filter = true
        }
      })
      this.setState({column, filtering: true, reset: false})
    } else {
      column.forEach(c => {
        c.filter = false
      })
      this.setState({column, filtering: false, reset: true})
    }
  }

  render() {

    const {
      column, data, pagination, loading, selectedRowKeys, filtering
    } = this.state
    const {formatMessage} = this.props.intl

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">

          <div className="btn-group">
            {
              this.state.check(this, 'enabled')
                ?
                <Popconfirm title="确定启用？" okText='确认' cancelText='取消' onConfirm={() => this.enabled()}>
                  <Button type="primary">
                    <FormattedMessage id="component.tablepage.enable" defaultMessage="启用" />
                  </Button>
                </Popconfirm>
                :
                null
            }
            {
              this.state.check(this, 'excel')
                ?
                <Button type="primary" onClick={this.exportExcel}>
                  <FormattedMessage id="component.tablepage.export" defaultMessage="导出" />
                </Button>
                :
                null
            }
            <Button type="primary" onClick={this.exportExcel}>
              <FormattedMessage id="component.tablepage.export" defaultMessage="导出" />
            </Button>
            <Button
              style={{
                background: filtering ? '#87d068' : '#1890ff',
                border: 0,
                color: '#fff'
              }}
              onClick={this.doFilter}
            >
              <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选" />
            </Button>
            <GoBackButton props={this.props} noConfirm/>

            <Search
              placeholder={formatMessage(messages.full_table_search)}  //全表搜索
              onSearch={this.handleSearch}
              enterButton
              style={{float: 'right', width: '250px'}}
            />
          </div>
          <VirtualTable
            columns={this.state.column}
            dataSource={this.state.data}
            onPaginationChange={this.handleTableChange}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onSelectChange={this.onSelectChange}
            reset={this.state.reset}
          />
        </div>
      </div>
    )
  }
}


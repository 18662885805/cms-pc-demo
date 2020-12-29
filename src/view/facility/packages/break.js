import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Table, Input, Tag} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {TaskBreakList} from '@apis/facility/packages'
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
  start_time: {
    id: 'page.walkthrough.record.start_time',
    defaultMessage: '开始时间',
  },
  end_time: {
    id: 'page.walkthrough.record.end_time',
    defaultMessage: '结束时间',
  },
  break_desc: {
    id: 'page.walkthrough.record.break_desc',
    defaultMessage: '是否永久打断',
  },
  belongpackage: {
    id: 'page.walkthrough.record.belongpackage',
    defaultMessage: '所属任务包',
  },
  remark: {
    id: 'page.walkthrough.record.remark',
    defaultMessage: '备注',
  },
  created: {
    id: 'page.walkthrough.record.created_name',
    defaultMessage: '创建人',
  },
  break_records: {
    id: 'page.walkthrough.record.break_records',
    defaultMessage: '中断记录',
  },
  yes: {
    id: 'page.walkthrough.content.yes',
    defaultMessage: '是',
  },
  no: {
    id: 'page.walkthrough.content.no',
    defaultMessage: '否',
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
          title: formatMessage(messages.start_time),   //开始时间
          dataIndex: 'start_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.end_time),    //结束时间
          dataIndex: 'end_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.break_desc),   //是否永久打断
          dataIndex: 'break',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.belongpackage),    //所属任务包
          dataIndex: 'package_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.remark),   //备注
          dataIndex: 'desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),    //创建人
          dataIndex: 'created_name',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
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

    TaskBreakList(params).then((res) => {
      _util.getInfo(res, this)
    });

    this.setState({
      task_id: this.props.location.state.id
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
        task_id: this.props.location.state.id
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
    //
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.break_records))   //中断记录

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

    data.forEach(d => {
      if (d.break_forever === 'no') {
        d.break = formatMessage(messages.no)   //否
      }
      if (d.break_forever === 'yes') {
        d.break = formatMessage(messages.yes)    //是
      }
    })

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


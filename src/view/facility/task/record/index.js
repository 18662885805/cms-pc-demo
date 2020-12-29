import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Table, Input, Tag} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {ChecklistRecordsTask} from '@apis/facility/records'
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
  system_eqpt: {
    id: 'page.walkthrough.system_eqpt',
    defaultMessage: '系统/设备',
  },
  code: {
    id: 'page.walkthrough.text.code',
    defaultMessage: '编号',
  },
  rule: {
    id: 'page.walkthrough.rule',
    defaultMessage: '规则',
  },
  user_name: {
    id: 'page.walkthrough.user_name',
    defaultMessage: '执行人',
  },
  plan_date: {
    id: 'page.walkthrough.plan_date',
    defaultMessage: '计划完成时间',
  },
  actual_date: {
    id: 'page.walkthrough.actual_date',
    defaultMessage: '实际完成时间',
  },
  check_type: {
    id: 'page.walkthrough.check_type',
    defaultMessage: '检查方式',
  },
  status: {
    id: 'page.walkthrough.status',
    defaultMessage: '状态',
  },
  cycle: {
    id: 'page.walkthrough.cycle',
    defaultMessage: '循环周期',
  },
  unit: {
    id: 'page.walkthrough.unit',
    defaultMessage: '单位',
  },
  workorder: {
    id: 'page.walkthrough.workorder',
    defaultMessage: '工单',
  },
  records: {
    id: 'app.excel.export.records',
    defaultMessage: '维护记录',
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
          title: formatMessage(messages.system_eqpt),   //系统/设备
          dataIndex: 'eqp_name',
          sorter: _util.sortString,
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/task/record/detail',
              state: {
                id: record.id
              }
            }
            return (
              <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}}>
                {record.eqp_name}
              </Link>
            );
          }
        },
        {
          title: formatMessage(messages.code),   //编号
          dataIndex: 'eqp_no',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.rule),   //规则
          dataIndex: 'rule_no',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
          // render: (text, record, index) => {
          //   let path = {
          //     pathname: '/facility/records/detail',
          //     state: {
          //       id: record.id
          //     }
          //   }
          //   return (
          //
          //     <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}}>
          //       {record.rule_no}
          //     </Link>
          //
          //   );
          // }
        },
        {
          title: formatMessage(messages.user_name),    //执行人
          dataIndex: 'user_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.plan_date),   //计划完成时间
          dataIndex: 'next_date',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              record.next_date ? moment(record.next_date).format('YYYY-MM-DD') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.actual_date),   //实际完成时间
          dataIndex: 'submit_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              record.submit_time ? moment(record.submit_time).format('YYYY-MM-DD') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.status),   //状态
          dataIndex: 'status',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.cycle),   //循环周期
          width: 80,
          dataIndex: 'interval',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.unit),    //单位
          width: 60,
          dataIndex: 'interval_type_desc',
          render: record => _util.getOrNullList(record)
        },
      ],
      check: _util.check(),
      refresh: false,
      selectedRowKeys: [],
      monthValue: null,
      dateOpen: false,
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
      search: null,
    }

    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.openNotification = this.openNotification.bind(this)
    this.getInfo = this.getInfo.bind(this)
    this.exportExcel = this.exportExcel.bind(this)
  }

  getInfo(params) {
    this.setState({
      loading: true
    });

    ChecklistRecordsTask(params).then((res) => {
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
      this.setState({
        package: this.props.location.state.package
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
    const pager = {...this.state.pagination}
    pager.current = 1
    this.setState({
      search: value,
      pagination: pager,
      data: []
    })
    this.getInfo({
      search: value,
      task_id: this.props.location.state.id,
      page_size: pager.pageSize
    })
  }

  openNotification(msg) {
    _util.openNotification(msg)
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.records))    //维护记录

  }

  onDateChange = value => {
    const {card_type} = this.state
    if (Array.isArray(value) && value.length === 0) {
      this.getInfo({
        card_type,
        page_size: this.state.pagination.pageSize
      })
      this.setState({
        monthValue: [null, null]
      })
    }
  }

  handleSelectCard = value => {
    const {monthValue} = this.state

    const values = {}
    values.start_time = ''
    values.end_time = ''
    values.page_size = this.state.pagination.pageSize

    if (Array.isArray(monthValue) && monthValue.length > 0) {
      values.start_time = moment(monthValue[0]).format('YYYY-MM')
      values.end_time = moment(monthValue[1]).format('YYYY-MM')
    }

    if (value) {
      values.card_type = value
    }

    this.getInfo(values)

    this.setState({
      card_type: value
    })
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
              this.state.check(this, 'add')
                ?
                <Link to={'/onestop/annualtrial/add'}>
                  <Button type="primary"><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>
                </Link>
                :
                null
            }
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


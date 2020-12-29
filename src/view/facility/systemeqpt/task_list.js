import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Table, Input, Tag} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {EqptTaskList} from '@apis/facility/syseqpt'
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
  systemeqpt: {
    id: 'page.walkthrough.task.systemeqpt',
    defaultMessage: '系统/设备',
  },
  ident: {
    id: 'page.walkthrough.task.ident',
    defaultMessage: '设备/系统标识',
  },
  rule_name: {
    id: 'page.walkthrough.task.rule_name',
    defaultMessage: '规则名称',
  },
  package_name: {
    id: 'page.walkthrough.task.package_name',
    defaultMessage: '所属任务包',
  },
  last_date: {
    id: 'page.walkthrough.task.last_date',
    defaultMessage: '上次维护日期',
  },
  next_remind: {
    id: 'page.walkthrough.task.next_remind',
    defaultMessage: '下次提醒日期',
  },
  next_date: {
    id: 'page.walkthrough.task.next_date',
    defaultMessage: '下次维护日期',
  },
  cycle: {
    id: 'page.walkthrough.task.cycle',
    defaultMessage: '循环周期',
  },
  unit: {
    id: 'page.walkthrough.task.unit',
    defaultMessage: '单位',
  },
  check_type: {
    id: 'page.walkthrough.task.check_type',
    defaultMessage: '检查方式',
  },
  status: {
    id: 'page.walkthrough.task.status',
    defaultMessage: '状态',
  },
  created: {
    id: 'page.walkthrough.created_name',
    defaultMessage: '创建人',
  },
  records: {
    id: 'page.walkthrough.maintenance_records',
    defaultMessage: '维护记录',
  },
  tasks: {
    id: 'app.walkthrough.tasks',
    defaultMessage: '任务单',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
  packagelist: {
    id: 'app.walkthrough.packagelist',
    defaultMessage: '任务包',
  },
  start_date: {
    id: 'app.walkthrough.start_date',
    defaultMessage: '开始日期',
  },
  end_date: {
    id: 'app.walkthrough.end_date',
    defaultMessage: '结束日期',
  },
  no: {
    id: 'app.page.content.no',
    defaultMessage: '否',
  },
  yes: {
    id: 'app.page.content.yes',
    defaultMessage: '是',
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
          title: formatMessage(messages.systemeqpt),    //系统/设备
          dataIndex: 'sys_eqp_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.ident),    //设备/系统标识
          dataIndex: 'sys_eqp_no',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.rule_name),    //规则名称
          dataIndex: 'rule_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.package_name),    //所属任务包
          dataIndex: 'package_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.last_date),   //上次维护日期
          dataIndex: 'last_date',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              record.last_date ? moment(record.last_date).format('YYYY-MM-DD HH:mm') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.next_remind),     //下次提醒日期
          dataIndex: 'next_remind',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              record.next_remind ? moment(record.next_remind).format('YYYY-MM-DD HH:mm') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.next_date),   //下次维护日期
          dataIndex: 'next_date',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              record.next_date ? moment(record.next_date).format('YYYY-MM-DD HH:mm') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.cycle),    //循环周期
          width: 80,
          dataIndex: 'interval',
          sorter: _util.sortString,
          render: (text, record, index) => {
            return (
              <div>{record.interval ? record.interval : '-'}</div>
            );
          }
        },
        {
          title: formatMessage(messages.unit),    //单位
          width: 60,
          dataIndex: 'interval_type_desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.status),   //状态
          dataIndex: 'status',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),    //创建人
          dataIndex: 'creator_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.records),    //维护记录
          width: 80,
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/syseqp/record',
              state: {
                id: id
              }
            }
            return (
              <div>
                {
                  record && record.data.length ?
                    <Link to={path}>
                      <FormattedMessage id="app.walkthrough.text.review" defaultMessage="查看" />
                    </Link>
                    :
                    ''
                }
              </div>
            );
          }
        }
      ],
      data: [],
      // data: [{
      //   eqp_no: 'SZ1_101_L_AHU_0001_AC001',
      //   user: 'kkd',
      //   rule_no: 'AHU_1M',
      // }],
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

    EqptTaskList(params).then((res) => {
      _util.getInfo(res, this)
    });

    this.setState({
      syseqp_id: this.props.location.state.id
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
        syseqp_id: this.props.location.state.id
        // record_id:"e575b28a-42ae-4b69-8b05-dea8088f1bf1"
      })
    }
  }

  handleTableChange(pagination, filters = {}, sorter) {
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.tasks))   //任务单

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
                  <FormattedMessage id="component.tablepage.export" defaultMessage="导出"/>
                </Button>
                :
                null
            }
            <Button type="primary" onClick={this.exportExcel}>
              <FormattedMessage id="component.tablepage.export" defaultMessage="导出"/>
            </Button>
            <Button
              style={{
                background: filtering ? '#87d068' : '#1890ff',
                border: 0,
                color: '#fff'
              }}
              onClick={this.doFilter}
            >
              <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选"/>
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


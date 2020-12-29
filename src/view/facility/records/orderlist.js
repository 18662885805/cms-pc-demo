import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Table, Input, Tag, Modal, Form, Row, Col, Tooltip} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {WorkOrderBaseRecords} from '@apis/facility/records'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable2'
import TextArea from 'antd/lib/input/TextArea';
import GoBackButton from '@component/go-back'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'

let _util = new CommonUtil()
const FormItem = Form.Item;
const {Option} = Select
const {Search} = Input

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  orderId: {
    id: 'page.walkthrough.workorder.orderId',
    defaultMessage: '工单编号',
  },
  reporter: {
    id: 'page.walkthrough.workorder.reporter',
    defaultMessage: '报修人',
  },
  reporter_tel: {
    id: 'page.walkthrough.workorder.reporter_tel',
    defaultMessage: '报修人座机',
  },
  order_type: {
    id: 'page.walkthrough.workorder.order_type',
    defaultMessage: '工单类型',
  },
  order_priority: {
    id: 'page.walkthrough.workorder.priority',
    defaultMessage: '工单优先级',
  },
  factorylocation: {
    id: 'page.walkthrough.workorder.factorylocation',
    defaultMessage: '厂区地点',
  },
  last_person: {
    id: 'page.walkthrough.workorder.last_person',
    defaultMessage: '上一处理人',
  },
  current_person: {
    id: 'page.walkthrough.workorder.current_person',
    defaultMessage: '当前处理人',
  },
  created_time: {
    id: 'page.walkthrough.workorder.created_time',
    defaultMessage: '报修时间',
  },
  duedate: {
    id: 'page.walkthrough.workorder.duedate',
    defaultMessage: '期望完成日期',
  },
  left_time: {
    id: 'page.walkthrough.workorder.left_time',
    defaultMessage: '剩余时间',
  },
  execute_time: {
    id: 'page.walkthrough.workorder.execute_time',
    defaultMessage: '执行时间',
  },
  complete_time: {
    id: 'page.walkthrough.workorder.complete_time',
    defaultMessage: '完成时间',
  },
  total_time: {
    id: 'page.walkthrough.workorder.total_time',
    defaultMessage: '总计用时',
  },
  rate: {
    id: 'page.walkthrough.workorder.rate',
    defaultMessage: '评价',
  },
  status: {
    id: 'page.walkthrough.workorder.status',
    defaultMessage: '状态',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  orderrecords: {
    id: 'page.walkthrough.workorder.orderrecords',
    defaultMessage: '维护记录工单',
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
          title: formatMessage(messages.orderId),    //工单编号
          dataIndex: 'serial',
          sorter: _util.sortString,
          render: (text, record) => {
              return <Link to={{
                  pathname: '/eqp/checklist/orderdetail',
                  state: {
                      id: record.id
                  }
              }}>{_util.getOrNullList(record.serial)}</Link>
          }
        },
        {
          title: formatMessage(messages.reporter),   //报修人
          dataIndex: 'fromuser_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.reporter_tel),   //报修人座机
          dataIndex: 'fromuser_tel',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.order_type),   //工单类型
          dataIndex: 'cate_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.order_priority),   //工单优先级
          dataIndex: 'priority_text',
          sorter: _util.sortString,
          render: record => {
            return <span style={record === '紧急' ? {color: 'red'} : null}>{record}</span>
          }
        },
        {
          title: formatMessage(messages.factorylocation),   //厂区地点
          dataIndex: 'factory_name',
          // sorter: (a, b) => {
          //     let aStr = ''
          //     if (a.factory_name) {
          //         aStr += a.factory_name
          //     }
          //     if (a.location_name) {
          //         aStr += a.location_name
          //     }
          //     let bStr = ''
          //     if (b.factory_name) {
          //         bStr += b.factory_name
          //     }
          //     if (b.location_name) {
          //         bStr += b.location_name
          //     }

          //     return aStr.localeCompare(bStr, 'zh')
          // },
          sorter: _util.sortString,
          render: (text, record) => {
            let s = ''
            if (record.factory_name) {
              s += record.factory_name
            }
            if (record.location_name) {
              s += record.location_name
            }
            return _util.getOrNullList(s)
          }
        },
        {
          title: formatMessage(messages.last_person),    //上一处理人
          dataIndex: 'last_person',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.current_person),   //当前处理人
          dataIndex: 'current_person',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created_time),   //报修时间
          dataIndex: 'created_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.duedate),    //期望完成日期
          filterType: 'range-date',
          sorter: _util.sortDate,
          dataIndex: 'duedate',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.left_time),   //剩余时间
          dataIndex: 'left_days_hint',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.execute_time),   //执行时间
          dataIndex: 'execute_time',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.complete_time),   //完成时间
          dataIndex: 'finish_time',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.total_time),   //总计用时
          dataIndex: 'total_time',
          sorter: _util.sortString,
          render: record => {

            if (!record) {
              return _util.getOrNullList(record)
            }

            return <Tooltip
              title={_util.formatSeconds(record)}
              placement="topLeft"
              mouseEnterDelay={0.4}>
              <span style={{color: 'red'}}>{_util.formatSeconds(record)}</span>
            </Tooltip>

          }
        },
        {
          title: formatMessage(messages.rate),   //评价
          dataIndex: 'rate_text',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.status),   //状态
          dataIndex: 'status',
          sorter: _util.sortString,
          render: record => {
            switch (record) {
              case 1:
                return (
                  <div>
                    <Tag color="#2db7f5"><FormattedMessage id="app.walkthrough.workorder.sending" defaultMessage="派发中" /></Tag>
                  </div>

                );
              case 2:
                return (
                  <div>
                    <Tag color="#108ee9"><FormattedMessage id="app.walkthrough.workorder.doing" defaultMessage="执行中" /></Tag>
                  </div>

                );
              case 3:
                return (
                  <div>

                    <Tag color="#87d068"><FormattedMessage id="app.walkthrough.workorder.completed" defaultMessage="已完成" /></Tag>
                  </div>

                );
              case 4:
                return (
                  <div>
                    <Tag color="#f50"><FormattedMessage id="app.walkthrough.workorder.closed" defaultMessage="已关闭" /></Tag>
                  </div>);
              case 5:
                return (<Tag color="#f50"><FormattedMessage id="app.walkthrough.workorder.closed" defaultMessage="已关闭" /></Tag>);
              case 7:
                return (
                  <div>

                    <Tag color="#2db7f5"><FormattedMessage id="app.walkthrough.workorder.sending" defaultMessage="派发中" /></Tag>
                  </div>

                );
              case 8:
                return (
                  <div>

                    <Tag color="#2db7f5"><FormattedMessage id="app.walkthrough.workorder.sending" defaultMessage="派发中" /></Tag>
                  </div>

                );
              case 9:  //AUDIT_IS_BACK
                return (<Tag color="#CCCCCC"><FormattedMessage id="app.walkthrough.workorder.canceled" defaultMessage="已取消" /></Tag>);
            }
          }
        },
        {
          title: formatMessage(messages.operate),   //操作
          width: 40,
          minWidth: 40,
          maxWidth: 40,
          render: (text, record) => {
            if (record.can_modify) {
              const {
                factory_id,
                location_id,
                serial,
                cate_id,
                priority,
                duedate,
                content,
                pic_source,
                last_person,
                id
              } = record
              return <Link to={
                {
                  pathname: '/hotline/order/add',
                  state: {
                    editData: {
                      factory_id,
                      location_id,
                      serial,
                      cate_id,
                      priority,
                      duedate,
                      content,
                      pic_source,
                      touser_name: last_person,
                      orderId: id
                    }
                  }
                }
              }>
                <FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" />
              </Link>
            }
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
      selectedRows: [],
      check: _util.check(),
      search: null,
      search_data: [],
      search_id: null,
      search_info: '',
      visible: false,
      approve_list: [],
      startValue: null,
      endValue: null,
      endOpen: false,
      desc: ''
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

    WorkOrderBaseRecords(params).then((res) => {
      _util.getInfo(res, this)
    });

    this.setState({
      checklist_id: this.props.location.state.id
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
        checklist_id: this.props.location.state.id
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
    // _util.onDeleteOne(res, this)
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.orderrecords))   //维护记录工单

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
      column, data, pagination, loading, selectedRowKeys, filtering, startValue, endValue, endOpen
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
                <Button type="primary" onClick={this.handleLink}><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>
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


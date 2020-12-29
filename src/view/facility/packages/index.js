import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Table, Input, Tag, Modal, Form, Row, Col} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {Packages, PackageDelete} from '@apis/facility/packages'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable3'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import {inject, observer} from 'mobx-react/index'

let _util = new CommonUtil()
const {RangePicker} = DatePicker
const FormItem = Form.Item;
const {Option} = Select
const {TextArea} = Input;
const {Search} = Input

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  package_name: {
    id: 'page.walkthrough.package_name',
    defaultMessage: '任务包名称',
  },
  desc: {
    id: 'page.walkthrough.desc',
    defaultMessage: '描述',
  },
  user_name: {
    id: 'page.walkthrough.user_name',
    defaultMessage: '执行人',
  },
  user_dept: {
    id: 'page.walkthrough.user_dept',
    defaultMessage: '执行部门',
  },
  priority: {
    id: 'page.walkthrough.priority',
    defaultMessage: '优先级',
  },
  created_name: {
    id: 'page.walkthrough.created_name',
    defaultMessage: '创建人',
  },
  created_dept: {
    id: 'page.walkthrough.created_dept',
    defaultMessage: '创建部门',
  },
  updated_name: {
    id: 'page.walkthrough.updated_name',
    defaultMessage: '修改人',
  },
  updated_time: {
    id: 'page.walkthrough.updated_time',
    defaultMessage: '修改时间',
  },
  status: {
    id: 'page.walkthrough.status',
    defaultMessage: '状态',
  },
  total: {
    id: 'page.walkthrough.total',
    defaultMessage: '任务单总数',
  },
  package_edit: {
    id: 'page.walkthrough.package_edit',
    defaultMessage: '编辑任务包',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  packages: {
    id: 'app.excel.export.packages',
    defaultMessage: '任务包',
  },
  select_data: {
    id: 'app.message.walkthrough.select_data',
    defaultMessage: '任务包',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
});

@inject('appState') @observer  @injectIntl
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
          title: formatMessage(messages.package_name),    //任务包名称
          dataIndex: 'name',
          sorter: _util.sortString,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/package/detail',
              state: {
                id: id,
                package: record.name
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
          title: formatMessage(messages.desc),   //描述
          dataIndex: 'desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.user_name),   //执行人
          dataIndex: 'user_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.user_dept),    //执行部门
          dataIndex: 'user_dept',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.priority),   //优先级
          dataIndex: 'priority_desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created_name),   //创建人
          dataIndex: 'created_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created_dept),   //创建部门
          dataIndex: 'creator_dept',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated_name),   //修改人
          dataIndex: 'updated_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated_time),   //修改时间
          dataIndex: 'updated_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              record.updated_time ? moment(record.updated_time).format('YYYY-MM-DD HH:mm') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.status),   //状态
          dataIndex: 'status',
          sorter: _util.sortString,
          render: (text, record, index) => {
            switch (record.status_id) {
              case '0':
                return (<Tag color="#87d068">{record.status}</Tag>);   //计划中
              case '1':
                return (<Tag color="#2db7f5">{record.status}</Tag>);    //待处理
              case '2':
                return (<Tag color="#f50">{record.status}</Tag>);   //已过期
            }
          }
        },
        {
          title: formatMessage(messages.total),   //任务单总数
          dataIndex: 'number',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.package_edit),   //编辑任务包
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/package/task',
              state: {
                id: id,
                package: record.name
              }
            }
            return (

              <Link to={path} style={{color: '#12517D'}} onClick={this.setScrollTop}>
                <FormattedMessage id="app.walkthrough.text.edit" defaultMessage="编辑" />
              </Link>

            );
          }
        },
        {
          title: formatMessage(messages.operate),   //操作
          width: 80,
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/package/edit',
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

                {
                  <Popconfirm placement="topRight"
                    title={<FormattedMessage id="app.confirm.title.delete" defaultMessage="是否删除，请确认？" />}
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}
                    cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}
                    onConfirm={() => {
                    this.onDeleteOne(id)
                  }}>
                    <a style={{color: '#f5222d'}}><FormattedMessage id="app.walkthrough.text.delete" defaultMessage="删除" /></a>
                  </Popconfirm>
                }
              </div>
            );
          }
        }
      ],
      check: _util.check(),
      refresh: false,
      monthValue: null,
      dateOpen: false,
      data: [],
      pagination: {
        pageSize: _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: _util.getSession('currentPage') ? _util.getSession('currentPage') :1
      },
      loading: false,
      selectedRowKeys: null,
      selectedRows: [],
      search: null
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
    })
    Packages(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  componentDidMount() {
    // _util.fixTableHead()
    this.getInfo({
      project_id: _util.getStorage('project_id'),
      page_size: this.state.pagination.pageSize
    })
  }

  handleTableChange(pagination, filters = {}, sorter) {
    if (this.state.card_type) {
      filters.card_type = this.state.card_type
    }
    _util.handleTableChange(pagination, filters, sorter, this)
  }

  handleSearch(value) {
    _util.removeSession('scrollTop');
    _util.handleSearch(value, this)
  }

  openNotification(msg) {
    _util.openNotification(msg)
  }

  onDeleteOne(id) {
    PackageDelete(id).then((res) => {
      _util.onDeleteOne(res, this)
    })
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.packages))   //任务包

  }

  enabled = () => {
    const { formatMessage } = this.props.intl
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
      message.warning(formatMessage(messages.select_data))   //请选择要提交的数据
    }
  }

  selectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    })
  }

  handleMonthChange = value => {
    console.log(value)

    if (Array.isArray(value) && value.length > 0) {
      const firstMonth = moment(value[0])
      const secondMonth = moment(value[1])

      if (secondMonth.subtract(11, 'months').isAfter(firstMonth)) {
        message.error('最多选择12个月！')
        return
      }

    } else {
      this.getInfo({
        page_size: this.state.pagination.pageSize
      })
    }
    this.setState({
      monthValue: value
    })
  }

  filterData = () => {
    const {monthValue, card_type} = this.state

    if (Array.isArray(monthValue) && monthValue.length > 0) {
      const values = {}
      values.start_time = moment(monthValue[0]).format('YYYY-MM')
      values.end_time = moment(monthValue[1]).format('YYYY-MM')
      values.card_type = ''
      values.page_size = this.state.pagination.pageSize

      if (card_type) {
        values.card_type = card_type
      }

      this.getInfo(values)
    } else {
      message.error('请选择日期!')
    }

  }

  onDateChange = (value, dateString) => {

    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);

    this.setState({
      start_time: dateString[0],
      end_time: dateString[1]
    })

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

  onOk = (value) => {
    const {start_time, end_time} = this.state
    console.log(start_time, end_time)
    if (start_time && end_time) {
      const values = {}
      values.start_time = start_time
      values.end_time = end_time
      values.page_size = this.state.pagination.pageSize

      this.getInfo(values)
    } else {
      message.error('请选择日期!')
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

    //记住scrollTop
    setScrollTop = () => {
      const scrollTopPosition = this.props.appState.tableScrollTop;
      if(scrollTopPosition){
        _util.setSession('scrollTop', scrollTopPosition);
      };
    }

  render() {
    const {
      column, data, pagination, loading, selectedRowKeys, filtering, refresh
    } = this.state
    const {formatMessage} = this.props.intl

    data.forEach(d => {
      d.number = d.total.toString()
    })

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">

          <div className="btn-group">
            {
              this.state.check(this, 'add')
                ?
                <Link to="/eqp/package/add">
                  <Button type="primary"><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>
                </Link>
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

            <Search
              placeholder={formatMessage(messages.full_table_search)}  //全表搜索
              onSearch={this.handleSearch}
              enterButton
              style={{float: 'right', width: '250px'}}
            />
          </div>
          <VirtualTable
            refresh={refresh}
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


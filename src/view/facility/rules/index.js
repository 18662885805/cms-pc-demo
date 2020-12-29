import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Table, Input, Tag, Tooltip} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {Rules, RulesDelete, enabledPost} from '@apis/facility/rules'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable2'
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
  rule_name: {
    id: 'page.walkthrough.rule_name',
    defaultMessage: '规则名称',
  },
  maintenancetype: {
    id: 'page.walkthrough.maintenancetype',
    defaultMessage: '维护类型',
  },
  is_cycle: {
    id: 'page.walkthrough.is_cycle',
    defaultMessage: '是否循环',
  },
  cycle: {
    id: 'page.walkthrough.cycle',
    defaultMessage: '循环周期',
  },
  unit: {
    id: 'page.walkthrough.unit',
    defaultMessage: '单位',
  },
  related: {
    id: 'page.walkthrough.related',
    defaultMessage: '已关联',
  },
  notrelated: {
    id: 'page.walkthrough.notrelated',
    defaultMessage: '待关联',
  },
  status: {
    id: 'page.walkthrough.status',
    defaultMessage: '状态',
  },
  check_type: {
    id: 'page.walkthrough.check_type',
    defaultMessage: '检查方式',
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
  RulesManagement: {
    id: 'app.excel.export.RulesManagement',
    defaultMessage: '规则管理',
  },
  norepeat: {
    id: 'app.message.walkthrough.norepeat',
    defaultMessage: '已启用的不能重复启用',
  },
  enabled: {
    id: 'app.message.walkthrough.enabled',
    defaultMessage: '启用成功',
  },
  needdata: {
    id: 'app.message.walkthrough.needdata',
    defaultMessage: '请选择要启用的数据',
  },
  disable_data: {
    id: 'app.message.walkthrough.disable_data',
    defaultMessage: '请选择要禁用的数据',
  },
  disabled: {
    id: 'app.message.walkthrough.disabled',
    defaultMessage: '禁用成功',
  },
  norepeatdisable: {
    id: 'app.message.walkthrough.norepeatdisable',
    defaultMessage: '已禁用的不能重复禁用',
  },
  select_date: {
    id: 'app.message.walkthrough.select_date',
    defaultMessage: '请选择日期!',
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
          title: formatMessage(messages.rule_name),   //规则名称
          dataIndex: 'name',
          sorter: _util.sortString,
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/rule/detail',
              state: {
                id: record.id
              }
            }
            return (

              <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}}>
                {record.name}
              </Link>

            );
          }
        },
        {
          title: formatMessage(messages.maintenancetype),   //维护类型
          dataIndex: 'mtype_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.is_cycle),    //是否循环
          dataIndex: 'is_cycle_desc',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.cycle),   //循环周期
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
          title: formatMessage(messages.related),    //已关联
          dataIndex: 'relatedcount',
          sorter: _util.sortString,
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/rule/related',
              state: {
                id: record.id
              }
            }
            return (

              <Link to={path} style={{color: '#12517D'}}>
                {record.relatedcount}
              </Link>

            );
          }
        },
        {
          title: formatMessage(messages.notrelated),    //待关联
          dataIndex: 'notrelatedcount',
          sorter: _util.sortString,
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/rule/norelated',
              state: {
                id: record.id
              }
            }
            return (

              <Link to={path} style={{color: '#12517D'}}>
                {record.notrelatedcount}
              </Link>

            );
          }
        },
        {
          title: formatMessage(messages.status),    //状态
          dataIndex: 'rule_status',
          sorter: _util.sortString,
          render: (text, record, index) => {
            switch (record.rule_status) {
              case '启用':
                return (<Tag color="#87d068">{record.rule_status}</Tag>);
              case '禁用':
                return (<Tag color="#CCCCCC">{record.rule_status}</Tag>);
            }
          }
        },
        {
          title: formatMessage(messages.check_type),    //检查方式
          dataIndex: 'check_type',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),    //创建人
          dataIndex: 'created_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated),    //上次修改人
          dataIndex: 'updated_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated_time),   //修改时间
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
        {
          title: formatMessage(messages.operate),   //操作
          width: 80,
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/rule/edit',
              state: {
                id: id
              }
            }
            return (
              <div>

                <Link to={path}>
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
    Rules(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  onDeleteOne = (id) => {
    RulesDelete(id).then((res) => {
      _util.onDeleteOne(res, this)
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
    _util.handleSearch(value, this)
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.RulesManagement))   //规则管理

  }

  enableFn = (e) => {
    this.setState({reset: false})
    const { formatMessage } = this.props.intl
    const {selectedRows, selectedRowKeys, pagination} = this.state
    console.log(selectedRows, selectedRowKeys)
    let is_true = true
    selectedRows.forEach(c => {
      if(c.rule_status === '启用'){
        is_true = false
        message.warning(formatMessage(messages.norepeat))    //已启用的不能重复启用
        return
      }
    })
    if(is_true){
      if (is_true && selectedRowKeys && selectedRowKeys.length) {
        enabledPost({rule_ids: JSON.stringify(selectedRowKeys), is_open: true}).then((res) => {
          this.setState({
            searchValue: ''
          })
          message.success(formatMessage(messages.enabled))     //启用成功
          this.onSelectChange([], [])
          this.getInfo({
            page_size: pagination.pageSize,
            page: pagination.current,
          })
          this.setState({reset: true})
        })
      } else {
        message.warning(formatMessage(messages.needdata))    //请选择要启用的数据
      }
    }
  }

  disableFn = (e) => {
    this.setState({reset: false})
    const { formatMessage } = this.props.intl
    const {selectedRows, selectedRowKeys, pagination} = this.state
    let is_true = true
    selectedRows.forEach(c => {
      if(c.rule_status === '禁用'){
        is_true = false
        message.warning(formatMessage(messages.norepeatdisable))      //已禁用的不能重复禁用
        return
      }
    })
    if(is_true){
      if (selectedRowKeys && selectedRowKeys.length) {
        enabledPost({rule_ids: JSON.stringify(selectedRowKeys), is_open: false}).then((res) => {
          this.setState({
            searchValue: ''
          })
          message.success(formatMessage(messages.disabled))    //禁用成功
          this.onSelectChange([], [])
          this.getInfo({
            page_size: pagination.pageSize,
            page: pagination.current,
          })
          this.setState({reset: true})
        })
      } else {
        message.warning(formatMessage(messages.disable_data))    //请选择要禁用的数据
      }
    }
  }

  selectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    })
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
    const { formatMessage } = this.props.intl
    if (start_time && end_time) {
      const values = {}
      values.start_time = start_time
      values.end_time = end_time
      values.page_size = this.state.pagination.pageSize

      this.getInfo(values)
    } else {
      message.error(formatMessage(messages.select_date))    //请选择日期!
    }
  }

  render() {

    const { column, data, pagination, loading, selectedRowKeys, filtering } = this.state
    const {formatMessage} = this.props.intl

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">

          <div className="btn-group">
            {
              this.state.check(this, 'add')
                ?
                <Link to={'/eqp/rule/add'}>
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

            <Button type="primary" onClick={this.enableFn}>
              <FormattedMessage id="component.tablepage.enable" defaultMessage="启用" />
            </Button>
            
            <Button type="primary" onClick={this.disableFn}>
              <FormattedMessage id="component.tablepage.disable" defaultMessage="禁用" />
            </Button>

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


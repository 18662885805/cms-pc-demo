import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Input, Tag, Modal, Icon, Tooltip} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {Packages} from '@apis/facility/packages'
import {AllWorkSheet} from '@apis/facility/tasks'
import {TaskDelete} from '@apis/facility/packages'
import moment from 'moment'
import { cloneDeep, debounce } from 'lodash'
import VirtualTable from '@component/VirtualTable2'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'

let _util = new CommonUtil()
const {RangePicker} = DatePicker
const {Option} = Select
const {Search} = Input
const confirm = Modal.confirm

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
    id: 'page.walkthrough.records',
    defaultMessage: '维护记录',
  },
  alltask: {
    id: 'page.walkthrough.alltask',
    defaultMessage: '所有任务单',
  },
  start_date: {
    id: 'app.walkthrough.start_date',
    defaultMessage: '开始日期',
  },
  end_date: {
    id: 'app.walkthrough.end_date',
    defaultMessage: '结束日期',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  no: {
    id: 'app.page.content.no',
    defaultMessage: '否',
  },
  yes: {
    id: 'app.page.content.yes',
    defaultMessage: '是',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
  deldesc: {
    id: 'app.confirm.walkthrough.deldesc',
    defaultMessage: '您将删除{count}条标记的对象！',
  },
  delcurrent: {
    id: 'app.confirm.walkthrough.delcurrent',
    defaultMessage: '是否删除当前对象，请确认？',
  },
  deletion: {
    id: 'app.confirm.walkthrough.deletion',
    defaultMessage: '删除确认',
  },
  okText: {
    id: 'app.confirm.walkthrough.ok',
    defaultMessage: '确认',
  },
  cancelText: {
    id: 'app.confirm.walkthrough.cancel',
    defaultMessage: '取消',
  },
  operation: {
    id: 'app.confirm.walkthrough.operation',
    defaultMessage: '操作提示',
  },
  ok: {
    id: 'app.button.ok',
    defaultMessage: '确认',
  },
  cancel: {
    id: 'app.button.cancel',
    defaultMessage: '取消',
  },
  deleted: {
    id: 'app.message.walkthrough.deleted',
    defaultMessage: '删除成功',
  },
  package: {
    id: 'app.placeholder.walkthrough.package',
    defaultMessage: '任务包',
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
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/task/detail',
              state: {
                id: record.id
              }
            }
            return (

              <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}}>
                {record.sys_eqp_name}
              </Link>

            );
          }
        },
        {
          title: formatMessage(messages.rule_name),    //规则名称
          dataIndex: 'rule_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.ident),    //设备/系统标识
          dataIndex: 'sys_eqp_no',
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
              <Tooltip
                title={record.last_date ? moment(record.last_date).format('YYYY-MM-DD') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                  {record.last_date ? moment(record.last_date).format('YYYY-MM-DD') : '-'}
              </Tooltip>
            )
          }
        },
        {
          title: formatMessage(messages.next_remind),     //下次提醒日期
          dataIndex: 'next_remind',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              <Tooltip
                title={record.next_remind ? moment(record.next_remind).format('YYYY-MM-DD') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                  {record.next_remind ? moment(record.next_remind).format('YYYY-MM-DD') : '-'}
              </Tooltip>
            )
          }
        },
        {
          title: formatMessage(messages.next_date),   //下次维护日期
          dataIndex: 'next_date',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              <Tooltip
                title={record.next_date ? moment(record.next_date).format('YYYY-MM-DD') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                {record.next_date ? moment(record.next_date).format('YYYY-MM-DD') : '-'}
              </Tooltip>
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
          title: formatMessage(messages.check_type),     //检查方式
          width: 80,
          dataIndex: 'check_type_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.status),   //状态
          width: 70,
          dataIndex: 'status',
          sorter: _util.sortString,
          render: (text, record, index) => {  //#87d068 #108ee9 #2db7f5
            switch (record.status_id) {
              case '0':
                return (<Tag color="#87d068">{record.status}</Tag>);  //计划中
              case '1':
                return (<Tag color="#2db7f5">{record.status}</Tag>);   //待处理
              case '2':
                return (<Tag color="#f50">{record.status}</Tag>);   //已过期
            }
          }
        },
        {
          title: formatMessage(messages.created),    //创建人
          dataIndex: 'creator_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.records),   //维护记录
          width: 80,
          dataIndex: 'operate',
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/task/record',
              state: {
                id: record.id
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
        },
        {
          title: formatMessage(messages.operate),   //操作
          width: 80,
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/package/task/edit',
              state: {
                id: id
              }
            }
            return (
              <div>
                {
                  _util.checkpermit('/eqp/task/modify') ?
                    <a onClick={() => {this.TaskEdit(id)}}><FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" /></a>
                    :
                    null
                }

                {
                  _util.checkpermit('/eqp/task/multi/delete') ?
                    <Fragment>
                      <Divider type="vertical"/>
                      <a style={{color: '#f5222d'}} onClick={() => {this.handleDelete(id)}}><FormattedMessage id="app.walkthrough.text.delete" defaultMessage="删除" /></a>
                    </Fragment>
                    :
                    null
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
        pageSize: _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: 1
      },
      loading: false,
      selectedRowKeys: [],
      selectedRows: [],
      search: null,
      arrlist: [],
      dataSource: []
    }

    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    // this.onDeleteOne = this.onDeleteOne.bind(this)
    this.openNotification = this.openNotification.bind(this)
    this.getInfo = this.getInfo.bind(this)
    this.exportExcel = this.exportExcel.bind(this)
  }

  getInfo(params) {
    this.setState({
      loading: true
    })
    AllWorkSheet(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  componentDidMount() {
    // _util.fixTableHead()
    this.getInfo({
      project_id: _util.getStorage('project_id'),
      page_size: this.state.pagination.pageSize
    })

    AllWorkSheet({page_size: 9999, project_id: _util.getStorage('project_id')}).then((res) => {
      this.setState({
        dataSource: cloneDeep(res.data)
      })
    })

    // Packages().then((res) => {
    //   this.setState({packagelist: res.data.results})
    // })

  }

  handleTableChange(pagination, filters = {}, sorter) {
    // if (this.state.card_type) {
    //   filters.card_type = this.state.card_type
    // }
    _util.handleTableChange(pagination, filters, sorter, this)
  }

  handleSearch(value) {
    _util.handleSearch(value, this)
  }

  openNotification(msg) {
    _util.openNotification(msg)
  }

  handleDelete = (id) => {
    let _this = this
    _this.setState({reset: false})
    let {selectedRowKeys, selectedRows} = this.state
    const { formatMessage } = _this.props.intl
    if(selectedRows && selectedRows.length > 1 && selectedRowKeys.findIndex(v => v == id) > -1 ){
      confirm({
        title: formatMessage(messages.deletion),  //删除确认
        icon: <Icon type="exclamation-circle" style={{color: '#1890ff'}} />,
        //content: formatMessage(messages.deldesc, {count: <b style={{color: '#f50',fontSize: '18px'}}>{selectedRows.length}</b>}),
        content: formatMessage(messages.deldesc, {count: selectedRows.length}),
        //content: <FormattedMessage id="app.confirm.walkthrough.deldesc" defaultMessage={`您将删除{count}条标记的对象！`} values={{count: <b style={{color: '#f50',fontSize: '18px'}}>{selectedRows.length}</b>}} />,
        okText: formatMessage(messages.okText),
        cancelText: formatMessage(messages.cancelText),
        onOk() {
          TaskDelete({task_ids: selectedRowKeys.join(',')}).then(res => {
            message.success(formatMessage(messages.deleted))   //删除成功
            const {pagination} = _this.state
            _this.getInfo({
              page_size: pagination.pageSize,
              page: pagination.current
            })
            _this.setState({reset: true})
          })
        },
        onCancel() {
        },
      })
    }else {
      confirm({
        title: formatMessage(messages.operation), //操作提示
        content: formatMessage(messages.delcurrent),  //是否删除当前对象，请确认？
        okText: formatMessage(messages.ok),
        cancelText: formatMessage(messages.cancel),
        onOk() {
          TaskDelete({task_ids: id}).then((res) => {
            message.success(formatMessage(messages.deleted))   //删除成功
            const {pagination} = _this.state
            _this.getInfo({
              page_size: pagination.pageSize,
              page: pagination.current
            })
            _this.setState({reset: true})
            // _util.onDeleteOne(res, this)
          })
        },
        onCancel() {
        },
      })
    }
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.alltask))    //所有任务单

  }

  // handleMonthChange = value => {
  //   console.log(value)
  //
  //   if (Array.isArray(value) && value.length > 0) {
  //     const firstMonth = moment(value[0])
  //     const secondMonth = moment(value[1])
  //
  //     if (secondMonth.subtract(11, 'months').isAfter(firstMonth)) {
  //       message.error('最多选择12个月！')
  //       return
  //     }
  //
  //   } else {
  //     this.getInfo({
  //       page_size: this.state.pagination.pageSize
  //     })
  //   }
  //   this.setState({
  //     monthValue: value
  //   })
  // }

  filterData = () => {
    const {monthValue, card_type} = this.state

    if (Array.isArray(monthValue) && monthValue.length > 0) {
      const values = {}
      values.start_time = moment(monthValue[0]).format('YYYY-MM')
      values.end_time = moment(monthValue[1]).format('YYYY-MM')
      values.card_type = ''
      values.page_size = this.state.pagination.pageSize

      // if (card_type) {
      //   values.card_type = card_type
      // }

      this.getInfo(values)
    } else {
      message.error('请选择日期!')
    }

  }

  onDateChange = (value, dateString) => {

    let start_time = dateString[0]
    let end_time = dateString[1]

    const values = {}
    values.start_time = start_time
    values.end_time = end_time
    values.package_id = this.state.package_id ? this.state.package_id : null
    values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      start_time: dateString[0],
      end_time: dateString[1]
    })
  }

  onPackageChange = (value) => {
    const values = {}
    values.start_time = this.state.start_time
    values.end_time = this.state.end_time
    values.package_id = value
    values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      package_id: value
    });
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

  // toSearch = (value) => {
  //   //console.log('onOk: ', value);
  //   const {start_time, end_time} = this.state
  //   console.log(start_time, end_time)
  //   if (start_time && end_time) {
  //     const values = {}
  //     values.start_time = start_time
  //     values.end_time = end_time
  //     values.page_size = this.state.pagination.pageSize
  //
  //     this.getInfo(values)
  //   } else {
  //     message.error('请选择日期!')
  //   }
  // }

  setFieldFun = (data) => {
    this.setState({arrlist: data})
  }

  TaskEdit = (id) => {
    let {selectedRowKeys, selectedRows} = this.state
    //console.log(selectedRowKeys.findIndex(v => v == id))
    if(selectedRows && selectedRows.length && selectedRowKeys.findIndex(v => v == id) > -1 ){
      this.props.history.push({
          pathname: '/eqp/task/edit',
          state: {
            id: id,
            ids: selectedRowKeys
          }
      })
    }else {
      this.props.history.push({
          pathname: '/eqp/task/edit',
          state: {
            id: id
          }
      })
    }
  }

  isJSON = (str) => {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }   
}

  render() {

    const {
      column, data, pagination, loading, selectedRowKeys, filtering, arrlist, dataSource
    } = this.state
    const {formatMessage} = this.props.intl

    data.forEach(d => {
      if (d.is_over === 'no') {
        d.isover = formatMessage(messages.no)   //否
      }
      if (d.is_over === 'yes') {
        d.isover = formatMessage(messages.yes)    //是
      }
    })

    let tempArr = []
    // tempArr = [...new Set(Array.isArray(dataSource) && dataSource.map(d => {return JSON.stringify({id: d.package_id,name: d.package_name}) }))].map(f => {return JSON.parse(f)})

    // let temp = []
    // let tempArr = []
    // if(arrlist.length == 0){
    //   if(new Set(data.map(v => {return v.package_id})).size > 0){
    //     [...new Set(data.map(v => {return v.package_id}))].map(q => {
    //       this.state.packagelist && this.state.packagelist.forEach(c => {
    //         if(q == c.id){
    //           temp.push({id: q, name: c.name})
    //         }
    //       })
    //     })
    //     tempArr = temp
    //     this.setFieldFun(temp)
    //   }
    // }else {
    //   tempArr = arrlist
    // }

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">

          <div className="btn-group">
            {
              this.state.check(this, 'excel')
                ?
                <Button type="primary" onClick={this.exportExcel}>
                  <FormattedMessage id="component.tablepage.export" defaultMessage="导出"/>
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
              <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选"/>
            </Button>

            <RangePicker
              style={{
                marginRight: 10
              }}
              placeholder={[formatMessage(messages.start_date),formatMessage(messages.end_date)]}     // 开始日期/结束日期
              // ranges={{Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')]}}
              onChange={this.onDateChange}
              // onOk={this.onOk}
            />
            {/*<Button style={{marginLeft: '5px'}} type='primary' onClick={() => this.toSearch()}>查询</Button>*/}

            <Select
              showSearch
              allowClear
              //value={{key: related, label: related_label}}
              onChange={this.onPackageChange}
              placeholder={formatMessage(messages.package)}   //任务包
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{
                width: 150,
                // marginRight: 8
              }}
            >
              {
                Array.isArray(tempArr) && tempArr.map((d, index) =>
                  <Option key={d.id} value={d.id}>{d.name}</Option>)
              }
            </Select>

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


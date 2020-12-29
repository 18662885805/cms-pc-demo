import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Input, Tag, Tooltip, Cascader, TreeSelect, Modal, Icon} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {visitInfo} from '@apis/system/location/'
import {areaInfo} from "@apis/system/area";
import {MaintenanceRecords, MaintenanceRecordsBaseTime, RecordDelete} from '@apis/facility/records'
import {WorkOrderStatus} from '@apis/facility/records'
import moment from 'moment'
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
  system_eqpt: {
    id: 'page.walkthrough.system_eqpt',
    defaultMessage: '系统/设备',
  },
  system_eqpt_code: {
    id: 'page.walkthrough.system_eqpt_code',
    defaultMessage: '系统/设备编号',
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
  allrecords: {
    id: 'app.excel.export.allrecords',
    defaultMessage: '所有维护记录',
  },
  start_date: {
    id: 'app.walkthrough.start_date',
    defaultMessage: '开始日期',
  },
  end_date: {
    id: 'app.walkthrough.end_date',
    defaultMessage: '结束日期',
  },
  factory: {
    id: 'app.placeholder.walkthrough.factory',
    defaultMessage: '厂区建筑',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
  scancode: {
    id: 'app.walkthrough.text.scancode',
    defaultMessage: '扫码',
  },
  notscan: {
    id: 'app.walkthrough.text.notscan',
    defaultMessage: '不扫码',
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
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
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
          minWidth: 60,
          dataIndex: 'eqp_name',
          sorter: _util.sortString,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/checklist/detail',
              state: {
                id: id
              }
            }
            return (
              <div>

                <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}}>
                  {record.eqp_name}
                </Link>

              </div>
            );
          }
        },
        {
          title: formatMessage(messages.system_eqpt_code),   //系统/设备编号
          minWidth: 160,
          dataIndex: 'eqp_no',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.rule),   //规则
          dataIndex: 'rule_no',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.user_name),    //执行人
          dataIndex: 'user_name',
          // sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.plan_date),   //计划完成时间
          dataIndex: 'next_date',
          filterType: 'range-date',
          sorter: _util.sortDate,
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
          title: formatMessage(messages.actual_date),   //实际完成时间
          dataIndex: 'submit_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              <Tooltip
                  title={record.submit_time ? moment(record.submit_time).format('YYYY-MM-DD HH:mm') : '-'}
                  placement="topLeft"
                  mouseEnterDelay={0.4}>
                  {record.submit_time ? moment(record.submit_time).format('YYYY-MM-DD HH:mm') : '-'}
              </Tooltip>
            )
          }
        },
        {
          title: formatMessage(messages.check_type),    //检查方式
          dataIndex: 'check_desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.status),   //状态
          dataIndex: 'status',
          render: (text, record, index) => {
            switch (record.status_id) {
              case '0':
                return (<Tag color="#87d068">{record.status}</Tag>);   //正常
              case '1':
                return (<Tag color="#f50">{record.status}</Tag>);    //异常
              case '2':
                return (<Tag color="#108ee9">{record.status}</Tag>);   //异常已处理
            }
          }
        },
        {
          title: formatMessage(messages.cycle),   //循环周期
          dataIndex: 'interval',
          render: (text, record, index) => {
            return (
              <div>{record.interval ? record.interval : '-'}</div>
            );
          }
        },
        {
          title: formatMessage(messages.unit),    //单位
          dataIndex: 'interval_type_desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.workorder),   //工单
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/checklist/orderlist',
              state: {
                id: id
              }
            }
            return (
              <div>
                {
                  record.order_id ?
                    <Link to={path} style={{color: '#12517D'}}>
                      <FormattedMessage id="app.walkthrough.text.review" defaultMessage="查看" />
                    </Link>
                    :
                    '-'
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
            return (
              <div>

                {
                  _util.checkpermit('/eqp/checklist/multi/delete') ?
                    <a style={{color: '#f5222d'}} onClick={() => {this.handleDelete(id)}}><FormattedMessage id="app.walkthrough.text.delete" defaultMessage="删除" /></a>
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
      arrlist: []
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
    MaintenanceRecords(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  componentDidMount() {
    // _util.fixTableHead()
    this.getInfo({
      project_id: _util.getStorage('project_id'),
      page_size: this.state.pagination.pageSize
    })

    areaInfo({project_id: _util.getStorage('project_id'), mode: 'tree'}).then((res) => {
      let targetArr = []
      const getValue = (obj) => {
        const tempObj = {};
        tempObj.title = obj.name;
        tempObj.value = obj.id;
        tempObj.key = obj.id;
        if (obj.children) {
          tempObj.children = [];
          obj.children.map(o => {
            tempObj.children.push(getValue(o))
          });
        }
        return tempObj;
      };
      res.data.forEach(a => {
        targetArr.push(getValue(a));
      });
      console.log(targetArr)
      
      this.setState({
        treeData: targetArr
      });
    });

    // visitInfo().then((res) => {
    //   let location_list = res.data.results.factory_and_location;
    //   const getValue = (obj) => {
    //     const tempObj = {}
    //     tempObj.label = obj.number
    //     tempObj.value = obj.id
    //     tempObj.key = obj.number
    //     if (obj.children) {
    //       tempObj.children = []
    //       obj.children.map(o => {
    //         // tempObj.children.push(getValue(o))
    //         tempObj.children.push({
    //           label: o.number,
    //           value: o.id,
    //           key: o.number
    //         })
    //       })
    //     }
    //     return tempObj
    //   }
    //   const targetArr = []
    //   location_list.forEach(a => {
    //     targetArr.push(getValue(a))
    //   })

    //   this.setState({
    //     treeData: targetArr
    //   })
    // })

  }

  handleTableChange(pagination, filters = {}, sorter) {
    if (this.state.start_time && this.state.end_time) {
      filters.start_time = this.state.start_time
      filters.end_time = this.state.end_time
    }
    if (this.state.location) {
      filters.location_id = this.state.location
    }
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
          RecordDelete({checklist_ids: selectedRowKeys.join(',')}).then(res => {
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
          RecordDelete({checklist_ids: id}).then((res) => {
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.allrecords))   //所有维护记录

  }

  onDateChange = (value, dateString) => {

    console.log('Formatted Selected Time: ', dateString);

    let start_time = dateString[0]
    let end_time = dateString[1]

    const values = {}
    values.start_time = start_time
    values.end_time = end_time
    values.page = this.state.pagination.current
    values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      start_time: dateString[0],
      end_time: dateString[1],
      location: undefined
    })
  }

  onLocationChange = (value) => {
    console.log(value)

    const values = {}
    values.start_time = this.state.start_time
    values.end_time = this.state.end_time
    values.location_id = value
    values.page = this.state.pagination.current
    values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      location: value
    });
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
    const { start_time, end_time} = this.state
    console.log(start_time,end_time)
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

  getWorkOrder = () => {
    WorkOrderStatus().then((res) => {
      this.getInfo({
        page_size: this.state.pagination.pageSize
      })
    })
  }

  setFieldFun = (data) => {
    this.setState({arrlist: data})
  }

  render() {

    const {
      column, data, pagination, loading, selectedRowKeys, filtering, treeData, arrlist
    } = this.state
    const {formatMessage} = this.props.intl

    data.forEach(d => {
      if (d.check_type == '0') {
        d.check_desc = formatMessage(messages.scancode)   //扫码
      }
      if (d.check_type !== '0') {
        d.check_desc = formatMessage(messages.notscan)    //不扫码
      }
    })

    let temp = []
    let tempArr = []
    let setarr = []
    if(arrlist.length == 0){
      setarr = new Set(data.map(v => {
        let obj = {}
        obj.id = v.location
        obj.name = v.location_name
        return JSON.stringify(obj)
      }))

      if(new Set(data.map(v => {return v.location})).size > 0){
        [...setarr].map(q => {
          temp.push(JSON.parse(q))
        })
        tempArr = temp
        this.setFieldFun(temp)
      }
    }else {
      tempArr = arrlist
    }
    console.log(tempArr)

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">

          <div className="btn-group">
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

            <Button type="primary" onClick={this.getWorkOrder}>
              <FormattedMessage id="app.walkthrough.text.refresh" defaultMessage="刷新" />
            </Button>

            <RangePicker
              style={{
                marginRight: 10
              }}
              placeholder={[formatMessage(messages.start_date),formatMessage(messages.end_date)]}     // 开始日期/结束日期
              // showTime={{format: 'HH:mm'}}
              // ranges={{Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')]}}
              onChange={this.onDateChange}
              // onOk={this.onOk}
            />

            <Select
              showSearch
              allowClear
              value={this.state.location}
              onChange={this.onLocationChange}
              placeholder={formatMessage(messages.factory)}   //厂区建筑
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{
                width: 200,
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


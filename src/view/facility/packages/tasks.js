import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Popconfirm, Divider, message, Button, DatePicker, Select, Table, Input, Tag, Modal, Form, Row, Col, Icon} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {TaskList, TaskDelete, PackageBreak} from '@apis/facility/packages'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable2'
import TextArea from 'antd/lib/input/TextArea';
import GoBackButton from '@component/go-back'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'

let _util = new CommonUtil()
const FormItem = Form.Item;
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
  rule_name: {
    id: 'page.walkthrough.rule_name',
    defaultMessage: '规则名称',
  },
  system_eqpt_code: {
    id: 'page.walkthrough.system_eqpt_code',
    defaultMessage: '系统/设备编号',
  },
  belongpackage: {
    id: 'page.walkthrough.belongpackage',
    defaultMessage: '所属任务包',
  },
  last_date: {
    id: 'page.walkthrough.last_date',
    defaultMessage: '上次维护日期',
  },
  next_remind: {
    id: 'page.walkthrough.next_remind',
    defaultMessage: '下次提醒日期',
  },
  next_date: {
    id: 'page.walkthrough.next_date',
    defaultMessage: '下次维护日期',
  },
  cycle: {
    id: 'page.walkthrough.cycle',
    defaultMessage: '循环周期',
  },
  unit: {
    id: 'page.walkthrough.unit',
    defaultMessage: '单位',
  },
  desc: {
    id: 'page.walkthrough.desc',
    defaultMessage: '描述',
  },
  status: {
    id: 'page.walkthrough.status',
    defaultMessage: '状态',
  },
  created_name: {
    id: 'page.walkthrough.created_name',
    defaultMessage: '创建人',
  },
  breakrecords: {
    id: 'page.walkthrough.breakrecords',
    defaultMessage: '中断记录',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  deleted: {
    id: 'app.message.walkthrough.deleted',
    defaultMessage: '删除成功',
  },
  tasks: {
    id: 'app.excel.export.tasks',
    defaultMessage: '任务单',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
  remark: {
    id: 'app.walkthrough.text.remark',
    defaultMessage: '原因说明',
  },
  select_start_date: {
    id: 'app.message.walkthrough.select_start_date',
    defaultMessage: '请选择打断开始日期!',
  },
  select_end_date: {
    id: 'app.message.walkthrough.select_end_date',
    defaultMessage: '请选择打断结束日期!',
  },
  submited: {
    id: 'app.message.walkthrough.submited',
    defaultMessage: '提交成功',
  },
  failedsubmit: {
    id: 'app.message.walkthrough.failedsubmit',
    defaultMessage: '提交失败',
  },
  onebyone: {
    id: 'app.message.walkthrough.onebyone',
    defaultMessage: '一次只能打断一个任务单',
  },
  select_data: {
    id: 'app.message.walkthrough.select_data',
    defaultMessage: '请选择要操作的数据',
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
          title: formatMessage(messages.system_eqpt),    //系统/设备
          dataIndex: 'sys_eqp_name',
          sorter: _util.sortString,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/package/task/detail',
              state: {
                id: id
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
          title: formatMessage(messages.system_eqpt_code),    //系统/设备编号
          dataIndex: 'sys_eqp_no',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.belongpackage),    //所属任务包
          dataIndex: 'package_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.last_date),   //上次维护日期
          dataIndex: 'last_date',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              record.last_date ? moment(record.last_date).format('YYYY-MM-DD') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.next_remind),    //下次提醒日期
          dataIndex: 'next_remind',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              record.next_remind ? moment(record.next_remind).format('YYYY-MM-DD') : '-'
            )
          }
        },
        {
          title: formatMessage(messages.next_date),     //下次维护日期
          dataIndex: 'next_date',
          filterType: 'range-date',
          render: (text, record, index) => {
            return (
              record.next_date ? moment(record.next_date).format('YYYY-MM-DD') : '-'
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
          title: formatMessage(messages.unit),   //单位
          width: 60,
          dataIndex: 'interval_type_desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.desc),   //描述
          dataIndex: 'desc',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.status),   //状态
          dataIndex: 'status',
          sorter: _util.sortString,
          render: (text, record, index) => {
            switch (record.status_id) {
              case '0':
                return (<Tag color="#87d068">{record.status}</Tag>);    //计划中
              case '1':
                return (<Tag color="#2db7f5">{record.status}</Tag>);    //待处理
              case '2':
                return (<Tag color="#f50">{record.status}</Tag>);    //已过期
            }
          }
        },
        {
          title: formatMessage(messages.created_name),    //创建人
          dataIndex: 'creator_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.breakrecords),   //中断记录
          dataIndex: 'operate',
          render: (text, record, index) => {
            let path = {
              pathname: '/eqp/package/task/break',
              state: {
                id: record.id
              }
            }
            return (
              <Fragment>
                {
                  record.breakcount > 0 ?
                    <Link to={path} style={{color: '#12517D'}}>
                      <FormattedMessage id="app.walkthrough.text.review" defaultMessage="查看" />
                    </Link>
                  :
                  '-'
                }
              </Fragment>
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
                id: id,
                package: this.props.location.state.package,
                package_id: this.props.location.state.id
              }
            }
            return (
              <div>

                {/*<Link to={path}>*/}
                  {/*<FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" />*/}
                {/*</Link>*/}
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

                {/*{*/}
                  {/*<Popconfirm placement="topRight"*/}
                      {/*title={<FormattedMessage id="app.confirm.title.delete" defaultMessage="是否删除，请确认？" />}*/}
                      {/*okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}*/}
                      {/*cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}*/}
                    {/*onConfirm={() => {*/}
                    {/*this.onDeleteOne(id)*/}
                  {/*}}>*/}
                    {/*<a style={{color: '#f5222d'}}><FormattedMessage id="app.walkthrough.text.delete" defaultMessage="删除" /></a>*/}
                  {/*</Popconfirm>*/}
                {/*}*/}
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

    TaskList(params).then((res) => {
      _util.getInfo(res, this)
    });

    this.setState({
      package_id: this.props.location.state.id
    })
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      console.log(this.props.location.state.id)

      // _util.fixTableHead()
      this.getInfo({
        page:this.state.pagination.current,
        page_size: this.state.pagination.pageSize,
        package_id: this.props.location.state.id
        // record_id:"e575b28a-42ae-4b69-8b05-dea8088f1bf1"
      })
      this.setState({
        package: this.props.location.state.package
      })
    }
  }

  handleTableChange(pagination, filters = {}, sorter) {
    if (this.state.package_id) {
      filters.package_id = this.state.package_id
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
    const { formatMessage } = this.props.intl
    TaskDelete(id).then((res) => {
      message.success(formatMessage(messages.deleted))   //删除成功
      console.log(this.state.pagination.current)
      const {pagination} = this.state
      this.getInfo({
        page_size: pagination.pageSize,
        page: pagination.current,
        package_id: this.props.location.state.id
      })
      // _util.onDeleteOne(res, this)
    })
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
              page: pagination.current,
              package_id: _this.props.location.state.id
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
              page: pagination.current,
              package_id: _this.props.location.state.id
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

    _util.exportExcel(selectedRows, column, formatMessage(messages.tasks))   //任务单

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

  //0605
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleLink = () => {
    this.props.history.push({
      pathname: '/eqp/package/task/add',
      state: {
        id: this.props.location.state.id,
        package: this.props.location.state.package,
      },
    })
  }

  disabledStartDate = startValue => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({endOpen: true});
    }
  };

  handleEndOpenChange = open => {
    this.setState({endOpen: open});
  };

  Break = () => {
    const _this = this;
    const {formatMessage} = this.props.intl
    let {selectedRowKeys, selectedRows} = this.state;
    console.log(selectedRowKeys, selectedRows)
    if (selectedRowKeys && selectedRowKeys.length) {
      if (selectedRowKeys.length > 1) {
        message.warning(formatMessage(messages.onebyone))    //一次只能打断一个任务单
      } else {
        _this.setState({
          package_id: selectedRowKeys,
          visible: true,
        })
      }
    } else {
      message.warning(formatMessage(messages.select_data))   //请选择要操作的数据
    }
  }

  handleOk = e => {
    const {formatMessage} = this.props.intl
    const {package_id, startValue, endValue, desc} = this.state

    if (!startValue) {
      message.error(formatMessage(messages.select_start_date))   //请选择打断开始日期!
      return
    }
    if (!endValue) {
      message.error(formatMessage(messages.select_end_date))   //请选择打断结束日期!
      return
    }

    this.setState({refresh: false, loading: true})

    let data = {
      package_id: this.props.location.state.id,
      task_id: package_id.join(''),
      start_time: startValue.format('YYYY-MM-DD'),
      end_time: endValue.format('YYYY-MM-DD'),
      desc: desc
    }

    if (startValue && endValue) {
      PackageBreak(data).then(res => {
        message.success(formatMessage(messages.submited))    //提交成功
        this.setState({
          loading: false,
          visible: false,
          startValue: null,
          endValue: null,
          desc: '',
          // selectedRowKeys: null,
          // selectedRows: [],
        });
        //this.setState({ refresh: true, loading: false })
      }).catch(err => {
        this.setState({loading: false})
        message.error(formatMessage(messages.failedsubmit))    //提交失败
      })
    }

    this.getInfo({
      page_size: this.state.pagination.pageSize,
      package_id: this.props.location.state.id
    })

  }

  textChange = (e) => {
    this.setState({
      desc: e.target.value
    })
  }

  TaskEdit = (id) => {
    let {selectedRowKeys, selectedRows} = this.state
    //console.log(selectedRowKeys.findIndex(v => v == id))
    if(selectedRows && selectedRows.length && selectedRowKeys.findIndex(v => v == id) > -1 ){
      this.props.history.push({
          pathname: '/eqp/package/task/edit',
          state: {
            id: id,
            ids: selectedRowKeys,
            package: this.props.location.state.package,
            package_id: this.props.location.state.id
          }
      })
    }else {
      this.props.history.push({
          pathname: '/eqp/package/task/edit',
          state: {
            id: id,
            package: this.props.location.state.package,
            package_id: this.props.location.state.id
          }
      })
    }
  }

  render() {

    const {
      column, data, pagination, loading, selectedRowKeys, filtering, startValue, endValue, endOpen
    } = this.state
    const {formatMessage} = this.props.intl

    const path = {
      pathname: '/eqp/package/task/schedule',
      state: {
        id: this.props.location.state.id
      }
    }

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

            <Button type="primary" onClick={this.handleLink}><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>
            <Button type="primary" onClick={this.Break}><FormattedMessage id="app.walkthrough.text.break" defaultMessage="中断" /></Button>
            <Button type="primary" onClick={this.exportExcel}>
              <FormattedMessage id="component.tablepage.export" defaultMessage="导出" />
            </Button>
            <Link to={path}>
              <Button type="primary">
                <FormattedMessage id="app.walkthrough.text.taskplan" defaultMessage="任务计划" />
              </Button>
            </Link>

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

          <Modal
            width={800}
            title={<FormattedMessage id="page.walkthrough.text.packagebreak" defaultMessage="中断任务包" />}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            //footer={null}
            maskClosable={false}
          >

            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}}
              label={<FormattedMessage id="page.walkthrough.text.rangedate" defaultMessage="打断日期" />}
              required
            >
              <Row>
                <Col>
                  <DatePicker
                    disabledDate={this.disabledStartDate}
                    format="YYYY-MM-DD"
                    value={startValue}
                    placeholder="Start"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                  <DatePicker
                    style={{marginLeft: '15px'}}
                    disabledDate={this.disabledEndDate}
                    format="YYYY-MM-DD"
                    value={endValue}
                    placeholder="End"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                </Col>
              </Row>

            </FormItem>

            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label={<FormattedMessage id="app.walkthrough.text.remark" defaultMessage="原因说明" />} >
              <TextArea
                placeholder={formatMessage(messages.remark)}
                style={{minHeight: 32}}
                rows={4}
                value={this.state.desc}
                onChange={this.textChange}
              />
            </FormItem>

          </Modal>

        </div>
      </div>
    )
  }
}


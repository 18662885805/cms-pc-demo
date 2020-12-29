import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {
  Button, Input, Select, Form, Modal, DatePicker, Spin, Divider, Popconfirm, message, Tag, Upload,
  Tooltip, Icon, InputNumber, notification
} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {debounce} from 'lodash'
import {interviewee} from "@apis/event/interviewee"
import {keySearch, relatedSearch} from '@apis/facility/keys'
import {Syseqpt, SyseqptList, SyseqptDelete, eqptCopyPost} from '@apis/facility/syseqpt'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable4'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import {inject, observer} from 'mobx-react/index'

const {Search} = Input
const {TextArea} = Input
const _util = new CommonUtil()
const FormItem = Form.Item;
const {Option} = Select;
const confirm = Modal.confirm

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  sort: {
    id: 'page.walkthrough.sort',
    defaultMessage: '类型',
  },
  trade: {
    id: 'page.walkthrough.trade_key',
    defaultMessage: '类KEY',
  },
  system_key: {
    id: 'page.walkthrough.system_key',
    defaultMessage: '系统KEY',
  },
  system_name: {
    id: 'page.walkthrough.system_name',
    defaultMessage: '系统名称',
  },
  system_code: {
    id: 'page.walkthrough.system_code',
    defaultMessage: '系统编号',
  },
  eqpt_key: {
    id: 'page.walkthrough.eqpt_key',
    defaultMessage: '设备KEY',
  },
  eqpt_name: {
    id: 'page.walkthrough.eqpt_name',
    defaultMessage: '设备名称',
  },
  eqpt_code: {
    id: 'page.walkthrough.eqpt_code',
    defaultMessage: '设备编号',
  },
  defined_code: {
    id: 'page.walkthrough.defined_code',
    defaultMessage: '自定义编号',
  },
  qrcode: {
    id: 'page.walkthrough.qrcode',
    defaultMessage: '二维码url',
  },
  tasks: {
    id: 'page.walkthrough.tasks',
    defaultMessage: '任务单',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  systemeqpt: {
    id: 'page.walkthrough.export.systemeqpt',
    defaultMessage: '系统设备',
  },
  copyone: {
    id: 'app.message.walkthrough.copyone',
    defaultMessage: '每次只能复制一个系统/设备',
  },
  select_row: {
    id: 'app.message.walkthrough.select_row',
    defaultMessage: '请选择要操作的数据',
  },
  operationsuccess: {
    id: 'app.message.walkthrough.operationsuccess',
    defaultMessage: '操作成功',
  },
  imported: {
    id: 'app.message.walkthrough.imported',
    defaultMessage: '导入成功',
  },
  trade_key: {
    id: 'app.placeholder.walkthrough.trade_key',
    defaultMessage: '大类',
  },
  systemkey: {
    id: 'app.placeholder.walkthrough.systemkey',
    defaultMessage: '系统KEY',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
  maxmin: {
    id: 'app.tooltip.walkthrough.maxmin',
    defaultMessage: '最小数量1，最大数量100',
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
  correct: {
    id: 'app.message.walkthrough.correct',
    defaultMessage: '请输入有效的设备数量',
  },
  errortype: {
    id: 'app.message.walkthrough.errortype',
    defaultMessage: '只能批量修改相同类型的系统或设备！',
  },
});

@inject('appState') @observer @injectIntl
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
          title: formatMessage(messages.sort),  //类型
          sorter: _util.sortString,
          dataIndex: 'type_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.trade),  //类KEY
          sorter: _util.sortString,
          dataIndex: 'trade_key_abbr',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.system_key),  //系统KEY
          sorter: _util.sortString,
          dataIndex: 'sys_key_abbr',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.system_name),    //系统名称
          dataIndex: 'sys_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.system_code),   //系统编号
          minWidth: 160,
          dataIndex: 'sys_no',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.eqpt_key),    //设备KEY
          sorter: _util.sortString,
          dataIndex: 'eqp_key_abbr',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.eqpt_name),    //设备名称
          dataIndex: 'eqp_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.eqpt_code),   //设备编号
          minWidth: 220,
          dataIndex: 'eqp_no',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.defined_code),   //自定义编号
          dataIndex: 'diyinfo',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.qrcode),    //二维码url
          dataIndex: 'wx_code',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.tasks),    //任务单
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/syseqp/task',
              state: {
                id: id
              }
            }
            return (
              <div>
                {
                  record.hastask > 0 ?
                    <Link to={path} onClick={this.setScrollTop}>
                      <FormattedMessage id="app.walkthrough.text.overview" defaultMessage="浏览" />
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
          width: 120,
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path1 = {
              pathname: '/eqp/syseqp/sysedit',
              state: {
                id: id
              }
            }
            let path2 = {
              pathname: '/eqp/syseqp/eqptedit',
              state: {
                id: id
              }
            }
            let path_1 = {
              pathname: '/eqp/syseqp/detail',
              state: {
                id: record.id
              }
            }
            return (
              <div>
                <Link to={path_1} onClick={this.setScrollTop}>
                  <FormattedMessage id="app.walkthrough.text.review" defaultMessage="查看" />
                </Link>

                {
                  _util.checkpermit('/eqp/syseqp/multi/modify') ?
                    <Fragment>
                      <Divider type="vertical"/>
                      <a onClick={() => {this.SystemEdit(id,record.type)}}><FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" /></a>
                    </Fragment>
                    :
                    null
                }

                {/*{*/}
                  {/*record.type == 0 ?*/}
                    {/*<a style={{color: '#f5222d'}} onClick={() => {this.SystemEdit(id)}}><FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" /></a>*/}
                    {/*// <Link to={path1} onClick={this.setScrollTop}>*/}
                    {/*//   <FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" />*/}
                    {/*// </Link>*/}
                    {/*:*/}
                    {/*<Link to={path2} onClick={this.setScrollTop}>*/}
                      {/*<FormattedMessage id="app.walkthrough.text.modify" defaultMessage="修改" />*/}
                    {/*</Link>*/}
                {/*}*/}

                {
                  _util.checkpermit('/eqp/syseqp/multi/delete') ?
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
        pageSize:  _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: _util.getSession('currentPage') ? _util.getSession('currentPage') : 1
      },
      loading: false,
      spinLoading: false,
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
      postData: {},
      visible: false,
      copyVisible: false,
      number: 1,
      fileList: [],
      tradelist: [],
      systemkeyArr: [],
      allsystemkeyArr: [],
      clearScrollTop:false,
      selected: null
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.lastFetchId = 0
    this.lastFetchIdNew = 0
    // this.fetchUser = debounce(this.fetchUser, 500).bind(this)
  }

  getInfo(params) {
    this.setState({
      loading: true
    })
    SyseqptList(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  componentDidMount() {
    // _util.fixTableHead()
    this.getInfo({
      project_id: _util.getStorage('project_id'),
      page:this.state.pagination.current,
      page_size:this.state.pagination.pageSize
    })

    keySearch({type: 0, project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        tradelist: res.data.results
      })
    })

    keySearch({type: 1, project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        systemkeyArr: res.data.results,
        allsystemkeyArr: res.data.results
      })
    })

    this.onSelectChange()
  }

  // handleTableChange(pagination, filters={}, sorter={}) {
  //     _util.handleTableChange(pagination, filters, sorter, this)
  // }

  handleTableChange(pagination, filters = {}, sorter = {}) {
    // let filters={};
    if (this.state.trade_key) {
      filters.trade_key = this.state.trade_key
      filters.system_key = null
    }
    if (this.state.system_key) {
      filters.system_key = this.state.system_key
    }
    _util.handleTableChange(pagination, filters, sorter, this);

    this.onSelectChange()
  }

  handleSearch(value) {
    this.setState({clearScrollTop:true})
    const { pagination } = this.state
    pagination.current = 1
    this.setState({
        search: value,
        data: []
    })
    this.getInfo({
        search: value,
        page: pagination.current,
        page_size: pagination.pageSize
    })

  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRows)
    this.setState({selectedRowKeys, selectedRows})
  };

  exportExcel = () => {
    const { formatMessage } = this.props.intl
    const {selectedRows, column} = this.state

    _util.exportExcel(selectedRows, column, formatMessage(messages.systemeqpt))    //系统设备

    // this.setState({selected: []})
    this.resetSelect();
  }
  async resetSelect(){
    await this.sleep(2000)
    this.child.updateRowSelected([])
  }

  sleep = (second) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, second);
      })
  }

  tradekeyChange = (value) => {
    console.log(value)
    if (value) {
      relatedSearch({related_key: value}).then(res => {
        this.setState({
          systemkeyArr: res.data.results
        })
      })
    } else {
      this.setState({
        systemkeyArr: this.state.allsystemkeyArr,
      })
    }

    const values = {}
    values.trade_key_id = value
    values.page = this.state.pagination.current
    values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      trade_key: value,
      system_key: undefined
    })
  }

  onSystemChange = (value) => {
    console.log(value)
    const values = {}
    values.trade_key_id = this.state.trade_key
    values.sys_key_id = value
    values.page = this.state.pagination.current
    values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      system_key: value
    })
  }

  onDeleteOne = id => {
    SyseqptDelete(id).then(res => {
      _util.onDeleteOne(res, this)
    })
  }

  openFormModal = () => {
    this.setState({
      formVisible: true,
    })
  }
  closeFormModal = () => {
    this.setState({
      formVisible: false
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

  openModal = () => {
    this.setState({
      visible: true
    })
  }

  addsystem = () => {
    this.props.history.push('/eqp/syseqp/add');
  }

  addeqpt = () => {
    this.props.history.push('/eqp/syseqp/eqptadd')
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  copyModal = () => {
    const { formatMessage } = this.props.intl
    let {selectedRowKeys, selectedRows} = this.state;
    //console.log(selectedRowKeys, selectedRows)
    if (selectedRowKeys && selectedRowKeys.length) {
      if (selectedRowKeys.length > 1) {
        message.warning(formatMessage(messages.copyone))   //每次只能复制一个系统/设备
      } else {
        this.setState({
          // package_id: selectedRowKeys,
          copyVisible: true,
        })
      }
    } else {
      message.warning(formatMessage(messages.select_row))   //请选择要操作的数据
    }
  }

  closeCopyModal = () => {
    this.setState({
      copyVisible: false
    })
  }
  onNumberChange = value => {
    this.setState({
      number: value
    })
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  copyEqpt = () => {
    const { formatMessage } = this.props.intl
    const {selectedRowKeys, number} = this.state
    //console.log(selectedRowKeys[0])
    let reg = /^\+?[1-9][0-9]*$/;
    if(!(number && reg.test(number) && number <= 100)){
      message.warning(formatMessage(messages.correct))    //请输入有效的设备数量
      return
    }
    eqptCopyPost({syseqp_id: selectedRowKeys[0], total: number}).then((res) => {
      let arr = res.data.results
      message.success(formatMessage(messages.operationsuccess))   //操作成功
      this.setState({number: 1, copyVisible: false})
      let _this = this

      var promise = new Promise(resolve => {/* executor函数 */
          // ... some code
        let params = {
          page: _this.state.pagination.current,
          page_size: _this.state.pagination.pageSize
        }
        this.setState({
          loading: true
        })
        SyseqptList(params).then((res) => {
          resolve();
          this.setState({
            data: res.data.results,
            loading: false
          })
        })
      });

      promise.then(() => {
        this.child.updateRowSelected(arr)
      }, (error) => {
          //failure
      })

    })
  }

  openFormModal = () => {
    this.setState({
      importVisible: true,
    })
  }
  closeFormModal = () => {
    this.setState({
      importVisible: false
    })
  }

  onRef = (ref) => {
        this.child = ref
  }


  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  SystemEdit = (id,type) => {
    const { formatMessage } = this.props.intl
    let {selectedRowKeys, selectedRows} = this.state
    //console.log(selectedRowKeys.findIndex(v => v == id))
    if(selectedRows && selectedRows.length && selectedRowKeys.findIndex(v => v == id) > -1 ){
      //console.log(selectedRowKeys, selectedRows)
      //console.log(selectedRows.every(p => p.type == 0))
      if (selectedRows.every(p => p.type == 0)) {
        this.props.history.push({
            pathname: '/eqp/syseqp/sysedit',
            state: {
                id: id,
                ids: selectedRowKeys
                //type: -1,
                //act: acts['MODIFY']
            }
        })

      } else if(selectedRows.every(p => p.type == 1)){
        this.props.history.push({
            pathname: '/eqp/syseqp/eqptedit',
            state: {
                id: id,
                ids: selectedRowKeys
                //type: -1,
                //act: acts['MODIFY']
            }
        })
      }else {
        message.error(formatMessage(messages.errortype))   //只能批量修改相同类型的系统或设备！
      }
    }else {
      if(type == 0){
        this.props.history.push({
            pathname: '/eqp/syseqp/sysedit',
            state: {
                id: id
            }
        })
      }else {
        this.props.history.push({
            pathname: '/eqp/syseqp/eqptedit',
            state: {
                id: id
            }
        })
      }
    }
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
          SyseqptDelete({sys_eqp_ids: selectedRowKeys.join(',')}).then(res => {
            message.success(formatMessage(messages.deleted))   //删除成功
            _this.getInfo({
              page: _this.state.pagination.current,
              page_size: _this.state.pagination.pageSize
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
          SyseqptDelete({sys_eqp_ids: id}).then(res => {
            message.success(formatMessage(messages.deleted))   //删除成功
            _this.getInfo({
              page: _this.state.pagination.current,
              page_size: _this.state.pagination.pageSize
            })
            _this.setState({reset: true})
          })
        },
        onCancel() {
        },
      })
    }
  }

  render() {
    const {column, data, pagination, loading, selectedRowKeys, filtering, reset,clearScrollTop, selected} = this.state
    const {refresh, check, tradelist, systemkeyArr} = this.state
    const { formatMessage } = this.props.intl
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };

    const formModal = (
      <Modal
        title={<FormattedMessage id="app.walkthrough.title.copy" defaultMessage="复制设备" />}
        visible={this.state.copyVisible}
        onCancel={this.closeCopyModal}
        maskClosable={false}
        onOk={this.copyEqpt}
        okText={<FormattedMessage id="app.modal.button.confirm" defaultMessage="确定" />}
        cancelText={<FormattedMessage id="app.modal.button.cancel" defaultMessage="取消" />}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Form style={{width: '300px'}}>
            <FormItem {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="page.walkthrough.text.copyamount" defaultMessage="数量" />&nbsp;
                  <Tooltip title={formatMessage(messages.maxmin)}>
                    <Icon type="question-circle-o" style={{color: '#1890ff'}}/>
                  </Tooltip>
                </span>
              }
            >
              {/*<InputNumber min={1} max={100} onChange={this.onNumberChange} value={this.state.number}/>*/}
              <Input name='number' onChange={this.handleInputChange} value={this.state.number} placeholder="数量" />
            </FormItem>
          </Form>
        </div>
      </Modal>
    )

    const _this = this
    const props1 = {
      name: 'file',
      action: _util.getServerUrl('/eqp/syseqp/sys/upload/excel/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token'),
      },
      data: {
        site_id: _util.getStorage('site')
      },
      fileList: this.state.fileList,
      accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      showUploadList: false,
      beforeUpload(){
        _this.setState({spinLoading: true})
      },
      onChange(info) {
        const {file} = info
        const {fileList} = info
        _this.setState({spinLoading: false})
        if (file.status === 'done' && fileList.length > 0) {
          console.log(info)
          if (file.response.errNo !== 0) {
            notification['error']({
              message: file.response.error,
              description: ''
            })
            _this.setState({
              fileList: []
            })
          } else {
            message.success(formatMessage(messages.imported))    //导入成功
            _this.setState({
              fileList: [],
              importVisible: false
            })
            _this.getInfo({
              page: _this.state.pagination.current,
              page_size: _this.state.pagination.pageSize
            })
          }
          //_this.handleUpload(fileList[0])
        }

        if (file.status === 'error') {
          message.error(`${info.file.name} ${info.file.response}.`)
        }

        _this.setState({
          fileList
        })

      },
    }

    const props2 = {
      name: 'file',
      action: _util.getServerUrl('/eqp/syseqp/eqp/upload/excel/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token'),
      },
      data: {
        site_id: _util.getStorage('site')
      },
      fileList: this.state.fileList,
      accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      showUploadList: false,
      beforeUpload(){
        _this.setState({spinLoading: true})
      },
      onChange(info) {
        const {file} = info
        const {fileList} = info
        _this.setState({spinLoading: false})
        if (file.status === 'done' && fileList.length > 0) {
          console.log(info)
          if (file.response.errNo !== 0) {
            notification['error']({
              message: file.response.error,
              description: ''
            })
            _this.setState({
              fileList: []
            })
          } else {
            message.success(formatMessage(messages.imported))    //导入成功
            _this.setState({
              fileList: [],
              importVisible: false
            })
            _this.getInfo({
              page: _this.state.pagination.current,
              page_size: _this.state.pagination.pageSize
            })
          }
          //_this.handleUpload(fileList[0])
        }

        if (file.status === 'error') {
          message.error(`${info.file.name} ${info.file.response}.`)
        }

        _this.setState({
          fileList
        })
      }
    }

    const importModal = (
      <Modal
        title={<FormattedMessage id="app.modal.title.import" defaultMessage="导入" />}
        width={600}
        style={{top: 20}}
        visible={this.state.importVisible}
        onCancel={this.closeFormModal}
        footer={null}
        maskClosable={false}
      >
        <Spin spinning={this.state.spinLoading} style={{zIndex: 1001}}>
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>

          <Upload {...props1}>
            <Button icon='upload' style={{margin: '0 10px 0 10px'}}>
              <FormattedMessage id="page.walkthrough.text.systemimport" defaultMessage="系统导入" />
            </Button>
          </Upload>

          <a href={_util.getImageUrl('template_excel/系统模板.xlsx')} download="系统模板.xlsx">
            <Button icon='download'>
              <FormattedMessage id="page.walkthrough.text.systemtemplete" defaultMessage="系统模板下载" />
            </Button>
          </a>
          <Upload {...props2}>
            <Button icon='upload' style={{margin: '0 10px 0 10px'}}>
              <FormattedMessage id="page.walkthrough.text.eqptimport" defaultMessage="设备导入" />
            </Button>
          </Upload>

          <a href={_util.getImageUrl('template_excel/设备模板.xlsx')} download="设备模板.xlsx">
            <Button icon='download'>
              <FormattedMessage id="page.walkthrough.text.eqpttemplete" defaultMessage="设备模板下载" />
            </Button>
          </a>

        </div>
        <div style={{marginTop: 10}}><a><FormattedMessage id="page.walkthrough.text.importtips" defaultMessage="提示：1、导入系统前需先维护系统KEY；2、导入设备前需先维护好系统编号和设备KEY。" /></a></div>
        </Spin>
      </Modal>
    )

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">
          <div className="btn-group">
            {
              this.state.check(this, 'add') ?
                <Button type="primary" onClick={this.openModal}><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>
                :
                null
            }
            <Button type='primary' onClick={this.openFormModal}><FormattedMessage id="app.button.import" defaultMessage="导入" /></Button>
            <Button type="primary" onClick={this.copyModal}><FormattedMessage id="app.button.copy" defaultMessage="复制" /></Button>
            {
              this.state.check(this, 'excel')
                ? <Button type="primary" onClick={this.exportExcel}><FormattedMessage id="component.tablepage.export"
                                                                                      defaultMessage="导出"/></Button>
                : null
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

            <Select
              allowClear
              showSearch
              placeholder={formatMessage(messages.trade_key)}  //大类
              value={this.state.trade_key}
              optionFilterProp="children"
              onChange={this.tradekeyChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{
                width: 150,
                marginRight: 8
              }}
            >
              {
                Array.isArray(tradelist) && tradelist.map((d, index) =>
                  <Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)
              }
            </Select>

            <Select
              allowClear
              showSearch
              placeholder={formatMessage(messages.systemkey)}    //系统KEY
              value={this.state.system_key}
              onChange={this.onSystemChange}
              notFoundContent={this.state.fetching ?
                <Spin size="small"/> : <FormattedMessage id="global.nodata" defaultMessage="暂无数据"/>}
              filterOption={false}
              //onSearch={this.fetchUser}
              style={{width: 150}}
            >
              {
                Array.isArray(systemkeyArr) && systemkeyArr.map((d, index) =>
                  <Option key={d.id} value={d.id}>{d.abbr + '-' + d.name}</Option>)
              }
            </Select>

            <Search
              placeholder={formatMessage(messages.full_table_search)}  //全表搜索
              onSearch={this.handleSearch}
              enterButton
              style={{float: 'right', width: '250px'}}
            />
          </div>

          {importModal}
          {formModal}

          <Modal
            title={<FormattedMessage id="app.modal.title.importeqpt" defaultMessage="系统/设备录入" />}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
            maskClosable={false}
          >

            <Button
              type="primary"
              style={{marginRight: '20px'}}
              onClick={this.addsystem}><FormattedMessage id="page.walkthrough.text.system" defaultMessage="系统" /></Button>

            <Button
              type="primary"
              style={{marginRight: '20px'}}
              onClick={this.addeqpt}><FormattedMessage id="page.walkthrough.text.eqpt" defaultMessage="设备" /></Button>

          </Modal>

          <VirtualTable
            onRef={this.onRef}
            columns={column}
            dataSource={this.state.data}
            onPaginationChange={this.handleTableChange}
            pagination={pagination}
            loading={loading}
            onSelectChange={this.onSelectChange}
            reset={reset}
            selected={selected}
            clearScrollTop={clearScrollTop}
            noAddIconFn={record => {
              return !record.info.length
            }}
          />
        </div>
      </div>
    )
  }
}

import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Button, Input, Select, Form, Modal, DatePicker, Spin, Divider, Popconfirm, message, Tag, Tooltip} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {debounce} from 'lodash'
import {interviewee} from "@apis/event/interviewee"
import {Keys, KeyList, KeyDelete, keySearch, relatedSearch} from '@apis/facility/keys'
import moment from 'moment'
import VirtualTable from '@component/VirtualTable2'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'

const {Search} = Input
const {TextArea} = Input
const _util = new CommonUtil()
const FormItem = Form.Item;
const {Option} = Select;

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
  systemkey_name: {
    id: 'page.walkthrough.systemkey_name',
    defaultMessage: '系统Key名称',
  },
  eqptkey: {
    id: 'page.walkthrough.eqptkey',
    defaultMessage: '设备KEY',
  },
  eqptkey_name: {
    id: 'page.walkthrough.eqptkey_name',
    defaultMessage: '设备Key名称',
  },
  created: {
    id: 'page.walkthrough.created_name',
    defaultMessage: '创建人',
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
          title: formatMessage(messages.sort),  //类型
          dataIndex: 'type_desc',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.trade),  //类KEY
          dataIndex: 'trade_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.system_key),  //系统KEY
          dataIndex: 'sys_abbr',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.systemkey_name),  //系统Key名称
          dataIndex: 'sys_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.eqptkey),  //设备Key
          dataIndex: 'eqp_abbr',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.eqptkey_name),  //设备Key名称
          dataIndex: 'eqp_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),  //创建人
          dataIndex: 'created_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated),  //上次修改人
          dataIndex: 'updated_name',
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.updated_time),  //修改时间
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
          width: 120,
          dataIndex: 'operate',
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/key/edit',
              state: {
                id: id
              }
            }
            let path1 = {
              pathname: '/eqp/key/detail',
              state: {
                id: record.id
              }
            }
            return (
              <div>

                <Link to={path1}>
                  <FormattedMessage id="app.walkthrough.text.review" defaultMessage="查看" />
                </Link>

                <Divider type="vertical"/>

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
      postData: {},
      tradelist: [],
      systemkeyArr: [],
      allsystemkeyArr: []
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.exportExcel = this.exportExcel.bind(this)
    this.lastFetchId = 0
    this.lastFetchIdNew = 0
    // this.fetchUser = debounce(this.fetchUser, 500).bind(this)
  }

  getInfo(params) {
    this.setState({
      loading: true
    })
    KeyList(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  componentDidMount() {
    // _util.fixTableHead()
    this.getInfo({
      project_id : _util.getStorage('project_id'),
      page: this.state.pagination.current,
      page_size: this.state.pagination.pageSize
    })

    keySearch({type: 0, project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        tradelist: res.data
      })
    })

    keySearch({type: 1, project_id: _util.getStorage('project_id')}).then(res => {
      this.setState({
        systemkeyArr: res.data,
        allsystemkeyArr: res.data
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
    // _util.handleSearch(value, this)

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

  exportExcel() {
    const {selectedRows, column} = this.state;

    _util.exportExcel(selectedRows, column, 'Keys')
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
    KeyDelete(id).then(res => {
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

  render() {
    const {column, data, pagination, loading, selectedRowKeys, filtering, reset} = this.state
    const {refresh, check, tradelist, systemkeyArr} = this.state
    const { formatMessage } = this.props.intl
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    }

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">
          <div className="btn-group">
            {
              this.state.check(this, 'add')
                ?
                <Link to="/eqp/key/add">
                  <Button type="primary"><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>
                </Link>
                :
                null
            }
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

          <VirtualTable
            columns={column}
            dataSource={this.state.data}
            onPaginationChange={this.handleTableChange}
            pagination={pagination}
            loading={loading}
            onSelectChange={this.onSelectChange}
            reset={reset}
            noAddIconFn={record => {
              return !record.info.length
            }}
          />
        </div>
      </div>
    )
  }
}

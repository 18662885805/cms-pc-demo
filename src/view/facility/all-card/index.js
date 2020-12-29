import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {
  Button, Input, Popconfirm, Divider, Select, Modal, message, Spin, Row, Col, Tag, Checkbox, Tooltip, DatePicker
} from 'antd'
import UserWrapper from '@component/user-wrapper'
import debounce from 'lodash/debounce'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {visitInfo} from '@apis/system/location/'
import {MyMaintCard, MyMaintCardDelete} from '@apis/facility/mymaintcard'
import {MaintCard} from '@apis/facility/maintcard'
// import {interviewee} from "@apis/event/interviewee/"
import {observer, inject} from 'mobx-react'
// import TablePage from '@component/TablePage'
import VirtualTable from '@component/VirtualTable2'
import {areaInfo} from "@apis/system/area";
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import translation from '../translation'
const Search = Input.Search
const confirm = Modal.confirm
const {Option} = Select
const {TextArea} = Input

const _util = new CommonUtil()
const {RangePicker} = DatePicker

const messages = defineMessages({
  number: {
    id: 'page.walkthrough.maintcard.number',
    defaultMessage: '合同编号',
  },
  object: {
    id: 'page.walkthrough.maintcard.object',
    defaultMessage: '维修对象',
  },
  eqpNo: {
    id: 'page.walkthrough.maintcard.eqpNo',
    defaultMessage: '设备编号',
  },
  name: {
    id: 'page.walkthrough.maintcard.name',
    defaultMessage: '设备名称',
  },
  type: {
    id: 'page.walkthrough.maintcard.type',
    defaultMessage: '维修类型',
  },
  is_supplier: {
    id: 'page.walkthrough.maintcard.is_supplier',
    defaultMessage: '是否供应商',
  },
  company: {
    id: 'page.walkthrough.maintcard.company',
    defaultMessage: '供应商名称',
  },
  code: {
    id: 'page.walkthrough.maintcard.code',
    defaultMessage: '供应商编号',
  },
  hours: {
    id: 'page.walkthrough.maintcard.hours',
    defaultMessage: '工时/h',
  },
  cost: {
    id: 'page.walkthrough.maintcard.cost',
    defaultMessage: '费用',
  },
  supervisor: {
    id: 'page.walkthrough.maintcard.supervisor',
    defaultMessage: '监督人员',
  },
  workers: {
    id: 'page.walkthrough.maintcard.workers',
    defaultMessage: '施工人员',
  },
  allcards: {
    id: 'page.walkthrough.maintcard.allcards',
    defaultMessage: '所有维修卡',
  },
  start_time: {
    id: 'page.parking.area.start_time',
    defaultMessage: '开始时间',
  },
  end_time: {
    id: 'page.parking.area.end_time',
    defaultMessage: '结束时间',
  },
  update_name: {
    id: 'page.walkthrough.maintcard.update_name',
    defaultMessage: '上次修改人',
  },
  update_time: {
    id: 'page.walkthrough.maintcard.update_time',
    defaultMessage: '上次修改时间',
  },
  // created: {
  //   id: 'page.parking.area.created',
  //   defaultMessage: '创建人',
  // },
  // created_time: {
  //   id: 'page.parking.area.created_time',
  //   defaultMessage: '创建时间',
  // },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  select_enable_data: {
    id: 'app.component.tablepage.select_enable_data',
    defaultMessage: '请选择要启用的数据!',
  },
  enabled: {
    id: 'app.component.tablepage.enabled',
    defaultMessage: '已启用',
  },
  selected_data: {
    id: 'app.component.tablepage.selected_data',
    defaultMessage: '请选择要提交的数据!',
  },
  select_disable_data: {
    id: 'app.component.tablepage.select_disable_data',
    defaultMessage: '请选择要禁用的数据!',
  },
  disabled: {
    id: 'app.component.tablepage.disabled',
    defaultMessage: '已禁用',
  },
  export_data: {
    id: 'app.component.tablepage.export_data',
    defaultMessage: '请选择要导出的数据!',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
  okText: {
    id: 'app.component.tablepage.okText',
    defaultMessage: '提交',
  },
  cancelText: {
    id: 'app.component.tablepage.cancelText',
    defaultMessage: '取消',
  },
  start_date: {
    id: 'app.walkthrough.start_date',
    defaultMessage: '开始日期',
  },
  end_date: {
    id: 'app.walkthrough.end_date',
    defaultMessage: '结束日期',
  },
});

@inject('menuState', 'appState')
@observer
@injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const {formatMessage} = this.props.intl
    this.state = {
      column: [
        {
          title: formatMessage(translation.No),  //序号
          width: 40,
          maxWidth: 40,
          dataIndex: 'efm-index',
          render: (text, record, index) => {
            return (index + 1)
          }
        },
        {
          title: formatMessage(messages.number),    //合同编号
          dataIndex: 'contract_no',
          sorter: _util.sortString,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/maintcard/detail',
              state: {
                id: id
              }
            }
            return (
              <div>

                <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}} onClick={this.setScrollTop}>
                  {record.contract_no}
                </Link>

              </div>
            );
          }
        },
        {
          title: formatMessage(messages.object),   //维修对象
          dataIndex: 'main_obj',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.type),     //维修类型
          dataIndex: 'type',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.is_supplier),     //是否供应商
          dataIndex: 'is_supplier',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.company),     //供应商名称
          dataIndex: 'supplier_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        // {
        //   title: formatMessage(messages.code),     //供应商编号
        //   dataIndex: 'code',
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(record)
        // },
        // {
        //   title: formatMessage(messages.supervisor),     //监督人员
        //   dataIndex: 'supervisor',
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(record)
        // },
        // {
        //   title: formatMessage(messages.content),     //维修内容
        //   dataIndex: 'content',
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(record)
        // },
        {
          title: formatMessage(messages.hours),     //工时
          dataIndex: 'total_time',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.cost),     //费用
          dataIndex: 'cost',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.start_time),
          dataIndex: 'start_date',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              <Tooltip
                title={record.start_date ? moment(record.start_date).format('YYYY-MM-DD') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                {record.start_date ? moment(record.start_date).format('YYYY-MM-DD') : '-'}
              </Tooltip>
            )
          }
        },
        {
          title: formatMessage(messages.start_time),
          dataIndex: 'end_date',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              <Tooltip
                title={record.end_date ? moment(record.end_date).format('YYYY-MM-DD') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                {record.end_date ? moment(record.end_date).format('YYYY-MM-DD') : '-'}
              </Tooltip>
            )
          }
        },
        {
          title: formatMessage(messages.update_name),     //上次修改人
          dataIndex: 'updated_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.update_time),     //上次修改时间
          dataIndex: 'updated_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        // {
        //   title: formatMessage(messages.end_time),    //结束时间
        //   dataIndex: 'end_time',
        //   filterType: 'range-date',
        //   sorter: _util.sortDate,
        //   render: (text, record, index) => {
        //     return (
        //       <Tooltip
        //         title={record.end_time && record.end_hour ? moment(record.end_time + ' ' + record.end_hour).format('YYYY-MM-DD HH:mm') : '-'}
        //         placement="topLeft"
        //         mouseEnterDelay={0.4}>
        //         {record.end_time && record.end_hour ? moment(record.end_time + ' ' + record.end_hour).format('YYYY-MM-DD HH:mm') : '-'}
        //       </Tooltip>
        //     )
        //   }
        // },
      ],
      refresh: false,
      data: [],
      pagination: {
        pageSize: _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: 1
      },
      selectedRowKeys: [],
      selectedRows: [],
      search: null,
      search_data: [],
      search_id: null,
      search_info: '',
      visible: false,
      attentionVisible: false,
      isDisabled: true,
      remarkModal: false,
      check: _util.check(),
      locale: _util.getStorage('langs') || _util.getCookie('django_language') || 'zh-Hans'
    }
    this.lastFetchId = 0
    this.getInfo = this.getInfo.bind(this)
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  getInfo(params) {
    this.setState({
      loading: true
    })
    MaintCard(params).then((res) => {
      _util.getInfo(res, this)
    })
  }

  componentDidMount() {
    this.getInfo({
      project_id: _util.getStorage('project_id'),
      page: this.state.pagination.current,
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
    //     tempObj.name = obj.number
    //     tempObj.id = obj.id
    //     tempObj.key = obj.number
    //     if (obj.children) {
    //       tempObj.children = []
    //       obj.children.map(o => {
    //         // tempObj.children.push(getValue(o))
    //         tempObj.children.push({
    //           name: o.number,
    //           id: o.id,
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
    //   console.log(targetArr)
    //   this.setState({
    //     treeData: targetArr
    //   })
    // })

  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if (scrollTopPosition) {
      _util.setSession('scrollTop', scrollTopPosition);
    }
    ;
  }

  onDeleteOne = (id) => {
    this.setState({refresh: false})
    MyMaintCardDelete(id).then((res) => {
      this.setState({refresh: true})
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, selectedRows})
  };

  exportExcel = () => {
    const { formatMessage } = this.props.intl
    const {selectedRows, column} = this.state

    _util.exportExcel(selectedRows, column, formatMessage(messages.allcards))   //所有维修卡

  }

  hideModal = () => {
    this.setState({
      visible: false,
      search_id: null
    })
  }

  fetchUser = (value) => {
    this.lastFetchId += 1
    const fetchId = this.lastFetchId
    this.setState({search_data: [], fetching: true, search_info: '', search_id: null})
    interviewee({q: value}).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return
      }
      const search_data = res.data.results.map(user => ({
        name: user.name,
        org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id
      }))
      this.setState({search_data, fetching: false})
    })
  }

  handleChange = (value, obj) => {
    this.setState({
      search_id: value,
      // search_data: [],
      fetching: false,
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

  render() {
    const {
      data, column, check, refresh, visible, search_info, attentionVisible, submitVisible,
      search_data, isDisabled, search_id, filtering, treeData
    } = this.state;
    const {formatMessage} = this.props.intl;

    data.forEach(d => {
      if(d.is_supplier){
        d.is_supplier = '是'
      }else {
        d.is_supplier = '否'
      }
      if (d.updated_time) {
        d.updated_time = moment(d.updated_time).format('YYYY-MM-DD HH:mm')
      }
    })

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">

          {/*<TablePage*/}
            {/*refresh={refresh}*/}
            {/*getFn={MyVip}*/}
            {/*columns={column}*/}
            {/*excelName={check(this, 'excel') && 'ff'}*/}
            {/*onSelectChange={this.onSelectChange}*/}
            {/*dataMap={data => {*/}
              {/*data.forEach(d => {*/}
                {/*if (d.status) {*/}
                  {/*d.status_desc = _util.genStatusDesc(d.status)*/}
                {/*}*/}
              {/*})*/}
            {/*}}*/}
          {/*>*/}
            {/*{*/}
              {/*this.state.check(this, 'add')*/}
                {/*?*/}
                {/*<Link to="/parking/visitor/add" onClick={this.setScrollTop}>*/}
                  {/*<Button type="primary"><FormattedMessage id="app.button.new" defaultMessage="新增" /></Button>*/}
                {/*</Link>*/}
                {/*:*/}
                {/*null*/}
            {/*}*/}

            {/*<Select*/}
              {/*showSearch*/}
              {/*allowClear*/}
              {/*value={this.state.location}*/}
              {/*onChange={this.onLocationChange}*/}
              {/*placeholder={formatMessage(messages.factory)}   //厂区建筑*/}
              {/*optionFilterProp="children"*/}
              {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
              {/*style={{*/}
                {/*width: 200,*/}
                {/*marginRight: 10*/}
              {/*}}*/}
            {/*>*/}
              {/*{*/}
                {/*Array.isArray(treeData) && treeData.map((d, index) =>*/}
                  {/*<Option key={d.id} value={d.id}>{d.name}</Option>)*/}
              {/*}*/}
            {/*</Select>*/}

            {/*<RangePicker*/}
              {/*style={{*/}
                {/*marginRight: 10*/}
              {/*}}*/}
              {/*placeholder={[formatMessage(messages.start_date),formatMessage(messages.end_date)]}     // 开始日期/结束日期*/}
              {/*// showTime={{format: 'HH:mm'}}*/}
              {/*// ranges={{Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')]}}*/}
              {/*onChange={this.onDateChange}*/}
              {/*// onOk={this.onOk}*/}
            {/*/>*/}

            {/*/!*<Button type="primary" onClick={this.showAttentionModal}><FormattedMessage id="component.tablepage.add"*!/*/}
                                                                                       {/*/!*defaultMessage="新增"/></Button>*!/*/}
          {/*</TablePage>*/}

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

            {/*<Select*/}
              {/*showSearch*/}
              {/*allowClear*/}
              {/*value={this.state.location}*/}
              {/*onChange={this.onLocationChange}*/}
              {/*placeholder={formatMessage(messages.factory)}   //厂区*/}
              {/*optionFilterProp="children"*/}
              {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
              {/*style={{*/}
                {/*width: 200,*/}
                {/*// marginRight: 8*/}
              {/*}}*/}
            {/*>*/}
              {/*{*/}
                {/*Array.isArray(treeData) && treeData.map((d, index) =>*/}
                  {/*<Option key={d.id} value={d.id}>{d.name}</Option>)*/}
              {/*}*/}
            {/*</Select>*/}

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

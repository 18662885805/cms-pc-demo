import React, { Fragment } from 'react'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { allOrder } from '@apis/workorder/order-search'
import { myOrderForm } from '@apis/workorder/my-order'
import {chip, chipPost, chipDelete} from '@apis/onestop/chip'
import {organize} from "@apis/system/organize";
import {Button, Modal, Upload, message,DatePicker, Tag, Select, Table, Input, Popconfirm, Tooltip,Cascader} from 'antd'
import { Link } from 'react-router-dom'
// import {
//     costcenter,
//     getDepartment,
//     fetchDepartment
// } from '../../onestop/card-operation/userForms'
import VirtualTable from '@component/VirtualTable2'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {inject, observer} from "mobx-react";
import moment from 'moment'
import {SearchStaffTypeByOrg} from '@apis/home';

let _util = new CommonUtil()
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const order = defineMessages({
  title1: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  title2: {
      id:"page.work.my.title2",
      defaultMessage:"报修单编号"

  },
  title3: {
      id:"page.work.my.title3",
      defaultMessage:"报修人"
  },
  title4: {
    id: 'page.work.my.title4',
    defaultMessage: '报修人座机',
  },
  title5: {
    id: 'page.work.my.title5',
    defaultMessage: '报修类型',
  },
  title6: {
    id: 'page.work.my.title6',
    defaultMessage: '优先级',
  },
  title7: {
    id: 'page.work.my.title7',
    defaultMessage: '上一处理人',
  },
    title8: {
    id: 'page.work.my.title8',
    defaultMessage: '当前处理人',
  },
  title9: {
      id:"page.work.my.title9",
      defaultMessage:"报修时间"

  },
  title10: {
      id:"page.work.my.title10",
      defaultMessage:"期望完成日期"
  },
  title11: {
    id: 'page.work.my.title11',
    defaultMessage: '剩余时间',
  },
  title12: {
    id: 'page.work.my.title12',
    defaultMessage: '执行时间',
  },
  title13: {
    id: 'page.work.my.title13',
    defaultMessage: '完成时间',
  },
  title14: {
    id: 'page.work.my.title14',
    defaultMessage: '总计用时',
  },
    title15: {
    id: 'page.work.my.title15',
    defaultMessage: '评价',
  },
  title16: {
    id: 'page.work.my.title16',
    defaultMessage: '状态',
  },
  title18: {
    id: 'page.work.my.title18',
    defaultMessage: '厂区地点',
  },
    title19: {
    id: 'page.carryout.record.factory',
    defaultMessage: '厂区',
  },
  title20: {
    id: 'page.carryout.record.location_name',
    defaultMessage: '地点',
  },
  title21: {
    id: 'page.work.my.cost',
    defaultMessage: '花费金额',
  },
})

@inject('appState')
@observer
@injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
            column: [
              {
                  //title: '序号',
                  title:formatMessage(order.title1),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  //title: '工单编号',
                  title:'任务单编号',
                  dataIndex: 'serial',
                  width: 90,
                  minWidth: 90,
                  maxWidth: 90,
                  sorter: _util.sortString,
                  render: (text, record) => {
                      return <Link to={{
                          pathname: '/hotline/orderall/detail',
                          state: {id: record.id}
                      }} onClick={this.setScrollTop}>{_util.getOrNullList(record.serial)}
                      </Link>
                  }
              },
              // {
              //     //title: '报修人',
              //     title:formatMessage(order.title3),
              //     dataIndex: 'fromuser_name',
              //     sorter: _util.sortString,
              //     render: record => _util.getOrNullList(record)
              // },
              // {
              //     //title: '报修人座机',
              //     title:formatMessage(order.title4),
              //     dataIndex: 'fromuser_tel',
              //     sorter: _util.sortString,
              //     render: record => _util.getOrNullList(record)
              // },

              // {
              //     //title: '工单优先级',
              //     title:formatMessage(order.title6),
              //     dataIndex: 'priority_text',
              //     sorter: _util.sortString,
              //     render: record => {
              //         return <span style={record === '紧急' ||record === 'Emergent' ? {color: 'red'} : null}>{record}</span>
              //     }
              // },
                {
                  title:'组织',
                  dataIndex: 'factory_name',
                  sorter: _util.sortString,
                  render:record => _util.getOrNullList(record)
              },
                {
                  title:'执行人',
                  dataIndex: 'factory_name',
                  sorter: _util.sortString,
                  render:record => _util.getOrNullList(record)
              },
                {
                  title:'区域',
                  dataIndex: 'location_name',
                  sorter: _util.sortString,
                  render:record => _util.getOrNullList(record)
              },
                {
                  //title: '工单类型',
                  title:'是否升级',
                  dataIndex: 'cate_name',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
                {   title:'任务内容',
                  dataIndex: 'content',
                  sorter: _util.sortString,
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  render: record => _util.getOrNullList(record)
                  //render:record=>this.handleContentLength(record)
                  // render: record => _util.getOrNullList(record.substr(0,10) + '...')
              },
              // {
              //     //title: '厂区地点',
              //     title:formatMessage(order.title18),
              //     dataIndex: 'factory_name',
              //     sorter: _util.sortString,
              //     render: (text, record) => {
              //         let s = ''
              //         if (record.factory_name) {
              //             s += record.factory_name
              //         }
              //         if (record.location_name) {
              //             s += record.location_name
              //         }
              //         return _util.getOrNullList(s)
              //     }
              // },
              {
                  //title: '上一处理人',
                  title:formatMessage(order.title7),
                  dataIndex: 'last_person',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  // title: '当前处理人',
                  title:formatMessage(order.title8),
                  dataIndex: 'current_person',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
                {
                  //title: '报修时间',
                  title:'创建人',
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '报修时间',
                  title:'创建时间',
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '期望完成日期',
                  title:formatMessage(order.title10),
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  dataIndex: 'duedate',
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '剩余时间',
                  title:'截止日期',
                  dataIndex: 'left_days_hint',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '执行时间',
                  title:formatMessage(order.title12),
                  dataIndex: 'execute_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '完成时间',
                  title:formatMessage(order.title13),
                  dataIndex: 'finished_time',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '总计用时',
                  title:formatMessage(order.title14),
                  dataIndex: 'total_time',
                  sorter: _util.sortString,
                  render: record => {

                      if (!record) {
                          return _util.getOrNullList(record)
                      }

                      return <Tooltip
                          title={_util.formatDuring(record)}
                          placement="topLeft"
                          mouseEnterDelay={0.4}>
                          <span style={{color: 'red'}}>{_util.formatDuring(record)}</span>
                      </Tooltip>

                  }
              },
              // {   title:formatMessage(order.title21),
              //     dataIndex: 'cost',
              //     sorter: _util.sortString,
              //     render: record => _util.getOrNullList(record)
              // },
              {
                  //title: '评价',
                  title:formatMessage(order.title15),
                  dataIndex: 'rate_text',
                  sorter: _util.sortString,
                  width: 80,
                  minWidth: 80,
                  maxWidth: 80,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '状态',
                  title:formatMessage(order.title16),
                  dataIndex: 'status',
                  width: 80,
                  minWidth: 80,
                  maxWidth: 80,
                  render: record => {return _util.orderTag(record)}
              },
            ],
            // check: _util.check(),
            formVisible: false,
            fileList: [],
            costcenterArr: [],
            departmentArr: [],
            allDepartmentArr: [],
            statusTypes: [
                {
                    id: 1,
                    val:'1,7,8',
                    name: <FormattedMessage id="page.order.myOrder.sending" defaultMessage="派发中"/>
                },
                {
                    id: 2,
                    val:'2',
                    name:<FormattedMessage id="page.order.myOrder.conducting" defaultMessage="执行中"/>
                },
                {
                    id: 3,
                    val:'3',
                    name:<FormattedMessage id="page.order.myOrder.finished" defaultMessage="已完成"/>
                },
                {
                    id: 4,
                    val:'4,5',
                    name:<FormattedMessage id="page.order.myOrder.completed" defaultMessage="已关闭"/>
                },
                {
                    id: 5,
                    val:'9',
                    name:<FormattedMessage id="page.order.myOrder.cancelled" defaultMessage="已取消"/>
                },{
                    id: 6,
                    val:'10',
                    name:<FormattedMessage id="page.order.myOrder.pause" defaultMessage="暂停中"/>
                }
            ],
            data: [],
            pagination: {
                pageSize: _util.getPageSize(),
                showSizeChanger: true,
                pageSizeOptions: _util.getPageSizeOptions(),
                current: 1
            },
            check: _util.check(),

            factoryArr:[],
            orderType:[],
            searchText:'',
            loading:true,
            start_day: null,
            end_day: null,
            status_type:undefined,
            costcenterId:undefined,
            card_type:undefined,
            role_list:[],
        };
        this.handleTableChange = this.handleTableChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.exportExcel = this.exportExcel.bind(this)
    }

    getInfo(params) {
        // allOrder(params).then((res) => {
        //     _util.getInfo(res, this)
        // })

        organize({project_id:18}).then((res) => {
            _util.getInfo(res, this)
        })
    }

    componentWillMount() {
      SearchStaffTypeByOrg({project_id:_util.getStorage('project_id')}).then(res => {
          if(res.data){
              this.setState({role_list:res.data})
          }
        });
    }

    componentDidMount() {
        // _util.fixTableHead()
        this.getInfo({
            page_size: this.state.pagination.pageSize
        });
        // costcenter().then(res => {
        //     let data = res.data.results
        //     if (Array.isArray(data) && data.length > 0) {
        //         this.setState({
        //             costcenterArr: data
        //         })
        //     }
        // });
        //
        // fetchDepartment().then(res => {
        //     const data = res.data.results
        //     if (Array.isArray(data) && data.length > 0) {
        //         this.setState({
        //             departmentArr: data,
        //             allDepartmentArr: data
        //         })
        //     }
        //
        // })
        this.onSelectChange()

        //  myOrderForm().then((res) => {
        //     console.log(res);
        //     if(res){
        //         let factoryInfo=res.data.results.content[4].options;
        //         let orderType=res.data.results.content[1].options;
        //
        //         let factoryArr=factoryInfo.map((val,i)=>{
        //             val.items=[];
        //             orderType.map((order,j)=>{
        //                 if(order.factory_id===val.id){
        //                     val.items.push(order)
        //                 }
        //             });
        //             return val
        //          });
        //         this.setState({factoryArr:factoryArr})
        //     }
        // })
    }

    handleTableChange(pagination, filters={}, sorter={}) {
        if(this.state.costcenterId){
            filters.factory_id=this.state.costcenterId;
        }
        if(this.state.card_type){
            filters.cate_id=this.state.card_type
        }
        if(this.state.status_type){
            filters.status=this.state.status_type
        }
        _util.handleTableChange(pagination, filters, sorter, this);

        this.onSelectChange()
    }

     handleSearch(value) {
        _util.handleSearch(value, this)
    }

    searchText(value) {
        console.log(value);
        this.setState({searchText:value})
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRows)
        this.setState({selectedRowKeys, selectedRows})
    };

    exportExcel() {
        const {selectedRows, column} = this.state;
        const { formatMessage } = this.props.intl;

        if (selectedRows.length <= 0) {
            message.warning(formatMessage(messages.inCon38));
            return
        }

        // 过滤掉里面的空值
        _util.exportExcel(selectedRows.filter(item=>item), column, formatMessage(messages.inOne74))
        // _util.exportExcel(selectedRows, column, '芯片卡库管理')
    }

    handleBack = () => {
        this.props.history.goBack()
    };

    handleSelectCostcenter = value => {
        const values = {}
        values.factory_id = value
        // values.department_id = this.state.departmentId
        values.cate_id = this.state.card_type
        values.status = this.state.status_type
        values.page_size = this.state.pagination.pageSize

        this.getInfo(values)

        this.setState({
            costcenterId: value,
            departmentId: undefined
        })
    };

    // 筛选工单类型
    handleSelectCard = (value,value2) => {
        console.log(value);
        console.log(value2);
        const values = {};
        //values.factory_id = this.state.costcenterId;
        // values.department_id = this.state.departmentId
        values.status = this.state.status_type
        values.page_size = this.state.pagination.pageSize;
        values.start_day=this.state.start_day;
        values.end_day=this.state.end_day;

        values.factory_id = value[0];
        values.cate_id = value[1];
        this.setState({costcenterId: value[0],card_type: value[1]});

        this.getInfo(values)
    };

    // 筛选状态
    handleSelectStatus = value => {
        const values = {};
        values.factory_id = this.state.costcenterId
        // values.department_id = this.state.departmentId
        values.cate_id = this.state.card_type
        values.page_size = this.state.pagination.pageSize;
        values.start_day=this.state.start_day;
        values.end_day=this.state.end_day;

        if (value) {
            values.status = value
        }

        this.getInfo(values)

        this.setState({
            status_type: value
        })
    };

    // 筛选开始/结束日期
    handleSelectDate = (value,value2) => {
        const values = {};
        values.factory_id = this.state.costcenterId;
        values.cate_id = this.state.card_type;
        values.status = this.state.status_type;
        values.page_size = this.state.pagination.pageSize;
        values.start_day=this.state.start_day;
        values.end_day=this.state.end_day;

        this.getInfo(values);
    };

    onChange = (value) => {
          if(value.length===0){
              let _this=this;
              let p=new Promise(function (resolve, reject) {
                  _this.setState({start_day:'',end_day:''});
                  resolve('ok')
              });
              p.then((date)=>{
                  _this.handleSelectDate()
              });

          }else{
              this.setState({
                  start_day: moment(value[0]).format('YYYY-MM-DD'),
                  end_day: moment(value[1]).format('YYYY-MM-DD'),
                })
          }
     };

    handleUpload = file => {
        const { formatMessage } = this.props.intl;
        if (file.response.content.results.url) {
            chipPost({
                file: file.response.content.results.url,
                is_excel: 1
            }).then(res => {
                message.success(formatMessage(messages.alarm33)
                //'导入成功'
            )
                this.setState({
                    fileList: [],
                    formVisible: false
                })
                this.getInfo({
                    page_size: this.state.pagination.pageSize
                })
            }).catch(err => {
                this.setState({
                    fileList: [],
                })
            })
        }
    };

    doFilter = () => {
        const { column, filtering } = this.state
    
        if (!filtering) {
            column.forEach(c => {
            if (c.dataIndex !== 'operate' && c.dataIndex !== 'efm-index' && c.dataIndex !== 'operate1') {
              c.filter = true
            }
          })
          this.setState({ column, filtering: true, reset: false })
        } else {
            column.forEach(c => {
            c.filter = false
          })
          this.setState({ column, filtering: false, reset: true })
        }
      };

    setScrollTop = () => {
        const scrollTopPosition = this.props.appState.tableScrollTop;
        if(scrollTopPosition){
          _util.setSession('scrollTop', scrollTopPosition);
        };
      };

    render(){
        const {column, data, pagination, loading, selectedRowKeys, filtering, reset,orderType,factoryArr,searchText,role_list} = this.state

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        }

        data.forEach(d => {
            d.efmExpands = d.info
        })

        const _this = this
        const props = {
            name: 'file',
            action: _util.getServerUrl('/upload/onestop/created/'),
            headers: {
                Authorization: 'JWT ' + _util.getStorage('token'),
            },
            data: {
                site_id: _util.getStorage('site')
            },
            fileList: this.state.fileList,
            accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            onChange(info) {
                const { file } = info
                const { fileList } = info

                if (file.status === 'done' && fileList.length > 0) { 
                    _this.handleUpload(fileList[0])
                }

                if (file.status === 'error') {
                    message.error(`${info.file.name} ${info.file.response}.`)
                }

                _this.setState({
                    fileList
                })

            },
        };

        const { formatMessage } = this.props.intl;

        const bread = [
      {
        name: formatMessage({
          id: "menu.homepage",
          defaultMessage: "首页"
        }),
        url: "/"
      },
      {
        name: formatMessage({
          id: "page.system.task.systemManage",
          defaultMessage: "任务管理"
        })
      },
      {
        name:'区域管理',
        url: "/system/work/type"
      }
    ];

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper">
                <div className="btn-group">
                        {
                            this.state.check(this, 'excel')
                            ? <Button type="primary" onClick={this.exportExcel}><FormattedMessage id="component.tablepage.export" defaultMessage="导出" /></Button>
                            : null
                        }
                        <Button style={{background: filtering ? '#87d068' : '#1890ff', border: 0, color: '#fff'}}
                            onClick={this.doFilter}
                          >
                            <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选" />
                        </Button>

                        {/*<RangePicker*/}
                            {/*disabled={this.state.filtering}*/}
                            {/*style={{marginRight: 8,width:'230px'}}*/}
                            {/*onChange={(value)=>this.onChange(value)}*/}
                            {/*onOk={() => this.handleSelectDate()}*/}
                            {/*showTime={{ format: 'HH:mm' }}*/}
                            {/*format="YYYY-MM-DD"*/}
                            {/*// defaultValue={[moment(moment().subtract(7,'days'),'YYYY-MM-DD'),moment(moment(),'YYYY-MM-DD')]}*/}
                            {/*placeholder={[formatMessage(messages.start_placeholder), formatMessage(messages.end_placeholder)]}*/}
                        {/*/>*/}

                        <Select
                            allowClear
                            showSearch
                            onChange={value => this.handleSelectCostcenter(value)}
                            placeholder={'组织'}
                            value={this.state.costcenterId}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            style={{width: 150, marginRight: 8}}
                        >
                            {role_list.map((card, cardIndex) => {
                                    return (<Option key={cardIndex} value={card.org_id}>{card.org_name}</Option>)
                                })
                            }
                        </Select>

                        <Cascader
                            options={factoryArr}
                            fieldNames={{ label: 'name', value: 'id', children: 'items' }}
                            onChange={(value,selectedOptions) => this.handleSelectCard(value,selectedOptions)}
                            placeholder={'任务类型'}
                            style={{width: 150, marginRight: 8}}
                            changeOnSelect
                          />

                        {/*<Select*/}
                                {/*allowClear*/}
                                {/*showSearch*/}
                                {/*onChange={value => this.handleSelectCard(value)}*/}
                                {/*placeholder={formatMessage(messages.inOne71)}*/}
                                {/*value={this.state.card_type}*/}
                                {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                                {/*style={{*/}
                                    {/*width: 150,*/}
                                    {/*marginRight: 8*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*{orderType.map((card, cardIndex) => {*/}
                                        {/*return (<Option key={cardIndex} value={card.id}>{card.name}</Option>)*/}
                                    {/*})*/}
                                {/*}*/}
                            {/*</Select>*/}

                        {/*<Select*/}
                            {/*allowClear*/}
                            {/*showSearch*/}
                            {/*onChange={value => this.handleSelectCostcenter(value)}*/}
                            {/*placeholder={formatMessage(messages.inOne72)}*/}
                            {/*value={this.state.costcenterId}*/}
                            {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                            {/*style={{width: 150, marginRight: 8}}*/}
                        {/*>*/}
                            {/*{factoryArr.map((card, cardIndex) => {*/}
                                    {/*return (<Option key={cardIndex} value={card.id}>{card.name}</Option>)*/}
                                {/*})*/}
                            {/*}*/}
                        {/*</Select>*/}

                        <Select
                                allowClear
                                showSearch
                                onChange={value => this.handleSelectStatus(value)}
                                placeholder={formatMessage(messages.inOne42)}
                                value={this.state.status_type}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{
                                    width: 150,
                                    marginRight: 8
                                }}
                            >
                                {
                                    this.state.statusTypes.map((card, cardIndex) => {
                                        return (
                                            <Option
                                                key={cardIndex}
                                                value={card.val}>
                                                {card.name}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                      
                        <Search
                            placeholder={formatMessage(messages.inOne43)}
                            onSearch={this.handleSearch}
                            // onChange={this.searchChange}
                            enterButton
                            // value={this.state.card_type|| this.state.costcenterId ||this.state.status_type?'':searchText}
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

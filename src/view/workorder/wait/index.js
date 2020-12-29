import React, { Fragment } from 'react'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {type,typeInfo} from '@apis/workorder/type'
import {wait} from '@apis/workorder/wait'
import {recordPdf} from '@apis/workorder/order';
import {
    Button,
    Modal,
    Upload,
    message,
    Tag,
    Select,
    DatePicker,
    Table,
    Input,
    Popconfirm,
    Tooltip,
    Cascader,
    Icon, Row, Col, Spin,Breadcrumb
} from 'antd'
import { Link } from 'react-router-dom'
import VirtualTable from '@component/VirtualTable2'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {inject, observer} from "mobx-react";
import moment from 'moment'
import styles from "../../document/workflow/index.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import { cloneDeep } from "lodash";
import {getURL} from '@apis/system/url'
let _util = new CommonUtil();
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const my = defineMessages({
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
  title17: {
    id: 'page.work.my.title17',
    defaultMessage: '操作',
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
});

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
                  title:formatMessage(my.title1),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  //title: '工单编号',
                  title:'编号',
                  dataIndex: 'serial',
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  sorter: _util.sortString,
                  render: (text, record) => {
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
                              id,
                              cate_user_name,
                              cate_user_id,
                              fromuser_phone,
                              fromuser_id,
                          } = record;

                      let editData={
                          factory_id,
                          location_id,
                          serial,
                          cate_id,
                          priority,
                          duedate,
                          content,
                          pic_source,
                          touser_name:cate_user_name,
                          touser_id:cate_user_id,
                          orderId: id,
                          fromuser_phone,
                          fromuser_id
                      };

                      return <Link to={{
                          pathname:'/assignment/wait/detail',
                          // pathname:record.can_modify?'/workorder/order/add':'/workorder/order/detail',
                          state: {id: record.id,
                              editData:record.can_modify?editData:null,
                          }
                      }} onClick={this.setScrollTop}><span style={{width:'16px',display:"inline-block",marginRight:'3px'}}>{record.is_important?<Icon type="flag" style={{color:'#ED5565'}}/>:null}</span>{_util.getOrNullList(record.serial)}</Link>
                  }
              },
                {
                  //title: '报修人',
                  title:'发起人',
                  dataIndex: 'from_user',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record.name)
              },
                {
                  //title: '报修时间',
                  title:'发起时间',
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
                {
                  //title: '当前处理人',
                  title:'处理人',
                  dataIndex: 'current_user',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record.name)
              },
                {
                  //title: '当前处理人',
                  title:'处理组织',
                  dataIndex: 'current_org',
                  sorter: _util.sortString,
                  render: (text,record) => _util.getOrNullList(record.current_user.org)
              },
                  {
                  //title: '期望完成日期',
                  title:'截止时间',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  dataIndex: 'duedate',
                  render: record => _util.getOrNullList(record)
              },
                 {
                  //title: '期望完成日期',
                  title:'是否逾期',
                  sorter: _util.sortString,
                  dataIndex: 'is_overdue',
                  render: record => {return record?'是':'否'}
                  //render: record => this.handleGapDay(record)
                },
                {
                  //title: '工单类型',
                  title:'是否升级',
                  dataIndex: 'is_escalation',
                  sorter: _util.sortString,
                  render: record => {
                      return <Tag color={record?'#ff0000':'#87d068'}>{record?'是':'否'}</Tag>
                  }
              },
              {
                  //title: '状态',
                  title:formatMessage(my.title16),
                  dataIndex: 'status',
                  width: 80,
                  minWidth: 80,
                  maxWidth: 80,
                  sorter: _util.sortString,
                  render: record => _util.renderAssignmentStatus(record)
                  //render: record => _util.getOrNullList(record)
              },
              //    {
              //     //title: '报修人',
              //     title:'任务类型',
              //     dataIndex: 'cate_name',
              //     sorter: _util.sortString,
              //     render: (text,record) => _util.getOrNullList(text)
              // },
              //   {
              //     //title: '报修人',
              //     title:'组织',
              //     dataIndex: 'org_name',
              //     sorter: _util.sortString,
              //     render: (text,record) => _util.getOrNullList(text)
              // },
              //
              // {
              //     //title: '报修人座机',
              //     title:'联系电话',
              //     dataIndex: 'fromuser',
              //     sorter: _util.sortString,
              //     render: (text,record) => _util.getOrNullList(record.from_user.phone)
              // },



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
                },
                {
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
            canAdd:true,
            //myAllFlow:[{name:'全部',id:0},{name:'任务类型1',id:1},{name:'任务类型2',id:2},{name:'任务类型3',id:3}],
            myAllFlow:[],
            selectedTypeKey:0,
            selectedTypeName:0,
            exportVisible:false,
            url:'',
        };
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.exportExcel = this.exportExcel.bind(this);
        this.exportPdf = this.exportPdf.bind(this)
    }

    getInfo(params) {
        wait({
             ...params,
             project_id:_util.getStorage("project_id")
         }).then((res) => {
             let res_data=cloneDeep(res.data.results);
              res_data&&res_data.length&&res_data.map(a=>a.current_org=a.current_user&&a.current_user.org)
              this.setState({data:res_data});
        })
    }

    componentWillMount() {
        this.getInfo({
            page_size: this.state.pagination.pageSize
        });
        this.onSelectChange();

        typeInfo({project_id:_util.getStorage("project_id")}).then((res) => {
            let result=res.data;
            result.unshift({name:'全部类型',id:0});
            this.setState({myAllFlow:result,loading:false})
        })
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRows)
        this.setState({selectedRowKeys, selectedRows})
    };

    exportModal=()=>{
        const {selectedRows, column} = this.state;
        console.log(selectedRows)
        if (selectedRows&&selectedRows.length > 0) {
            getURL().then(data => {
              if(data.data&&data.data.pc_url){
                this.setState({url:data.data.pc_url})
              }else{
                message.warning('获取URL失败')
              }
            });
            this.setState({exportVisible:true})
        }else{
            message.warning('请先选择要导出的数据');
        }
    };

    hideExportModal=()=>{
        this.setState({exportVisible:false})
    };

    exportExcel() {
        const {selectedRows, column} = this.state;
        const { formatMessage } = this.props.intl;

        if (selectedRows&&selectedRows.length <= 0) {
            message.warning(formatMessage(messages.inCon38));
            return
        }

        // 过滤掉里面的空值
        _util.exportExcel(selectedRows.filter(item=>item), column, '待处理任务')
        this.setState({exportVisible:false})
        // _util.exportExcel(selectedRows, column, '芯片卡库管理')
    }

    exportPdf(){
        const {selectedRows, column,url} = this.state;
        const { formatMessage } = this.props.intl;
        console.log(selectedRows)

        if (selectedRows&&selectedRows.length <= 0) {
            message.warning(formatMessage(messages.inCon38));
            return
        }

        recordPdf({
             task_id_string:selectedRows.map(a=>a.id).join(','),
             project_id:_util.getStorage("project_id")
         }).then((res) => {
             if(res){
                 window.open(url + "/source/" + res.data);
                 // _util.getHrefUrl(res.data)
             }
        });
        this.setState({exportVisible:false})

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

    handleSelectCard = (value,value2) => {
        console.log(value);
        const values = {};
        //values.factory_id = this.state.costcenterId;
        values.status = this.state.status_type
        values.page_size = this.state.pagination.pageSize;
        values.start_day=this.state.start_day;
        values.end_day=this.state.end_day;

        values.factory_id = value[0];
        values.cate_id = value[1];
        this.setState({costcenterId: value[0],card_type: value[1]});

        // if (value.length) {
        //     values.factory_id = value[0];
        //     this.setState({costcenterId: value[0]});
        //     if(value.length>1){
        //         values.cate_id = value[1];
        //         this.setState({card_type: value[1]})
        //     }
        // }

        this.getInfo(values)

        // this.setState({card_type: value[1]})
    };

    handleSelectStatus = value => {
        const values = {}
        values.factory_id = this.state.costcenterId;
        // values.department_id = this.state.departmentId
        values.cate_id = this.state.card_type;
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
    }

    doFilter = () => {
        const { column, filtering } = this.state
    
        if (!filtering) {
            column.forEach(c => {
            if (c.dataIndex !== 'operate' && c.dataIndex !== 'efm-index' && c.dataIndex !== 'operate1') {
              c.filter = true
            }
          });
          this.setState({ column, filtering: true, reset: false })
        } else {
            column.forEach(c => {
            c.filter = false
          });
          this.setState({ column, filtering: false, reset: true })
        }
      };

     setScrollTop = () => {
        const scrollTopPosition = this.props.appState.tableScrollTop;
        if(scrollTopPosition){
          _util.setSession('scrollTop', scrollTopPosition);
        }
      };

      handeWorkflowInfo = (id,name) => {
        const {selectedTypeKey} = this.state;
        if(selectedTypeKey === id){
          return
        }
        const {project_id} = this.state;
        this.setState({
          level_loading:true,
          workflowRecordList:[],
          selectedTypeKey:id,
          selectedTypeName:name,
          selectedRecordKey:'',
          selectedRecordName:'',
          fileData:[],
            refresh:true,
        });

        this.getInfo({page_size:200,page:1,cate_id:id?id:null})
      };

    render(){
        const {column, data, pagination, loading, selectedRowKeys, filtering, reset,orderType,factoryArr,searchText,
        canAdd,myAllFlow,selectedTypeKey,exportVisible} = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        }

        data.forEach(d => {
            d.efmExpands = d.info
        });

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
        name:'待处理任务',
        url: "/assignment/wait"
      }
    ];

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper">
                    <div className="btn-group" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div>
                          <Breadcrumb className={styles.file_Breadcrumb} style={{height:'32px'}}>
                            <Breadcrumb.Item>
                              {/*<Icon type="folder" theme="twoTone" />*/}
                              {/*<span>任务类型</span>*/}
                            </Breadcrumb.Item>
                          </Breadcrumb>
                        </div>

                        <div>
                            <Button type='primary' style={{marginRight: 8}} onClick={()=>this.exportModal()}>
                              导出
                            </Button>
                        </div>
                    </div>

                 <Row gutter={24} style={{height: 'calc(100vh - 228px)',borderBottom:'1px solid rgb(232, 232, 232)'}}>
            {/* 一级目录区 */}
                <Col span={myAllFlow&&myAllFlow.length ? 4 :0} style={{ overflow: "hidden", padding:0}}>
                  <Spin spinning={false}>
                    <Scrollbars
                      style={{
                        height: 'calc(100vh - 228px)',
                        borderRight:'1px solid rgb(232, 232, 232)'
                      }}>
                      <Fragment>
                        {
                          myAllFlow&&myAllFlow.map((d,index) => {
                            return(
                              <div
                                key={d.id}
                                className={styles.firstLevelItem}
                                style={{background:selectedTypeKey === d.id ? 'rgba(0,0,0,0.08)' :''}}
                                onClick={() => this.handeWorkflowInfo(d.id,d.name)}
                              >
                                <div className={styles.firstLevelItemLeft} >
                                  <Icon type='tag' theme={selectedTypeKey === d.id ?'twoTone':''} style={{marginRight:'8px'}}/>
                                  <span>{d.name}</span>
                                </div>
                              </div>
                            )
                          })
                        }
                      </Fragment>
                    </Scrollbars>
                  </Spin>
                </Col>

                <Col span={20}>
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
                </Col>
            </Row>

                    <Modal
                        title={'类型'}
                        style={{ top: 20 }}
                        visible={exportVisible}
                        // onOk={()=>this.submitDateModal()}
                        // onCancel={()=>this.hideExportModal()}
                        // okText={'提交'}
                        // cancelText={'取消'}
                        destroyOnClose={true}
                        footer={[
                            <Button key="back" onClick={()=>this.hideExportModal()}>
                              取消
                            </Button>,
                        ]}
                     >
                        <div style={{textAlign:'center'}}>
                            <Button type={'primary'} style={{marginRight:'10%'}} onClick={this.exportExcel}>导出excel</Button>
                            <Button type={'primary'} onClick={this.exportPdf}>导出pdf</Button>
                        </div>
                      </Modal>
                </div>
            </div>
        )
    }
}

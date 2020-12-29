import React, {Fragment} from "react";
import { Link } from "react-router-dom";
import {Popconfirm, Divider, message, Icon, Button,Form,Input,Select, 
   Row, Col, Spin, Breadcrumb, Tag,InputNumber,Modal,Upload} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { wait, waitDelete,ChildFlow } from "@apis/workflow/wait";
import { record } from "@apis/workflow/record";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import {inject, observer} from "mobx-react/index";
import moment from 'moment'
import styles from "../../document/workflow/index.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {recordAllFlow} from "@apis/workflow/record";
import VirtualTable from '@component/VirtualTable3'
import values from "postcss-modules-values";
import SearchUserSelect from '@component/searchUserSelect'
import { SearchProjectUser } from "@apis/system/user";
import debounce from 'lodash/debounce';
const _util = new CommonUtil();
const FormItem = Form.Item;
const {TextArea}=Input;
const {Search} = Input


@inject("appState") @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      column: [
        {
          title: formatMessage(translation.No),   //序号
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return (index + 1);
          }
        },
          {
          title:'编号',
          dataIndex: "code",
          sorter: _util.sortString,
          render: (text, record) => {
              return record.info&&record.info.code ? record.info.code :''
          }
        },

        {
          title:'标题',
          dataIndex: "remarks",
          sorter: _util.sortString,
          render: (text,record) => _util.getOrNullList(record.info.remarks)
        },
        {
          title:'发起人',
          dataIndex: "created",
          sorter: _util.sortString,
          render: (text,record) => _util.getOrNullList(record.info.created)
        },
        {
          title:'发起时间',  //创建时间
          dataIndex: "created_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: (text,record) => _util.getOrNullList(record.info.created_time)
        },
        {
          title:'当前步骤',  
          dataIndex: "step_name",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        // {
        //   title: '当前审批人', 
        //   dataIndex: "info",
        //   sorter: _util.sortString,
        //   render: (text, record, index) => {
        //     const {info} = record;
        //     const {now_approval} = info;
        //     return <span>{_util.renderListToString(now_approval,'name')}</span>
        //   }
        // },
        {
          title:'审批截止日期',  
          dataIndex: "info",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: (text, record, index) => {
            const {info} = record;
            const {now_approval} = info;
            var current_day = moment( new Date() ).format('YYYY-MM-DD')
            var dead_day = now_approval&&now_approval.length ? (now_approval[0]['dead_day'] ? now_approval[0]['dead_day']:'') :'';
            return <span style={{color:this.compareDate(current_day,dead_day) ? 'red' :''}}>{dead_day}</span>
          },
        },
        {
          title:'逾期天数',  
          dataIndex: "info",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record.timeout ? record.timeout : 0)
        },
        {
          title: '状态',  //修改时间
          dataIndex: "status_desc",
          sorter: _util.sortDate,
          render: (val, record) => {
            return <Tag color={_util.getColor(record.info.status)}>{record.info.status_desc}</Tag>;
          }
        },
        {
          title: formatMessage(translation.operate),   //操作
          dataIndex: "operate",
          minWidth: 80,
          maxWidth: 110,
          render: (text, record, index) => {
            return (
              <div>
                <Link to={{
                    pathname: "/workflow/record/wait/pdf",
                    state: {
                        id: record.id,
                        work_flow_id:this.state.selectedWorkflowKey?this.state.selectedWorkflowKey:'',
                        type:2,
                    }
                  }} onClick={this.setScrollTop}>
                  审批
                </Link>
                <Divider type='vertical' />
                <a onClick={() => this.showEntrust(record)}>委托</a>
              </div>
            );
          }
        }
      ],
      check: _util.check(),
      myAllFlow:[],

      selectedWorkflowKey:'',
      fileData:[],
      pagination: {
        pageSize: _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: _util.getSession('currentPage') ? _util.getSession('currentPage') : 1
      },
      tableLoading:false,
      filtering:false,
      search: '',

      entrustVisible:false,
      entrustData:{remarks:'',deadline:1},
      fileList:[],
      user_data:[],
      user:[],
      user_info:'',
      user_id:'',
      fetching: false,
      selectedRecord:'',
      refresh:false,
    };
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  componentWillMount() {
    const {selectedWorkflowKey,search,pagination} = this.state;
    recordAllFlow({project_id: _util.getStorage('project_id')}).then((res) => {
      let allFlow=res.data;
      allFlow.unshift({id:'',name:'全部类型'});
      this.setState({myAllFlow: allFlow})
    });

    if(_util.getStorage('workflow_wait_key')){
      var id = _util.getStorage('workflow_wait_key');
      var name = _util.getStorage('workflow_wait_name');
      this.handleWorkflowInfo(id,name)
    }else{
      this.getInfo(selectedWorkflowKey,search,pagination)
    }
    
  }

  //比较日期大小
  compareDate = (date1,date2) => {
    //当前日期,期限日期
    if(date1&&date2){
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if(oDate1.getTime() > oDate2.getTime()){
        return true;
      } else {
        return false;
      }
    }else{
      return false
    }
    
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  };

  getInfo=(work_flow_id,new_search,new_pagination)=>{
    const {pagination,search} = this.state;
      wait({
        work_flow_id: work_flow_id,
        project_id:_util.getStorage('project_id'),
        page : new_pagination ? new_pagination.current : pagination.current,
        page_size : new_pagination ? new_pagination.pageSize : pagination.pageSize,
        search:new_search ? new_search :search
      }).then(res => {
        if(res.data&&res.data.results.length){
          res.data.results.forEach((d,index) => {
                    switch (d.info.status) {
                        case 1:d.info.status_desc='未操作';
                        break;
                        case 2:d.info.status_desc='待提交';
                        break;
                        case 3:d.info.status_desc='待审批';
                        break;
                        case 4:d.info.status_desc='审批通过';
                        break;
                        case 5:d.info.status_desc='审批未通过';
                        break;
                        case 6:d.info.status_desc='召回';
                        break;
                        case 7:d.info.status_desc='退回';
                        break;
                        case 8:d.info.status_desc='提交';
                        break;
                        case 9:d.info.status_desc='跳过';
                        break;
                        case 10:d.info.status_desc='已撤回';
                        break;
                        case 11:d.info.status_desc='发起人修改步骤参与人';
                        break;
                        case 12:d.info.status_desc='代理';
                        break;
                    }
          });

          this.setState({
            fileData:res.data.results,
            recordShow:true
          })
        }
        this.setState({level_loading:false, })
      })
  };

  handleWorkflowInfo = (id,name) => {
    _util.setStorage('workflow_wait_key',id);
    _util.setStorage('workflow_wait_name',name);
    const {selectedWorkflowKey, pagination,search} = this.state;
    if(selectedWorkflowKey == id){
      return
    }

    this.setState({
      level_loading:true,
      workflowRecordList:[],
      selectedWorkflowKey:id,
      selectedWorkflowName:name,
      selectedRecordKey:'',
      selectedRecordName:'',
      fileData:[],
    });

    this.getInfo(id,search,pagination);
  };

  handleDeadTime=(val1,val2)=>{
     let item_str='';
     val2&&val2.length?
     val2.map((item)=>{
        if(item.child.map(a=>a.id).indexOf(val1)>-1){
          item_str=item.dead_day;
        }
     }):item_str='';
     let now_day=moment().format('YYYY-MM-DD');
     if(item_str){
         let gap_day=moment(now_day).diff(moment(item_str),'days');
         console.log(gap_day);
         if(gap_day>-1){
            return <Tag color={'#f50'}>{item_str}</Tag>
         }else{
             return item_str
         }
     }else{
         return '-'
     }
  };


  showEntrust = (record) => {
    this.setState({entrustVisible:true,selectedRecord:record})
  }

  hideEntrust = () => {
    this.setState({
      entrustVisible:false,
      fileList:[],
      entrustData:{remarks:'',deadline:1},
      selectedRecord:'',
      user_data:[],
      user_info:''
    })
  }

  handleEntrustData = (value,field) => {
    const {entrustData} = this.state;
    entrustData[field] = value;
    this.setState({entrustData})

  }


  fileUpload = (info) => {
    let {fileList} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;
    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }

    this.setState({fileList: fileList})
  };

  



  fetchUser = value => {
    console.log(value);
    if(value){
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.setState({user_data: [], fetching: true });
      SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') }).then(body => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        this.setState({ user_data:body.data, fetching: false });
      });
    }
    
  };

  handleChange = value => {
    console.log('value',value);
    this.setState({user_info:value,user_id:value.key})
  };

  applyEntrust = () => {
    this.setState({refresh:true})
    const {entrustData,selectedRecord,user_id,selectedWorkflowKey,search,pagination} = this.state;
    const {remarks,deadline} = entrustData;
    const {id,info} = selectedRecord;
    var _id = info.id ? info.id :'';
    var now_id = id;
    entrustData.id = _id;
    entrustData.now_id = now_id;
    entrustData.user_id = user_id;
    entrustData.project_id = _util.getStorage('project_id');
    if(!user_id){
      message.warning('请选择委托人')
      return
    }
    ChildFlow(entrustData).then(res => {
      this.setState({refresh:false})
      this.hideEntrust();
      this.getInfo(selectedWorkflowKey,search,pagination)
    })
  }

  //修改页数
  handleTableChange = (pagination, filters = {}, sorter = {}) => {
    const {selectedWorkflowKey,search} = this.state;
    const pager = {...pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      fileData: []
    });
    this.getInfo(selectedWorkflowKey,search,pager);
  };

  //搜索
  handleSearch = (value) => {
    const {selectedWorkflowKey,pagination} = this.state;
    _util.removeSession('scrollTop');
    this.setState({search:value})
    this.getInfo(selectedWorkflowKey,value,pagination);
  }

  //筛选
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
    const { column, check, refresh,myAllFlow,fileData,pagination,tableLoading,user_data,
      filtering,selectedRows,selectedWorkflowKey,entrustVisible,fileList,fetching} = this.state;
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
          id: "page.system.workFlow.systemManage",
          defaultMessage: "工作流管理"
        })
      },
      {
        name: '待处理工作流',
        url: "/workflow/record/wait"
      }
    ];

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };


    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
            <div
              className="btn-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
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
                placeholder={'全表搜索'}  //全表搜索
                onSearch={this.handleSearch}
                enterButton
                style={{width: '280px'}}
                /> 
            </div>
            <Row gutter={24} style={{height: 'calc(100vh - 200px)',borderBottom:'1px solid rgb(232, 232, 232)'}}>
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
                                style={{background:selectedWorkflowKey === d.id ? 'rgba(0,0,0,0.08)' :''}}
                                onClick={() => this.handleWorkflowInfo(d.id,d.name)}
                              >
                                <div className={styles.firstLevelItemLeft} >
                                  <Icon type='tag' theme={selectedWorkflowKey === d.id ?'twoTone':''} style={{marginRight:'8px'}}/>
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
                    refresh={refresh}
                    columns={column}
                    dataSource={fileData}
                    onPaginationChange={this.handleTableChange}
                    pagination={pagination}
                    loading={tableLoading}
                    onSelectChange={this.onSelectChange}
                    filtering={this.state.filtering}
                    selectedRows={selectedRows}
                  />
            </Col>
            </Row>


            <Modal
                title={'委托'}
                visible={entrustVisible}
                onOk={this.applyEntrust}
                onCancel={this.hideEntrust}
                okText={<FormattedMessage id="component.tablepage.sure" defaultMessage="确定" />}
                cancelText={<FormattedMessage id="page.oneStop.cardOperation.close" defaultMessage="关闭" />}
                destroyOnClose={true}
            >
              <Form  {...formItemLayout}>
                    <Form.Item label={'委托人'} required>
                      <Select
                        showSearch
                        labelInValue
                        value={this.state.user_info}
                        placeholder="输入名字搜索"
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                        style={{ width: '100%' }}
                      >
                        {user_data&&user_data.length ? user_data.map(d => (
                          <Option key={d.id} value={d.id}>{d.org+" "+d.name}</Option>
                        )) :[]}
                      </Select>
                    </Form.Item>

                    <Form.Item label={'期限'} required>
                          <InputNumber min={1} max={999} defaultValue={1} onChange={(value)=>this.handleEntrustData(value,'deadline')}/>
                    </Form.Item>

                    <Form.Item label={'备注'}>
                        <TextArea
                          placeholder="请输入"
                          style={{width:'100%'}}
                          onChange={(e)=>this.handleEntrustData(e.target.value,'remarks')}
                        />
                    </Form.Item>

                    
              </Form>
            </Modal>
        </div>
      </div>
    );
  }
}
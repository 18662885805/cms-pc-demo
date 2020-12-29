import React, { Fragment } from 'react'
import { Modal, Select, message, Tag, Row, Col, Card, Spin, Tree, Divider,Icon,Button,Checkbox,
  Popconfirm,Tooltip,Form,Input,Upload,Tabs,Breadcrumb,Table,List} from 'antd'
import { Link } from 'react-router-dom'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import moment from "moment";
import {
  WorkflowFile,
  WorkflowInfo,
  WorkflowRecord,
} from '@apis/document/workflow';
import { FormattedMessage, injectIntl, defineMessages, } from 'react-intl'
import translation from "../translation";
import VirtualTable from '@component/VirtualTable3'
import { inject, observer } from 'mobx-react'
import styles from './index.module.css'
import { Scrollbars } from 'react-custom-scrollbars'
import TablePage from '@component/TablePage'
import {GetTemporaryKey} from "@apis/account/index"
import Downloader from 'js-file-downloader';
const FormItem = Form.Item;
const { Option } = Select
const { TabPane } = Tabs;
const { Search } = Input;
const {TextArea} = Input;
const confirm = Modal.confirm
const _util = new CommonUtil();

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
    this.state = {
      column: [
        {
          title: '序号',
          width: 40,
          maxWidth: 40,
          dataIndex: 'efm-index',
          render: (text, record, index) => {
            return (index + 1)
          }
        },
        {
          title: '工作流',
          dataIndex: 'code',
          sorter: _util.sortString,
          render: (value, record) => {
            const {id} = record
            let path = {
              pathname: '/document/workflow/detail',
              state: {
                id: id
              }
            };
            return (
                <Link to={path}>
                  {value}
                </Link>
            )
          } 
        },
        {
          title:'上传人',
          dataIndex: 'created',
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: '上传时间',
          dataIndex: 'created_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
        }, {
          title: '最后修改人',      
          dataIndex: 'updated',
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
      },
      {
          title: '最后修改时间',      
          dataIndex: 'updated_time',
          sorter: _util.sortDate,
          filterType: 'range-date',
          render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      
      ],
      check: _util.check(),    
      workflowInfoList:[],
      workflowRecordList:[],
      document_workflow_key:'',
      document_workflow_record_key:'',
      document_workflow_name:'',
      document_workflow_record_name:'',
      recordShow:false,
      fileList:[],
      refresh:false,
      level_loading:false,
      fileData:[],
      pagination: {
        pageSize: _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: _util.getSession('currentPage') ? _util.getSession('currentPage') : 1
      },
      tableLoading:false,
      filtering:false,
      selectedRowKeys: [],
      selectedRows: [],
      search: '',
      loading:false
    }
  }

  componentDidMount(){
    const project_id =  _util.getStorage('project_id');
    this.setState({project_id,level_loading:true})
    WorkflowInfo({project_id:project_id}).then((res) => {
      if(res.data){
        this.setState({
          workflowInfoList:res.data
        })
      }
      this.setState({level_loading:false});
      this.initialOpenState();
    })
  }


  initialOpenState = () => {
    var document_workflow_key = _util.getStorage('document_workflow_key');
    var document_workflow_name = _util.getStorage('document_workflow_name');
    var document_workflow_record_key = _util.getStorage('document_workflow_record_key');
    var document_workflow_record_name = _util.getStorage('document_workflow_record_name');
    if(document_workflow_record_key){
      this.initialSecondLevel(document_workflow_record_key,document_workflow_record_name)
      return
    }
    if(document_workflow_key){
      this.initialFirstLevel(document_workflow_key,document_workflow_name)
      return
    }
  }

  //恢复二级目录打开
  initialSecondLevel = (id,name) => {
    var document_workflow_key = _util.getStorage('document_workflow_key');
    var document_workflow_name = _util.getStorage('document_workflow_name');
    //打开工作流目录
    this.handeWorkflowInfo(document_workflow_key,document_workflow_name)
    //打开工作流记录
    this.handeRecord(id,name)
  }

  //恢复一级目录打开
  initialFirstLevel = (id,name) => {
    //打开工作流目录
    this.handeWorkflowInfo(id,name)
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if (scrollTopPosition) {
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }



  getFile = (id,new_search,new_pagination) => {
    this.setState({tableLoading:true,fileData:[]})
    const {pagination,project_id} = this.state;
    const params = {
      id:id,
      project_id:project_id,
      page : new_pagination ? new_pagination.current : pagination.current,
      page_size : new_pagination ? new_pagination.pageSize : pagination.pageSize,
      search:new_search
    }
    WorkflowFile(params).then(res => {
      if(res.data){ 
        let { results, count } = res.data;
        if(count){
          pagination.total = count;
          this.setState({pagination})
        }
        if(results&&results.length){
          this.setState({fileData:results})
        }
        this.setState({tableLoading:false})
      }
    })
  }

  //点击工作流
  handeWorkflowInfo = (id,name) => {
    const {document_workflow_key} = this.state;
    if(document_workflow_key == id){
      return
    }
    const {project_id} = this.state;
    this.setState({
      level_loading:true,
      workflowRecordList:[],
      document_workflow_key:id,
      document_workflow_name:name,
      document_workflow_record_key:'',
      document_workflow_record_name:'',
      fileData:[],
    });
    _util.setStorage('document_workflow_key',id);
    _util.setStorage('document_workflow_name',name);
    WorkflowRecord({work_flow_id:id,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          workflowRecordList:res.data,
          recordShow:true
        })
      }
      this.setState({level_loading:false, })
    })
  }


    //点击工作流记录
  handeRecord = (id,name) => {
    const {document_workflow_record_key} = this.state;
    if(document_workflow_record_key == id){
      return
    }
    this.setState({
      document_workflow_record_key:id,
      document_workflow_record_name:name
    });
    _util.setStorage('document_workflow_record_key',id);
    _util.setStorage('document_workflow_record_name',name);
    this.getFile(id); 
  }


  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  //下载文档
  downloadFile = () => {
    const {selectedRowKeys,selectedRows} = this.state;
   
    if (selectedRows && selectedRows.length) {
      this.setState({refresh:true});
      var cos = _util.getCos(null,GetTemporaryKey);
      var that = this;
      selectedRows.map((f,fIndex) => {
        if(f.source){
          const source_list = JSON.parse(f.source);          
          var file;
          if(Array.isArray(source_list)){
            file = source_list[0];
          }else{
            file = source_list;
          }
          const key = file.url ? file.url : '';
          const name = file.name ? file.name : '文档管理';
          if(!key){
            return
          }
          var url = cos.getObjectUrl({
              Bucket: 'ecms-1256637595',
              Region: 'ap-shanghai',
              Key:key,
              Sign: true,
          }, function (err, data) {
              if(data && data.Url){
                new Downloader({ 
                  url: data.Url
                }).then(function () {
                  message.success(`${name}下载成功`);
                  that.setState({refresh:false})
                }).catch(function (error) {
                  message.warning(`${name}下载失败`)
                  that.setState({refresh:false})
                });
              }else{
                that.setState({refresh:false})
              }
          });
        }
      })
    }else{
      message.warning('请选择数据');
    }   
  }

  //修改页码
  handleTableChange = (pagination, filters = {}, sorter = {}) => {
    const {document_workflow_record_key} = this.state;
    const pager = {...pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      fileData: []
    });
    const {search} = this.state;
    this.getFile(document_workflow_record_key,search,pager)
  }

  //搜索
  handleSearch = (value) => {
    const {document_workflow_record_key} = this.state;
    _util.removeSession('scrollTop');
    this.setState({search:value})
    this.getFile(document_workflow_record_key,value)
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
    const { column, check, refresh,
      workflowInfoList,document_workflow_key,document_workflow_record_key,selectedThirdLevelKey,
      workflowRecordList,recordShow,
      level_loading,fileData,pagination,tableLoading,
      document_workflow_name,document_workflow_record_name,selectedThirdLevelName,
      selectedRows,filtering,
       } = this.state;
    const { formatMessage } = this.props.intl;


    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <div className="btn-group" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <Breadcrumb className={styles.file_Breadcrumb} style={{height:'32px'}}>
                <Breadcrumb.Item>
                  <Icon type="folder" theme="twoTone" />
                  <span>{'工作流文档'}</span>
                </Breadcrumb.Item>
                {
                  document_workflow_key?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span>{document_workflow_name}</span>
                  </Breadcrumb.Item>:''
                }
                
                {
                  document_workflow_record_key?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span>{document_workflow_record_name}</span>
                  </Breadcrumb.Item> :''
                }
              </Breadcrumb>
            </div>
           
            <div>
              {
                document_workflow_record_key ? 
                <div>
                  <Button type='primary'  onClick={() => this.downloadFile()}>下载</Button>
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
                :''
              }
              
            </div>    
          </div>

          <Row gutter={24} style={{height: 'calc(100vh - 228px)',borderBottom:'1px solid rgb(232, 232, 232)'}}>          
            {/* 一级目录区 */}
            <Col span={workflowInfoList&&workflowInfoList.length ? 4 :0} style={{ overflow: "hidden", padding:0}}>
              <Spin spinning={level_loading}>
                <Scrollbars
                  style={{
                    height: 'calc(100vh - 228px)',
                    borderRight:'1px solid rgb(232, 232, 232)'
                  }}>
                  <Fragment>  
                    {
                      workflowInfoList&&workflowInfoList.map((d,index) => {
                        return(
                          <div 
                            key={d.id} 
                            className={styles.firstLevelItem}                 
                            style={{background:document_workflow_key == d.id ? 'rgba(0,0,0,0.08)' :''}}
                            onClick={() => this.handeWorkflowInfo(d.id,d.name)} 
                          >
                            <div className={styles.firstLevelItemLeft} >
                              <img 
                                src={require(document_workflow_key == d.id ? './file_o.png' : './file.png')} 
                                style={{height:'30px',marginRight:'5px'}}
                              />
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


            {/* 二级目录区 */}
            <Col span={workflowRecordList&&workflowRecordList.length ? 4 : 0} style={{ overflow: "hidden", padding:0}}>
            <Spin spinning={level_loading}>
            <Scrollbars
              style={{
                height: 'calc(100vh - 228px)',
                display:recordShow ? 'block' : 'none',
                borderRight:'1px solid rgb(232, 232, 232)'
              }}
            >                     
              <Fragment>  
              {
                  workflowRecordList&&workflowRecordList.map((d,index) => {
                    return(
                      <div 
                        key={d.id} 
                        className={styles.firstLevelItem} 
                        style={{background:document_workflow_record_key == d.id ? 'rgba(0,0,0,0.08)' :''}}
                        onClick={() => this.handeRecord(d.id,d.code)} 
                      >
                          <div className={styles.firstLevelItemLeft} >
                            <img 
                              src={require(document_workflow_record_key == d.id ? './file_o.png' : './file.png')} 
                              style={{height:'30px',marginRight:'5px'}}
                            />
                            <span>{d.code}</span>
                          </div>                   
                      </div>
                    ) 
                  })
                }
              </Fragment>
            </Scrollbars>
            </Spin>
            </Col>

            <Col style={{ overflow: "hidden"}}>
                <div
                  style={{
                    height: '100%',
                    overflowY: 'hidden',
                  }}
                >                
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
                </div>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}
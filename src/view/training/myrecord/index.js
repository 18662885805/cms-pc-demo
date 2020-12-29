import React from 'react'
import { Link } from 'react-router-dom'
import { Popconfirm, message,Tag,Tooltip,Button,Input } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { myTrainRecord,trainRecord,orgTrainRecord} from '@apis/training/record'
import TablePage from '@component/TablePage'
import VirtualTable from '@component/VirtualTable3'
import moment from 'moment'
import {inject, observer} from 'mobx-react'


const _util = new CommonUtil()
const {Search} = Input

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  train_name: {
    id: 'page.training.myrecord.myrecord_name',
    defaultMessage: '培训名称',
  },
  created: {
    id: 'page.training.papers.created',
    defaultMessage: '创建人',
  },
  created_time: {
    id: 'page.training.papers.created_time',
    defaultMessage: '创建时间',
  },
  updated: {
    id: 'page.training.papers.updated',
    defaultMessage: '上次修改人',
  },
  updated_time: {
    id: 'page.training.papers.updated_time',
    defaultMessage: '上次修改时间',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  expire_time:{
    id: 'page.training.train.expire_time',
    defaultMessage: '截止日期',
  },
  certificate_expire_time:{
    id: 'page.training.train.certificate_expire_time',
    defaultMessage: '证书有效期',
  },
  status: {
    id: 'page.training.material.status',
    defaultMessage: '状态',
  },
});

@inject('appState') @observer @injectIntl
class TrainingRecord extends React.Component {
    constructor(props) {
        super(props)
        const {formatMessage} = this.props.intl
        this.state = {     
            column:[
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
                  title: '姓名',      
                  dataIndex: 'created',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record.name ? record.name :'')
                },
                {
                  title: '组织',      
                  dataIndex: 'created',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record.org_name ? record.org_name :'')
                },
                {
                  title: '手机',      
                  dataIndex: 'created',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record.phone ? record.phone :'')
                },
                {
                  title: '培训名称',      
                  dataIndex: 'training_name',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '培训时间',      
                  dataIndex: 'submit_time',
                  sorter: _util.sortString,
                  filterType: 'range-date',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '培训分数',      
                  dataIndex: 'score',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '培训种类',      
                  dataIndex: 'training_type',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: (text, record, index) => {
                  return record&&record.training_type == 1 ? <Tag color="#108ee9">{'入厂培训'}</Tag> : ''
                  }
                },
                {
                  title: '培训结果',      
                  dataIndex: 'training_result',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: (text, record, index) => {
                    return record&&record.training_result ? <Tag color="#87d068">通过</Tag> : <Tag color="#f50">未通过</Tag>
                  }
                },
                
               
            ],
            list_type:1,
            check: _util.check(),
            data: [],
            pagination: {
              pageSize: _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
              showSizeChanger: true,
              pageSizeOptions: _util.getPageSizeOptions(),
              current: _util.getSession('currentPage') ? _util.getSession('currentPage') :1
            },
            loading: false,
            selectedRowKeys: null,
            selectedRows: [],
            search: '',
            canViewOrg:false,
            canViewAll:false,
            filtering:false,
        }
    }

    componentDidMount() {
      this.checkAllRecord();
      this.checkOrgRecord();
      this.getRecordData({
        project_id: _util.getStorage('project_id'),
        page_size: this.state.pagination.pageSize
      })
      
    }

    setScrollTop = () => {
      const scrollTopPosition = this.props.appState.tableScrollTop;
      if(scrollTopPosition){
        _util.setSession('scrollTop', scrollTopPosition);
      };
    }

    //获取数据
    getRecordData = (params) => {
      this.setState({
        loading: true
      })
      const {list_type} = this.state;
      if(list_type == 1){
        myTrainRecord(params).then((res) => {
          _util.getInfo(res, this)
        })
      };
      if(list_type == 2){
        trainRecord(params).then((res) => {
          _util.getInfo(res, this)
        })
      }
      if(list_type == 3){
        orgTrainRecord(params).then((res) => {
          _util.getInfo(res, this)
        })
      }
      
    }

    //导出
    exportExcel = () => {
      const { formatMessage } = this.props.intl
      const {selectedRows, column} = this.state
      _util.exportExcel(selectedRows, column, '培训记录')  
    }

    

    checkGetListFn = (type) => {
      if(type == 1){
        return myTrainRecord
      }else if(type == 2){
        return trainRecord
      }else if(type == 3){
        return orgTrainRecord
      }
    }

    handleListType = (list_type) => {
      this.setState({list_type:list_type});
      const {pagination,search} = this.state;
      var params = {
        project_id: _util.getStorage('project_id'),
        page_size: pagination.pageSize,
        search:search
      };
      if(list_type == 1){
        myTrainRecord(params).then((res) => {
          _util.getInfo(res, this)
        })
      };
      if(list_type == 2){
        trainRecord(params).then((res) => {
          _util.getInfo(res, this)
        })
      }
      if(list_type == 3){
        orgTrainRecord(params).then((res) => {
          _util.getInfo(res, this)
        })
      }
    }

    checkAllRecord = () => {
      if(_util.getStorage('is_project_admin')){
        this.setState({canViewAll:true})
        return 
      }else{
        var permission = _util.getStorage('permission')
        if(permission&&permission.length){
          var length = permission.length;
          for(var i=0; i< length; i++){
            if(permission[i]['url']=='/training/record'){
              this.setState({canViewAll:true})
              break
            }
          }
        }
      }
    }

    checkOrgRecord = () => {
      if(_util.getStorage('is_project_admin')){
        this.setState({canViewOrg:true})
        return 
      }else{
        var permission = _util.getStorage('permission')
        if(permission&&permission.length){
          var length = permission.length;
          for(var i=0; i< length; i++){
            if(permission[i]['url']=='/training/org/record'){
              this.setState({canViewOrg:true})
              break
            }
          }
        }
      }
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

    //搜索
    handleSearch = (value) => {
      _util.removeSession('scrollTop');
      this.setState({search:value});
      this.getRecordData({
        project_id: _util.getStorage('project_id'),
        page_size: this.state.pagination.pageSize,
        search:value
      })
    }

    handleTableChange = (pagination, filters = {}, sorter)=> {
      const pager = {...pagination};
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
        fileData: []
      });
      const {search} = this.state;
      this.getRecordData({
        project_id: _util.getStorage('project_id'),
        page : pager.current,
        page_size : pager.pageSize,
        search:search
      })
    }

    onSelectChange = (selectedRowKeys, selectedRows)=> {
      this.setState({
        selectedRowKeys,
        selectedRows
      })
    }

    render() {
      const { column, check, refresh,list_type,data, filtering,canViewAll,canViewOrg} = this.state
      const {formatMessage} = this.props.intl

        return (
            <div>
                <MyBreadcrumb />
                <div className="content-wrapper">

                <div className="btn-group">
                  {
                    canViewAll ?
                    <Button 
                      type="primary" 
                      onClick={() => this.handleListType(2)}
                      style={{background: list_type == 2 ? '#87d068' : '#1890ff',border: 0,}}
                    >
                      所有培训记录
                    </Button>:''
                  }
                  {
                    canViewOrg ?
                    <Button 
                      type="primary" 
                      onClick={() => this.handleListType(3)}
                      style={{background: list_type == 3 ? '#87d068' : '#1890ff',border: 0,}}
                    >
                      组织培训记录
                    </Button> :''
                  }
                  
                  
                  <Button type="primary" onClick={this.exportExcel}>
                    <FormattedMessage id="component.tablepage.export" defaultMessage="导出" />
                  </Button>
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
                    style={{float: 'right', width: '250px'}}
                  />


                </div>
                <VirtualTable
                  refresh={refresh}
                  columns={this.state.column}
                  dataSource={data}
                  onPaginationChange={this.handleTableChange}
                  pagination={this.state.pagination}
                  loading={this.state.loading}
                  onSelectChange={this.onSelectChange}
                  reset={this.state.reset}
                />

                {/* <TablePage
                    refresh={refresh}
                    //getFn={myTrainRecord}
                    getFn={this.checkGetListFn(list_type)}
                    columns={column}
                    excelName={'培训记录'}
                    disableFnWithConfirm={true}
                    dataMap={data => {
                      data.forEach((d,index) => {
                        d.submit_time = d.submit_time ? moment(d.submit_time).format('YYYY-MM-DD HH:mm') : '-'
                        d.created_org = d.created&&d.created.org_name ? d.created.org_name :''
                        d.created_name = d.created&&d.created.name ? d.created.name :''
                        d.created_phone = d.created&&d.created.phone ? d.created.phone :''
                        d.training_result_desc = d.training_result ? '通过' :'不通过'
                        d.training_type_desc = d.training_type == 1 ? '入场培训' :''
                      });
                    }}
                >
                  <Button type='primary' onClick={() => this.handleListType(2)}>所有培训记录</Button>
                  <Button type='primary' onClick={() => this.handleListType(3)}>组织培训记录</Button>
                </TablePage> */}
                </div>
            </div>
        )
    }
}

export default TrainingRecord;
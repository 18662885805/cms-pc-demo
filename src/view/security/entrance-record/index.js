import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,Input,Tag
} from 'antd'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { AllEntryList,entry,orgEntry,allEntry} from '@apis/security/entryrecord'
import TablePage from '@component/TablePage'
import VirtualTable from '@component/VirtualTable3'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import {inject, observer} from 'mobx-react/index'
import intl from "react-intl-universal";
const _util = new CommonUtil()
const {Search} = Input


@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  //title: '序号',
                  title: formatMessage({ id:"app.table.column.No", defaultMessage:"序号"}),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  //title: '员工姓名',
                  title: formatMessage({ id:"page.construction.staff.name", defaultMessage:"员工姓名"}),
                  dataIndex: 'staff_name',
                  sorter: _util.sortString,
                  render: (text, record) => {
                    const id = record.id
                    let path = {
                      pathname:'/safety/entryrecord/detail',
                      state: {
                        id: id,
                        type: this.state.list_type
                      }
                    }
                    return (
                      <Link to={path} onClick={this.setScrollTop}>
                        {record.staff_name?record.staff_name:null}
                      </Link>
                    );
                  }
              },
              {
                title: formatMessage({ id:"page.construction.staff.contractor", defaultMessage:"所属组织"}),
                dataIndex: 'organization_name',
                sorter: _util.sortString,
                render: record => _util.getOrNullList(record)
              },
             
            {
                
                title: '人员类型',
                dataIndex: 'staff_type_name',
                sorter: _util.sortString,
                render: (text, record, index) => {
                    return _util.getPersonType(parseInt(record&&record.staff_type))
                }
            },
            {
                
              title: '职务',
              dataIndex: 'staff_work_type_name',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
            },
            {
              title: '手机号',
              dataIndex: 'staff_phone',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
          {
              title: '证件号',
              dataIndex: 'staff_id_card',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
            {
              title: '补充描述',
              dataIndex: 'extra_desc',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
            {
              title: '备注',
              dataIndex: 'remark',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
            {
                  
              title: '入场时间',
              dataIndex: 'start_time_GMT',
              sorter: _util.sortDate,
              filterType: 'range-date',
              render: record => _util.getOrNullList(record)
          },
          {
                  
            title: '出场时间',
            dataIndex: 'end_time_GMT',
            sorter: _util.sortDate,
            filterType: 'range-date',
            render: record => _util.getOrNullList(record)
          },
          {
            title: '逗留时间',    //逗留时间
            dataIndex: 'operate1',
            sorter: _util.sortString,
            render: (text, record) => {
              return this.getDurationTime(record)
            },
          },
          {
            title: '闸机',
            dataIndex: 'turnstile_name',
            sorter: _util.sortString,
            render: record => _util.getOrNullList(record)
          },
          
              
          ],
          check: _util.check(),
          list_type:1,
          data: [],
          pagination: {
            pageSize: _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
            showSizeChanger: true,
            pageSizeOptions: _util.getPageSizeOptions(),
            current: _util.getSession('currentPage') ? _util.getSession('currentPage') :1
          },
          loading: false,
          selectedRowKeys: [],
          selectedRows: [],
          search: '',
          canViewOrg:true,
          canViewAll:true,
          refresh:false,
          filtering:false,
      }
  }

  componentDidMount(){
    this.getRecordData({
      project_id: _util.getStorage('project_id'),
      page_size: this.state.pagination.pageSize
    })
  }

  //获取数据
  getRecordData = (params) => {
    this.setState({
      loading: true
    })
    const {list_type} = this.state;
    if(list_type == 1){
      entry(params).then((res) => {
        _util.getInfo(res, this)
      })
    };
    if(list_type == 2){
      allEntry(params).then((res) => {
        _util.getInfo(res, this)
      })
    }
    if(list_type == 3){
      orgEntry(params).then((res) => {
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

  

  handleListType = (list_type) => {
    this.setState({list_type:list_type});
    const {pagination,search} = this.state;
    var params = {
      project_id: _util.getStorage('project_id'),
      page_size: pagination.pageSize,
      search:search
    };
    if(list_type == 1){
      entry(params).then((res) => {
        _util.getInfo(res, this)
      })
    };
    if(list_type == 2){
      allEntry(params).then((res) => {
        _util.getInfo(res, this)
      })
    }
    if(list_type == 3){
      orgEntry(params).then((res) => {
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
          if(permission[i]['url']=='/safety/all/entryrecord'){
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
          if(permission[i]['url']=='/safety/org/entryrecord'){
            this.setState({canViewOrg:true})
            break
          }
        }
      }
    }
  }




  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  };

  getDurationTime = (record) => {
    console.log('0318',record.start_time,record.end_time)
    if(!record.end_time){//未出场
      let m1 = moment(record.start_time).valueOf();
      let m2 = moment(Date.now()).valueOf();
      let time = moment.duration(m2 - m1, "ms");
      if (time.get("days") < 1 && time.get("hours") < 1 && time.get("minutes") < 1) {
        return (
          <div style={{ color: "#FF0016" }}>{time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
        );
      }
      if (time.get("days") < 1 && time.get("hours") < 1) {
        return (
          <div style={{ color: "#FF0016" }}>{time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
        );
      }
      if (time.get("days") < 1 && time.get("hours") < 8) {
        return (
          <div style={{ color: "#FF0016" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
        );
      }
      if (time.get("days") < 1 && (time.get("hours") >= 8 && time.get("hours") < 12)) {
        return (
          <div style={{ color: "#FF0016" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
        );
      }
      if (time.get("days") < 1 && (time.get("hours") >= 12 && time.get("hours") < 24)) {
        return (
          <div style={{ color: "#FF0016" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
        );
      }
      if (time.get("days") > 0) {
        return (
          <div style={{ color: "#FF0016" }}>
            {
              (time.get("months") > 0 ? time.get("months") + intl.get("page.event.accessrecord.month") : null) +
              time.get("days") + intl.get("page.event.accessrecord.day") + time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")
            }
          </div>
        );
      }
    }else{//已出场
      let m1 = moment(record.start_time).valueOf();
        let m2 = moment(record.end_time	).valueOf();
        let time = moment.duration(m2 - m1, "ms");
        if (time.get("days") < 1 && time.get("hours") < 1 && time.get("minutes") < 1) {
          return (
            <div style={{ color: "#108ee9" }}>{time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 1) {
          return (
            <div style={{ color: "#108ee9" }}>{time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 8) {
          return (
            <div style={{ color: "#108ee9" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 8 && time.get("hours") < 12)) {
          return (
            <div style={{ color: "#108ee9" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 12 && time.get("hours") < 24)) {
          return (
            <div style={{ color: "#108ee9" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") > 0) {
          return (
            <div style={{ color: "#108ee9" }}>
              {
                (time.get("months") > 0 ? time.get("months") + intl.get("page.event.accessrecord.month") : null) +
                time.get("days") + intl.get("page.event.accessrecord.day") + time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")
              }
            </div>
          );
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


  //修改页码
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
    const { column, check, refresh,list_type,data, filtering,canViewAll,canViewOrg } = this.state;
    const { formatMessage } = this.props.intl;
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: '安防管理'
      },
      {
          name: '进出记录',
          url: '/safety/entryrecord'
      },
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <div className="btn-group">
            {
              canViewAll ?
              <Button 
                type="primary" 
                onClick={() => this.handleListType(2)}
                style={{background: list_type == 2 ? '#87d068' : '#1890ff',border: 0,}}
              >
                所有进出记录
              </Button>:''
            }
            {
              canViewOrg ?
              <Button 
                type="primary" 
                onClick={() => this.handleListType(3)}
                style={{background: list_type == 3 ? '#87d068' : '#1890ff',border: 0,}}
              >
                组织进出记录
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
            getFn={entry}
            columns={column}
            excelName={'进出记录'}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach((d,index) => {
                d.start_time_GMT = d.start_time ? moment(d.start_time).format('YYYY-MM-DD HH:mm') : '-'
                d.end_time_GMT = d.end_time ? moment(d.end_time).format('YYYY-MM-DD HH:mm') : '-'
                d.staff_type_name = d.staff_type? _util.getPersonTypeDesc(parseInt(d.staff_type))  :''
              });
            }}
          >
          </TablePage> */}
        </div>
      </div>
    )
  }
}
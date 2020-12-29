import React from 'react'
import { Link } from 'react-router-dom'
import { Popconfirm, message,Tag,Tooltip,Button } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { trainList,trainDelete, trainDisabled,
  trainEnabled,} from '@apis/training/manage'
import TablePage from '@component/TablePage'
import moment from 'moment'
import {inject, observer} from 'mobx-react'
import {workerData} from '@utils/contractorList'

const _util = new CommonUtil()

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
class TrainingManage extends React.Component {
    constructor(props) {
        super(props)
        const {formatMessage} = this.props.intl
        this.state = {   
            check: _util.check(),  
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
                    title: formatMessage(messages.train_name),      
                    dataIndex: 'name',
                    filterType: 'select',
                    sorter: _util.sortString,
                    render: (text, record) => {
                      return <Link to={{
                        pathname: '/training/management/detail',
                        state: {
                          id: record.id
                        }
                      }} onClick={this.setScrollTop}>{_util.getOrNullList(record.name)}</Link>
                    }
                },
                {
                  title: '培训类型',      
                  dataIndex: 'is_entry_desc',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: (text, record) => {
                    return _util.renderIsEntry(record&&record.is_entry)
                  }
                },
                {
                  title: '题目数量',      
                  dataIndex: 'length',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '每题分数',      
                  dataIndex: 'score',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '合格分数',      
                  dataIndex: 'clearance',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '考试时间(分钟)',      
                  dataIndex: 'examination_time',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '状态',      
                  dataIndex: 'status_desc',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: (text, record) => {
                    return _util.renderAccessCard(record&&record.status)
                  }
                },
        
               
                {
                    title: formatMessage(messages.created),      
                    dataIndex: 'created_name',
                    sorter: _util.sortString,
                    filterType: 'select',
                    render: record => _util.getOrNullList(record)
                },
                {
                    title: formatMessage(messages.created_time),      
                    dataIndex: 'created_time',
                    sorter: _util.sortDate,
                    filterType: 'range-date',
                    render: record => _util.getOrNullList(record)
                },
                {
                    title: formatMessage(messages.updated),      
                    dataIndex: 'updated_name',
                    sorter: _util.sortString,
                    filterType: 'select',
                    render: record => _util.getOrNullList(record)
                },
                {
                    title: formatMessage(messages.updated_time),      
                    dataIndex: 'updated_time',
                    sorter: _util.sortDate,
                    filterType: 'range-date',
                    render: record => _util.getOrNullList(record)
                },
                {
                  title: formatMessage(messages.operate),      //操作
                  dataIndex: 'operate',
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  render: (text, record) => {
                    const id = record.id
                    const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
                    const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
                    return (
                      record.flag ?
                      <div>
                        <Tooltip title={<FormattedMessage id="page.training.operation.flag" defaultMessage="已有人培训，不可操作" />}>
                          <span style={{ color: '#a9a9a9',marginRight: '14px' }}> 
                          <FormattedMessage id="app.page.text.modify" defaultMessage="修改" /> 
                          </span>
                        </Tooltip>
                        <Tooltip title={<FormattedMessage id="page.training.operation.flag" defaultMessage="已有人培训，不可操作" />}> 
                          <span style={{ color: '#a9a9a9' }}> 
                          <FormattedMessage id="app.page.text.delete" defaultMessage="删除" /> 
                          </span>
                        </Tooltip>                   
                      </div> :
                      <div>
                        {
                          canEdit ?
                          <Link to={{
                            pathname: '/training/management/edit',
                            state: {
                              id: record.id
                            }
                          }} style={{ marginRight: '10px' }} onClick={this.setScrollTop}> <FormattedMessage id="app.page.text.modify" defaultMessage="修改" /> </Link>
                          :''
                        }
                        {
                          canDelete ?
                          <Popconfirm
                            title={<FormattedMessage id="app.pop.title.delete" defaultMessage="确认删除？" />}
                            okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}
                            cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}
                            onConfirm={() => {
                              this.onDeleteOne(id)
                          }}>
                            <a style={{ color: '#f5222d' }}> <FormattedMessage id="app.page.text.delete" defaultMessage="删除" /> </a>
                          </Popconfirm> :''
                        }              
                      </div>
                    )
                  }
                }
            ],
            
        }
    }

    setScrollTop = () => {
      const scrollTopPosition = this.props.appState.tableScrollTop;
      if(scrollTopPosition){
        _util.setSession('scrollTop', scrollTopPosition);
      };
    }

    onDeleteOne = id => {
      const {formatMessage} = this.props.intl
      const project_id = _util.getStorage('project_id');
      this.setState({ refresh: false })
      trainDelete(project_id,{id:id}).then((res) => {
        message.success('已删除')      //已删除
        this.setState({ refresh: true })
      })
    }

    enableUser = () => {
      this.setState({ refresh: false })
      const { formatMessage } = this.props.intl;
      let {selectedRows} = this.state;
      let project_id = _util.getStorage('project_id');
      if (selectedRows && selectedRows.length) {
          const data = _util.renderListToString(selectedRows,'id')
          trainEnabled({project_id:project_id,training_ids:data}).then((res) => {
              message.success('启用成功');
              this.setState({ refresh: true ,selectedRowKeys:[],selectedRows:[] })
          });
      }else{
          message.warning('请选择数据');
      }   
  }
  
  disableUser = () => {
      this.setState({ refresh: false })
      const { formatMessage } = this.props.intl;
      let {selectedRows} = this.state;
      let project_id = _util.getStorage('project_id');
      if (selectedRows && selectedRows.length) {       
          const data = _util.renderListToString(selectedRows,'id')
          trainDisabled({project_id:project_id,training_ids:data}).then((res) => {
              message.success('禁用成功');
              this.setState({ refresh: true ,selectedRowKeys:[],selectedRows:[] })
          });
      }else{
          message.warning('请选择数据');
      }   
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  };

    render() {
      const { column, check, refresh } = this.state
      const {formatMessage} = this.props.intl
      const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="menu.training" defaultMessage="培训管理"/>
      },
      {
          name: '培训配置',
          url: '/training/management'
      },
    ]
        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper">
                <TablePage
                    refresh={refresh}
                    getFn={trainList}
                    columns={column}
                    addPath={canAdd && '/training/management/add'}
                    excelName={'培训管理'}
                    onSelectChange={this.onSelectChange}
                    disableFnWithConfirm={true}
                    dataMap={data => {
                      data.forEach((d,index) => {
                        d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                        d.updated_time = d.updated_time ? moment(d.updated_time).format('YYYY-MM-DD HH:mm') : '-'
                        d.is_entry_desc = d.is_entry ? '入场培训':''
                        d.status_desc = d.status ? '启用' :'禁用'
                      });
                    }}
                >
                  <Button type="primary" onClick={() => this.enableUser()}>
                  启用
                  </Button>
                  <Button type="primary" onClick={() => this.disableUser()}>
                  禁用
                  </Button>
                </TablePage>
                </div>
            </div>
        )
    }
}

export default TrainingManage;
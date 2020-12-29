import React from 'react'
import { Link } from 'react-router-dom'
import { Popconfirm, message,Tag,Tooltip } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {trainstartList,trainstartDelete} from '@apis/training/start'
import TablePage from '@component/TablePage'
import moment from 'moment'
import {inject, observer} from 'mobx-react'

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
class TrainingTrain extends React.Component {
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
                    dataIndex: 'training_name',
                    filterType: 'select',
                    sorter: _util.sortString,
                    render: (text, record) => {
                      return <Link to={{
                        pathname: '/training/start/training/detail',
                        state: {
                          id: record.id
                        }
                      }} onClick={this.setScrollTop}>{_util.getOrNullList(record.training&&record.training.length&&record.training[0]['name'])}</Link>
                    }
                    
                },
                {
                  title: formatMessage(messages.expire_time),      
                  dataIndex: 'begin_day',
                  sorter: _util.sortDate,
                  filterType: 'range-date',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '培训结束日期',      
                  dataIndex: 'end_day',
                  sorter: _util.sortDate,
                  filterType: 'range-date',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '门禁关联',      
                  dataIndex: 'is_access_card_desc',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: (text, record) => {
                    return <Tag color={record&&record.is_access_card ? '#ffa500' : '#008000'}>
                              {record&&record.is_access_card ? '关联' : '不关联'}
                            </Tag>
                  },
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
                    title: formatMessage(messages.created),      
                    dataIndex: 'created',
                    sorter: _util.sortString,
                    filterType: 'select',
                    render: record => _util.getOrNullList(record)
                },
                
                {
                    title: formatMessage(messages.updated),      
                    dataIndex: 'updated',
                    sorter: _util.sortString,
                    filterType: 'select',
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
                          canEdit?
                          <Link to={{
                            pathname: '/training/start/training/edit',
                            state: {
                              id: record.id
                            }
                          }} style={{ marginRight: '10px' }} onClick={this.setScrollTop}> <FormattedMessage id="app.page.text.modify" defaultMessage="修改" /> </Link> :''
                        }
                        {
                          canDelete?
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
      this.setState({ refresh: false })
      trainstartDelete(_util.getStorage('project_id'),{id:id}).then((res) => {
        message.success('已删除')      //
        this.setState({ refresh: true })
      })
    }

    render() {
      const { column, check, refresh } = this.state
      const {formatMessage} = this.props.intl
      const bread = [
        {
            name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
            url: '/'
        },
        {
            name: <FormattedMessage id="menu.training" defaultMessage="培训管理"/>
        },
        {
            name: '培训启动',
            url: '/training/start/training'
        },
      ]
      const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");
        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper">
                <TablePage
                    refresh={refresh}
                    getFn={trainstartList}
                    columns={column}
                    addPath={canAdd && '/training/start/training/add'}
                    excelName={'培训启动管理'}
                    disableFnWithConfirm={true}
                    dataMap={data => {
                      data.forEach((d,index) => {
                        d.is_access_card_desc = d.is_access_card ? '关联' :'不关联'
                        d.training_name = d.training&&d.training.length ? d.training[0]['name'] :''
                      });
                    }}
                />
                </div>
            </div>
        )
    }
}

export default TrainingTrain;
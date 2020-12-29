import React from 'react'
import { Link } from 'react-router-dom'
import { Popconfirm, message } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {papersDelete,papers } from '@apis/training/paper'
import TablePage from '@component/TablePage'
import {inject, observer} from 'mobx-react/index'
import moment from "moment";
import {workerData} from '@utils/contractorList'

const _util = new CommonUtil()

const messages = defineMessages({
    No: {
      id: 'app.table.column.No',
      defaultMessage: '序号',
    },
    paper_name: {
      id: 'page.training.papers.paper_name',
      defaultMessage: '试卷名',
    },
    created: {
      id: 'page.training.material.created',
      defaultMessage: '创建人',
    },
    created_time: {
      id: 'page.training.material.created_time',
      defaultMessage: '创建时间',
    },
    updated: {
      id: 'page.training.material.updated',
      defaultMessage: '上次修改人',
    },
    updated_time: {
      id: 'page.training.material.updated_time',
      defaultMessage: '修改日期',
    },
    operate: {
      id: 'app.table.column.operate',
      defaultMessage: '操作',
    },
    deleted: {
      id: 'app.message.papers.deleted',
      defaultMessage: '已删除',
    },
    paper_manage: {
      id: 'page.training.papers.paper_manage',
      defaultMessage: '试题库',
    },
});

@inject('appState') @observer  @injectIntl
class InTrainingPaper extends React.Component {
    constructor(props) {
        super(props)
        const {formatMessage} = this.props.intl
        this.state = {  
            project_id: _util.getStorage('project_id'),
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
                    title: formatMessage(messages.paper_name),      //试卷名
                    dataIndex: 'name',
                    sorter: _util.sortString,
                    filterType: 'select',
                    render: (text, record, index) => {
                      const id = record.id
                      let path = {
                        pathname: '/training/paper/detail',
                        state: {
                          id: id
                        }
                      }
                      return (
                        <Link to={path} onClick={this.setScrollTop}>
                          {record.name}
                        </Link>
                      );
                    }
                },
                {
                  title: formatMessage(messages.created),      
                  dataIndex: 'created',
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
                    dataIndex: 'updated',
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
                    title: formatMessage(messages.operate),    //操作
                    dataIndex: 'operate',
                    width: 120,
                    minWidth: 120,
                    maxWidth: 120,
                    render: (text, record, index) => {
                      const id = record.id
                      let path = {
                        pathname: '/training/paper/edit',
                        state: {
                          id: id
                        }
                      }
                      const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
                      const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
                      return (
                        <div
                        >
                          {
                            canEdit ?
                            <Link to={path} style={{ marginRight: '10px' }} onClick={this.setScrollTop}>
                              <FormattedMessage id="app.page.text.modify" defaultMessage="修改" />
                            </Link> : ''
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
        this.setState({ refresh: false })
        papersDelete(_util.getStorage('project_id'),{id:id}).then((res) => {
          message.success(formatMessage(messages.deleted))      //已删除
          this.setState({ refresh: true })
        })
    }

    render() {
        const { column, check, refresh,project_id } = this.state
        const {formatMessage} = this.props.intl
        const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");
        return (
            <div>
                <MyBreadcrumb />
                <div className="content-wrapper">
                <TablePage
                    refresh={refresh}
                    getFn={papers}
                    columns={column}
                    addPath={canAdd && '/training/paper/add'}
                    excelName={'试题库'}
                    dataMap={data => {
                      data.forEach((d,index) => {
                        d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                        d.updated_time = d.updated_time ? moment(d.updated_time).format('YYYY-MM-DD HH:mm') : '-'
                      });
                    }}
                />
                </div>
            </div>
        )
    }
}

export default InTrainingPaper;
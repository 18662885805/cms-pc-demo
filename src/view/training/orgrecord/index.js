import React from 'react'
import { Link } from 'react-router-dom'
import { Popconfirm, message,Tag,Tooltip } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { orgTrainRecord} from '@apis/training/record'
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
                // {
                //   title: '组织',      
                //   dataIndex: 'organization',
                //   sorter: _util.sortString,
                //   filterType: 'select',
                //   render: record => _util.getOrNullList(record)
                // },
                {
                  title: '姓名',      
                  dataIndex: 'created_name',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '手机',      
                  dataIndex: 'created_phone',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record)
                },
                {
                  title: '培训名称',      
                  dataIndex: 'training_name',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList(record),
                  // render: (text, record, index) => {
                  //   const id = record.id
                  //   let path = {
                  //     pathname: '/training/record/detail',
                  //     state: {
                  //       id: id
                  //     }
                  //   }
                  //   return (
                  //     <Link to={path} onClick={this.setScrollTop}>
                  //       {record.training_name}
                  //     </Link>
                  //   );
                  // }
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
                  dataIndex: 'training_type_desc',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: (text, record, index) => {
                  return record&&record.training_type == 1 ? <Tag color="#108ee9">{text}</Tag> : ''
                  }
                },
                {
                  title: '培训结果',      
                  dataIndex: 'training_result_desc',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: (text, record, index) => {
                    return record&&record.training_result ? <Tag color="#87d068">通过</Tag> : <Tag color="#f50">未通过</Tag>
                  }
                },
                                    
            ],
            check: _util.check(),
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
      trainDelete(id).then((res) => {
        // message.success(formatMessage(messages.deleted))      //已删除
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
            name: '组织培训记录',
            url: '/training/org/record'
        },
      ]
        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper">
                <TablePage
                    refresh={refresh}
                    getFn={orgTrainRecord}
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
                />
                </div>
            </div>
        )
    }
}

export default TrainingRecord;
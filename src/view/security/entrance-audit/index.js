import React from 'react'
import { Link } from 'react-router-dom'
import {
  message,
  Tag,
} from 'antd'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import TablePage from '@component/TablePage'
import {entrance,entryPending} from '@apis/security/factoryapply'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {inject, observer} from 'mobx-react/index'
const _util = new CommonUtil()

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
                dataIndex: 'name',
                sorter: _util.sortString,
                render: (text, record, index) => {
                  const id = record.id
                  let path = {
                    pathname: '/staff/my/factoryapply/detail',
                    state: {
                      id: id
                    }
                  }
                  return (
                    <Link to={path} onClick={this.setScrollTop}>
                      {record.staff_info&&record.staff_info.name ? record.staff_info.name : ''}
                    </Link>
                  );
                }
            },
            {
              title: '组织',
              dataIndex: 'org_name',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
            },
            {
              title: '职务',
              dataIndex: 'work_type',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
            },
            {
              title: '人员类型',
              dataIndex: 'staff_type_name',
              sorter: _util.sortString,
              render: (text, record, index) => {
                if(record.staff_info && record.staff_info.staff_type){
                  return _util.getPersonType(record.staff_info.staff_type)
                }else{
                  return record.staff_type_name
                }
              }
            },
            {
              title: '手机号',
              dataIndex: 'phone',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
            },
            {
              title: '身份证号',
              dataIndex: 'id_card',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
            },
            {
              title: '入场培训',      
              dataIndex: 'need_training_desc',
              sorter: _util.sortString,
              filterType: 'select',
              render: (text, record, index) => {
                return _util.renderNeedTraining(record&&record.need_training)
              }
              },
             
            {
              title: '发起人',      
              dataIndex: 'created',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record)
            },
            {
              title: '发起时间',      
              dataIndex: 'created_time',
              sorter: _util.sortString,
              filterType: 'range-date',
              render: record => _util.getOrNullList(record)
              },
              {
                title: '审批时间',      
                dataIndex: 'approve_time',
                sorter: _util.sortString,
                filterType: 'range-date',
                render: record => _util.getOrNullList(record)
                },
              {
                title: '状态',      
                dataIndex: 'status_desc',
                sorter: _util.sortString,
                filterType: 'select',
                render: (text, record, index) => {
                    return _util.renderApproval(record&&record.status)
                }
            },       
            {
              // title: '操作',
              title: formatMessage({ id:"app.table.column.operate", defaultMessage:"操作"}),
              dataIndex: 'operate',
              maxWidth:110,
              minWidth: 80,
              render: (text, record, index) => {
                  const id = record.id
                  const status = record.status
                  let path = {
                      pathname: '/staff/my/factoryapply/audit',
                      state: {
                        id: id
                      }
                  }
                  return (
                    status == 1 ?
                      <Link to={path} onClick={this.setScrollTop}>
                          审批
                      </Link> : ''
                  );
              }
            }       
          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
      }
  }

  componentDidMount(){
  }


  onDeleteOne = id => {
    const project_id = _util.getStorage('project_id')
    this.setState({ refresh: false })
    // staffDelete(project_id,{id:id}).then((res) => {
    //   const { formatMessage } = this.props.intl;
    //   message.success(formatMessage(messages.alarm9));
    //   this.setState({ refresh: true })
    // })
  };

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  };



  render() {
    const { column, check, refresh,} = this.state;
    const { formatMessage } = this.props.intl;

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: '入场管理'
      },
      {
          name: '绿码审批',
          url: '/staff/my/factoryapply'
      }
    ]


    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={entryPending}
            //param={{org_id:_util.getStorage('userdata') ? _util.getStorage('userdata').org.id : ''}}
            columns={column}
            excelName={'绿码审批'}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach((d,index) => {
                d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                d.approve_time = d.approve_time ? moment(d.approve_time).format('YYYY-MM-DD HH:mm') : '-'
                d.name = d.staff_info&&d.staff_info.name ? d.staff_info.name :''
                d.phone = d.staff_info&&d.staff_info.phone ? d.staff_info.phone :''
                d.id_card = d.staff_info&&d.staff_info.id_card ? d.staff_info.id_card :''
                d.org_name = d.staff_info&&d.staff_info.org_name ? d.staff_info.org_name :''
                d.work_type = d.staff_info&&d.staff_info.work_type ? d.staff_info.work_type :''
                d.staff_type_name = d.staff_info&&d.staff_info.staff_type	 ?  _util.getPersonTypeDesc(d.staff_info.staff_type)  :''
                d.need_training_desc = d.need_training ? '需要参加' :'不需参加'
                d.status_desc = d.status ? _util.renderApprovalDesc(d.status) :''
              });
            }}
          >
          </TablePage>
        </div>
      </div>
    )
  }
}
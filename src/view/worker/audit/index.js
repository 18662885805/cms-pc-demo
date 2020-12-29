import React from 'react'
import { Link } from 'react-router-dom'
import {
  Popconfirm,
  Divider,
  message,
  Tag,
  Button,
  Modal,
  Input,
  Form,
  Select,
  Spin,
  Row,
  Col,
  List,
  Timeline,
  Icon
} from 'antd'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {StaffApprove} from '@apis/staff/index'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {inject, observer} from 'mobx-react/index'
import debounce from 'lodash/debounce'
import UserWrapper from '@component/user-wrapper'
import values from 'postcss-modules-values'
import {workerData} from '@utils/contractorList'
const _util = new CommonUtil()
const FormItem = Form.Item;
const {TextArea } = Input;
const { Option } = Select;

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
                const id = record.id ? record.id : null;
                const name = record.name ? record.name : null;
                let path = {
                    pathname: '/staff/approve/detail',
                    state: {
                        id: id
                    }
                }
                return (
                  <Link to={path} onClick={this.setScrollTop}>
                      {name}
                  </Link>
                );
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
                
            title: '人员类型',
            dataIndex: 'staff_type_name',
            sorter: _util.sortString,
            filterType: 'select',
            render: (text, record, index) => {
              if(record.staff_type){
                return _util.getPersonType(record.staff_type)
              }else{
                return record.staff_type_name
              }
            }
        },
          {        
            title: '职务',
            dataIndex: 'work_type_name',
            sorter: _util.sortString,
            filterType: 'select',
            render: record => _util.getOrNullList(record)
        },
          {
              
            title: '角色',
            dataIndex: 'role_name',
            sorter: _util.sortString,
            filterType: 'select',
            render: record => _util.getOrNullList(record)
        },
          {
            title: '创建者',      
            dataIndex: 'created',
            sorter: _util.sortString,
            filterType: 'select',
            render: record => _util.getOrNullList(record)
            },
            {
                title: '创建时间',      
                dataIndex: 'created_time',
                sorter: _util.sortDate,
                filterType: 'range-date',
                render: record => _util.getOrNullList(record)
            },
            {
              title: '最后修改者',      
              dataIndex: 'updated',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record)
            },
            {
                title: '修改时间',      
                dataIndex: 'updated_time',
                sorter: _util.sortDate,
                filterType: 'range-date',
                render: record => _util.getOrNullList(record)
            },
            {
              title: '状态',      
              dataIndex: 'is_approval_desc',
              sorter: _util.sortString,
              filterType: 'select',
              render: (text, record, index) => {
                const {is_approval,staff_approve} = record;
                return(
                  staff_approve ? this.renderApproval(is_approval) :''
                )
              }
            },
            {
              // title: '操作',
              title: formatMessage({ id:"app.table.column.operate", defaultMessage:"操作"}),
              dataIndex: 'operate',
              maxWidth:110,
              minWidth: 80,
              render: (text, record, index) => {
                  const id = record.id;
                  const is_approval = record.is_approval;
                  let path = {
                      pathname: '/staff/approve/audit',
                      state: {
                          id: id
                      }
                  }
                  return (
                      <div>
                          {
                            is_approval == 1?
                            <Link to={path} onClick={this.setScrollTop}>
                                审批
                            </Link>  :''
                          }
                                                                           
                      </div>
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

  renderApproval = (record) => {
    if(record == 1){
      return (<Tag color="#108ee9">待审批</Tag>);
    }else if(record == 2){
      return (<Tag color="#87d068">审批通过</Tag>);
    }else{
      return (<Tag color="#f50">审批未通过</Tag>);
    }
  }

  renderApprovalDesc = (record) => {
    if(record == 1){
      return '待审批';
    }else if(record == 2){
      return '审批通过';
    }else{
      return '审批未通过';
    }
  }

  renderHasTraining = (record) => {
    if(record){
      return (<Tag color="#87d068">通过</Tag>);
    }else{
      return (<Tag color="#f50">未通过</Tag>);
    }
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


  renderUserList = (list) => {
    var user = [];
    if(list&&list.length){
      list.forEach(u => {
        user.push(u.id)
      })
    }
    return user
  }

  render() {
    const { column, check, refresh} = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            param={{organization_id:_util.getStorage('userdata') ? _util.getStorage('userdata').org.id : ''}}
            getFn={StaffApprove}
            columns={column}
            excelName={'红码审批'}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach((d,index) => {
                d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                d.updated_time = d.updated_time ? moment(d.updated_time).format('YYYY-MM-DD HH:mm') : '-'
                d.is_approval_desc = d.staff_approve ? this.renderApprovalDesc(d.is_approval) :''    
                if(d.role_info && d.role_info.length){
                  let arr = d.role_info.map(d => {return d.name});
                  d.role_name = arr.join(',')
                }
                
              });
            }}
          >
          </TablePage>
        </div>
      </div>
    )
  }
}
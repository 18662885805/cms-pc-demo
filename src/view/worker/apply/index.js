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
import {staff,staffDelete,PendingStaff,StaffOrg,staffOrgDelete} from '@apis/staff/index'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
// import messages from '@utils/formatMsg'
import {inject, observer} from 'mobx-react/index'
import debounce from 'lodash/debounce'
import UserWrapper from '@component/user-wrapper'
import values from 'postcss-modules-values'
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
                  filterType: 'select',
                  render: (text, record, index) => {
                    const id = record.id ? record.id : null;
                    const name = record.name ? record.name : null;
                    let path = {
                        pathname: '/staff/org/detail',
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
                filterType: 'select',
                render: record => _util.getOrNullList(record)
            },
            {
              title: '身份证号',
              dataIndex: 'id_card',
              sorter: _util.sortString,
              filterType: 'select',
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
                  
              title: '是否绑定微信',
              dataIndex: 'bind_wx_desc',
              sorter: _util.sortString,
              filterType: 'select',
              render: (text, record, index) => {
                return this.renderBindWX(record.bind_wx)
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
            // {
            //     title: '状态',      
            //     dataIndex: 'is_approval',
            //     sorter: _util.sortString,
            //     filterType: 'select',
            //     render: (text, record, index) => {
            //       const {is_approval,staff_approve} = record;
            //       return(
            //         staff_approve ? this.renderApproval(is_approval) :''
            //       )
            //     }
            //   },

              {
                // title: '操作',
                title: formatMessage({ id:"app.table.column.operate", defaultMessage:"操作"}),
                dataIndex: 'operate',
                render: (text, record, index) => {
                    const id = record.id
                    let path = {
                        pathname: '/staff/org/edit',
                        state: {
                            id: id
                        }
                    }
                    const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
                    const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
                    return (
                        <div>
                            {
                              canEdit ?
                              <Link to={path} onClick={this.setScrollTop}>
                                  <FormattedMessage id="global.revise" defaultMessage="修改"/>
                              </Link> :''
                            }                                 
                            <Divider type="vertical"/>

                            {
                              canDelete ?
                              <Popconfirm
                                  title={<FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/>}
                                  okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                                  cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                                  onConfirm={() => {
                                      this.onDeleteOne(id)
                                  }}>
                                  <a style={{color: '#f5222d'}}>
                                      <FormattedMessage id="global.delete" defaultMessage="删除"/>
                                  </a>
                              </Popconfirm> :''
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

  renderHasTraining = (record) => {
    if(record){
      return (<Tag color="#87d068">通过</Tag>);
    }else{
      return (<Tag color="#f50">未通过</Tag>);
    }
  }

  renderBindWX = (record) => {
    if(record){
      return (<Tag color="#87d068">绑定</Tag>);
    }else{
      return (<Tag color="#f50">未绑定</Tag>);
    }
  }

  onDeleteOne = id => {
    const organization_id = _util.getStorage('userdata') ? _util.getStorage('userdata').org.id : '';
    const { formatMessage } = this.props.intl;
    const project_id = _util.getStorage('project_id')
    this.setState({ refresh: false })
    staffOrgDelete(project_id,{id:id,organization_id:organization_id}).then((res) => {
      const { formatMessage } = this.props.intl;
      message.success('删除成功');
      this.setState({ refresh: true })
    })
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

  checkOrg = () => {
    if(_util.getStorage('userdata')){
      const userdata = _util.getStorage('userdata');
      if(userdata&&userdata.org){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
    
  }




  render() {
    const { column, check, refresh,showSubModal,showAddAuditSearch,template,add_audit_user_list,audit_user_fetching,withDrawVisible,withDrawRemark, } = this.state;
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
          name: '红码申请',
          url: '/staff/org'
      }
      
    ]
    const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            param={{organization_id:_util.getStorage('userdata') ? _util.getStorage('userdata').org.id : ''}}
            getFn={StaffOrg}
            columns={column}
            addPath={canAdd && '/staff/org/add'}
            excelName={formatMessage({ id:"page.component.breadcrumb.staff", defaultMessage:"员工管理"})}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach((d,index) => {
                d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                d.updated_time = d.updated_time ? moment(d.updated_time).format('YYYY-MM-DD HH:mm') : '-'
                if(d.role_info && d.role_info.length){
                  let arr = d.role_info.map(d => {return d.name});
                  d.role_name = arr.join(',')
                }
                d.bind_wx_desc = d.bind_wx ? '绑定' :'未绑定'
              });
            }}
          >
          </TablePage>
        </div>
      </div>
    )
  }
}
import React from 'react'
import { Link } from 'react-router-dom'
import {
  message,
  Tag,
  Button,
} from 'antd'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {accessCard,enableAccess,disableAccess} from '@apis/security/accesscard'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
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
              title: formatMessage({ id:"page.construction.staff.name", defaultMessage:"员工姓名"}),
              dataIndex: 'name',
              sorter: _util.sortString,
              render: (text, record, index) => {
                const id = record.id
                let path = {
                  pathname: '/safety/accesscard/detail',
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
              title: '是否需要参加培训',      
              dataIndex: 'need_training_desc',
              sorter: _util.sortString,
              filterType: 'select',
              render: (text, record, index) => {
                return _util.renderNeedTraining(record&&record.staff_info&&record.staff_info.need_training)
              }
            },
            {
              title: '审批人',
              dataIndex: 'factory_approve_name',
              sorter: _util.sortString,
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
              title: '门禁管理',      
              dataIndex: 'active_desc',
              sorter: _util.sortString,
              filterType: 'select',
              render: (text, record, index) => {
                return _util.renderAccessCard(record&&record.active)
            }
          },
          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
      }
  }

  componentDidMount(){
    let userdata = _util.getStorage('userdata');
    if(userdata.org){
      this.setState({
          org_name:userdata.org.company ? userdata.org.company : '',
          org_id:userdata.org.id ? userdata.org.id: ''
      });     
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  };


  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  enableUser = () => {
    this.setState({ refresh: false })
    const { formatMessage } = this.props.intl;
    let {selectedRows} = this.state;
    let project_id = _util.getStorage('project_id');
    if (selectedRows && selectedRows.length) {
        const data = _util.renderListToString(selectedRows,'id')
        enableAccess({project_id:project_id,access_card_ids:data}).then((res) => {
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
        disableAccess({project_id:project_id,access_card_ids:data}).then((res) => {
            message.success('禁用成功');
            this.setState({ refresh: true ,selectedRowKeys:[],selectedRows:[] })
        });
    }else{
        message.warning('请选择数据');
    }   
}


render() {
    const { column, check, refresh,org_id } = this.state;
    const { formatMessage } = this.props.intl;
    let userdata = _util.getStorage('userdata');
    if(userdata.org){
        const org_id=userdata.org.id ? userdata.org.id: ''  
    }
    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={accessCard}
            //param={{org_id:_util.getStorage('userdata') ? _util.getStorage('userdata').org.id : ''}}
            columns={column}
            excelName={'门禁管理'}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach((d,index) => {
                d.created_time = d.created_time ? moment(d.created_time).format('YYYY-MM-DD HH:mm') : '-'
                d.approve_time = d.staff_info&&d.staff_info.approve_time ? moment(d.staff_info.approve_time).format('YYYY-MM-DD HH:mm') : '-'
                d.name = d.staff_info&&d.staff_info.name ? d.staff_info.name :''
                d.phone = d.staff_info&&d.staff_info.phone ? d.staff_info.phone :''
                d.id_card = d.staff_info&&d.staff_info.id_card ? d.staff_info.id_card :''
                d.org_name = d.staff_info&&d.staff_info.org_name ? d.staff_info.org_name :''
                d.work_type = d.staff_info&&d.staff_info.work_type ? d.staff_info.work_type :''
                d.staff_type_name = d.staff_info&&d.staff_info.staff_type	 ?  _util.getPersonTypeDesc(d.staff_info.staff_type)  :''
                d.need_training_desc = d.staff_info&&d.staff_info.need_training ? '需要参加' :'不需参加'
                d.status_desc = d.status ? _util.renderApprovalDesc(d.status) :''
                d.active_desc = d.active ? '启用' :'禁用'
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
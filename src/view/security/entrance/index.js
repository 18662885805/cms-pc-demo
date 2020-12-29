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
import {
  SearchProjectUser
} from '@apis/system/user'
import {Factoryapply2,entryAeecssList} from '@apis/security/factoryapply'
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
                  const id = record.id
                  let path = {
                    pathname: '/staff/list/factoryapply/detail',
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
                title: '审批人',      
                dataIndex: 'factory_approve_name',
                sorter: _util.sortString,
                filterType: 'select',
                render: record => _util.getOrNullList(record)
                },
                {
                  title: '审批时间',      
                  dataIndex: 'approve_time',
                  sorter: _util.sortDate,
                  filterType: 'range-date',
                  render: record => _util.getOrNullList(record)
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
                sorter: _util.sortDate,
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

          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
          showSubModal:false,
          add_audit_user_list:[],
          audit_user_fetching: false,
          withDrawVisible:false, 
          withDrawRemark:'',
          showAddAuditSearch:false
      }
      
      this.fetchCC = debounce(this.fetchCC, 800);
      this.fetchAduit = debounce(this.fetchAduit, 800);
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

  

  fetchCC = (value) => {
    const project_id = _util.getStorage('project_id')
    this.setState({ cc_user: [], cc_user_fetching: true });
    SearchProjectUser({project_id:project_id, q: value }).then((res) => {
        if (res.data) {
            this.setState({ cc_user: res.data, cc_user_fetching: false });
        }
    })
  }

  fetchAduit = (value) => {
    const project_id = _util.getStorage('project_id')
    this.setState({ add_audit_user_list: [], audit_user_fetching: true });
    SearchProjectUser({project_id:project_id, q: value }).then((res) => {
        if (res.data) {
            this.setState({ add_audit_user_list: res.data, audit_user_fetching: false });
        }
    })
  }

  handleCC = value => {
    this.setState({
      cc_user: [],
      cc_user_fetching: false,
    })
    var cc_user_list = [];
    if (value && value.length) {
        value.map((item) => {
          cc_user_list.push(item.key)
        });
        this.setState({
          cc_user_list
        });
    }
  };


  submitWorker = () => {
    const _this = this;
    const { formatMessage } = this.props.intl;
    let {selectedRows} = this.state;
    if (selectedRows && selectedRows.length) {
      this.setState({showSubModal:true})
    }else{
        message.warning(formatMessage(messages.inCon37));
    }   
    
  }

  closeSubModal = () => {
    this.setState({showSubModal:false})
  }

  renderUserList = (list) => {
    var user = [];
    if(list&&list.length){
      list.forEach(u => {
        user.push(u.id)
      })
    }
    return user
  }


  //提交
  handleSubmit = () => {
      const project_id = _util.getStorage('project_id')
      const {selectedRows} = this.state;
      this.setState({ refresh: false })
  }


  recallWorker = () => {
    const _this = this;
    const { formatMessage } = this.props.intl;
    let {selectedRows} = this.state;
    if (selectedRows && selectedRows.length) {
      this.setState({withDrawVisible:true})
    }else{
      message.warning(formatMessage(messages.inCon37));
    }   
  }

  handleWithDrawVisible = () => {
    this.setState({withDrawVisible:false})
  }

  handleWithDrawRemark = e => {
    this.setState({
      withDrawRemark: e.target.value
    });
  }

  doWithdraw = () => {
    this.setState({ refresh: false })
    let {selectedRows,withDrawRemark} = this.state;
    var id_list = [];
    selectedRows.forEach((item,index) => {
      id_list.push(item.id)
    });
    var ids = id_list.join(',');
    const project_id = _util.getStorage('project_id')
    const data = {id:ids,remarks:withDrawRemark,is_first:true}
  }

  openAuditSearch = () => {
    this.setState({showAddAuditSearch:true})
  }

  closeWithdrawModal = () => {
    this.setState({withDrawVisible:false})
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
    const { column, check, refresh,showSubModal,withDrawVisible,withDrawRemark,} = this.state;
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
          name: '绿码申请',
          url: '/staff/list/factoryapply'
      }
    ]

    const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");
    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={Factoryapply2}
            param={{org_id:_util.getStorage('userdata') ? _util.getStorage('userdata').org.id : ''}}
            columns={column}
            addPath={canAdd && '/staff/list/factoryapply/add'}
            excelName={'绿码申请'}
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
          <Modal
            title='提交'
            visible={showSubModal}
            onOk={this.handleSubmit}
            onCancel={this.closeSubModal}
            okText={'保存'}
            cancelText={'取消'}
            maskClosable={false}
            okButtonProps={null}
            destroyOnClose={true}
          >

          </Modal>
          <Modal
            title={<FormattedMessage id="app.component.tablepage.withdraw_remark" defaultMessage="撤回备注" />}
            visible={withDrawVisible}
            onOk={this.doWithdraw}
            onCancel={() => this.handleWithDrawVisible()}
            okText={'提交'} //提交
            cancelText={'取消'} //取消
          >
            <Row gutter={20}>
              <Col span={6} style={{ textAlign: "right" }}><FormattedMessage id="app.component.tablepage.remark" defaultMessage="备注" /></Col>
              <Col span={16}>
                <TextArea
                  onChange={this.handleWithDrawRemark}
                  value={withDrawRemark} />
              </Col>
            </Row>
          </Modal>
        </div>
      </div>
    )
  }
}
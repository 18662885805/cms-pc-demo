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
import {EntryRecordIn,EntryRecordOut} from '@apis/security/entryrecord'
import {accessCardEnable}from '@apis/security/accesscard'
import {turnstileInfo} from '@apis/system/organize';
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {inject, observer} from 'mobx-react/index'
import debounce from 'lodash/debounce'
import UserWrapper from '@component/user-wrapper'
import values from 'postcss-modules-values'
const _util = new CommonUtil()
const FormItem = Form.Item;
const {TextArea } = Input;
const { Option } = Select;
const confirm = Modal.confirm

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
                    pathname: '/safety/enabled/accesscard/detail',
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
                title: '门禁管理',      
                dataIndex: 'active_desc',
                sorter: _util.sortString,
                filterType: 'select',
                render: (text, record, index) => {
                  return _util.renderAccessCard(record&&record.active)
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
                // title: '操作',
                title: formatMessage({ id:"app.table.column.operate", defaultMessage:"操作"}),
                dataIndex: 'operate',
                maxWidth:110,
                minWidth: 80,
                render: (text, record, index) => {
                    const id = record.id;
                    const is_in = record.is_in;
                    if(is_in){
                      return (
                        <Button type='danger' size='small' onClick={() => this.handleOut(id)}>离场</Button>
                      );
                    }else{
                      return (
                        <Button type='primary' size='small' onClick={() => this.handleIn(id)}>进场</Button>
                      );
                    }
                    
                }
              },
             
              
          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
          remark:'',
          postData:{},
          inModal:false,
          outModal:false,
          factory_apply_id:null,
          turnstile:[]
      }
  }

  componentDidMount(){
    const project_id = _util.getStorage('project_id');
    this.setState({project_id:project_id});
    turnstileInfo({project_id: _util.getStorage('project_id') }).then(res => {
      if(res.data&&res.data.length){
        this.setState({ turnstile:res.data });
      }
    })
  }


  handleIn = (id) => {
    this.setState({inModal:true,factory_apply_id:id})
  }

  handleOut = (id) => {
    this.setState({outModal:true,factory_apply_id:id})
  }

  handleInSubmit = () => {
    this.setState({ refresh: false })
    const{project_id,factory_apply_id,postData} = this.state;
    const {remark,turnstile_id} = postData
    EntryRecordIn({
      project_id:project_id,
      access_card_id:factory_apply_id,
      remark:remark,
      turnstile_id:turnstile_id,
    }).then((res) => {
      message.success('进场成功')
      this.setState({ refresh: true })
    })
    this.closeInModal();
  }

  handleOutSubmit = () => {
    this.setState({ refresh: false })
    const{project_id,factory_apply_id,postData} = this.state;
    const {remark,turnstile_id} = postData
    EntryRecordOut({
      project_id:project_id,
      access_card_id:factory_apply_id,
      remark:remark,
      turnstile_id:turnstile_id,
    }).then((res) => {
      message.success('出场成功')
      this.setState({ refresh: true })
    })
    this.closeOutModal();
  }

  closeInModal = () => {
    this.setState({inModal:false,factory_apply_id:null,postData:{}})
  }

  closeOutModal = () => {
    this.setState({outModal:false,factory_apply_id:null,postData:{}})
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

  handleData = (value, field) => {
    const { postData } = this.state
    postData[field] = value
    this.setState({
      postData
    })
  }


render() {
    const { column, check, refresh,inModal,outModal, turnstile } = this.state;
    const { formatMessage } = this.props.intl;
    const turnstileOption = turnstile instanceof Array && turnstile.length ? turnstile.map(d =>
      <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

      const bread = [
        {
            name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
            url: '/'
        },
        {
            name: '安防管理'
        },
        {
            name: '临时出入',
            url: '/safety/enabled/accesscard'
        }
      ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={accessCardEnable}
            columns={column}
            excelName={check(this, 'excel') && formatMessage({ id:"page.component.breadcrumb.staff", defaultMessage:"员工管理"})}
            onSelectChange={this.onSelectChange}
            showSearch={false}
            excelName={'临时出入'}
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
          </TablePage>
          <Modal
              title={'入场操作'}
              visible={inModal}
              onOk={() => this.handleInSubmit()}
              onCancel={() => this.closeInModal()}
              okText={'确认'}
              cancelText={<FormattedMessage id="app.component.tablepage.cancelText" defaultMessage="取消" />}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              {/* <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'闸机'}
              >
                  <Select 
                    style={{width:'100%'}}  
                    placeholder="请选择闸机" 
                    onChange={(value) => this.handleData(value,'turnstile_id')}
                    allowClear
                  >
                      {turnstileOption}
                  </Select>
              </FormItem> */}
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'备注'}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleData(e.target.value, 'remark')}
                      defaultValue={null}
                      placeholder="备注"
                  />
              </FormItem>                     
          </Modal>
          <Modal
              title={'出场操作'}
              visible={outModal}
              onOk={() => this.handleOutSubmit()}
              onCancel={() => this.closeOutModal()}
              okText={'确认'}
              cancelText={<FormattedMessage id="app.component.tablepage.cancelText" defaultMessage="取消" />}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              {/* <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'闸机'}
              >
                  <Select 
                    style={{width:'100%'}}  
                    placeholder="请选择闸机" 
                    onChange={(value) => this.handleData(value,'turnstile_id')}
                    allowClear
                  >
                      {turnstileOption}
                  </Select>
              </FormItem> */}
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'备注'}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleData(e.target.value, 'remark')}
                      defaultValue={null}
                      placeholder="备注"
                  />
              </FormItem>                     
          </Modal>
        </div>
      </div>
    )
  }
}
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
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import { 
  turnstile,
  turnstileDelete,
  turnstileDetail,
  turnstilePost,
  turnstilePut
} from '@apis/security/turnstile'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import {inject, observer} from 'mobx-react/index'
import moment from "moment";
const _util = new CommonUtil()
const FormItem = Form.Item;
const confirm = Modal.confirm
const {TextArea } = Input;
const { Option } = Select;

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  description:{
      id: 'page.inspection.description',
      defaultMessage: '描述',
  },
  created: {
      id: 'page.inspection.created',
      defaultMessage: '创建人',
  },
  created_time: {
      id: 'page.inspection.created_time',
      defaultMessage: '创建时间',
  },
  updated: {
      id: 'page.inspection.updated',
      defaultMessage: '上次修改人',
  },
  updated_time: {
      id: 'page.inspection.updated_time',
      defaultMessage: '修改日期',
  },
  select: {
      id: 'app.placeholder.select',
      defaultMessage: '-- 请选择 --',
  },
  confirm_title: {
      id: 'app.confirm.title.submit',
      defaultMessage: '确认提交?',
    },
  confirm_content: {
      id: 'app.common.button.content',
      defaultMessage: '单击确认按钮后，将会提交数据',
  },
  okText: {
      id: 'app.button.ok',
      defaultMessage: '确认',
  },
  cancelText: {
      id: 'app.button.cancel',
      defaultMessage: '取消',
  },
  save_success: {
      id: 'app.message.save_success',
      defaultMessage: '保存成功',
  },
  operate: {
      id: 'app.table.column.operate',
      defaultMessage: '操作',
  },
  deleted: {
      id: 'app.message.material.deleted',
      defaultMessage: '已删除',
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
                  title: '闸机名称',
                  dataIndex: 'name',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                title: '闸机凭证',
                dataIndex: 'token',
                sorter: _util.sortString,
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
                    title: formatMessage(messages.created_time),      
                    dataIndex: 'created_time',
                    sorter: _util.sortDate,
                    filterType: 'range-date',
                    render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
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
                  render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
              },
              {
                title: formatMessage(messages.operate),    //操作
                dataIndex: 'operate',
                width: 120,
                minWidth: 120,
                maxWidth: 120,
                render: (text, record, index) => {
                  const id = record.id
                  return (
                    <div
                    >
                       <a style={{ marginRight: '10px' }} onClick={() => this.showEditModal(record)}> <FormattedMessage id="app.page.text.modify" defaultMessage="修改" /> </a>
                      <Popconfirm
                          title={<FormattedMessage id="app.pop.title.delete" defaultMessage="确认删除？" />}
                          okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}
                          cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}
                          onConfirm={() => {
                            this.onDeleteOne(id)
                      }}>
                        <a style={{ color: '#f5222d' }}> <FormattedMessage id="app.page.text.delete" defaultMessage="删除" /> </a>
                      </Popconfirm>
                    </div>
                  )
                }
              }
              
          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
          addModal:false,
          addData:{},
          editModal:false,
          editData:{}
      }
  }

  componentWillMount(){
    if(_util.getStorage('myadmin')&&_util.getStorage('myadmin') == true){
      console.log('mjk')
    }else{
      message.warning('仅限曼捷科管理员权限')
      this.props.history.replace('/')
    }
  }

  componentDidMount(){
  }

  handleAddData = (value, field) => {
    const { addData } = this.state
    addData[field] = value
    this.setState({
       addData
    })
  }

  handleEditData = (value, field) => {
    const { editData } = this.state
    editData[field] = value
    this.setState({
      editData
    })
  }

  showAddModal = () => {
    this.setState({addModal:true})
  }

  closeAddModal=()=>{
    this.setState({addModal:false})
  }

  handleAddSubmit = () => {
    const { addData} = this.state;
    const {name,token} = addData;
    const project_id =  _util.getStorage('project_id');
    this.setState({ refresh: false });
    turnstilePost(project_id,addData).then((res) => {
        message.success('保存成功')   
        this.setState({refresh:true})   
        this.closeAddModal();
    })
    // const _this = this;
    // if(name&&token){
    //     //const { formatMessage } = this.props.intl;
    //     confirm({
    //         title: '确认提交?',
    //         content: '单击确认按钮后，将会提交数据',
    //         okText: '确认',
    //         cancelText: '取消',
    //         onOk() {
    //             turnstilePost(project_id,addData).then((res) => {
    //                 message.success('保存成功')      
    //                 _this.closeAddModal();
    //                 _this.setState({refresh:true})
    //             })
    //         },
    //         onCancel() {    
    //         },
    //     })
    // }else{
    //     message.warning('请补全数据')
    // }  
  }

  showEditModal = (record) => {
    const project_id =  _util.getStorage('project_id');
    this.setState({
      editModal:true,
    });
    turnstileDetail(project_id,{id:record.id}).then(res => {
      this.setState({
          editData:res.data
      })
    })
    
  }

  closeEditModal=()=>{
    this.setState({editModal:false});
  }

  handleEditSubmit = () => {
    const { editData} = this.state;
    const {name,token} = editData;
    const project_id =  _util.getStorage('project_id');
    this.setState({ refresh: false });
    turnstilePut(project_id,editData).then((res) => {
        message.success('保存成功')  
        this.setState({refresh:true})    
        this.closeEditModal();
    })
    // const _this = this;
    // if(name&&token){
    //     confirm({
    //         title: '确认提交?',
    //         content: '单击确认按钮后，将会提交数据',
    //         okText: '确认',
    //         cancelText: '取消',
    //         onOk() {
    //             turnstilePut(project_id,editData).then((res) => {
    //                 message.success('保存成功')      
    //                 _this.closeEditModal();
    //                 _this.setState({refresh:true})
    //             })
    //         },
    //         onCancel() {
                
    //         },
    //     })       
    // }else{
    //     message.warning('请补全数据')
    // }   
  }

  onDeleteOne = id => {
    const project_id =  _util.getStorage('project_id');
    this.setState({ refresh: false })
    const { formatMessage } = this.props.intl;
    turnstileDelete(project_id,{id:id}).then((res) => {
        message.success(formatMessage(messages.deleted));
        this.setState({ refresh: true })
    })
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


render() {
    const { column, check, refresh ,addModal,editModal,editData} = this.state;
    const { formatMessage } = this.props.intl;


    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={turnstile}
            columns={column}
            excelName={'闸机管理'}
            onSelectChange={this.onSelectChange}
          >
            <Button type="primary" onClick={() => this.showAddModal()}>
              新增
            </Button>
          </TablePage>
          <Modal
              title={<FormattedMessage id="component.tablepage.add" defaultMessage="新增" />}
              visible={addModal}
              onOk={() => this.handleAddSubmit()}
              onCancel={() => this.closeAddModal()}
              okText={'保存'}
              cancelText={<FormattedMessage id="app.component.tablepage.cancelText" defaultMessage="取消" />}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'闸机名称'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleAddData(e.target.value, 'name')}
                      defaultValue={null}
                      placeholder="闸机名称"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'闸机凭证'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleAddData(e.target.value, 'token')}
                      defaultValue={null}
                      placeholder="闸机凭证"
                  />
              </FormItem>                     
          </Modal>

          <Modal
              title={<FormattedMessage id="app.page.text.modify" defaultMessage="修改" />}
              visible={editModal}
              onOk={() => this.handleEditSubmit()}
              onCancel={() => this.closeEditModal()}
              okText={'保存'}
              cancelText={<FormattedMessage id="app.component.tablepage.cancelText" defaultMessage="取消" />}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'闸机名称'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleEditData(e.target.value, 'name')}
                      value={editData.name ? editData.name :null}
                      placeholder="闸机名称"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'闸机凭证'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleEditData(e.target.value, 'token')}
                      value={editData.token ? editData.token :null}
                      placeholder="闸机凭证"
                  />
              </FormItem>                  
          </Modal>
        </div>
      </div>
    )
  }
}
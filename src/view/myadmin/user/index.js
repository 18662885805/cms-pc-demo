import React from 'react'
import {
  Popconfirm,
  Divider,
  message,
  Tag,
  Modal,
  Button,
  Input,
  Select,
  Form,
  Switch
} from 'antd'
import { Link } from "react-router-dom";
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {user,userDetail,userPost,userPut,userDelete} from '@apis/myadmin/user';
import {disabledPost, enabledPost}from '@apis/admin/user';
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages,} from 'react-intl'
import {inject, observer} from 'mobx-react'
import moment from "moment";
import ViewPwd from '@component/ViewPwd'


const _util = new CommonUtil();
const FormItem = Form.Item;
const confirm = Modal.confirm
const Option = Select.Option

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

@inject('appState') @observer  @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  // title: '序号',
                  title: formatMessage({ id:"app.table.column.No", defaultMessage:"序号"}),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  title: '手机号',
                  dataIndex: 'phone',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: '姓名',
                  dataIndex: 'name',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                title: '加入项目',
                dataIndex: 'project',
                sorter: _util.sortString,
                render: record => _util.getOrNullList(record)
              },
              {
                  title: '状态',
                  dataIndex: 'is_active_desc',
                  sorter: _util.sortString,
                  render: (text, record) => <Tag color={_util.getColor(record.is_active ? 4 : 5)}>{text}</Tag>
              },
            //   {
            //     title: '身份',            
            //     dataIndex: 'status',
            //     sorter: _util.sortString,
            //     render: record =>  _util.getUserStatus(record)
            //   },
              {
                title: 'MJK管理员',            
                dataIndex: 'is_super',
                sorter: _util.sortString,
                render: (text, record) => record.is_super ? <Tag color={'#483d8b'}>MJK管理员</Tag> : ''
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
                  render: record => _util.getOrNullList(record ? moment(record).format('YYYY-MM-DD HH:mm:ss') :null)
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
                  render: record => _util.getOrNullList(record ? moment(record).format('YYYY-MM-DD HH:mm:ss') :null)
              },
              {
                  // title: '操作',
                  title: formatMessage({ id:"app.table.column.operate", defaultMessage:"操作"}),
                  dataIndex: 'operate',
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  render: (text, record, index) => {
                    const id = record.id;
                    const is_super = record.is_super;
                    let path = `/myadmin/user/add/${id}`
                      return (
                          <div>
                              {
                                  is_super ?
                                  <Link to={path} onClick={this.setScrollTop}>
                                    <FormattedMessage id="global.revise" defaultMessage="修改"/>
                                </Link>:
                                ''
                              }
                              {
                                  is_super ? <Divider type="vertical"/> : ''
                              }                                                
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
                              </Popconfirm>
                          </div>
                      );
                  }
              }
          ],
          check: _util.check(),
          showAddModal:false, 
          showEditModal:false, 
          addData:{},
          editData:{},
          selectedRowKeys:[],
          selectedRows:[]
      }
  }


  renderProjectName = (list) => {
    if(list && list.length){
        return list.join(',')
    }else{
        return ''
    }
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  onDeleteOne = id => {
    this.setState({ refresh: false })
    const { formatMessage } = this.props.intl;
    userDelete(id).then((res) => {
        message.success(formatMessage(messages.deleted));
        this.setState({ refresh: true })
    })
  }

  openAddModal = () => {
    this.setState({
      showAddModal:true
    })
  }


  openEditModal = (record) => {
    this.setState({
      showEditModal:true,
    });
    userDetail({id:record.id}).then(res => {
        console.log('0115',res);
        this.setState({
            editData:res.data
        })
    })
  }

  closeAddModal = () => {
      this.setState({
          showAddModal:false,
          addData:{}
      })
  }


  closeEditModal = () => {
      this.setState({
          showEditModal:false,
          editData:{}
      })
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


    handleAddSubmit = () => {
        const { addData} = this.state;
        const {name,phone,email,password} = addData;
        if(name&&phone&&email&&password){
            const { formatMessage } = this.props.intl;
            this.setState({ refresh: false });
            // addData.status = 1;
            const _this = this;
            confirm({
                title: formatMessage(messages.confirm_title),
                content: formatMessage(messages.confirm_content),
                okText: formatMessage(messages.okText),
                cancelText: formatMessage(messages.cancelText),
                onOk() {
                    userPost(addData).then((res) => {
                        message.success(formatMessage(messages.save_success))      
                        _this.closeAddModal();
                        _this.setState({refresh:true})
                    })
                },
                onCancel() {
                    
                },
            })
        }else{
            message.warning('请补全数据')
        }
        
    }

    handleEditSubmit = () => {
        const { editData} = this.state;
        const {name,phone,email,password} = editData;
        if(name&&phone&&email&&password){
            const { formatMessage } = this.props.intl;
            this.setState({ refresh: false });
            const _this = this;
            confirm({
                title: formatMessage(messages.confirm_title),
                content: formatMessage(messages.confirm_content),
                okText: formatMessage(messages.okText),
                cancelText: formatMessage(messages.cancelText),
                onOk() {
                    userPut(editData.id,editData).then((res) => {
                        message.success(formatMessage(messages.save_success))      
                        _this.closeEditModal();
                        _this.setState({refresh:true})
                    })
                },
                onCancel() {
                    
                },
            })       
        }else{
            message.warning('请补全数据')
        }
        
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
    };

    enableUser = () => {
        this.setState({ refresh: false })
        const { formatMessage } = this.props.intl;
        let {selectedRows} = this.state;
        if (selectedRows && selectedRows.length) {
           const data = _util.renderListToString(selectedRows,'id')
           enabledPost({operation:1,ids:data}).then((res) => {
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
        if (selectedRows && selectedRows.length) {       
           const data = _util.renderListToString(selectedRows,'id')
           enabledPost({operation:2,ids:data}).then((res) => {
                message.success('禁用成功');
                this.setState({ refresh: true ,selectedRowKeys:[],selectedRows:[] })
           });
        }else{
            message.warning('请选择数据');
        }   
    }

    render() {
    const { column, check, refresh,showAddModal,showEditModal,editData,addData,selectedRowKeys,selectedRows } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={user}
            columns={column}
            excelName={'用户管理'}
            addPath={"/myadmin/user/add"}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach(d => {
                const { status } = d
                if (status) {
                  d.status_desc = <FormattedMessage id="component.tablepage.use" defaultMessage="启用" />
                } else {
                  d.status_desc = <FormattedMessage id="page.construction.location.disactive" defaultMessage="禁用"/>
                }
                if(d.project){
                    d.project = d.project.map(d => {return d.name}).join(',')
                }
                if(d.is_active){
                    d.is_active_desc = '启用'
                }else{
                    d.is_active_desc = '禁用'
                }
              })
            }}
          >
            {/* <Button type="primary" onClick={() => this.openAddModal()}>
              <FormattedMessage id="component.tablepage.add" defaultMessage="新增" />
            </Button> */}
            {/* <Button type="primary" onClick={() => this.enableUser()}>
              启用
            </Button>
            <Button type="primary" onClick={() => this.disableUser()}>
              禁用
            </Button> */}
          </TablePage>

            <Modal
              title={<FormattedMessage id="component.tablepage.add" defaultMessage="新增" />}
              visible={showAddModal}
              onOk={this.handleAddSubmit}
              onCancel={this.closeAddModal}
              okText={'保存'}
              cancelText={<FormattedMessage id="app.component.tablepage.cancelText" defaultMessage="取消" />}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'手机号'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}} 
                      onChange={e => this.handleAddData(e.target.value, 'phone')}
                      defaultValue={null}
                      maxLength={11}
                      placeholder="手机号"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'姓名'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleAddData(e.target.value, 'name')}
                      defaultValue={null}
                      placeholder="姓名"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'密码'}
                  required={true}
              >
                  <ViewPwd inputName="password" placeholder="密码(10-16位数字,字符组成) " pwd={addData.password ? addData.password : ''} onChange={(e) => this.handleAddData(e.target.value, 'password')} />
              </FormItem>
              
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'邮箱'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleAddData(e.target.value, 'email')}
                      defaultValue={null}
                      placeholder="邮箱"
                  />
              </FormItem>

              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'MJK管理员'}
                  required={true}
              >
                  <Switch onChange={value => this.handleAddData(value, "is_super")} defaultChecked={false}  />
              </FormItem>

                {/* <FormItem 
                    labelCol={{ span: 5 }} 
                    wrapperCol={{ span: 15 }} 
                    label={'系统管理员'}
                    required={true}
                >
                    <Switch onChange={value => this.handleAddData(value, "is_admin")} defaultChecked={false}  />
                </FormItem> */}

              
          </Modal>
          <Modal
              title={<FormattedMessage id="app.page.text.modify" defaultMessage="修改" />}
              visible={showEditModal}
              onOk={this.handleEditSubmit}
              onCancel={this.closeEditModal}
              okText={<FormattedMessage id="app.component.tablepage.submit" defaultMessage="提交" />}
              cancelText={<FormattedMessage id="app.component.tablepage.cancelText" defaultMessage="取消" />}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'手机号'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}} 
                      onChange={e => this.handleEditData(e.target.value, 'phone')}
                      value={editData.phone ? editData.phone :null}
                      placeholder="手机号"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'姓名'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleEditData(e.target.value, 'name')}
                      value={editData.name ? editData.name :null}
                      placeholder="姓名"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'邮箱'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleEditData(e.target.value, 'email')}
                      value={editData.email ? editData.email :null}
                      placeholder="邮箱"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'加入项目'}
              >
                  <Input value={editData.project ? this.renderProjectName(editData.project) : null} disabled />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'身份'}
              >
                  {_util.getUserStatus(editData.status ? editData.status : null)}
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'MJK管理员'}
                  required={true}
              >
                  <Switch onChange={value => this.handleEditData(value, "super")} checked={editData.super ? editData.super : false}  />
              </FormItem>
          </Modal>

        </div>
      </div>
    )
  }
}
import React from "react";
import { Link } from "react-router-dom";
import { 
    Divider, 
    Popconfirm, 
    message, 
    Tag,
    Button,
    Modal,
    Input,
    Form,
    Select,
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import{messageList,messageDelete} from "@apis/today/message";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import {inject, observer} from "mobx-react/index";
import moment from 'moment';
import {messageData} from '@utils/contractorList'

const _util = new CommonUtil();
const FormItem = Form.Item;
const confirm = Modal.confirm

const messages = defineMessages({
  No: {
    id: "app.table.column.No",
    defaultMessage: "序号"
  },
  title: {
    id:"page.system.setting.title",
    defaultMessage:"标题"
  },
  type: {
    id:"page.system.setting.type",
    defaultMessage:"类型"
  },
  content: {
    id:"page.system.setting.content",
    defaultMessage:"内容"
  },
  created: {
    id:"page.system.setting.created",
    defaultMessage:"创建人"
  },
  created_time: {
    id:"page.system.setting.created_time",
    defaultMessage:"创建日期"
  },
  updated: {
    id:"page.system.setting.updated",
    defaultMessage:"上次修改人"
  },
  updated_time: {
    id:"page.system.setting.updated_time",
    defaultMessage:"修改日期"
  },
  status: {
    id:"page.system.setting.status",
    defaultMessage:"状态"
  },
  operate: {
    id:"page.system.setting.operate",
    defaultMessage:"操作"
  },
})

@inject("appState") @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      column: [
        {
          title: formatMessage(messages.No),
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return (index + 1);
          }
        },
        {
          title: '类型名称',
          dataIndex: "title",
          sorter: _util.sortString,
          render: (text, record,index) => {
            return <Link to={{
              pathname: "/",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{`任务类型${index+1}`}</Link>;
          }
        },
        {
          title: '描述',
          dataIndex: "type_desc",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),
          dataIndex: "created",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title:formatMessage(messages.updated),
          dataIndex: "updated",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.operate),
          dataIndex: "operate",
          minWidth: 80,
          maxWidth: 110,
          render: (text, record, index) => {
            const id = record.id;
            let path = {
              pathname: "/today/message/edit",
              state: {
                id: id
              }
            };
            const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
            const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
            return (
              <div>
                {
                  canEdit ?
                  <Link to={path} onClick={this.setScrollTop}><FormattedMessage id="global.revise" defaultMessage="修改"/></Link> :''
                }                    
                <Divider type='vertical' /> 
                {
                  canDelete ?
                  <Popconfirm placement="topRight"
                    title={<p><FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/></p>}
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                    cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                    onConfirm={() => {
                      this.onDeleteOne(id);
                    }}>
                    <a style={{ color: "#f5222d" }}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
                  </Popconfirm>  :''
                }                          
              </div>
            );
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
    };}



    showAddModal = () => {
    this.setState({addModal:true})
    }

    closeAddModal=()=>{
    this.setState({addModal:false})
    }

    handleAddSubmit = () => {
    const { addData} = this.state;
    const project_id =  _util.getStorage('project_id');
    this.setState({ refresh: false });
    }

    showEditModal = (record) => {
    const project_id =  _util.getStorage('project_id');
    this.setState({
        editModal:true,
    });
    }

    closeEditModal=()=>{
    this.setState({editModal:false});
    }

    handleEditSubmit = () => {
    const { editData} = this.state;
    const project_id =  _util.getStorage('project_id');
    this.setState({ refresh: false });
    }



  onDeleteOne = id => {
    this.setState({ refresh: false });
    const project_id =  _util.getStorage('project_id');
    const { formatMessage } = this.props.intl;
    
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  }
  render() {
    const { column, check, refresh,addModal,editModal,editData } = this.state;
    const { formatMessage } = this.props.intl;
    let params = {project_id: _util.getStorage('project_id')}
    const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");
    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <TablePage
            param={params}
            refresh={refresh}
            getFn={messageList}
            columns={column}
            excelName={formatMessage({ id:"page.component.breadcrumb.message_manage", defaultMessage:"消息通知管理"})}
            dataMap={data => {
              data.forEach(d => {
                d.type_desc = d.m_type === 1 ? '文字' : '音频'
              });
            }}
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
                  label={'类型名称'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleAddData(e.target.value, 'name')}
                      defaultValue={null}
                      placeholder="类型名称"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'类型描述'}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleAddData(e.target.value, 'token')}
                      defaultValue={null}
                      placeholder="类型描述"
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
                  label={'类型名称'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleEditData(e.target.value, 'name')}
                      value={editData.name ? editData.name :null}
                      placeholder="类型名称"
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'类型描述'}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleEditData(e.target.value, 'token')}
                      value={editData.token ? editData.token :null}
                      placeholder="类型描述"
                  />
              </FormItem>                  
          </Modal>
        </div>
      </div>
    );
  }
}
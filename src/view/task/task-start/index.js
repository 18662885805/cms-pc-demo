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
import{messageList} from "@apis/today/message";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import {inject, observer} from "mobx-react/index";
import moment from 'moment';


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
          title: '问题名称',
          dataIndex: "title",
          sorter: _util.sortString,
          render: (text, record,index) => {
            return <Link to={{
              pathname: "/",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{text}</Link>;
          }
        },
        {
          title: '执行人',
          dataIndex: "user",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
            title: '行动日期',
            dataIndex: "start_time",
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
            title: '状态',
            dataIndex: "operate2",
            sorter: _util.sortString,
            render: (text, record,index) => {
              return this.renderTaskStatusText(record&&record.status)
            }
          },
        {
          title: formatMessage(messages.operate),
          dataIndex: "operate",
          minWidth: 80,
          maxWidth: 110,
          render: (text, record, index) => {
            const id = record.id;
            const status = record.status
            let path = {
              pathname: "/task/task-resolve/detail2",
              state: {
                id: id
              }
            };
            return (
              <div>
                {
                  status == 1?
                  <a style={{color: "#174276",marginRight:'5px' }}>提交</a> :''
                }  
                {
                  status == 1 || status == 5?
                  <a style={{marginRight:'5px' }}><FormattedMessage id="global.revise" defaultMessage="修改"/></a> :''
                }  
                {
                  status == 4?
                  <a style={{marginRight:'5px' }} onClick={() => this.toDetail2()}><FormattedMessage id="global.revise" defaultMessage="修改"/></a> :''
                }                    
                {
                  status == 1 || status == 5 ?
                  <Popconfirm placement="topRight"
                    title={<p><FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/></p>}
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                    cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                    onConfirm={() => {
                      this.onDeleteOne(id);
                    }}>
                    <a style={{ color: "#f5222d",marginRight:'5px' }}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
                  </Popconfirm>  :''
                }   
                {
                  status == 2 || status == 3 || status == 4 ||status == 6 ? <a style={{ color: "green" }}>关闭</a> :''
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
        editData:{},
        mockData:[
            {id:1,title:'重要任务1',user:'Adolph',start_time:'2020-04-11',created:'jmy',created_time:'2020-04-01',status:1},
            {id:2,title:'重要任务2',user:'Adolph',start_time:'2020-04-12',created:'jmy',created_time:'2020-04-01',status:2},
            {id:4,title:'重要任务3',user:'Adolph',start_time:'2020-04-13',created:'jmy',created_time:'2020-04-01',status:3},
            {id:5,title:'重要任务4',user:'Adolph',start_time:'2020-04-20',created:'jmy',created_time:'2020-04-01',status:4},
            {id:6,title:'重要任务5',user:'Adolph',start_time:'2020-04-22',created:'jmy',created_time:'2020-04-01',status:5},
            {id:7,title:'重要任务6',user:'Adolph',start_time:'2020-04-22',created:'jmy',created_time:'2020-04-01',status:6},
        ]
    };}


    toDetail2 = () => {
      this.props.history.push({
        pathname:'/task/task-resolve/detail2'
      });
    }


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

  renderTaskStatusText(code){
    switch (code) {
    case 1:
      return (<Tag color="#a9a9a9">待提交</Tag>);
    case 2:
      return (<Tag color="#48d1cc">待接受</Tag>);
    case 3:
      return (<Tag color="#108ee9">执行中</Tag>);
    case 4:
      return (<Tag color="#ffd700">逾期</Tag>);
    case 5:
      return (<Tag color="#ff0000">已拒绝</Tag>);
    case 6:
      return (<Tag color="#87d068">已完成</Tag>);
    default:
      return null;
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
            getMockData={this.state.mockData}
            getFn={messageList}
            addPath={'/task/task-start/add'}
            columns={column}
            excelName={formatMessage({ id:"page.component.breadcrumb.message_manage", defaultMessage:"消息通知管理"})}
            dataMap={data => {
              data.forEach(d => {
                d.type_desc = d.m_type === 1 ? '文字' : '音频'
              });
            }}
          >
            </TablePage>   
        </div>
      </div>
    );
  }
}
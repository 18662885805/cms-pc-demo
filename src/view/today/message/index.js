import React from "react";
import { Link } from "react-router-dom";
import { Divider, Popconfirm, message, Tag } from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import{messageList,messageDelete} from "@apis/today/message";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import {inject, observer} from "mobx-react/index";
import moment from 'moment';
import {messageData} from '@utils/contractorList'

const _util = new CommonUtil();

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
          title: formatMessage(messages.title),
          dataIndex: "title",
          sorter: _util.sortString,
          render: (text, record) => {
            return <Link to={{
              pathname: "/today/message/detail",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{_util.getOrNullList(record.title)}</Link>;
          }
        },
        {
          title: formatMessage(messages.type),
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
      check: _util.check()
    };}
  onDeleteOne = id => {
    this.setState({ refresh: false });
    const project_id =  _util.getStorage('project_id');
    const { formatMessage } = this.props.intl;
    messageDelete(project_id, {id:id}).then(() => {
      message.success('删除成功');
      this.setState({ refresh: true });
    });
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  }
  render() {
    const { column, check, refresh } = this.state;
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
            addPath={canAdd && "/today/message/add"}
            excelName={formatMessage({ id:"page.component.breadcrumb.message_manage", defaultMessage:"消息通知管理"})}
            dataMap={data => {
              data.forEach(d => {
                d.type_desc = d.m_type === 1 ? '文字' : '音频'
              });
            }}
          />
        </div>
      </div>
    );
  }
}
import React from "react";
import { Link } from "react-router-dom";
import {
  Popconfirm,
  Divider,
  message, Tag
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { allrecord, allrecordDelete } from "@apis/workflow/allrecord";

import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import {inject, observer} from "mobx-react/index";
import moment from 'moment'
const _util = new CommonUtil();

const messages = defineMessages({
  typeName: {
    id: 'app.page.system.typeName',
    defaultMessage: '职务名称',
  },
  orgtype: {
    id: 'app.page.system.orgtype',
    defaultMessage: '组织类型',
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
          title: formatMessage(translation.No),   //序号
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return (index + 1);
          }
        },
          {
          title:'编号',    //职务名称
          dataIndex: "code",
          width: 160,
          maxWidth: 160,
          sorter: _util.sortString,
          render: (text, record) => {
            return <Link to={{
              pathname: "/workflow/allrecord/detail",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{_util.getOrNullList(record.code)}</Link>;
          }
        },
        // {
        //   title:'分类',    //职务名称
        //   dataIndex: "classification_name",
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(record)
        //   // render: (text, record) => {
        //   //   return <Link to={{
        //   //     pathname: "/system/work/type/detail",
        //   //     state: {
        //   //       id: record.id
        //   //     }
        //   //   }} onClick={this.setScrollTop}>{_util.getOrNullList(record.name)}</Link>;
        //   // }
        // },
        {
          title:'表单名',    //组织类型
          dataIndex: "form_name",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.created),  //创建人
          dataIndex: "created",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.created_time),  //创建时间
          dataIndex: "created_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.updated),  //上次修改人
          dataIndex: "updated",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.updated_time),  //修改时间
          dataIndex: "updated_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
           {
          title: '状态',  //修改时间
          dataIndex: "status_desc",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: (val, record) => {
            return <Tag color={_util.getColor(record.status)}>{record.status_desc}</Tag>;
          }
        },
        // {
        //   title: formatMessage(translation.operate),   //操作
        //   dataIndex: "operate",
        //   minWidth: 80,
        //   maxWidth: 110,
        //   render: (text, record, index) => {
        //     const id = record.id;
        //
        //     let path = `/workflow/classification/add/${id}`
        //     return (
        //       <div>
        //
        //         <Link to={path} onClick={this.setScrollTop}>
        //           <FormattedMessage id="global.revise" defaultMessage="修改"/>
        //         </Link>
        //         <Divider type="vertical"/>
        //         <Popconfirm placement="topRight"
        //           title={<p><FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/></p>}
        //           okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
        //           cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
        //           onConfirm={() => {
        //             this.onDeleteOne(id);
        //           }}>
        //           <a style={{color: "#f5222d"}}><FormattedMessage id="global.delete"
        //             defaultMessage="删除"/></a>
        //         </Popconfirm>
        //       </div>
        //     );
        //   }
        // }
      ],
      check: _util.check()
    };
  }
  onDeleteOne(id) {
    console.log(id);
    console.log(_util.getStorage('project_id'));

    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    classificationDelete(id, {project_id: _util.getStorage('project_id') }).then((res) => {
      message.success(formatMessage(translation.deleted));
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
    // let params = {project_id: _util.getStorage('project_id')}
    const bread = [
      {
        name: formatMessage({
          id: "menu.homepage",
          defaultMessage: "首页"
        }),
        url: "/"
      },
      {
        name: formatMessage({
          id: "page.system.workFlow.systemManage",
          defaultMessage: "工作流管理"
        })
      },
      {
        name: formatMessage({
          id: "page.component.workFlow.allRecord",
          defaultMessage: "所有工作流记录"
        }),
        url: "/workflow/allrecord"
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <TablePage
            // param={params}
            refresh={refresh}
            getFn={allrecord}
            columns={column}
            addPath={"/workflow/classification/add"}
            excelName={check(this, "excel") && '分类配置'}
            dataMap={data => {
              data.forEach((d,index) => {
                switch (d.status) {
                    case 1:d.status_desc='未操作';
                    break;
                    case 2:d.status_desc='待提交';
                    break;
                    case 3:d.status_desc='待审批';
                    break;
                    case 4:d.status_desc='审批通过';
                    break;
                    case 5:d.status_desc='审批未通过';
                    break;
                    case 6:d.status_desc='召回';
                    break;
                    case 7:d.status_desc='退回';
                    break;
                    case 8:d.status_desc='提交';
                    break;
                    case 9:d.status_desc='跳过';
                    break;
                    case 10:d.status_desc='已撤回';
                    break;
                    case 11:d.status_desc='发起人修改步骤参与人';
                    break;
                    case 12:d.status_desc='代理';
                    break;
                }
              });
            }}
          />
        </div>
      </div>
    );
  }
}
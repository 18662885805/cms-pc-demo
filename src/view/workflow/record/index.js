import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Popconfirm,
  Divider,
  message,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Tag,
  Table,
  Spin,
  Icon,
  Breadcrumb,
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {
  record,
  recordDelete,
  recordRecall,
  recordSub,
  recordAllFlowDetail,
} from "@apis/workflow/record";
import { waitStop, waitJump } from "@apis/workflow/wait";
import { recordAllFlow, recordDetail } from "@apis/workflow/record";
import TablePage from "@component/TablePage";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import translation from "../translation";
import { inject, observer } from "mobx-react/index";
import moment from "moment";
import FlowModal from "@component/flowModal";
import { Scrollbars } from "react-custom-scrollbars";
import styles from "../../document/workflow/index.module.css";
import VirtualTable from "@component/VirtualTable3";
const _util = new CommonUtil();
const confirm = Modal.confirm;
const { TextArea } = Input;
const {Search} = Input

const messages = defineMessages({
  typeName: {
    id: "app.page.system.typeName",
    defaultMessage: "职务名称",
  },
  orgtype: {
    id: "app.page.system.orgtype",
    defaultMessage: "组织类型",
  },
});

@inject("appState")
@observer
@injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      column: [
        {
          title: formatMessage(translation.No), //序号
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return index + 1;
          },
        },
          {
          title: "编号", //职务名称
          dataIndex: "code",
          sorter: _util.sortString,
          render: (text, record, index) => {
            return (
              <Link
                to={{
                  pathname: "/workflow/record/detail",
                  state: {
                    id: record.work_flow_id,
                    type: 3,
                    record_id: record.id,
                  },
                }}
                onClick={this.setScrollTop}
              >
                {text}
              </Link>
            )
          },
        },
        {
          title: "工作流类型", //职务名称
          dataIndex: "work_flow_name",
          sorter: _util.sortString,
          render: (record) => _util.getOrNullList(record),
        },
        {
          title: "标题", //组织类型
          dataIndex: "remarks",
          sorter: _util.sortString,
          render: (record) => _util.getOrNullList(record),
        },
        {
          title: "发起人", //创建人
          dataIndex: "created",
          sorter: _util.sortString,
          render: (record) => _util.getOrNullList(record),
        },
        {
          title: "发起时间", //创建时间
          dataIndex: "created_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: (record) => _util.getOrNullList(record),
        },
        {
          title: formatMessage(translation.updated), //上次修改人
          dataIndex: "updated",
          sorter: _util.sortString,
          render: (record) => _util.getOrNullList(record),
        },
        {
          title: formatMessage(translation.updated_time), //修改时间
          dataIndex: "updated_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: (record) => _util.getOrNullList(record),
        },
        {
          title: '当前审批人', 
          dataIndex: "now_approval",
          sorter: _util.sortString,
          render: (text, record, index) => {
            return <span>{_util.renderListToString(text,'name')}</span>
          }
        },
        {
          title: '审批截止日期', 
          dataIndex: "now_approval",
          sorter: _util.sortDate,
          render: (record) => {
            var current_day = moment( new Date() ).format('YYYY-MM-DD')
            var dead_day = record&&record.length ? (record[0]['dead_day'] ? record[0]['dead_day'] :'') :'';
            return <span style={{color:this.compareDate(current_day,dead_day) ? 'red' :''}}>{dead_day}</span>
          }
        },
        {
          title: '逾期天数', //修改时间
          dataIndex: "timeout",
          sorter: _util.sortString,
          render: (text, record, index) => {
            return <span>{text ? text : '0'}</span>
          }
        },
        {
          title: "状态", //修改时间
          dataIndex: "status_desc",
          sorter: _util.sortString,
          render: (val, record) => {
            return (
              <Tag color={_util.getColor(record.status)}>
                {record.status_desc}
              </Tag>
            );
          },
        },
        {
          title: formatMessage(translation.operate), //操作
          dataIndex: "operate",
          minWidth: 100,
          maxWidth: 100,
          render: (text, record, index) => {
            const id = record.id;
            const userdata = _util.getStorage('userdata')
            const user_id = userdata.user_id ?  userdata.user_id :''
            return record.status === 2 ? (//待提交
              <div>
                <Link
                  to={{
                    pathname: "/workflow/record/fill",
                    state: {
                      id: record.work_flow_id,
                      type: 2,
                      record_id: record.id,
                    },
                  }}
                  onClick={this.setScrollTop}
                >
                  <FormattedMessage id="global.revise" defaultMessage="修改" />
                </Link>
                <Divider type="vertical" />
                <Popconfirm
                  placement="topRight"
                  title={
                    <p>
                      <FormattedMessage
                        id="app.button.sureDel"
                        defaultMessage="确定删除？"
                      />
                    </p>
                  }
                  okText={
                    <FormattedMessage
                      id="app.button.ok"
                      defaultMessage="确认"
                    />
                  }
                  cancelText={
                    <FormattedMessage
                      id="app.button.cancel"
                      defaultMessage="取消"
                    />
                  }
                  onConfirm={() => {
                    this.onDeleteOne(id);
                  }}
                >
                  <a style={{ color: "#f5222d" }}>
                    <FormattedMessage
                      id="global.delete"
                      defaultMessage="删除"
                    />
                  </a>
                </Popconfirm>
              </div>
            ) : [5, 10].indexOf(record.status) > -1 ? (
              <div>
                <Link
                  to={{
                    pathname: "/workflow/record/fill",
                    state: {
                      id: record.work_flow_id,
                      type: 2,
                      record_id: record.id,
                    },
                  }}
                  onClick={this.setScrollTop}
                >
                  <FormattedMessage id="global.revise" defaultMessage="修改" />
                </Link>
              </div>
            ) : (record.status == 3 && record.created_id == user_id) ? <a onClick={() => this.showRecall(id)}>撤销</a> : '' ;
          },
        },
      ],
      check: _util.check(),
      subVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      selectedFlowRows: [],
      selectedFlowRowKeys: [],
      myAllFlow: [],
      flowVisible: false,
      type: undefined,
      param_id: undefined,
      steps: undefined,
      state: 2,
      remarks: "",
      selectedWorkflowKey:'',
      fileData: [],
      pagination: {
        pageSize: _util.getSession("pageSize")
          ? _util.getSession("pageSize")
          : _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: _util.getSession("currentPage")
          ? _util.getSession("currentPage")
          : 1,
      },
      tableLoading: false,
      filtering: false,
      recallVisiable:false,
      recall_id:'',
      recall_remarks:'',
      search: '',
    };
  }

  componentWillMount() {
    const {selectedWorkflowKey,search,pagination} = this.state;
    recordAllFlow({ project_id: _util.getStorage("project_id") }).then(
      (res) => {
        let allFlow = res.data;
        allFlow.unshift({ id: '', name: "全部类型" });
        this.setState({ myAllFlow: allFlow });
      }
    );
    if(_util.getStorage('workflow_record_key')){
      var id = _util.getStorage('workflow_record_key');
      var name = _util.getStorage('workflow_record_name');
      this.handeWorkflowInfo(id,name)
    }else{
      this.getInfo(selectedWorkflowKey,search,pagination);
    }
    
  }

  //比较日期大小
  compareDate = (date1,date2) => {
    //当前日期,期限日期
    if(date1&&date2){
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if(oDate1.getTime() > oDate2.getTime()){
        return true;
      } else {
        return false;
      }
    }else{
      return false
    }
    
  }

  hideRecall = () => {
    this.setState({recallVisiable:false,recall_id:''})
  }

  showRecall = (id) => {
    this.setState({recallVisiable:true,recall_id:id})
  }


  recallFlow = () => {
    this.setState({ refresh: false });
    const {recall_id,recall_remarks,selectedWorkflowKey,search,pagination} = this.state;
    var data = {
      project_id:_util.getStorage("project_id"),
      id:recall_id,
      remarks:recall_remarks
    }
    recordRecall(data).then(res => {
      this.hideRecall();
      this.getInfo(selectedWorkflowKey,search,pagination);
      this.setState({ refresh: true }); 
    })
  }

  onDeleteOne(id) {
    const {selectedWorkflowKey,search,pagination} = this.state;
    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    recordDelete(id, { project_id: _util.getStorage("project_id") }).then(
      (res) => {
        message.success(formatMessage(translation.deleted));
        this.getInfo(selectedWorkflowKey,search,pagination);
        //this.setState({ refresh: true });
      }
    );
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    console.log(scrollTopPosition);
    if (scrollTopPosition) {
      _util.setSession("scrollTop", scrollTopPosition);
    }
  };


  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  getInfo = (work_flow_id,new_search,new_pagination) => {
    const {pagination,search} = this.state;
    this.setState({fileData:[]})
    record({
      work_flow_id: work_flow_id,
      project_id: _util.getStorage("project_id"),
      page : new_pagination ? new_pagination.current : pagination.current,
      page_size : new_pagination ? new_pagination.pageSize : pagination.pageSize,
      search:new_search ? new_search :search
    }).then((res) => {
      if (res.data && res.data.results.length) {
        res.data.results.forEach((d, index) => {
          switch (d.status) {
            case 1:
              d.status_desc = "未操作";
              break;
            case 2:
              d.status_desc = "待提交";
              break;
            case 3:
              d.status_desc = "待审批";
              break;
            case 4:
              d.status_desc = "审批通过";
              break;
            case 5:
              d.status_desc = "审批未通过";
              break;
            case 6:
              d.status_desc = "召回";
              break;
            case 7:
              d.status_desc = "退回";
              break;
            case 8:
              d.status_desc = "提交";
              break;
            case 9:
              d.status_desc = "跳过";
              break;
            case 10:
              d.status_desc = "已撤回";
              break;
            case 11:
              d.status_desc = "发起人修改步骤参与人";
              break;
            case 12:
              d.status_desc = "代理";
              break;
          }
        });
        this.setState({
          fileData: res.data.results,
          recordShow: true,
        });
      }
      this.setState({ level_loading: false });
    });
  };

  handleToApproval = (modal_data) => {
    const { child_step_id, e_type, info, id, type, param_id,pagination,search,selectedWorkflowKey } = this.state;
    let data = {
      project_id: _util.getStorage("project_id"),
      id: param_id,
      cc: modal_data.cc,
      remarks: modal_data.remarks,
      source: JSON.stringify(_util.setSourceList(modal_data.fileList)),
    };

    const _this = this;

    if (type === "stop") {
      waitStop(data).then((res) => {
        if (res) {
          message.success("已撤回成功");
          this.getInfo(selectedWorkflowKey,search,pagination);
        }
      });
    } else if (type === "jump") {
      data.step_id = modal_data.step_id;
      waitJump(data).then((res) => {
        if (res) {
          message.success("跳过成功");
          this.getInfo(selectedWorkflowKey,search,pagination);
        }
      });
    }
    this.setState({ subVisible: false });
  };

  handleShowFlowModal = () => {
    const { selectedWorkflowKey } = this.state;
    if (selectedWorkflowKey) {
      this.setState({ flowVisible: true });
    } else {
      message.error("请先在左侧选择工作流类型");
    }
  };

  handleRemarkChange = (value, field) => {
    this.setState({ remarks: value });
  };

  submitFlowModal = (state) => {
    const {
      selectedFlowRows,
      selectedFlowRowKeys,
      remarks,
      selectedWorkflowKey,
    } = this.state;
    if (!_util.isNull(remarks)) {
      if (state === 2) {
        const params = { id: selectedWorkflowKey, type: 1, remarks: remarks };
        this.props.history.push({
          pathname: "/workflow/record/fill",
          state: params,
        });
        localStorage.setItem("workflow-record-fill-params", params);
      } else if (state === 1) {
        this.setState({ state: 2 });
      }
    } else {
      message.error("标题不能为空");
    }
  };

  hideFlowModal = () => {
    this.setState({ flowVisible: false });
  };

  handeWorkflowInfo = (id, name) => {
    _util.setStorage('workflow_record_key',id);
    _util.setStorage('workflow_record_name',name);
    const { selectedWorkflowKey, pagination,search} = this.state;
    if (selectedWorkflowKey === id) {
      return;
    }
    const { project_id } = this.state;
    this.setState({
      level_loading: true,
      workflowRecordList: [],
      selectedWorkflowKey: id,
      selectedWorkflowName: name,
      selectedRecordKey: "",
      selectedRecordName: "",
      fileData: [],
      subVisible:false
      // refresh: true,
    });
    this.getInfo(id,search,pagination);
  };

  handleTableChange = (pagination, filters = {}, sorter = {}) => {
    const {selectedWorkflowKey,search} = this.state;
    const pager = {...pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      fileData: []
    });
    this.getInfo(selectedWorkflowKey,search,pager);
  };


  handleRecallRemark = (val) => {
    this.setState({recall_remarks:val})
  }

   //搜索
   handleSearch = (value) => {
    const {selectedWorkflowKey,pagination} = this.state;
    _util.removeSession('scrollTop');
    this.setState({search:value})
    this.getInfo(selectedWorkflowKey,value,pagination);
  }

  
  //筛选
  doFilter = () => {
    const {column, filtering} = this.state
    if (!filtering) {
      column.forEach(c => {
        if (c.dataIndex !== 'operate' && c.dataIndex !== 'efm-index' && c.dataIndex !== 'operate1') {
          c.filter = true
        }
      })
      this.setState({column, filtering: true, reset: false})
    } else {
      column.forEach(c => {
        c.filter = false
      })
      this.setState({column, filtering: false, reset: true})
    }
  }

  render() {
    const {
      column,
      check,
      refresh,
      subVisible,
      myAllFlow,
      flowVisible,
      type,
      steps,
      state,
      selectedWorkflowKey,
      fileData,
      pagination,
      tableLoading,
      filtering,
      selectedRows,
    } = this.state;
    const { formatMessage } = this.props.intl;
    const bread = [
      {
        name: formatMessage({
          id: "menu.homepage",
          defaultMessage: "首页",
        }),
        url: "/",
      },
      {
        name: formatMessage({
          id: "page.system.workFlow.systemManage",
          defaultMessage: "工作流管理",
        }),
      },
      {
        name: formatMessage({
          id: "page.component.workFlow.record1",
          defaultMessage: "我的工作流",
        }),
        url: "/system/work/type",
      },
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
        this.setState({
          selectedFlowRows: selectedRows,
          selectedFlowRowKeys: selectedRowKeys,
        });
      },

      getCheckboxProps: (record) => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
        name: record.name,
      }),
    };

    const columns = [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "描述",
        dataIndex: "desc",
      },
    ];

    const canAdd =
      (_util.getStorage("is_project_admin") || this.state.check(this, "add")) &&
      selectedWorkflowKey;

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <div
            className="btn-group"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Breadcrumb
                className={styles.file_Breadcrumb}
                style={{ height: "32px" }}
              >
              </Breadcrumb>
            </div>

           
            <div>
              {canAdd ? (
                <Button
                  type="primary"
                  onClick={this.handleShowFlowModal}
                  style={{ marginRight: 8 }}
                >
                  新增
                </Button>
              ) : ''}
                
              <Button
                style={{
                  background: filtering ? '#87d068' : '#1890ff',
                  border: 0,
                  color: '#fff'
                }}
                onClick={this.doFilter}
              >
                <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选" />
              </Button>
              <Search
                placeholder={'全表搜索'}  //全表搜索
                onSearch={this.handleSearch}
                enterButton
                style={{width: '280px'}}
                />    
              </div>
          </div>

          <Row
            gutter={24}
            style={{
              height: "calc(100vh - 228px)",
              borderBottom: "1px solid rgb(232, 232, 232)",
            }}
          >
            {/* 一级目录区 */}
            <Col
              span={myAllFlow && myAllFlow.length ? 4 : 0}
              style={{ overflow: "hidden", padding: 0 }}
            >
              <Spin spinning={false}>
                <Scrollbars
                  style={{
                    height: "calc(100vh - 228px)",
                    borderRight: "1px solid rgb(232, 232, 232)",
                  }}
                >
                  <Fragment>
                    {myAllFlow &&
                      myAllFlow.map((d, index) => {
                        return (
                          <div
                            key={d.id}
                            className={styles.firstLevelItem}
                            style={{
                              background:
                                selectedWorkflowKey === d.id
                                  ? "rgba(0,0,0,0.08)"
                                  : "",
                            }}
                            onClick={() => this.handeWorkflowInfo(d.id, d.name)}
                          >
                            <div className={styles.firstLevelItemLeft}>
                              <Icon
                                type="tag"
                                theme={
                                  selectedWorkflowKey === d.id ? "twoTone" : ""
                                }
                                style={{ marginRight: "8px" }}
                              />
                              <span>{d.name}</span>
                            </div>
                          </div>
                        );
                      })}
                  </Fragment>
                </Scrollbars>
              </Spin>
            </Col>

            <Col span={20}>
              <VirtualTable
                refresh={refresh}
                columns={column}
                dataSource={fileData}
                onPaginationChange={this.handleTableChange}
                pagination={pagination}
                loading={tableLoading}
                onSelectChange={this.onSelectChange}
                filtering={this.state.filtering}
                selectedRows={selectedRows}
              />
            </Col>
          </Row>

          <Modal
            title={"新增工作流"}
            style={{ top: 20 }}
            visible={flowVisible}
            onOk={() => this.submitFlowModal(state)}
            onCancel={this.hideFlowModal}
            okText={"下一步"}
            cancelText={"取消"}
            destroyOnClose={true}
          >
            {state === 1 ? (
              <Table
                size="small"
                rowSelection={rowSelection}
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={myAllFlow}
              />
            ) : state === 2 ? (
              <Form {...formItemLayout}>
                <Form.Item label={"标题"} required={true}>
                  <Input
                    placeholder="请输入"
                    style={{ width: "100%" }}
                    onChange={(e) =>
                      this.handleRemarkChange(e.target.value, "remarks")
                    }
                  />
                </Form.Item>
              </Form>
            ) : null}
          </Modal>


          <Modal
            title={"撤销"}
            visible={this.state.recallVisiable}
            onOk={() => this.recallFlow()}
            onCancel={this.hideRecall}
            okText={"确认"}
            cancelText={"取消"}
            destroyOnClose={true}
          >
            <TextArea placeholder={'撤销备注'} onChange={(e) => this.handleRecallRemark(e.target.value)}></TextArea>
          </Modal>

          <FlowModal
            subVisible={subVisible}
            type={type}
            steps={steps}
            getModalData={this.handleToApproval}
          />
        </div>
      </div>
    );
  }
}

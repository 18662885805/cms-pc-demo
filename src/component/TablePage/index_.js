import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Row,
  Col,
  Modal,
  Tooltip
} from "antd";
import UserWrapper from "@component/user-wrapper";
import VirtualTable from "@component/VirtualTable3";
import { cloneDeep } from "lodash";
import CommonUtil from "@utils/common";
import {inject, observer} from "mobx-react/index";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";

const _util = new CommonUtil();
const { Search, TextArea } = Input;
const { confirm } = Modal;

const messages = defineMessages({
  select_enable_data: {
    id: "app.component.tablepage.select_enable_data",
    defaultMessage: "请选择要启用的数据!"
  },
  enabled: {
    id: "app.component.tablepage.enabled",
    defaultMessage: "已启用"
  },
  selected_data: {
    id: "app.component.tablepage.selected_data",
    defaultMessage: "请选择要提交的数据!"
  },
  select_approver: {
    id: "app.component.tablepage.select_approver",
    defaultMessage: "请选择审批人!"
  },
  approver: {
    id: "app.component.tablepage.approver",
    defaultMessage: "审批人"
  },
  submitted: {
    id: "app.component.tablepage.submitted",
    defaultMessage: "已提交"
  },
  withdraw_data: {
    id: "app.component.tablepage.withdraw_data",
    defaultMessage: "请选择要撤回的数据!"
  },
  haswithdraw: {
    id: "app.component.tablepage.haswithdraw",
    defaultMessage: "已撤回"
  },
  returnback_data: {
    id: "app.component.tablepage.returnback_data",
    defaultMessage: "请选择要退回的数据!"
  },
  hasreturn: {
    id: "app.component.tablepage.hasreturn",
    defaultMessage: "已退回"
  },
  select_disable_data: {
    id: "app.component.tablepage.select_disable_data",
    defaultMessage: "请选择要禁用的数据!"
  },
  disabled: {
    id: "app.component.tablepage.disabled",
    defaultMessage: "已禁用"
  },
  export_data: {
    id: "app.component.tablepage.export_data",
    defaultMessage: "请选择要导出的数据!"
  },
  full_table_search: {
    id: "app.component.tablepage.full_table_search",
    defaultMessage: "全表搜索"
  },
  okText: {
    id: "app.component.tablepage.okText",
    defaultMessage: "提交"
  },
  cancelText: {
    id: "app.component.tablepage.cancelText",
    defaultMessage: "取消"
  },
  search_approver: {
    id: "app.component.tablepage.search_approver",
    defaultMessage: "搜索审批人"
  },
  search_name_tel: {
    id: "app.component.tablepage.search_name_tel",
    defaultMessage: "根据姓名或者座机搜索审批人"
  },
  col_filter_tip: {
    id: "app.component.tablepage.col-filter-tip",
    defaultMessage: "筛选当前页"
  },
  confirmText:{
    id: "app.button.ok",
    defaultMessage: "确认"
  },
  disabled_confirm:{
    id: "page.training.disabled.confirm",
    defaultMessage: "禁用后将无法再次启用！"
  }
});

@inject("appState") @observer @injectIntl
class TablePage extends Component {
  state = {
    searchValue: "",
    pagination: {
      pageSize: _util.getSession("pageSize") ? _util.getSession("pageSize") : 200,
      showSizeChanger: true,
      pageSizeOptions: ["200", "1000", "3000"],
      current: _util.getSession("currentPage") ? _util.getSession("currentPage") : 1
    },
    selectedRowKeys: [],
    selectedRows: [],
    loading: false,
    data: [],
    copyColumns: cloneDeep(this.props.columns),
    submitPerson: [],
    defaultScrollTop: 0,
    clearScrollTop:false
  };
  componentDidMount() {
    const { tableData, scrollTop } = this.props.appState;
    const pathname = this.props.appState.getPathname();

    // if (typeof scrollTop[pathname] === 'number') {
    //   this.setState({ defaultScrollTop: scrollTop[pathname] })
    // }

    // if (tableData[pathname]) {
    //   this.setState({ data: tableData[pathname] })
    // } else {
    //   this.props.appState.clearTable()
    //   this.getList()
    // }
    this.getList();
  }
  componentDidUpdate(prevProps) {
    const { refresh: prevRefresh } = prevProps;
    const { refresh } = this.props;

    if (!prevRefresh && refresh) {
      this.getList();
    }
  }
  getList = params => {
    const { pagination, searchValue } = this.state;
    const { getFn, dataMap, dataFilter } = this.props;
    this.setState({loading: true, data: []});
    const values = {
      page : pagination.current,
      page_size : pagination.pageSize,
      ...params
    };
    if (searchValue) {
      values.search = searchValue;
    }
    getFn(values).then(res => {
      let { results, count } = res.data;

      if (results.results) {
        count = results.count;
        results = results.results;
      }

      if (results.data) {
        count = results.count;
        results = results.data;
      }

      pagination.total = count;

      const firstData = results[0];
      if (firstData && _util.getType(firstData.info) === "Object" && firstData.next) {
        results = results.map(r => {
          return {
            uid: r.id,
            ...r.info
          };
        });
      }

      if (typeof dataMap === "function") {
        dataMap(results);
      }

      if (typeof dataFilter === "function") {
        results = dataFilter(results);
      }

      this.setState({ data: results, pagination, loading: false });
      // this.props.appState.setTableData(results)
    });
  }
  doEnable = () => {
    const {formatMessage} = this.props.intl;
    const { selectedRowKeys } = this.state;
    this.setState({reset:false});

    if (selectedRowKeys.length === 0) {
      message.error(formatMessage(messages.select_enable_data)); //请选择要启用的数据!
      return;
    }

    this.props.enableFn({ ids: selectedRowKeys.join(",") }).then(() => {
      message.success(formatMessage(messages.enabled)); //已启用
      this.getList();
      this.setState({reset:true});
    });
  }
  handleSubmitVisible = show => {
    const {formatMessage} = this.props.intl;
    if (show) {
      const { selectedRowKeys } = this.state;

      if (selectedRowKeys.length <= 0) {
        message.error(formatMessage(messages.selected_data)); //请选择要提交的数据!
        return;
      }

      this.setState({
        submitVisible: true
      });
    } else {
      this.setState({
        submitVisible: false,
        submitPerson: []
      });
    }
  }
  handleSubmitPerson = value => {
    this.setState({ submitPerson: value });
  }
  doSubmit = () => {
    const {formatMessage} = this.props.intl;
    const { selectedRowKeys, submitPerson } = this.state;
    const { submitFn } = this.props;

    if (submitPerson.length <= 0) {
      message.error(formatMessage(messages.select_approver)); //请选择审批人!
      return;
    }

    const values = {
      user_data: JSON.stringify(submitPerson.map(p => {
        return {
          user_id: p.id,
          type: "person",
          type_name: formatMessage(messages.approver) //审批人
        };
      })),
      ids: selectedRowKeys.join(",")
    };

    submitFn(values).then(() => {
      message.success(formatMessage(messages.submitted)); //已提交
      this.setState({
        submitVisible: false,
        submitPerson: []
      });
      this.getList();
    });
  }
  handleWithDrawVisible = show => {
    const {formatMessage} = this.props.intl;
    if (show) {
      const { selectedRowKeys } = this.state;

      if (selectedRowKeys.length <= 0) {
        message.error(formatMessage(messages.withdraw_data)); //请选择要撤回的数据!
        return;
      }

      this.setState({
        withDrawVisible: true
      });
    } else {
      this.setState({
        withDrawVisible: false,
        withDrawRemark: ""
      });
    }
  }
  handleWithDrawRemark = e => {
    this.setState({
      withDrawRemark: e.target.value
    });
  }
  doWithdraw = () => {
    const {formatMessage} = this.props.intl;
    const { selectedRowKeys, withDrawRemark } = this.state;
    const { withdrawFn, withdrawFirst } = this.props;
    const values = {
      ids: selectedRowKeys.join(","),
      remarks: withDrawRemark
    };
    if (withdrawFirst) {
      values.is_first = 1;
    }

    withdrawFn(values).then(() => {
      message.success(formatMessage(messages.haswithdraw)); //已撤回
      this.setState({
        withDrawRemark: "",
        withDrawVisible: false
      });
      this.getList();
    });
  }
  handleBackVisible = show => {
    const {formatMessage} = this.props.intl;
    if (show) {
      const { selectedRowKeys } = this.state;

      if (selectedRowKeys.length <= 0) {
        message.error(formatMessage(messages.returnback_data)); //请选择要退回的数据!
        return;
      }

      this.setState({
        backVisible: true
      });
    } else {
      this.setState({
        backVisible: false,
        backRemark: ""
      });
    }
  }
  handleBackRemark = e => {
    this.setState({
      backRemark: e.target.value
    });
  }
  doBack = () => {
    const {formatMessage} = this.props.intl;
    const { selectedRows, backRemark } = this.state;
    const { backFn, backFirst } = this.props;
    const values = {
      ids: selectedRows.map(s => s.uid).join(","),
      remarks: backRemark
    };
    if (backFirst) {
      values.is_first = 1;
    }

    backFn(values).then(() => {
      message.success(formatMessage(messages.hasreturn)); //已退回
      this.setState({
        backRemark: "",
        backVisible: false
      });
      this.getList();
    });
  }
  doDisable = () => {
    const {formatMessage} = this.props.intl;
    const { selectedRowKeys } = this.state;
    this.setState({reset:false});
    if (selectedRowKeys.length === 0) {
      message.error(formatMessage(messages.select_disable_data)); //请选择要禁用的数据!
      return;
    }

    this.props.disableFn({ ids: selectedRowKeys.join(",") }).then(() => {
      message.success(formatMessage(messages.disabled)); //已禁用
      this.getList();
      // 已选择的数据清空
      this.setState({reset:true});
    });
  }

  doDisableWithConfirm = () => {
    const {formatMessage} = this.props.intl;
    const _this = this;
    confirm({
      title: formatMessage(messages.disabled_confirm),
      okText: formatMessage(messages.confirmText),
      cancelText: formatMessage(messages.cancelText),
      onOk() {
        _this.doDisable();
      },
      onCancel() {}
    });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
    const { onSelectChange } = this.props;
    if (typeof onSelectChange === "function") {
      onSelectChange(selectedRowKeys, selectedRows);
    }
  }
  onPaginationChange = pagination => {
    // this.props.appState.setPageSize(pagination.pageSize);
    // this.props.appState.setCurrentPage(pagination.current);
    // _util.setSession('pageSize', pagination.pageSize);
    // _util.setSession('currentPage', pagination.current);
    this.setState({ pagination }, () => {
      this.getList();
    });
  }
  doSearch = value => {
    this.setState({clearScrollTop:true});
    const { pagination } = this.state;
    pagination.current = 1;
    this.setState({ searchValue: value, pagination }, () => {
      this.getList();
    });
  }
  doExport = () => {
    console.log(this);
    const {formatMessage} = this.props.intl;
    const { excelName, columns } = this.props;
    // console.log(excelName);
    console.log(columns);

    const { selectedRows } = this.state;


    if (selectedRows.length === 0) {
      message.error(formatMessage(messages.export_data)); //请选择要导出的数据!
      return;
    }

    _util.exportExcel(selectedRows, columns, excelName);
  }
  doFilter = () => {
    const { copyColumns, filtering } = this.state;

    if (!filtering) {
      //不筛选==》筛选
      copyColumns.forEach(c => {
        if (c.dataIndex !== "operate" && c.dataIndex !== "efm-index" && c.dataIndex !== "operate1") {
          c.filter = true;
        }
      });
      this.setState({ copyColumns, filtering: true, reset: false });
    } else {
      //筛选==》不筛选
      copyColumns.forEach(c => {
        c.filter = false;
      });
      this.setState({ copyColumns, filtering: false, reset: true });
    }

    const { onFiltering } = this.props; //undefined
    if (typeof onFiltering === "function") {
      onFiltering(!filtering);
    }
  }
  getChild = (id) => {
    const { data } = this.state;
    const { expandFn } = this.props;

    this.setState({ refresh: false, loading: true });
    expandFn({
      id
    }).then(res => {
      const { results } = res.data;

      if (Array.isArray(results)) {
        let index = -1;

        data.forEach((d, dIndex) => {
          if (d.id === id) {
            index = dIndex;
          }
        });
        data[index].efmExpands = results;

        this.setState({
          data,
          refresh: true,
          loading: false
        });
      }
    });
  }
  onScroll = ({scrollTop}) => {
    this.props.appState.setScrollTop(scrollTop);
    if(scrollTop !== _util.getSession("scrollTop")){
      _util.removeSession("scrollTop");
    }
  }
  render() {
    const {
      addPath,
      enableFn,
      disableFn,
      disableFnWithConfirm,
      excelName,
      children,
      withdrawFn,
      backFn,
      submitFn,
      customSearch,
      expand,
      fatherComponentClearScrollTop
    } = this.props;
    const {
      copyColumns,
      data,
      pagination,
      refresh,
      loading,
      filtering,
      reset,
      withDrawVisible,
      withDrawRemark,
      backVisible,
      backRemark,
      submitVisible,
      defaultScrollTop,
      clearScrollTop
    } = this.state;

    const { formatMessage } = this.props.intl;

    return (
      <div>
        <div className="btn-group" style={{ overflow: "hidden" }}>
          {
            addPath
            &&
            <Link to={addPath}>
              <Button type="primary">
                <FormattedMessage
                  id="component.tablepage.add"
                  defaultMessage="新增" /></Button>
            </Link>
          }
          {
            enableFn
            &&
            <Button type="primary" onClick={this.doEnable}>
              <FormattedMessage
                id="component.tablepage.enable"
                defaultMessage="启用" /></Button>
          }
          {
            disableFn
            &&
            <Button type="primary" onClick={ disableFnWithConfirm ? this.doDisableWithConfirm : this.doDisable}>
              <FormattedMessage
                id="component.tablepage.disable"
                defaultMessage="禁用" />
            </Button>
          }
          {
            submitFn
            &&
            <Button type="primary" onClick={() => this.handleSubmitVisible(true)}><FormattedMessage id="app.component.tablepage.submit" defaultMessage="提交" /></Button>
          }
          {
            withdrawFn
            &&
            <Button type="primary" onClick={() => this.handleWithDrawVisible(true)}><FormattedMessage id="app.component.tablepage.withdraw" defaultMessage="撤回" /></Button>
          }
          {
            backFn
            &&
            <Button type="primary" onClick={() => this.handleBackVisible(true)}><FormattedMessage id="app.component.tablepage.returnback" defaultMessage="退回" /></Button>
          }
          {
            typeof children === "function"
              ? children(this.getList)
              : children
          }
          {
            excelName
            &&
            <Button type="primary" onClick={this.doExport}>
              <FormattedMessage
                id="component.tablepage.export"
                defaultMessage="导出" /></Button>
          }
          <Tooltip title={formatMessage(messages.col_filter_tip)}>
            <Button
              style={{
                background: filtering ? "#87d068" : "#1890ff",
                border: 0,
                color: "#fff"
              }}
              onClick={this.doFilter}
            >
              <FormattedMessage
                id="component.tablepage.col-filter"
                defaultMessage="列筛选" />
            </Button>
          </Tooltip>
          {
            customSearch
              ? typeof customSearch === "function"
                ? customSearch(this.getList)
                : customSearch
              : <Search
                disabled={filtering}
                placeholder={formatMessage(messages.full_table_search)} //全表搜索
                onSearch={this.doSearch}
                enterButton
                style={{ float: "right", width: "280px" }}
              />
          }
        </div>
        <VirtualTable
          columns={copyColumns}
          dataSource={data}
          onPaginationChange={this.onPaginationChange}
          onSelectChange={this.onSelectChange}
          pagination={pagination}
          loading={loading}
          reset={reset}
          refresh={refresh}
          expand={expand}
          expandFn={this.getChild}
          onScroll={this.onScroll}
          defaultScrollTop={defaultScrollTop}
          filtering={filtering}
          noAddIconFn={this.props.noAddIconFn}
          clearScrollTop={fatherComponentClearScrollTop ? (fatherComponentClearScrollTop === "Yes") : clearScrollTop}
        />
        {
          withdrawFn
          &&
          <Modal
            title={<FormattedMessage id="app.component.tablepage.withdraw_remark" defaultMessage="撤回备注" />}
            visible={withDrawVisible}
            onOk={this.doWithdraw}
            onCancel={() => this.handleWithDrawVisible()}
            okText={formatMessage(messages.okText)} //提交
            cancelText={formatMessage(messages.cancelText)} //取消
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
        }
        {
          backFn
          &&
          <Modal
            title={<FormattedMessage id="app.component.tablepage.returnback_remark" defaultMessage="退回备注" />}
            visible={backVisible}
            onOk={this.doBack}
            onCancel={() => this.handleBackVisible()}
            okText={formatMessage(messages.okText)} //提交
            cancelText={formatMessage(messages.cancelText)} //取消
          >
            <Row gutter={20}>
              <Col span={6} style={{ textAlign: "right" }}><FormattedMessage id="app.component.tablepage.remark" defaultMessage="备注" /></Col>
              <Col span={16}>
                <TextArea
                  onChange={this.handleBackRemark}
                  value={backRemark} />
              </Col>
            </Row>
          </Modal>
        }
        {
          submitFn
          &&
          <Modal
            title={<FormattedMessage id="app.component.tablepage.submit_to_approve" defaultMessage="提交审批" />}
            visible={submitVisible}
            onOk={this.doSubmit}
            onCancel={() => this.handleSubmitVisible()}
            okText={formatMessage(messages.okText)} //提交
            cancelText={formatMessage(messages.cancelText)} //取消
          >
            <UserWrapper
              modalTitle={formatMessage(messages.search_approver)} //搜索审批人
              searchPlaceholder={formatMessage(messages.search_name_tel)} //根据姓名或者座机搜索审批人
              getSelectedLists={this.handleSubmitPerson}
              auditUsers={this.state.submitPerson}
            />
          </Modal>
        }
      </div>
    );
  }
}

export default TablePage;
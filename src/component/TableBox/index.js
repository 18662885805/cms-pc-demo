import React, { Component } from "react";
import {Link} from "react-router-dom";
import {
  Table as AntTable,
  Button,
  Popconfirm,
  Input,
  message,
  Divider
} from "antd";
import CommonUtil from "@utils/common";
import {
  observer,
  inject
} from "mobx-react";
import tableDecorate from "@component/table-decorate";

const Search = Input.Search;
const _util = new CommonUtil();
const Table = tableDecorate(
  AntTable,
  {
    colDragable: true
  }
);

@inject("menuState") @observer
class TableBox extends Component {
    state = {
      searchValue: "",
      pagination: {
        pageSize: _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: 1
      },
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      data: []
    }

    getInfo = (params) => {
      this.onSelectChange([], []);
      this.setState({
        loading: true
      });
      this.props.getFn(params).then(res => {
        _util.getInfo(res, this);
      });
    }

    componentDidMount() {
      if (typeof this.props.getFn !== "function") {
        throw new Error("参数错误");
      }
      _util.fixTableHead();
      this.props.menuState.changeMenuCurrentUrl(this.props.location.pathname);
      this.getInfo({
        page_size: this.state.pagination.pageSize
      });
    }

    enabled = () => {
      const {selectedRowKeys, pagination} = this.state;
      const { enabledText } = this.props;
      if (selectedRowKeys && selectedRowKeys.length) {
        this.props.enabledFn({ids: selectedRowKeys.join(",")}).then((res) => {
          this.setState({
            searchValue: ""
          });
          message.success(enabledText ? `${enabledText}成功` : "启用成功");
          this.onSelectChange([], []);
          this.getInfo({
            results: pagination.pageSize,
            page: pagination.current
          });
        });
      } else {
        message.warning("请选择要提交的数据");
      }
    }

    disabled = () => {
      const {selectedRowKeys, pagination} = this.state;
      const { disabledText } = this.props;
      if (selectedRowKeys && selectedRowKeys.length) {
        this.props.disabledFn({ids: selectedRowKeys.join(",")}).then((res) => {
          this.setState({
            searchValue: ""
          });
          message.success(disabledText ? `${disabledText}成功` : "禁用成功");
          this.onSelectChange([], []);
          this.getInfo({
            results: pagination.pageSize,
            page: pagination.current
          });
        });
      } else {
        message.warning("请选择要提交的数据");
      }
    }

    exportExcel = (canExcel) => {
      const { selectedRows } = this.state;
      const { columns } = this.props;

      _util.exportExcel(selectedRows, columns, canExcel);
    }

    handleSearchValue = (e) => {
      this.setState({
        searchValue: e.target.value
      });
    }

    handleSearch = (value) => {
      _util.handleSearch(value, this);
    }

    handleTableChange = (pagination, filters, sorter) => {
      _util.handleTableChange(pagination, filters, sorter, this);
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
      const { rowSelectFn } = this.props;

      if (typeof rowSelectFn === "function") {
        rowSelectFn(selectedRowKeys, selectedRows);
      }

      this.setState({
        selectedRowKeys,
        selectedRows
      });
    }

    handleDelete = id => {
      this.props.deleteFn(id).then(res => {
        _util.onDeleteOne(res, this);
      });
    }

    componentDidUpdate(prevProps) {
      const prevRefresh = prevProps.refresh;
      const { refresh } = this.props;

      if (!prevRefresh && refresh) {
        this.getInfo({
          page_size: this.state.pagination.pageSize
        });
      }

    }

    expandedRowRender = () => {
      const { subColumn } = this.props;
      const { data } = this.state;

      const { number_data } = data[0];
      console.log(number_data);

      if (subColumn && number_data) {
        return (
          <Table
            columns={subColumn}
            dataSource={number_data ? number_data : null}
            pagination={false}
            rowKey={record => record.pers_no}
          />
        );
      }


    }

    render() {
      const {
        location,
        canAdd,
        canExcel,
        enabledFn,
        enabledText,
        disabledFn,
        disabledText,
        columns,
        deleteFn,
        canEdit,
        children,
        rowSelect
      } = this.props;
      const { pathname } = location;
      const {selectedRowKeys} = this.state;
      let rowSelection = null;

      if (!columns.some(column => column.key === "index")) {
        columns.unshift({
          title: "序号",
          width: "40px",
          key: "index",
          render: (text, record, index) => {
            return (index+1);
          }
        });
      }

      if (!columns.some(column => column.key === "operate") && (typeof deleteFn === "function" || canEdit)) {
        columns.push({
          title: "操作",
          key: "operate",
          render: (text, record, index) => {
            const path = {
              pathname: pathname + "/edit",
              state: {
                id: record.id
              }
            };

            return (
              <div>
                {
                  canEdit
                    ?
                    <Link to={path}>修改</Link>
                    :
                    null
                }
                {
                  canEdit && typeof deleteFn === "function" ? <Divider type='vertical' /> : null
                }
                {
                  typeof deleteFn === "function"
                    ?
                    <Popconfirm
                      title="确定删除？"
                      okText='确认'
                      cancelText='取消'
                      onConfirm={() => {
                        this.handleDelete(record.id);
                      }}>
                      <a style={{color: "#f5222d"}}>删除</a>
                    </Popconfirm>
                    :
                    null
                }
              </div>
            );
          }
        });
      }

      rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          disabled: record.disabled
        })
      };

      return (
        <div>
          <div className="btn-group" style={{overflow: "hidden"}}>
            {
              children ? children : null
            }
            {
              canAdd
                ?
                <Link to={pathname + "/add"}>
                  <Button type="primary">新增</Button>
                </Link>
                :
                null
            }
            {
              typeof enabledFn === "function"
                ?
                <Popconfirm title="确定启用？" okText='确认' cancelText='取消' onConfirm={this.enabled}>
                  <Button type="primary">{enabledText ? enabledText : "启用"}</Button>
                </Popconfirm>
                :
                null
            }
            {
              typeof disabledFn === "function"
                ?
                <Popconfirm title="确定禁用？" okText='确认' cancelText='取消' onConfirm={this.disabled}>
                  <Button type="primary">{disabledText ? disabledText : "禁用"}</Button>
                </Popconfirm>
                :
                null
            }
            {
              canExcel
                ?
                <Button type="primary" onClick={e => this.exportExcel(this.props.canExcel)}>导出</Button>
                :
                null
            }

            <Search
              placeholder="搜索"
              onSearch={this.handleSearch}
              enterButton
              style={{ float: "right", width: "300px" }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={Array.isArray(this.props.refreshData) ? this.props.refreshData : this.state.data}
            expandedRowRender={this.props.subColumn ? this.expandedRowRender : null}
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
            loading={this.state.loading}
            rowSelection={rowSelection}
            rowKey={record => record.id}
          />
        </div>
      );
    }
}

export default TableBox;
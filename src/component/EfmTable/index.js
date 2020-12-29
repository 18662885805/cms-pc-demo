import React, { Component } from "react";
import { Pagination, Spin } from "antd";
import { AgGridReact } from "ag-grid-react";
import { debounce } from "lodash";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import {
  user
} from "@apis/system/user";

class EfmTableHeader extends Component {
  render() {
    const { reactContainer } = this.props;
    console.log(this.props);
    return <a>1</a>;
  }
}
class EfmTableLoading extends Component {
  render() {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: "rgba(255, 255, 255, .5)"
        }}>
        <Spin style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}></Spin>
      </div>
    );
  }
}
class EfmTableNoRows extends Component {
  render() {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}>
        <span style={{
          position: "absolute",
          top: "50px",
          left: "50%",
          transform: "translate(-50%, 0)",
          color: "rgba(0,0,0,.45)",
          fontSize: 14
        }}>
            暂无数据
        </span>
      </div>
    );
  }
}
class EfmTableCell extends Component {
  render() {
    const { value, data, colDef, rowIndex } = this.props;
    console.log(value);
    console.log(data);
    console.log(colDef);
    if (typeof colDef.originRender === "function" && data) {
      return <div
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
          wordWrap: "break-word",
          overflow: "hidden"
        }}>
        {colDef.originRender(value, data, rowIndex)}
      </div>;
    }
    return <div>{value}</div>;
  }
}

export default class EfmTable extends Component {
  componentDidMount() {
    console.log(this.props.dataSource);
  }
  onGridReady = params => {
    console.log(this.props.dataSource);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.hideOverlay();
    // window.addEventListener('resize', () => {
    //   setTimeout(() => {params.api.sizeColumnsToFit()}, 0)
    // })
    params.api.sizeColumnsToFit();
    params.api.resetRowHeights();

    // const updateData = data => {
    //   console.log(data)
    //   let dataSource = {
    //     rowCount: null,
    //     getRows: function(params) {
    //       console.log("asking for " + params.startRow + " to " + params.endRow);
    //       setTimeout(function() {
    //         var rowsThisPage = data.slice(params.startRow, params.endRow);
    //         var lastRow = -1;
    //         if (data.length <= params.endRow) {
    //           lastRow = data.length;
    //         }
    //         params.successCallback(rowsThisPage, lastRow);
    //       }, 500);
    //     }
    //   };
    //   params.api.setDatasource(dataSource);
    // }
    // user({
    //   page_size: 200
    // }).then(res => {
    //   const { results } = res.data
    //   updateData(results)
    // })

  }
  onColumnResized = event => {
    if (event.finished) {
      this.gridApi.resetRowHeights();
    }
  }
  onFirstDataRendered = params => {
    params.api.sizeColumnsToFit();
  }
  onSelectionChanged = event => {
    const { rowSelection } = this.props;
    const nodes = event.api.getSelectedNodes();

    if (rowSelection && typeof rowSelection.onChange === "function") {
      rowSelection.onChange(nodes.map(n => n.data && n.data.id), nodes.map(n => n.data));
    }
  }
  onShowSizeChange = (current, pageSize) => {
    const { onChange, pagination } = this.props;
    pagination.pageSize = pageSize;
    pagination.current = current;

    if (typeof onChange === "function") {
      onChange(pagination, {}, {});
    }
  }
  handlePage = (page, pageSize) => {
    const { onChange, pagination } = this.props;
    pagination.pageSize = pageSize;
    pagination.current = page;

    if (typeof onChange === "function") {
      onChange(pagination, {}, {});
    }
  }
  render() {
    const { columns, dataSource, pagination, loading } = this.props;

    const columnDefs = [];
    columns.forEach(c => {
      const obj = {};
      const { render, title, dataIndex, width } = c;
      if (title === "序号") {
        obj.headerCheckboxSelection = true;
        obj.checkboxSelection = true;
      }
      if (width) {
        obj.width = parseInt(width);
      }
      obj.originRender = render;
      obj.headerName = title;
      obj.field = dataIndex;
      obj.cellRenderer = "efmtablecell";
      obj.autoHeight = true;
      obj.cellStyle = {
        paddingTop: "7px",
        paddingBottom: "7px",
        fontSize: "14px",
        color: "rgba(0, 0, 0, 0.65)",
        border: 0
      };

      columnDefs.push(obj);
    });

    return (
      <div className='efmtable' style={{position: "relative"}}>
        {
          loading
            ? <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              }}>
              <Spin style={{
                position: "absolute",
                top: "50px",
                left: "50%",
                transform: "translate(-50%, 0)",
                color: "rgba(0,0,0,.45)",
                fontSize: 14
              }} />
            </div>
            : null
        }
        <div
          className='ag-theme-balham'
          style={{height: "calc(100vh - 280px)"}}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={dataSource}
            onGridReady={this.onGridReady}
            onColumnResized={this.onColumnResized}
            rowSelection='multiple' //表格选择行
            // enableColResize={true}    //表格列拖动
            enableSorting={true} //表格排序
            // onFirstDataRendered={this.onFirstDataRendered}
            frameworkComponents={{
              efmtablecell: EfmTableCell,
              // efmtableloading: EfmTableLoading,
              efmtablenorows: EfmTableNoRows
            // agColumnHeader: EfmTableHeader
            }}
            // loadingOverlayComponent='efmtableloading'
            noRowsOverlayComponent='efmtablenorows'
            rowStyle={{
              borderBottomColor: "#e8e8e8"
            }}
            // suppressColumnVirtualisation={true}
            onSelectionChanged={this.onSelectionChanged}
            suppressAnimationFrame={true}
            // rowBuffer={0}
            // rowModelType='infinite'
            cacheBlockSize={30}
            // datasource={test}
            debug={false}
          >

          </AgGridReact>

        </div>
        <div style={{overflow: "hidden"}}>
          <Pagination
            {...pagination}
            style={{marginTop: 15, float: "right"}}
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.handlePage} />
        </div>
      </div>

    );
  }
}
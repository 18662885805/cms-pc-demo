import React, { Component } from "react";
import { Column, Table, AutoSizer, ColumnSizer, List } from "react-virtualized";
import { Pagination, Spin, Checkbox, Icon, Select, Button, Input, message, DatePicker } from "antd";
import { isEqual } from "lodash";
import styles from "./index.module.css";
import { uniq, cloneDeep } from "lodash";
import moment from "moment";

const { Option } = Select;

class VirtualTable extends Component {
  state = {
    filterIndex: -1,
    filters: {},
    sorts: {},
    searchs: {},
    ranges: {},
    rangesDate: {},
    selectOption: {},
    ops: {},
    filterSelected: [],
    processData: cloneDeep(this.props.dataSource)
  }
  resetConfig = () => {
    this.setState({
      filterIndex: -1,
      filters: {},
      sorts: {},
      searchs: {},
      ranges: {},
      rangesDate: {},
      ops: {},
      selectOption: {},
      filterSelected: [],
      processData: cloneDeep(this.props.dataSource)
    });
  }
  componentDidUpdate(prevProps) {
    const { dataSource: prevDataSource, reset: prevReset } = prevProps;
    const { dataSource, reset } = this.props;

    if (!prevReset && reset) {
      this.resetConfig();
    }
    if (!isEqual(dataSource, prevDataSource)) {
      this.setState({
        processData: cloneDeep(dataSource)
      });
    }
  }
  onShowSizeChange = (current, pageSize) => {
    const { onChange, pagination } = this.props;
    pagination.pageSize = pageSize;
    pagination.current = current;

    this.resetConfig();

    if (typeof onChange === "function") {
      onChange(pagination, {}, {});
    }
  }
  handlePage = (page, pageSize) => {
    const { onChange, pagination } = this.props;
    pagination.pageSize = pageSize;
    pagination.current = page;

    this.resetConfig();

    if (typeof onChange === "function") {
      onChange(pagination, {}, {});
    }
  }
  updateRowSelect = () => { //更新所选项目
    const { processData } = this.state;
    const { rowSelection } = this.props;

    if (rowSelection && rowSelection.onChange) {
      const selectedRow = processData.filter(d => d.rowSelected);
      const selectedRowKeys = selectedRow.map(s => s.id);
      rowSelection.onChange(selectedRowKeys, selectedRow);
    }

  }
  selectAll = () => { //全选
    const { processData } = this.state;

    if (!processData.every(d => d.rowSelected)) {
      processData.forEach(d => {
        d.rowSelected = true;
      });
    } else {
      processData.forEach(d => {
        d.rowSelected = false;
      });
    }
    this.updateRowSelect();
  }
  selectOne = (checked, data) => { //单选
    if (checked) {
      data.rowSelected = true;
    } else {
      data.rowSelected = false;
    }
    this.updateRowSelect();
  }
  updateData = () => { //更新数据
    const { filters, sorts, searchs, ranges, rangesDate } = this.state;
    let { dataSource, columns } = this.props;
    const { field, type } = sorts;

    if (field && type) {
      const sortCol = columns.filter(c => c.dataIndex === field)[0];

      if (sortCol) {
        dataSource = dataSource.sort((a, b) => sortCol.sorter(a[field], b[field]));

        if (type === "desc") {
          dataSource = dataSource.reverse();
        }
      }
    }

    dataSource = dataSource.filter(d => {
      return Object.keys(searchs).every(k => {
        if (searchs[k]) {
          if (typeof d[k] === "string" && d[k].toLowerCase().indexOf(searchs[k].toLowerCase()) > -1) return true;
          if (Array.isArray(d[k])) {
            for (let i = 0, len = d[k].length; i < len; i++) {
              if (d[k][i].toLowerCase().indexOf(searchs[k].toLowerCase()) > -1) {
                return true;
              }
            }
          }
        } else {
          return true;
        }
      });
    });

    dataSource = dataSource.filter(d => {
      return Object.keys(filters).every(k => {
        if (filters[k].length > 0) {
          if (typeof d[k] === "string" && filters[k].indexOf(d[k]) > -1) return true;
          if (Array.isArray(d[k])) {
            for (let i = 0, len = d[k].length; i < len; i++) {
              if (filters[k].indexOf(d[k][i]) > -1) {
                return true;
              }
            }
          }
        } else {
          return true;
        }
      });
    });

    if (Object.keys(ranges).every(k => ranges[k].every(r => r.operate && r.value))) {
      dataSource = dataSource.filter(d => {
        return Object.keys(ranges).every(k => {
          if (ranges[k].length === 1) {
            const { operate, value } = ranges[k][0];
            if (operate === "lt" && d[k] < value) return true;
            if (operate === "lte" && d[k] <= value) return true;
            if (operate === "gt" && d[k] > value) return true;
            if (operate === "gte" && d[k] >= value) return true;
          } else if (ranges[k].length === 2) {
            const operates = ranges[k].map(r => r.operate);
            const values = ranges[k].map(r => r.value);
            const firstOperate = operates[0];
            const secondOperate = operates[1];
            const fValue = values[0];
            const sValue = values[1];

            let ltlt = fValue < sValue && ["lt", "lte"].indexOf(firstOperate) > -1 && ["gt", "gte"].indexOf(secondOperate) > -1;
            let gtgt = fValue > sValue && ["gt", "gte"].indexOf(firstOperate) > -1 && ["lt", "lte"].indexOf(secondOperate) > -1;

            if (ltlt || gtgt) { //小于小的，大于大的，去或
              return ranges[k].some(r => {
                const { operate, value } = r;
                if (operate === "lt" && d[k] < value) return true;
                if (operate === "lte" && d[k] <= value) return true;
                if (operate === "gt" && d[k] > value) return true;
                if (operate === "gte" && d[k] >= value) return true;
              });
            } else { //其余取与
              return ranges[k].every(r => {
                const { operate, value } = r;
                if (operate === "lt" && d[k] < value) return true;
                if (operate === "lte" && d[k] <= value) return true;
                if (operate === "gt" && d[k] > value) return true;
                if (operate === "gte" && d[k] >= value) return true;
              });
            }

          }
        });
      });
    }

    if (Object.keys(rangesDate).every(k => rangesDate[k].every(r => r.operate && r.value))) {
      dataSource = dataSource.filter(d => {
        return Object.keys(rangesDate).every(k => {
          if (rangesDate[k].length === 1) {
            const { operate, value } = rangesDate[k][0];
            if (operate === "lt" && moment(d[k]).isBefore(value)) return true;
            if (operate === "lte" && (moment(d[k]).isBefore(value) || moment(d[k]).isSame(value)) ) return true;
            if (operate === "gt" && moment(d[k]).isAfter(value)) return true;
            if (operate === "gte" && (moment(d[k]).isAfter(value) || moment(d[k]).isSame(value))) return true;
          } else if (rangesDate[k].length === 2) {
            const operates = rangesDate[k].map(r => r.operate);
            const values = rangesDate[k].map(r => r.value);
            const firstOperate = operates[0];
            const secondOperate = operates[1];
            const fValue = values[0];
            const sValue = values[1];

            let ltlt = moment(fValue).isBefore(moment(sValue)) && ["lt", "lte"].indexOf(firstOperate) > -1 && ["gt", "gte"].indexOf(secondOperate) > -1;
            let gtgt = moment(fValue).isAfter(moment(sValue)) && ["gt", "gte"].indexOf(firstOperate) > -1 && ["lt", "lte"].indexOf(secondOperate) > -1;

            if (ltlt || gtgt) { //小于小的，大于大的，去或
              return rangesDate[k].some(r => {
                const { operate, value } = r;
                if (operate === "lt" && moment(d[k]).isBefore(value)) return true;
                if (operate === "lte" && (moment(d[k]).isBefore(value) || moment(d[k]).isSame(value)) ) return true;
                if (operate === "gt" && moment(d[k]).isAfter(value)) return true;
                if (operate === "gte" && (moment(d[k]).isAfter(value) || moment(d[k]).isSame(value))) return true;
              });
            } else { //其余取与
              return rangesDate[k].every(r => {
                const { operate, value } = r;
                if (operate === "lt" && moment(d[k]).isBefore(value)) return true;
                if (operate === "lte" && (moment(d[k]).isBefore(value) || moment(d[k]).isSame(value)) ) return true;
                if (operate === "gt" && moment(d[k]).isAfter(value)) return true;
                if (operate === "gte" && (moment(d[k]).isAfter(value) || moment(d[k]).isSame(value))) return true;
              });
            }

          }
        });
      });
    }

    this.setState({ processData: dataSource });
    this.updateRowSelect();
  }
  doSort = (c, sortType) => { //排序
    const { sorts } = this.state;
    const { field, type } = sorts;

    if (field === c.dataIndex) {
      if (type === sortType) {
        sorts.type = "";
      } else {
        sorts.type = sortType;
      }
    } else {
      sorts.field = c.dataIndex;
      sorts.type = sortType;
    }

    if (c.sorter && typeof c.sorter !== "function") {
      const { onChange, pagination } = this.props;

      if (typeof onChange === "function") {
        if (sorts.field && sorts.type) {
          onChange(pagination, {}, {
            order: sorts.type === "asc" ? "ascend" : "",
            field: c.dataIndex
          });
        } else {
          onChange(pagination, {}, {});
        }
      }
    } else if (c.sorter && typeof c.sorter === "function") {
      this.setState({ sorts }, () => {
        this.updateData();
      });
    }
  }
  renderSelect = (c) => { //渲染选项
    const { filters, rangesDate, ranges } = this.state;
    if (c.filterType === "range") {
      ranges[c.dataIndex] = [
        {
          operate: undefined,
          value: ""
        }
      ];
      this.setState({ ranges });
    } else if (c.filterType === "search") {

    } else if (c.filterType === "range-date") {
      rangesDate[c.dataIndex] = [{
        operate: undefined,
        value: null
      }];
    } else {
      filters[c.dataIndex] = [];
      this.setState({ filters });
    }

    let { dataSource } = this.props;
    let temp = [];
    dataSource.forEach(d => {
      if (Array.isArray(d[c.dataIndex])) {
        temp = [...temp, ...d[c.dataIndex]];
      }
      if (typeof d[c.dataIndex] === "string") {
        temp = [...temp, d[c.dataIndex]];
      }

    });
    temp = uniq(temp);
    temp = temp.filter(t => {
      if (t || t === 0) return true;
    });
    const { selectOption } = this.state;
    selectOption[c.dataIndex] = temp;
    console.log(selectOption);
    this.setState({ selectOption });
  }

  doFilter = (index, c) => {
    const { filterIndex, filterSelected } = this.state;

    if (filterIndex === index) {
      this.setState({ filterIndex: -1 });
    } else {
      this.setState({ filterIndex: index });
    }
    let idx = filterSelected.indexOf(index);
    if (idx > -1) {
      return;
    } else {
      this.renderSelect(c);
      filterSelected.push(index);
      this.setState(filterSelected);
    }
  }
  handleInput = (e, field) => { // 搜索框变化
    const { searchs } = this.state;

    if (e.target.value) {
      searchs[field] = e.target.value;
    } else {
      searchs[field] = "";
    }
    this.setState({ searchs });
    this.updateData();
  }
  clearInput = field => {
    const { searchs } = this.state;

    searchs[field] = "";
    this.setState({ searchs });
    this.updateData();
  }
  filterSelect = (e, name, field) => { //选项改变状态
    let { filters } = this.state;

    const fieldsArr = filters[field];
    const index = fieldsArr.indexOf(name);

    if (e.target.checked && index < 0) {
      fieldsArr.push(name);
    } else if (!e.target.checked && index > -1) {
      fieldsArr.splice(index, 1);
    }

    filters[field] = fieldsArr;
    this.setState({ filters });
    this.updateData();
  }
  filterSelectAll = (e, field, temp) => { //筛选选项全选
    let { filters } = this.state;
    let fieldsArr = filters[field];

    if (e.target.checked) {
      fieldsArr = temp;
    } else {
      fieldsArr = [];
    }
    filters[field] = fieldsArr;
    this.setState({ filters }, () => {this.updateData();});
  }
  removeFilter = field => {
    const { filters, ops } = this.state;

    filters[field] = [];
    ops[field] = "";
    this.setState({ filters, ops });
    this.updateData();
  }
  addRange = field => {
    const { ranges } = this.state;

    ranges[field].push({
      operate: undefined,
      value: ""
    });
    this.setState({ ranges });
  }
  removeRange = (field, index) => {
    const { ranges } = this.state;

    ranges[field].splice(index, 1);
    this.setState({ ranges });
  }
  addRangeDate = field => {
    const { rangesDate } = this.state;

    rangesDate[field].push({
      operate: undefined,
      value: ""
    });
    this.setState({ rangesDate });
  }
  removeRangeDate = (field, index) => {
    const { rangesDate } = this.state;

    rangesDate[field].splice(index, 1);
    this.setState({ rangesDate });
  }
  clearRange = field => {
    const { ranges } = this.state;
    ranges[field] = [{
      operate: undefined,
      value: ""
    }];
    this.setState({ ranges });
    this.updateData();
  }
  clearRangeDate = field => {
    const { rangesDate } = this.state;
    rangesDate[field] = [{
      operate: undefined,
      value: ""
    }];
    this.setState({ rangesDate });
    this.updateData();
  }
  handleSelectRange = (field, value, index) => {
    const { ranges } = this.state;

    ranges[field][index].operate = value;
    this.setState({ ranges });
  }
  handleSelectRangeDate = (field, value, index) => {
    const { rangesDate } = this.state;

    rangesDate[field][index].operate = value;
    this.setState({ rangesDate });
  }
  handleInputRange = (field, e, index) => {
    const { ranges } = this.state;
    if (e.target.value) {
      ranges[field][index].value = e.target.value;
    } else {
      ranges[field][index].value = "";
    }
    this.setState({ ranges });
  }
  handleInputRangeDate = (field, value, index) => {
    const { rangesDate } = this.state;
    if (value) {
      rangesDate[field][index].value = moment(value).format("YYYY-MM-DD");
    } else {
      rangesDate[field][index].value = null;
    }
    this.setState({ rangesDate });
  }
  updateDataWithRange = () => {
    const { ranges } = this.state;
    const keys = Object.keys(ranges);

    for (let i = 0, len = keys.length; i < len; i++) {
      if (ranges[keys[i]].some(r => !r.operate || !r.value)) {
        message.error("请填写完整筛选条件!");
        return false;
      }
    }
    this.updateData();
  }
  updateDataWithRangeDate = () => {
    const { rangesDate } = this.state;
    const keys = Object.keys(rangesDate);

    for (let i = 0, len = keys.length; i < len; i++) {
      if (rangesDate[keys[i]].some(r => !r.operate || !r.value)) {
        message.error("请填写完整筛选条件!");
        return false;
      }
    }
    this.updateData();
  }
  handleSelectOptions = (e, field) => {
    const { ops } = this.state;
    if (e.target.value) {
      ops[field] = e.target.value;
    } else {
      ops[field] = "";
    }
    this.setState({ ops });
  }

  render () {
    const { columns, pagination, loading } = this.props;
    const { selectOption, filters, processData, sorts, searchs, ranges, ops, rangesDate } = this.state;

    return (
      <div style={{position: "relative"}} className={styles.efmHeader}>
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

        <div style={{overflow: "hidden"}}>
          <AutoSizer style={{height: "calc(100vh - 280px)", width: "100%"}}>
            {
              ({ width, height }) => {

                return (
                  <ColumnSizer
                    width={width}
                    columnCount={1}
                  >
                    {
                      ({ adjustedWidth, getColumnWidth, registerChild }) => {

                        return (
                          <Table
                            headerStyle={{
                              background: "#fafafa",
                              margin: 0,
                              color: "rgba(0, 0, 0, 0.85)",
                              fontWeight: "500",
                              border: "1px solid #fff",
                              lineHeight: "36px",
                              height: "36px"
                            }}
                            rowClassName={styles.RowStyle}
                            width={width}
                            height={height}
                            headerHeight={36}
                            rowHeight={35}
                            rowCount={processData.length}
                            rowGetter={({ index }) => processData[index]}
                            noRowsRenderer={() => {
                              return <div style={{
                                color: "rgba(0,0,0,.45)",
                                fontSize: 14,
                                textAlign: "center",
                                marginTop: 20
                              }}>暂无数据</div>;
                            }}
                            // rowRenderer={({columns, key, style, className, index}) => {
                            //   const a11yProps = {'aria-rowindex': index + 1}

                          //   return <div
                          //   key={key}
                          //   className={className}
                          //   role="row"
                          //   style={{
                          //     ...style,
                          //   }}>
                          //   {columns}
                          //   </div>
                          // }}
                          >
                            <Column
                              style={{marginLeft: 0, marginRight: 0}}
                              label={<Checkbox
                                onChange={this.selectAll}
                                indeterminate={!processData.every(d => d.rowSelected) && !processData.every(d => !d.rowSelected)}
                                checked={processData.length > 0 && processData.every(d => d.rowSelected)} />}
                              dataKey='user-check'
                              width={adjustedWidth}
                              maxWidth={30}
                              cellRenderer={p => {
                                const { rowData } = p;
                                return <Checkbox
                                  onChange={e => this.selectOne(e.target.checked, rowData)}
                                  checked={rowData.rowSelected}
                                />;
                              }} />
                            {
                              columns.map((c, cIndex) => {
                                return (
                                  <Column
                                    style={{marginLeft: 0, marginRight: 0}}
                                    key={c.dataIndex}
                                    label={c.title}
                                    dataKey={c.dataIndex}
                                    width={adjustedWidth}
                                    minWidth={c.minWidth}
                                    maxWidth={c.maxWidth}
                                    headerRenderer={
                                      p => {
                                        const { label } = p;

                                        let selectOpts = [];

                                        if (Array.isArray(selectOption[c.dataIndex]) && selectOption[c.dataIndex].length > 0) {
                                          selectOpts = selectOption[c.dataIndex].filter(s => {
                                            if (ops[c.dataIndex] && s.toLowerCase().indexOf(ops[c.dataIndex].toLowerCase()) > -1) {
                                              return true;
                                            } else if (!ops[c.dataIndex]) {
                                              return true;
                                            }
                                          });
                                        }

                                        return <div className={styles.headerItem} style={{
                                          paddingRight: c.sorter && c.filter
                                            ? "36px"
                                            : (c.sorter && !c.filter) || (!c.sorter && c.filter)
                                              ? "18px"
                                              : 0
                                        }}>
                                          <div
                                            className={styles.headerFilter}
                                            style={{
                                              display: c.filter && cIndex === this.state.filterIndex ? "block" : "none",
                                              left: cIndex === 0 || cIndex === 1 || cIndex === 2 ? 0 : "auto",
                                              width: c.filterType === "range"
                                                ? 220
                                                : c.filterType === "range-date"
                                                  ? 250
                                                  : 170
                                            }}>
                                            {
                                              c.filterType === "search"
                                                ? <div>
                                                  <Input placeholder='输入搜索' style={{
                                                    width: "100%",
                                                    height: 30,
                                                    border: "1px solid #e8e8e8",
                                                    borderRadius: 2,
                                                    padding: "0 5px",
                                                    fontSize: 14
                                                  }} onChange={e => this.handleInput(e, c.dataIndex)}
                                                  value={searchs[c.dataIndex]} />
                                                </div>
                                                : null
                                            }
                                            {
                                              c.filterType === "range"
                                                ? <div>

                                                  {
                                                    Array.isArray(ranges[c.dataIndex])
                                                      ? ranges[c.dataIndex].map((r, rIndex) => {
                                                        return <div key={rIndex}>
                                                          <Select
                                                            style={{width: 70, height: 30}}
                                                            placeholder='选择'
                                                            value={r.operate}
                                                            onChange={value => this.handleSelectRange(c.dataIndex, value, rIndex)}
                                                            showArrow={false}
                                                            allowClear>
                                                            <Option value='gt'>{">"}</Option>
                                                            <Option value='gte'>{">="}</Option>
                                                            <Option value='lt'>{"<"}</Option>
                                                            <Option value='lte'>{"<="}</Option>
                                                          </Select>
                                                          <Input
                                                            style={{width: 80, height: 30, marginLeft: 8, border: "1px solid #e8e8e8"}}
                                                            placeholder='输入'
                                                            value={r.value}
                                                            onChange={e => this.handleInputRange(c.dataIndex, e, rIndex)} />
                                                          {
                                                            ranges[c.dataIndex].length > 1
                                                              ? <span style={{
                                                                display: "inline-block",
                                                                width: 30,
                                                                marginLeft: 8,
                                                                textAlign: "center",
                                                                height: 30,
                                                                lineHeight: "30px",
                                                                color: "red",
                                                                cursor: "pointer"
                                                              }} onClick={e => this.removeRange(c.dataIndex, rIndex)}>×</span>
                                                              : null
                                                          }
                                                        </div>;
                                                      })
                                                      : null
                                                  }
                                                  {
                                                    Array.isArray(ranges[c.dataIndex]) && ranges[c.dataIndex].length < 2
                                                      ? <Button
                                                        type='dashed'
                                                        style={{display: "block", width: "100%"}}
                                                        onClick={e => this.addRange(c.dataIndex)}>新增</Button>
                                                      : null
                                                  }
                                                  <Button
                                                    type='primary'
                                                    onClick={this.updateDataWithRange}
                                                    style={{width: "100%"}}>确定</Button>
                                                </div>
                                                : null
                                            }
                                            {
                                              c.filterType === "range-date"
                                                ? <div>
                                                  {
                                                    Array.isArray(rangesDate[c.dataIndex])
                                                      ? rangesDate[c.dataIndex].map((r, rIndex) => {
                                                        return <div key={rIndex}>
                                                          <Select
                                                            style={{width: 70, height: 30}}
                                                            placeholder='选择'
                                                            value={r.operate}
                                                            onChange={value => this.handleSelectRangeDate(c.dataIndex, value, rIndex)}
                                                            showArrow={false}
                                                            allowClear>
                                                            <Option value='gt'>{">"}</Option>
                                                            <Option value='gte'>{">="}</Option>
                                                            <Option value='lt'>{"<"}</Option>
                                                            <Option value='lte'>{"<="}</Option>
                                                          </Select>
                                                          <DatePicker
                                                            style={{width: 110, marginLeft: 8}}
                                                            onChange={value => this.handleInputRangeDate(c.dataIndex, value, rIndex)}
                                                            value={r.value && moment(r.value)}
                                                            placeholder='选择日期' />
                                                          {
                                                            rangesDate[c.dataIndex].length > 1
                                                              ? <span style={{
                                                                display: "inline-block",
                                                                width: 30,
                                                                marginLeft: 8,
                                                                textAlign: "center",
                                                                height: 30,
                                                                lineHeight: "30px",
                                                                color: "red",
                                                                cursor: "pointer"
                                                              }} onClick={e => this.removeRangeDate(c.dataIndex, rIndex)}>×</span>
                                                              : null
                                                          }
                                                        </div>;
                                                      })
                                                      : null
                                                  }
                                                  {
                                                    Array.isArray(rangesDate[c.dataIndex]) && rangesDate[c.dataIndex].length < 2
                                                      ? <Button
                                                        type='dashed'
                                                        style={{display: "block", width: "100%"}}
                                                        onClick={e => this.addRangeDate(c.dataIndex)}>新增</Button>
                                                      : null
                                                  }
                                                  <Button
                                                    type='primary'
                                                    onClick={this.updateDataWithRangeDate}
                                                    style={{width: "100%"}}>确定</Button>
                                                </div>
                                                : null
                                            }
                                            {
                                              c.filter
                                            && c.filterType !== "range"
                                            && c.filterType !== "search"
                                            && c.filterType !== "range-date"
                                                ?
                                                <div>
                                                  <div>
                                                    <Input placeholder='搜索选项' style={{
                                                      width: "100%",
                                                      height: 30,
                                                      border: "1px solid #e8e8e8",
                                                      borderRadius: 2,
                                                      padding: "0 5px",
                                                      fontSize: 14
                                                    }} onChange={e => this.handleSelectOptions(e, c.dataIndex)}
                                                    value={ops[c.dataIndex]} />
                                                  </div>
                                                  <div style={{
                                                    height: 30,
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    wordBreak: "break-all",
                                                    overflow: "hidden"
                                                  }}>
                                                    <Checkbox
                                                      checked={
                                                        Array.isArray(filters[c.dataIndex])
                                                    && selectOpts.length === filters[c.dataIndex].length
                                                    && filters[c.dataIndex].length > 0
                                                      }
                                                      indeterminate={
                                                        Array.isArray(filters[c.dataIndex])
                                                    && selectOpts.length !== filters[c.dataIndex].length
                                                    && filters[c.dataIndex].length > 0
                                                      }
                                                      onChange={e => this.filterSelectAll(e, c.dataIndex, selectOpts)}>全选</Checkbox>
                                                  </div>

                                                  {
                                                    selectOpts.length > 0
                                                      ? <List
                                                        rowCount={selectOpts.length}
                                                        rowHeight={30}
                                                        height={140}
                                                        width={150}
                                                        rowRenderer={
                                                          ({index, key, style}) => {
                                                            let t = selectOpts[index];

                                                            return <div title={t} key={key}
                                                              style={{
                                                                ...style,
                                                                height: 30,
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                wordBreak: "break-all",
                                                                overflow: "hidden"
                                                              }}
                                                            >
                                                              <Checkbox
                                                                checked={
                                                                  Array.isArray(this.state.filters[c.dataIndex])
                                                          && this.state.filters[c.dataIndex].indexOf(t) > -1
                                                                }
                                                                onChange={e => this.filterSelect(e, t, c.dataIndex)}>{t}</Checkbox>
                                                            </div>;
                                                          }
                                                        } />
                                                      : <div style={{
                                                        height: "30px",
                                                        lineHeight: "30px",
                                                        textAlign: "center",
                                                        color: "#ccc",
                                                        fontSize: "14px"
                                                      }}>暂无数据</div>
                                                  }


                                                </div>

                                                : null
                                            }

                                            <div style={{
                                              lineHeight: "36px",
                                              textAlign: "right"
                                            }}>
                                              <a
                                                style={{padding: "0 5px",fontSize: "12px"}}
                                                onClick={
                                                  c.filterType === "search"
                                                    ? () => this.clearInput(c.dataIndex)
                                                    : c.filterType === "range"
                                                      ? () => this.clearRange(c.dataIndex)
                                                      : c.filterType === "range-date"
                                                        ? () => this.clearRangeDate(c.dataIndex)
                                                        : () => this.removeFilter(c.dataIndex)

                                                }>清除筛选</a>
                                            </div>
                                          </div>
                                          <div title={label} className={styles.headerItemContent}>{label}</div>
                                          {
                                            c.sorter || c.filter
                                              ? <div className={styles.headerItemIcon}>
                                                {
                                                  c.sorter
                                                    ? <div style={{width: 18, paddingTop: 8}}>
                                                      <Icon
                                                        type="caret-up"
                                                        className={styles.headerItemIconUp}
                                                        onClick={e => this.doSort(c, "asc")}
                                                        style={{
                                                          color: sorts.field === c.dataIndex && sorts.type === "asc" ? "#1890ff" : "#bfbfbf"
                                                        }} />
                                                      <Icon
                                                        type="caret-down"
                                                        className={styles.headerItemIconDown}
                                                        onClick={e => this.doSort(c, "desc")}
                                                        style={{
                                                          color: sorts.field === c.dataIndex && sorts.type === "desc" ? "#1890ff" : "#bfbfbf"
                                                        }} />
                                                    </div>
                                                    : null
                                                }
                                                {
                                                  c.filter
                                                    ? <div style={{width: 18, paddingTop: 13}}>
                                                      <Icon
                                                        theme='filled'
                                                        type="filter"
                                                        style={{
                                                          color: this.state.filterIndex === cIndex
                                                          || (Array.isArray(filters[c.dataIndex]) && filters[c.dataIndex].length > 0)
                                                          || searchs[c.dataIndex]
                                                          || Array.isArray(ranges[c.dataIndex]) && ranges[c.dataIndex].every(r => r.operate && r.value)
                                                          || Array.isArray(rangesDate[c.dataIndex]) && rangesDate[c.dataIndex].every(r => r.operate && r.value) ? "#1890ff" : "#bfbfbf"
                                                        }}
                                                        className={styles.headerItemIconFilter}
                                                        onClick={e => this.doFilter(cIndex, c)}
                                                      />
                                                    </div>
                                                    : null
                                                }
                                              </div>
                                              : null
                                          }
                                        </div>;
                                      }
                                    }
                                    cellRenderer={p => {
                                      const { cellData, rowData, rowIndex } = p;
                                      return c.render(cellData, rowData, rowIndex);
                                    }}

                                  />
                                );
                              })
                            }
                          </Table>
                        );
                      }
                    }
                  </ColumnSizer>
                );
              }
            }
          </AutoSizer>
        </div>

        {
          processData.length > 0
            ? <div style={{overflow: "hidden"}}>
              <Pagination
                {...pagination}
                style={{marginTop: 15, float: "right"}}
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.handlePage} />
            </div>
            : null
        }
      </div>
    );
  }
}

export default VirtualTable;

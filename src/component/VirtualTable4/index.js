import React, { Component } from "react";
import { AutoSizer, List } from "react-virtualized";
import { Pagination, Spin, Checkbox, Icon, Select, Button, Input, message, DatePicker } from "antd";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {inject, observer} from "mobx-react/index";
import { isEqual } from "lodash";
import { uniq, cloneDeep } from "lodash";
import moment from "moment";
import styles from "./index.module.css";
import CommonUtil from "@utils/common";

const { Option } = Select;

let _util = new CommonUtil();

const messages = defineMessages({
  fill_full_filter: {
    id: "app.component.virtualtable.fill_full_filter",
    defaultMessage: "请填写完整筛选条件!"
  },
  input_search: {
    id: "app.component.virtualtable.input_search",
    defaultMessage: "输入搜索"
  },
  searchoption: {
    id: "app.component.virtualtable.searchoption",
    defaultMessage: "搜索选项"
  },
  please_select: {
    id: "app.component.virtualtable.please_select",
    defaultMessage: "选择"
  },
  please_input: {
    id: "app.component.virtualtable.please_input",
    defaultMessage: "输入"
  },
  select_date: {
    id: "app.component.virtualtable.select_date",
    defaultMessage: "选择日期"
  }
});

@inject("appState") @observer @injectIntl
class VirtualTable extends Component {
  state = {
    firstFilter: -1,
    filterIndex: -1, //当前筛选列索引，因为一次只有一个筛选面板显示。
    filters: {}, //筛选，列名作为键，filters: {username: ['jason', 'lyh']}，即列名为username只包含jason, lyh两条数据
    sorts: {},
    searchs: {}, //搜索筛选，暂未用到
    ranges: {}, //数字范围筛选，
    rangesDate: {}, //日期筛选，
    selectOption: {}, //选择筛选的选项
    ops: {}, //选择筛选的搜索框
    filterSelected: [], //已筛选的列，防止重复渲染列筛选面板
    processData: cloneDeep(this.props.dataSource), //表格数据
    expandedRows: [],
    selectedRows: this.props.selectedRows || [],
    headerPaddingRight: 0,
    current:1,
    scrollTop:0
  }
  componentDidMount() {
    this.props.onRef(this);
    document.onclick = e => {
      this.setState({ filterIndex: -1 });
    };
  }
  removeAllFilter = fn => { //清除筛选状态
    this.setState({
      firstFilter: -1,
      filterIndex: -1,
      filters: {},
      searchs: {},
      ranges: {},
      rangesDate: {},
      ops: {},
      selectOption: {},
      filterSelected: [],
      processData: cloneDeep(this.props.dataSource)
    }, () => {
      if (typeof fn === "function") {
        fn();
      }
    });
  }
  resetConfig = (fn) => { //清除所有状态
    this.setState({
      firstFilter: false,
      filterIndex: -1,
      filters: {},
      sorts: {},
      searchs: {},
      ranges: {},
      rangesDate: {},
      ops: {},
      selectOption: {},
      filterSelected: [],
      processData: cloneDeep(this.props.dataSource),
      expandedRows: [],
      selectedRows: []
    }, () => {
      if (typeof fn === "function") {
        fn();
      }
    });
  }
  componentDidUpdate(prevProps) {
    const {
      dataSource: prevDataSource,
      reset: prevReset,
      refresh: prevRefresh,
      selected: prevSelected,
      defaultScrollTop: prevScrollTop,
      removeAllFilter: prevRemoveAllFilter
    } = prevProps;
    const {
      dataSource,
      reset,
      refresh,
      selected,
      defaultScrollTop,
      removeAllFilter
    } = this.props;

    if (defaultScrollTop !== prevScrollTop) {
      this.setState({ scrollTop: defaultScrollTop});
    }
    if (!prevReset && reset) {
      this.resetConfig(() => this.updateData());
    }
    if (!prevSelected && selected) {
      let selectedRows = [...selected];
      this.setState({ selectedRows }, () => {
        this.updateData();
        this.updateRowSelect();
      });
    }
    if (!prevRemoveAllFilter && removeAllFilter) {
      this.removeAllFilter(() => this.updateData());
    }
    if (refresh && !prevRefresh) {
      this.setState({
        processData: cloneDeep(dataSource)
      }, () => {
        this.updateData();
      });
    } else if (!isEqual(dataSource, prevDataSource)) {
      this.setState({
        processData: cloneDeep(dataSource)
      });
    }
  }
  onPaginationChange = (page, pageSize) => { //分页变化回掉
    //分页变化回掉

    //删除scrollTop
    _util.removeSession("scrollTop");
    this.setState({ scrollTop:0 });
    //写入currentPage
    this.setState({current:page});

    const { pagination, onPaginationChange } = this.props;

    pagination.pageSize = pageSize;
    pagination.current = page;
    //this.resetConfig()

    if (typeof onPaginationChange === "function") {
      this.props.appState.setPageSize(pagination.pageSize);
      this.props.appState.setCurrentPage(pagination.current);
      _util.setSession("pageSize", pagination.pageSize);
      _util.setSession("currentPage", pagination.current);
      onPaginationChange(pagination);//向父组件传递pagination：index.js or TablePage
    }
  }
  updateRowSelect = () => { //选择回调
    const { onSelectChange } = this.props;
    const { processData } = this.state;

    if (typeof onSelectChange === "function") {
      const { selectedRows } = this.state;

      onSelectChange(selectedRows, selectedRows.map(k => processData.filter(p => p.id === k)[0]));
    }
  }
  updateRowSelected = (arr) => { //设置选择项
    // let { processData } = this.state
    let selectedRows = [...arr];
    this.setState({ selectedRows }, () => {
      this.updateData();
      this.updateRowSelect();
    });
  }
  selectAll = () => { //全选
    let { selectedRows, processData } = this.state;
    let selectedRowsWithFilter = selectedRows.filter(s => processData.map(p => p.id).indexOf(s) < 0);

    if (processData.every(p => selectedRows.indexOf(p.id) > -1)) {
      selectedRows = selectedRowsWithFilter;
    } else {
      selectedRows = [...selectedRowsWithFilter, ...processData.map(p => p.id)];
    }

    this.setState({ selectedRows }, () => {
      this.updateRowSelect();
    });
  };
  selectOne = (checked, index) => { //单选
    const {selectedRows, processData} = this.state;
    const selectedRowsIndex = selectedRows.indexOf(processData[index].id);

    if (checked) {
      if (selectedRowsIndex < 0) {
        selectedRows.push(processData[index].id);
      }
    } else {
      if (selectedRowsIndex > -1) {
        selectedRows.splice(selectedRowsIndex, 1);
      }
    }

    this.setState({ selectedRows }, () => {
      this.updateRowSelect();
    });
  };
  updateData = () => { //根据状态更新数据
    const { filters, sorts, searchs, ranges, rangesDate } = this.state;
    const { dataSource: originDataSource, columns } = this.props;
    const { field, type } = sorts;

    let dataSource = cloneDeep(originDataSource);
    if (field && type) { //排序
      const sortCol = columns.filter(c => c.dataIndex === field)[0];

      if (sortCol) {
        dataSource = dataSource.sort((a, b) => sortCol.sorter(a[field], b[field]));

        if (type === "desc") {
          dataSource = dataSource.reverse();
        }
      }
    }

    dataSource = dataSource.filter(d => { //搜索筛选
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

    dataSource = dataSource.filter(d => { //选择筛选
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

    if (Object.keys(ranges).every(k => ranges[k].every(r => r.operate && r.value))) { //范围筛选
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

            if (ltlt || gtgt) { //小于小的，大于大的，取或
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

    if (Object.keys(rangesDate).every(k => rangesDate[k].every(r => r.operate && r.value))) { //日期筛选
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

            if (ltlt || gtgt) { //小于小的，大于大的，取或
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

    this.setState({ processData: dataSource }, () => {
      this.list.forceUpdateGrid(); //更新数据
      this.list.recomputeRowHeights(); //重新计算高度
      this.updateRowSelect(); //更新选择项
    });
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
      this.setState({ sorts }, () => this.updateData());
    }
  }
  renderSelect = (c, isFirst) => {
    const { filters, rangesDate, ranges } = this.state;
    if (c.filterType === "range") { //根据筛选种类不同，初始化数据
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

    let temp = [];

    if (!isFirst) {
      const { processData } = this.state;
      processData.forEach(d => {
        if (Array.isArray(d[c.dataIndex])) {
          temp = [...temp, ...d[c.dataIndex]];
        }
        if (typeof d[c.dataIndex] === "string") {
          temp = [...temp, d[c.dataIndex]];
        }

      });
    } else {
      let { dataSource } = this.props;
      dataSource.forEach(d => {
        if (Array.isArray(d[c.dataIndex])) {
          temp = [...temp, ...d[c.dataIndex]];
        }
        if (typeof d[c.dataIndex] === "string") {
          temp = [...temp, d[c.dataIndex]];
        }

      });
    }

    temp = uniq(temp); //去重数据
    temp = temp.filter(t => {
      if (t || t === 0) return true;
    });
    const { selectOption } = this.state;
    selectOption[c.dataIndex] = temp;

    this.setState({ selectOption });
  }
  /**
   * index 列序号
   * column项目
   */
  doFilter = (index, c) => {
    const { filterIndex, filters } = this.state;
    let { filterSelected } = this.state;

    if (filterIndex === index) {
      this.setState({ filterIndex: -1 });
    } else {
      this.setState({ filterIndex: index });
    }

    let idx = filterSelected.indexOf(c.dataIndex);
    if (idx > -1) { //已渲染过的选择面板直接返回，否则初始化筛选面板
      return;
    } else {
      this.renderSelect(c); //渲染筛选面板
      if (Object.keys(filters).every(k => filters[k].length === 0)) {
        filterSelected = [c.dataIndex];
      } else {
        filterSelected.push(c.dataIndex);
      }
      this.setState({filterSelected});
    }

  }
  handleInput = (e, field) => {
    const { searchs } = this.state;

    if (e.target.value) {
      searchs[field] = e.target.value;
    } else {
      searchs[field] = "";
    }
    this.setState({ searchs });
  }
  clearInput = field => {
    const { searchs } = this.state;

    searchs[field] = "";
    this.setState({ searchs });
  };

  filterSelect = (e, name, field) => {
    let { filters } = this.state;

    const fieldsArr = filters[field];
    const index = fieldsArr.indexOf(name);

    if (e.target.checked && index < 0) {
      fieldsArr.push(name);
    } else if (!e.target.checked && index > -1) {
      fieldsArr.splice(index, 1);
    }

    filters[field] = fieldsArr;

    let { filterSelected } = this.state;

    // filterSelected = filterSelected.filter(f => filters[f].length > 0)
    // let fieldIndex = filterSelected.indexOf(field)
    // filterSelected = filterSelected.slice(0, fieldIndex + 1)

    Object.keys(filters).forEach(k => {
      if (filterSelected.indexOf(k) < 0) {
        filters[k] = [];
      }
    });

    this.setState({ filters, filterSelected }, () => this.updateData());
  }
  filterSelectAll = (e, field, temp) => { //选择筛选的全选
    let { filters } = this.state;
    let fieldsArr = filters[field];

    if (e.target.checked) {
      fieldsArr = temp;
    } else {
      fieldsArr = [];
    }
    filters[field] = fieldsArr;

    let { filterSelected } = this.state;

    // filterSelected = filterSelected.filter(f => filters[f].length > 0)
    // let fieldIndex = filterSelected.indexOf(field)
    // filterSelected = filterSelected.slice(0, fieldIndex + 1)

    Object.keys(filters).forEach(k => {
      if (filterSelected.indexOf(k) < 0) {
        filters[k] = [];
      }
    });

    this.setState({ filters, filterSelected }, () => this.updateData());
  }
  removeFilter = field => {
    const { filters, ops } = this.state;

    filters[field] = [];
    ops[field] = "";

    // if (Object.keys(filters).every(k => filters[k].length === 0)) {
    //   this.setState({ filterSelected: [] })
    // }

    this.setState({ filters, ops }, () => this.updateData());
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
    this.setState({ ranges }, () => this.updateData());
  }
  clearRangeDate = field => {
    const { rangesDate } = this.state;
    rangesDate[field] = [{
      operate: undefined,
      value: ""
    }];
    this.setState({ rangesDate }, () => this.updateData());
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
    const {formatMessage} = this.props.intl;
    const { ranges } = this.state;
    const keys = Object.keys(ranges);

    for (let i = 0, len = keys.length; i < len; i++) {
      if (ranges[keys[i]].some(r => !r.operate || !r.value)) {
        message.error(formatMessage(messages.fill_full_filter)); //请填写完整筛选条件!
        return false;
      }
    }
    this.updateData();
  }
  updateDataWithRangeDate = () => {
    const {formatMessage} = this.props.intl;
    const { rangesDate } = this.state;
    const keys = Object.keys(rangesDate);

    for (let i = 0, len = keys.length; i < len; i++) {
      if (rangesDate[keys[i]].some(r => !r.operate || !r.value)) {
        message.error(formatMessage(messages.fill_full_filter)); //请填写完整筛选条件!
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
  handleFilterPanelBlur = () => {
    this.setState({ filterIndex: -1 });
  }
  renderRowHeader = () => { //渲染表头
    const { columns, expand, noCheckbox } = this.props;
    const {formatMessage} = this.props.intl;
    const {
      processData,
      sorts,
      filters,
      searchs,
      ranges,
      rangesDate,
      filterIndex,
      ops,
      selectOption,
      headerPaddingRight,
      selectedRows
    } = this.state;

    return (
      <div
        className={styles.HeaderRow}
        style={{
          paddingRight: headerPaddingRight
        }}
      >
        { //如果有需要展开行，表头需要添加一列+-符号
          expand && <div className={styles.HeaderCell} style={{ width: 30 }} />
        }
        {
          !noCheckbox
          &&
          <div
            className={styles.HeaderCell}
            style={{
              width: 40,
              textAlign:"center"
            }}>
            <Checkbox
              onChange={this.selectAll}
              indeterminate={
                !processData.every(p => selectedRows.indexOf(p.id) > -1)
                &&
                processData.some(p => selectedRows.indexOf(p.id) > -1)
              }
              checked={
                processData.every(p => selectedRows.indexOf(p.id) > -1)
                &&
                selectedRows.length > 0
              }
            />
          </div>
        }

        {
          columns.map((c, cIndex) => {
            let selectOpts = []; //最终要渲染的选择项

            if (Array.isArray(selectOption[c.dataIndex]) && selectOption[c.dataIndex].length > 0) {
              selectOpts = selectOption[c.dataIndex].filter(s => {
                if (ops[c.dataIndex] && s.toLowerCase().indexOf(ops[c.dataIndex].toLowerCase()) > -1) {
                  return true;
                } else if (!ops[c.dataIndex]) {
                  return true;
                }
              });
            }
            //排序的图标
            const sorterIcon = (
              <div style={{width: 18, paddingTop: 6}}>
                <Icon
                  type="caret-up"
                  className={styles.headerCellIconUp}
                  onClick={e => this.doSort(c, "asc")} //asc 升序
                  style={{
                    color: sorts.field === c.dataIndex && sorts.type === "asc" ? "#1890ff" : "#bfbfbf"
                  }}
                />
                <Icon
                  type="caret-down"
                  className={styles.headerCellIconDown}
                  onClick={e => this.doSort(c, "desc")} //desc 降序
                  style={{
                    color: sorts.field === c.dataIndex && sorts.type === "desc" ? "#1890ff" : "#bfbfbf"
                  }}
                />
              </div>
            );
            //筛选的图标
            const filterIcon = (
              <div style={{width: 18, paddingTop: 12}}>
                <Icon
                  theme='filled'
                  type="filter"
                  style={{
                    color: filterIndex === cIndex
                    || (Array.isArray(filters[c.dataIndex]) && filters[c.dataIndex].length > 0)
                    || searchs[c.dataIndex]
                    || Array.isArray(ranges[c.dataIndex]) && ranges[c.dataIndex].every(r => r.operate && r.value)
                    || Array.isArray(rangesDate[c.dataIndex]) && rangesDate[c.dataIndex].every(r => r.operate && r.value) ? "#1890ff" : "#bfbfbf"
                  }}
                  className={styles.headerCellIconFilter}
                  onClick={e => {
                    e.nativeEvent.stopImmediatePropagation(); //需要阻止事件冒泡
                    this.doFilter(cIndex, c);
                  }}
                />
              </div>
            );
            //筛选种类1   搜索
            const filterTypeSearch = (
              <div>
                <Input
                  autoFocus
                  placeholder={formatMessage(messages.input_search)} //输入搜索
                  style={{
                    width: "100%",
                    height: 30,
                    border: "1px solid #e8e8e8",
                    borderRadius: 2,
                    padding: "0 5px",
                    fontSize: 14
                  }}
                  onChange={e => this.handleInput(e, c.dataIndex)}
                  value={searchs[c.dataIndex]}
                />
              </div>
            );
            //筛选种类2    选择
            const filterTypeSelect = (
              <div>
                <div>
                  <Input
                    placeholder={formatMessage(messages.searchoption)} //搜索选项
                    style={{
                      width: "100%",
                      height: 30,
                      border: "1px solid #e8e8e8",
                      borderRadius: 2,
                      padding: "0 5px",
                      fontSize: 14
                    }}
                    onChange={e => this.handleSelectOptions(e, c.dataIndex)}
                    value={ops[c.dataIndex]}
                  />
                </div>
                <div
                  style={{
                    height: 30,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    wordBreak: "break-all",
                    overflow: "hidden"
                  }}
                >
                  <Checkbox //全选
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
                    onChange={e => this.filterSelectAll(e, c.dataIndex, selectOpts)}><FormattedMessage id="app.component.virtualtable.select_all" defaultMessage="全选" /></Checkbox>
                </div>
                {
                  selectOpts.length > 0
                    ? <List
                      rowCount={selectOpts.length}
                      rowHeight={30}
                      height={140}
                      width={150}
                      rowRenderer={
                        ({ index, key, style }) => {
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
                    }}><FormattedMessage id="app.component.virtualtable.nodata" defaultMessage="暂无数据" /></div>
                }
              </div>
            );

            //筛选种类3   范围
            const filterTypeRange = (
              <div>
                {
                  Array.isArray(ranges[c.dataIndex])
                    ? ranges[c.dataIndex].map((r, rIndex) => {
                      return <div key={rIndex}>
                        <Select
                          style={{ width: 70, height: 30 }}
                          placeholder={formatMessage(messages.please_select)} //选择
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
                          style={{ width: 80, height: 30, marginLeft: 8, border: "1px solid #e8e8e8" }}
                          placeholder={formatMessage(messages.please_input)} //输入
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
                      style={{ display: "block", width: "100%" }}
                      onClick={e => this.addRange(c.dataIndex)}><FormattedMessage id="app.component.virtualtable.add" defaultMessage="新增" /></Button>
                    : null
                }
                <Button
                  type='primary'
                  onClick={this.updateDataWithRange}
                  style={{ width: "100%" }}><FormattedMessage id="app.component.virtualtable.confirm" defaultMessage="确定" /></Button>
              </div>
            );

            //筛选种类4   日期范围
            const filterTypeRangeDate = (
              <div>
                {
                  Array.isArray(rangesDate[c.dataIndex])
                    ? rangesDate[c.dataIndex].map((r, rIndex) => {
                      return <div key={rIndex}>
                        <Select
                          style={{ width: 70, height: 30 }}
                          placeholder={formatMessage(messages.please_select)} //选择
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
                          style={{ width: 110, marginLeft: 8 }}
                          onChange={value => this.handleInputRangeDate(c.dataIndex, value, rIndex)}
                          value={r.value && moment(r.value)}
                          placeholder={formatMessage(messages.select_date)} />
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
                      style={{ display: "block", width: "100%" }}
                      onClick={e => this.addRangeDate(c.dataIndex)}><FormattedMessage id="app.component.virtualtable.add" defaultMessage="新增" /></Button>
                    : null
                }
                <Button
                  type='primary'
                  onClick={this.updateDataWithRangeDate}
                  style={{ width: "100%" }}><FormattedMessage id="app.component.virtualtable.confirm" defaultMessage="确定" /></Button>
              </div>
            );

            //筛选的面板
            const filterPanel = (
              <div
                className={styles.HeaderCellFilterPanel}
                style={{
                  display: c.filter && cIndex === filterIndex ? "block" : "none",
                  left: cIndex === 0 || cIndex === 1 || cIndex === 2 ? 0 : "auto",
                  width: c.filterType === "range"
                    ? 220
                    : c.filterType === "range-date"
                      ? 250
                      : 170
                }}
                onClick={e => e.nativeEvent.stopImmediatePropagation()} //禁止事件冒泡
              >
                {c.filterType === "search" && filterTypeSearch}
                {c.filterType === "range" && filterTypeRange}
                {c.filterType === "range-date" && filterTypeRangeDate}
                {
                  c.filter
                  && c.filterType !== "range"
                  && c.filterType !== "search"
                  && c.filterType !== "range-date"
                  && filterTypeSelect
                }
                <div style={{
                  lineHeight: "36px",
                  textAlign: "right"
                }}>
                  <a
                    style={{ padding: "0 5px", fontSize: "12px" }}
                    onClick={
                      c.filterType === "search"
                        ? () => this.clearInput(c.dataIndex)
                        : c.filterType === "range"
                          ? () => this.clearRange(c.dataIndex)
                          : c.filterType === "range-date"
                            ? () => this.clearRangeDate(c.dataIndex)
                            : () => this.removeFilter(c.dataIndex)

                    }><FormattedMessage id="app.component.virtualtable.clear_filter" defaultMessage="清除筛选" /></a>
                </div>
              </div>
            );

            return (
              <div
                className={styles.HeaderCell}
                key={cIndex}
                title={c.title}
                style={{
                  width: c.width || 10,
                  minWidth: c.minWidth || "none",
                  maxWidth: c.maxWidth || "none",
                  flexGrow: c.width ? 0 : 1
                }}>
                {filterPanel}
                <div
                  className={styles.HeaderCellLabel}
                  style={{
                    paddingRight: c.sorter && c.filter
                      ? 36
                      : (c.sorter && !c.filter) || (c.filter && !c.sorter)
                        ? 18
                        : 0
                  }}>
                  {c.title}
                </div>
                <div className={styles.HeaderCellIcon}>
                  { c.sorter && sorterIcon }
                  { c.filter && filterIcon }
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
  rowRenderer = ({ index, key, style, parent }) => { //行渲染
    const { expandedRows, selectedRows, processData } = this.state;
    const { columns, expand, noCheckbox, noAddIconFn } = this.props;

    return (
      <div style={{
        ...style
      }} key={key}>
        <div
          className={styles.Row}
          style={{
            display: "flex",
            lineHeight: "35px",
            height: 35,
            backgroundColor:selectedRows.indexOf(processData[index].id)>-1?"#FFF9C3":null
          }}>
          {
            expand
          &&
          <div
            className={styles.Cell}
            style={{
              textAlign: "center",
              cursor: "pointer",
              width: 30
            }}
            onClick={
              typeof noAddIconFn === "function"
              &&
              noAddIconFn(processData[index])
                ? () => {}
                : () => this.expandRow(index)
            }
          >
            {
              expandedRows.indexOf(processData[index].id) < 0
                ? typeof noAddIconFn === "function"
                  ? noAddIconFn(processData[index])
                    ? ""
                    : "+"
                  : "+"
                : "-"
            }
          </div>
          }
          {
            !noCheckbox
          &&
          <div
            className={styles.Cell}
            style={{
              width: 40,
              textAlign:"center"
            }}
          >
            <Checkbox
              onChange={e => this.selectOne(e.target.checked, index)}
              checked={selectedRows.indexOf(processData[index].id) > -1}
            />
          </div>
          }

          {
            columns.map((c, cIndex) => {
              return (
                <div
                  className={styles.Cell}
                  key={cIndex}
                  style={{
                    width: c.width || 10,
                    minWidth: c.minWidth || "none",
                    maxWidth: c.maxWidth || "none",
                    flexGrow: c.width ? 0 : 1
                  }}>
                  { c.render(processData[index][c.dataIndex], processData[index], index) }
                </div>
              );
            })
          }
        </div>
        {this.renderExpandRow(index)}
      </div>
    );
  }
  noRowsRenderer = () => {
    const { loading } = this.state;
    if (!loading) {
      return (
        <div className={styles.NoData}><FormattedMessage id="app.component.virtualtable.nodata" defaultMessage="暂无数据" /></div>
      );
    }
  }
  renderLoading = () => { //渲染loading
    const { loading } = this.props;

    if (!loading) return null;
    return (
      <div className={styles.Loading}>
        <Spin className={styles.LoadingSpin} />
      </div>
    );
  }
  expandRow = index => {
    const { expandedRows, processData } = this.state;
    const { expandFn } = this.props;
    const hasIndex = expandedRows.indexOf(processData[index].id);

    if (hasIndex > -1) {
      expandedRows.splice(hasIndex, 1);
    } else {
      expandedRows.push(processData[index].id);
      if (typeof expandFn === "function" && !processData[index].efmExpands) {
        expandFn(processData[index].id);
      }
    }

    this.setState({ expandedRows }, () => {
      this.list.recomputeRowHeights();
    });
  }
  rowHeightGetter = ({ index }) => {
    const { processData, expandedRows } = this.state;
    const obj = processData[index];
    let expandHeight = this.props.expandHeight || 35;

    let num = 0;

    if (obj && expandedRows.indexOf(obj.id) > -1) {
      if (obj) {
        if (Array.isArray(obj.efmExpands)) {
          if (obj.efmExpands.length > 0) {
            num = 35 + expandHeight * obj.efmExpands.length;
          }
          if (obj.efmExpands.length === 0) {
            num = 70;
          }
        } else {
          num = 35;
        }
      } else {
        num = 35;
      }
    } else {
      num = 35;
    }
    return num;
  }
  renderExpandRow = (index) => {
    const { expandedRows, processData } = this.state;
    const { expand } = this.props;

    if (processData[index] && expandedRows.indexOf(processData[index].id) < 0) {
      return null;
    }
    if (expand) {
      return expand(processData[index], this.rowHeightGetter({ index }) - 35);
    }
  }
  onScrollbarPresenceChange = () => { //有无滚动条时回调
    this.setState({ headerPaddingRight: 16}); //有滚动条时设置表头padding-right 16
  }
  onScroll = ({scrollTop}) => {
    if (scrollTop) {
      if(scrollTop <= 5){
        this.setState({scrollTop:0});
      }else{
        this.setState({scrollTop});
      }
      // this.setState({scrollTop});
      this.props.appState.setScrollTop(scrollTop);
      if(scrollTop !== _util.getSession("scrollTop")){
        _util.removeSession("scrollTop");
      }
    }
  }
  render () {
    const { pagination, noHeader,appState,clearScrollTop } = this.props;
    const {tableScrollTop} = appState;
    let {
      processData,
      scrollTop,
      current
    } = this.state;

    return (
      <div className={styles.Wrap}>
        {this.renderLoading()}
        {!noHeader && this.renderRowHeader()}
        <div
          style={{
            height: "calc(100vh - 316px)",
            width: "100%",
            overflow: "hidden"
          }}
        >
          <AutoSizer>
            {
              ({ width, height }) => {
                return (
                  clearScrollTop ?
                    <List
                      style={{overflow: "hidden"}}
                      ref={ref => this.list = ref}
                      width={width}
                      height={height}
                      rowCount={processData.length}
                      rowHeight={this.rowHeightGetter}
                      rowRenderer={this.rowRenderer}
                      noRowsRenderer={this.noRowsRenderer}
                      onScrollbarPresenceChange={this.onScrollbarPresenceChange}
                      onScroll={this.onScroll}
                    /> :
                    <List
                      style={{overflow: "hidden"}}
                      ref={ref => this.list = ref}
                      width={width}
                      height={height}
                      rowCount={processData.length}
                      rowHeight={this.rowHeightGetter}
                      rowRenderer={this.rowRenderer}
                      noRowsRenderer={this.noRowsRenderer}
                      onScrollbarPresenceChange={this.onScrollbarPresenceChange}
                      onScroll={this.onScroll}
                      scrollTop={_util.getSession("scrollTop") ? tableScrollTop : scrollTop}
                    />
                );
              }
            }
          </AutoSizer>
        </div>
        <div style={{
          // overflow: 'hidden',
          height: 47,
          background: "#fff",
          position: "relative"
        }}>
          {
            this.props.filtering
              &&
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 10,
                background: "rgba(255, 255, 255, .5)",
                cursor: "not-allowed"
              }}></div>
          }
          <Pagination
            {...pagination}
            style={{
              marginTop: 15,
              float: "right"
            }}
            onShowSizeChange={this.onPaginationChange}
            onChange={this.onPaginationChange}
            current={_util.getSession("currentPage") ? _util.getSession("currentPage") : current}
          />
        </div>
      </div>
    );
  }
}

export default VirtualTable;

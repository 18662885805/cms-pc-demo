import React, { PureComponent } from "react";
import { Checkbox, Input } from "antd";
import { List } from "react-virtualized";
import styles from "./FilterSelect.module.css";

export default class extends PureComponent {
  rowRenderer = ({ index, style }) => {
    const { selectedOptions, options } = this.props;
    const option = options[index];

    return (
      <div
        title={option}
        key={option}
        style={{
          ...style,
          height: 30,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          wordBreak: "break-all",
          overflow: "hidden"
        }}>
        <Checkbox
          checked={selectedOptions.indexOf(option > -1)}
          onChange={e => this.selectOne(e, option)}
        >
          {option}
        </Checkbox>
      </div>
    );
  }
  selectAll = e => { this.props.selectAll(e); }
  selectOne = (e, option) => { this.props.selectOne(e, option); }
  handleInput = e => { this.props.handleInput(e); }
  render() {
    const { inputValue, selectedOptions, options } = this.props;

    console.log(selectedOptions);
    console.log(options);

    return (
      <div>
        <Input
          className={styles.Input}
          placeholder='搜索选项'
          onChange={this.handleInput}
          value={inputValue}
        />
        <div className={styles.CheckboxLine}>
          <Checkbox
            checked={selectedOptions.length >= options.length}
            indeterminate={selectedOptions.length > 0 && selectedOptions.length < options.length}
            onChange={this.selectAll}
          >
            全选
          </Checkbox>
        </div>
        {
          options.length > 0
            ? <List
              rowCount={options.length}
              rowHeight={30}
              height={140}
              width={150}
              rowRenderer={this.rowRenderer}
            />
            : <div className={styles.NoData}>暂无数据</div>
        }
      </div>
    );
  }
}
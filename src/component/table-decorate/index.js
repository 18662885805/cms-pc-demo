import React from "react";
import { produceDragableCol, moveCol } from "./header-col";
import { produceDragableRow, moveRow } from "./body-row";

function tableDecorate (WrappedComponent, config = {}) {
  class Wrapper extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        cols: [],
        dataLists: [],
        onrow: () => {},
        component: {}
      };
    }

    componentWillMount () {
      let { columns, dataSource, onRow } = this.props;

      if (config.rowDragable) {
        onRow = (record, index) => ({
          index,
          moveRow
        });

        this.setState({
          onrow: onRow,
          dataLists: dataSource,
          component: { ...produceDragableRow(this) }
        });
      }

      if (config.colDragable) {
        columns.forEach(column => {
          column.onHeaderCell = (col) => {
            return {
              dataIndex: col.dataIndex,
              moveCol
            };
          };
        });

        this.setState({
          cols: columns,
          component: { ...produceDragableCol(this) }
        });
      }
    }

    render () {
      return <WrappedComponent
        {...this.props}
        columns={this.state.cols}
        components={this.state.component}
        onRow={this.state.onrow} />;
    }
  }

  return Wrapper;
}

export default tableDecorate;

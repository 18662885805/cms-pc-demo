import React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { Affix } from "antd";

class HeaderCol extends React.Component {
  render () {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      children,
      dataIndex,
      moveCol,
      ...restProps
    } = this.props;

    const style = {
      ...restProps.style,
      position: "relative",
      cursor: "move",
      border: "1px solid #fff"
    };

    let className = restProps.className;

    if (isOver && initialClientOffset) {
      style["background"] = "#1890ff";
      style["color"] = "#fff";
    }

    return connectDragSource(
      connectDropTarget(
        <th
          {...restProps}
          className={className}
          style={style}
        >
          <span>{children}</span>
        </th>
      )
    );
  }
}

function produceDragableCol (ctx) {
  const colSource = {
    beginDrag (props) {
      return {
        index: props.dataIndex
      };
    }
  };

  const colTarget = {
    drop (props, monitor) {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.dataIndex;

      if (!hoverIndex || !dragIndex) {
        return;
      }

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      props.moveCol(dragIndex, hoverIndex, ctx);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    }
  };

  const DragableHeaderCol = DropTarget(
    "col",
    colTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      sourceClientOffset: monitor.getSourceClientOffset()
    })
  )(
    DragSource(
      "col",
      colSource,
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset()
      }))(HeaderCol)
  );

  return {
    header: {
      cell: DragableHeaderCol
    }
  };
}

function moveCol (dragIndex, hoverIndex, ctx) {
  const { cols } = ctx.state;
  let dIndex = 0;
  let hIndex = 0;
  for (let i = 0, len = cols.length; i < len; i++) {
    if (cols[i].dataIndex === dragIndex) {
      dIndex = i;
    }
    if (cols[i].dataIndex === hoverIndex) {
      hIndex = i;
    }
  }
  [cols[dIndex], cols[hIndex]] = [cols[hIndex], cols[dIndex]];
  ctx.setState(
    cols
  );
}

export {
  produceDragableCol,
  moveCol
};

import React from "react";
import { DragSource, DropTarget } from "react-dnd";

class BodyRow extends React.Component {
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
        <tr
          {...restProps}
          className={className}
          style={style} />
      )
    );
  }
}

function produceDragableRow (ctx) {
  const rowSource = {
    beginDrag (props) {
      return {
        index: props.index
      };
    }
  };

  const rowTarget = {
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

  const DragableBodyRow = DropTarget(
    "row",
    rowTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      sourceClientOffset: monitor.getSourceClientOffset()
    })
  )(
    DragSource(
      "row",
      rowSource,
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset()
      }))(BodyRow)
  );

  return {
    body: {
      row: DragableBodyRow
    }
  };
}

function moveRow (dragIndex, hoverIndex, ctx) {
  const { dataLists } = ctx.state;

  [dataLists[dragIndex], dataLists[hoverIndex]] = [dataLists[hoverIndex], dataLists[dragIndex]];

  ctx.setState(
    dataLists
  );
}

export {
  produceDragableRow,
  moveRow
};

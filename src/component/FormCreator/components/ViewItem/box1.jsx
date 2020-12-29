import React from "react";
import { DeleteFilled } from "@ant-design/icons";
import "./style.less";

const checkEventBubble = (target, ref, end) => {
  if (!target || target.className === end) {
    return true;
  }
  if (target.className === ref) {
    return false;
  }
  return checkEventBubble(target.parentElement, ref, end);
};

class ViewItemBox extends React.PureComponent {
  state = {
    hoverName: false,
  };
  handleHover = (hoverName) => {
    this.setState({
      hoverName,
    });
  };

  createItemElement = (children) => {
    return React.createElement("div", { style: {} }, children);
  };
  render() {
    const {
      property,
      children,
      handleChoose,
      chosenName,
      handleRemove,
    } = this.props;
    const { hoverName } = this.state;
    const item = this.createItemElement(children);

    // Solution for style is read-only
    if (
      property.boxProps.style &&
      Object.keys(property.boxProps.style).length > 0
    ) {
      Object.entries(property.boxProps.style).map(([key, value]) => {
        item.props.style[key] = value;
      });
    }

    return (
      <div
        className={
          chosenName && chosenName === property.name
            ? "form-creator-view-item-box chosen"
            : "form-creator-view-item-box"
        }
        onMouseEnter={() => {
          this.handleHover(property.name);
        }}
        onMouseLeave={() => {
          this.handleHover(false);
        }}
        onClick={(e) => {
          if (
            !checkEventBubble(
              e.target,
              "form-creator-view-item-box-handler",
              e.currentTarget.className
            )
          ) {
            return;
          }
          e.stopPropagation();

          handleChoose(property.name);
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10000,
            background: "#1890ff",
            padding: "0 15px",
            borderRadius: "0 0 0 3px",
            display:
              (chosenName && chosenName === property.name) ||
              hoverName === property.name
                ? "block"
                : "none",
          }}
          className="form-creator-view-item-box-handler"
          onClick={() => {
            handleRemove(property.name);
          }}
        >
          <DeleteFilled style={{ color: "#fff" }} />
        </div>

        <div className="form-creator-view-item-box-cover"></div>
        {item}
        {/* <div style={property.boxProps.style || {}}>{children}</div> */}
      </div>
    );
  }
}

export default ViewItemBox;

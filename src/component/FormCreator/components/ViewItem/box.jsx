import React from "react";
import { Button, Icon } from "antd";
import styles from "./style.module.css";
import classnames from "classnames";

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
  createBoxElement = () => {
    const {
      children,
      property,
      chosenName,
      handleChoose,
      handleRemove,
      renderEditor,
    } = this.props;
    const delButton = () => {
      if (renderEditor) {
        return (
          <div
            className={styles.handler}
            style={{
              display:
                chosenName && chosenName === property.name ? "block" : "none",
            }}
          >
            <Button
              size="small"
              type="primary"
              onClick={() => {
                handleRemove(property.name);
              }}
            >
              <Icon type="delete" theme="filled" style={{ color: "#fff" }} />
            </Button>
          </div>
        );
      }
      return null;
    };
    const item = (
      <div className={styles.item}>
        {delButton()}
        {children}
      </div>
    );
    return React.createElement(
      "div",
      {
        className: classnames(styles.box, {
          [styles.editor]: renderEditor,
          [styles.chosen]:
            renderEditor && chosenName && chosenName === property.name,
        }),
        style: {},
        onClick: (e) => {
          if (!renderEditor) {
            return;
          }

          if (
            !checkEventBubble(
              e.target,
              styles.handler,
              e.currentTarget.className
            )
          ) {
            return;
          }
          e.stopPropagation();
          handleChoose(property.name);
        },
      },
      item
    );
  };

  render() {
    const { property } = this.props;

    const box = this.createBoxElement();

    if (
      property.boxProps.style &&
      Object.keys(property.boxProps.style).length > 0
    ) {
      Object.entries(property.boxProps.style).map(([key, value]) => {
        box.props.style[key] = value;
      });
    }

    return box;
  }
}

export default ViewItemBox;

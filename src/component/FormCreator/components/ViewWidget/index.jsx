import React from "react";
import styles from "./style.module.css";

class ViewWidget extends React.PureComponent {
  render() {
    const { field, handleAppend } = this.props;
    /*     const Widget = field.widget;
    const widgetProps = field.widgetProps || {};
    const children = field.children || null; */
    return (
      <div
        className={styles.wrapper}
        onDoubleClick={() => {
          handleAppend(field);
        }}
      >
        <div className={styles.tag}>{field.widgetName}</div>
      </div>
    );
  }
}

export default ViewWidget;

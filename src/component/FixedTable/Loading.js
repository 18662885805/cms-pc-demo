import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import styles from "./Loading.module.css";

export default class extends React.Component {
  static propTypes = {
    loading: PropTypes.bool
  }
  render() {
    if (!this.props.loading) return null;

    return (
      <div className={styles.LoadingWrap}>
        <Spin className={styles.LoadingSpin} />
      </div>
    );
  }
}
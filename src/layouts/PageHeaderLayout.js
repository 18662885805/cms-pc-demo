import React from "react";
// import { Link } from 'dva/router';
import { Link } from "react-router-dom";
import PageHeader from "../component/PageHeader";
import styles from "./PageHeaderLayout.css";

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div className={wrapperClassName}>
    {top}
    <PageHeader key='pageheader' {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);

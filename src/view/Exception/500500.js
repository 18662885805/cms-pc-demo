import React from "react";
import { Link } from "react-router-dom";
import {
  Button
} from "antd";
import Exception from "@component/Exception";

export default () => (
  <Exception
    type='error'
    style={{ minHeight: 500, height: "80%" }}
    linkElement={Link}
    actions={
      <Link to='/login'><Button type='primary'>登录</Button></Link>
    } />
);

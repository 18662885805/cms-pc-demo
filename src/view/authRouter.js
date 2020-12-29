import React from "react";
import {
  Route,
  withRouter
} from "react-router-dom";
import PropTypes from "prop-types";
import appState from "../store/app-state";
import CommonUtil from "@utils/common";
const _util = new CommonUtil();

// 私有路由，只有登录的用户才能访问
class PrivateRoute extends React.Component {
  componentWillMount () {
    let _util = new CommonUtil();
    let token = _util.getStorage("token");
    let isAuthenticated = !!token;
    this.setState({ isAuthenticated: isAuthenticated });
    if (!isAuthenticated) {
      const { history } = this.props;
      console.log("private");
      history.replace(_util.doLogin());
    }
  }

  render () {
    let { component: Component, path = "/", exact = false, strict = false } = this.props;

    return this.state.isAuthenticated ? (
      <Route path={path} exact={exact} strict={strict} render={(props) => (<Component {...props} />)} />
    ) : ("请重新登录");
  }
}

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  component: PropTypes.func.isRequired
};

export default withRouter(PrivateRoute);

import React from "react";
import {
  inject, observer
} from "mobx-react";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";

import CommonUtil from "@utils/common";

let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class MyAdminHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    render() {
    
      return(
        <div>
          <div className="content-wrapper">
            <h1>MJK Dashboard</h1>
          </div> 
        </div>
      )
    }
}

export default MyAdminHome;

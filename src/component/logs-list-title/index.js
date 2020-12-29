import React from "react";
// import {Link} from 'react-router-dom'

class LogsListTitleComponent extends React.Component {
  render () {
    let { ip, name, content, desc } = this.props;
    // let {ip, name, content, desc, to, id} = this.props
    // let path = {
    //     pathname: to,
    //     state: {
    //         id: id
    //     }
    // }
    return (
      <div>
        {
          ip ? <span style={{ marginRight: "10px", color: "red" }}>{ip}</span> : ""
        }

        <span style={{ marginRight: "10px" }}>
          {name}
        </span>
        <span style={{ marginRight: "10px" }}>
          {content}
        </span>
        <span>
          {
            // id ? <Link to={path}>{desc}</Link> : desc
            desc
          }

        </span>
      </div>
    );
  }
}

export default LogsListTitleComponent;

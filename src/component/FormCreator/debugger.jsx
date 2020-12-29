import React from "react";
import { FormCreatorContext } from "./form-creator";

class Debugger extends React.Component {
  static contextType = FormCreatorContext;

  render() {
    return (
      <pre {...this.props}>
        {JSON.stringify(this.context.toJson(), null, 3)}
      </pre>
    );
  }
}

export default Debugger;

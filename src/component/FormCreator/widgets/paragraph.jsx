import React from "react";

class Paragraph extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <p {...this.props}>{children}</p>;
  }
}
export default Paragraph;

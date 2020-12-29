import React from "react";

class ResizeCol extends React.Component {
  constructor (props) {
    super(props);

    this.resizeColStart = this.reresizeColStart.bind(this);
    this.resizeColEnd = this.resizeColEnd.bind(this);
    this.resizeColMoving = this.resizeColMoving.bind(this);
  }

  resizeColStart () {}
  resizeColEnd () {}
  resizeColMoving () {}

  render () {
    return (
      <div />
    );
  }
}

import React from "react";
import {hide_id_num} from "@utils/hide-num";

function inputDecorate(WrappedComponent) {

  class Wrapper extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      if (this.props.hidenum && (this.node.input !== document.activeElement) && this.props.value) {
        this.node.input.value = hide_id_num(this.props.value);
      }
    }

    componentDidUpdate() {
      if (this.props.hidenum && (this.node.input !== document.activeElement) && this.props.value) {
        this.node.input.value = hide_id_num(this.props.value);
      }
    }

        handleBlur = () => {
          if (!this.props.hidenum) return;
          if (!this.props.value) return;
          this.node.input.value = hide_id_num(this.props.value);
        }

        handleFocus = () => {
          if (!this.props.hidenum) return;
          if (!this.props.value) return;
          this.node.input.value = this.props.value;
        }

        render() {
          const { hidenum, ...rest } = this.props;
          return <WrappedComponent {...rest}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            ref={node => this.node = node}/>;
        }
  }


  return Wrapper;
}

export default inputDecorate;
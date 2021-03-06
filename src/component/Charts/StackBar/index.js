import React, { Component } from "react";
import { Chart, Axis, Tooltip, Geom, Legend } from "bizcharts";
import Debounce from "lodash-decorators/debounce";
import Bind from "lodash-decorators/bind";
import autoHeight from "../autoHeight";
import styles from "../index.css";

@autoHeight()
class StackBar extends Component {
  state = {
    autoHideXLabels: false
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    const event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, false);
    window.dispatchEvent(event);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    console.log(canvasWidth);

    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false
      });
    }
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  render() {
    const {
      height,
      title,
      forceFit = true,
      data,
      color = "rgba(24, 144, 255, 0.85)",
      padding
    } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      x: {
        type: "cat"
      },
      y: {
        min: 0
      }
    };

    const tooltip = [
      "x*y",
      (x, y) => ({
        name: x,
        value: y
      })
    ];

    return (
      <div style={{ height}} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit
            data={data}
          >
            <Legend />
            <Axis
              name="x"
            />
            <Axis name="y" />
            <Tooltip />
            <Geom type='intervalStack' position="x*y" color={"name"} style={{stroke: "#fff", lineWidth: 1}}/>
          </Chart>
        </div>
      </div>
    );
  }
}

export default StackBar;

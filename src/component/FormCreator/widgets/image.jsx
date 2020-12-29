import React from "react";
import { Spin } from "antd";

import { getCosSourse } from "@apis/system/cos";

class Image extends React.PureComponent {
  static defaultProps = {
    src: "",
    alt: "图片",
  };

  state = {
    imageBase64: null,
  };
  getImage = (url) => {
    if (!url) {
      return;
    }
    getCosSourse({ file_name: url }).then((res) => {
      if (res && res.data && res.data.data) {
        const imageBase64 = `data:image/png;base64,${res.data.data}`;
        this.setState({
          imageBase64,
        });
      }
    });
  };

  render() {
    const { src } = this.props;
    const { imageBase64 } = this.state;
    this.getImage(src);
    return (
      <Spin
        spinning={
          src !== null && src !== undefined && src !== "" && imageBase64 === null
        }
      >
        <img {...this.props} src={imageBase64} />
      </Spin>
    );
  }
}

export default Image;

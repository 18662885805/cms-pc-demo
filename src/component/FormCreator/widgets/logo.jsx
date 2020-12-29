import React from "react";
import { Spin } from "antd";

import { getCosSourse } from "@apis/system/cos";

class Logo extends React.PureComponent {
  static defaultProps = {
    src: "",
    alt: "Logo",
  };

  state = {
    logoBase64: null,
  };
  getImage = (url) => {
    if (!url) {
      return;
    }
    getCosSourse({ file_name: url }).then((res) => {
      if (res && res.data && res.data.data) {
        const logoBase64 = `data:image/png;base64,${res.data.data}`;
        this.setState({
          logoBase64,
        });
      }
    });
  };

  render() {
    const { src } = this.props;
    const { logoBase64 } = this.state;
    this.getImage(src);
    return (
      <Spin
        spinning={
          src !== null && src !== undefined && src !== "" && logoBase64 === null
        }
      >
        <img {...this.props} src={logoBase64} />
      </Spin>
    );
  }
}

export default Logo;

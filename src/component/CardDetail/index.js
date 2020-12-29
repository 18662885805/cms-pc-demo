import React, { Component } from "react";
import {
  Card
} from "antd";

class CardDetail extends Component {
  render () {
    const { leftWidth, rightWidth } = this.props;

    const tableElement = <table style={{ width: "100%" }}>
      <tbody style={{ borderBottom: "1px solid #dee2e6" }}>
        {
          this.props.data.map((t, tIndex) => {
            return (
              <tr style={tIndex % 2 === 0 ? { background: "#fafafa" } : null} key={tIndex}>
                <td style={{
                  borderTop: "1px solid #dee2e6",
                  padding: "8px",
                  width: leftWidth || "25%",
                  color: "#333"
                }}>{t.text}</td>
                <td style={{
                  borderTop: "1px solid #dee2e6",
                  padding: "8px",
                  color: "#333",
                  width: rightWidth || "75%",
                  wordBreak: "break-all"
                }}>{t.value}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>;

    return (
      this.props.noCard
        ? tableElement
        : <Card
          title={this.props.title}
          style={{ width: "80%", margin: "0 auto 10px" }}>
          {tableElement}
          {this.props.children}
        </Card>
    );
  }
}

export default CardDetail;

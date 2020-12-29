import React, {Fragment} from "react";
import {
  Descriptions
} from "antd";

const DescItem = Descriptions.Item;

export default class extends React.Component {
  render() {

    const table =
      <Descriptions bordered title="" size="small">
        {
          this.props.data.map((t, tIndex) => {
            return (
              <DescItem label={t.text} span={3} key={tIndex}>
                {t.value}
              </DescItem>
            );
          })
        }
      </Descriptions>;

    return (
      <Fragment>
        {table}
      </Fragment>
    );
  }
}

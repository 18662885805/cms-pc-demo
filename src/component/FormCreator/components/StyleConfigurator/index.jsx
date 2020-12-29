import React from "react";
import { Card, Empty, Col, Row, Typography, Collapse } from "antd";
import StyleItem from "./style-item";
import { getStyleName } from "../../utils";

const { Text } = Typography;
const { Panel } = Collapse;

const marginEnum = [
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
];
const paddingEnum = [
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
];
const textEnum = [
  "fontSize",
  "fontWeight",
  "fontStyle",
  "fontFamily",
  "color",
  "textAlign",
  "textIndent",
  "textDecoration",
  "text-transform",
  "wordSpacing",
  "letterSpacing",
  "lineHeight",
];
const outwardEnum = ["background", "backgroundColor"];
const sizeEnum = [
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
];
const positionEnum = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "display",
  "zIndex",
];

const floatEnum = ["float", "clear"];

class StyleConfigurator extends React.PureComponent {
  ConfiguratorBox = (elements) => {
    const marginAndPaddingElements = [];
    const textElements = [];
    const outwardAndSizeElements = [];
    const positionElements = [];
    const floatElements = [];
    Object.entries(elements).map(([key, value]) => {
      if (marginEnum.indexOf(key) !== -1 || paddingEnum.indexOf(key) !== -1) {
        return marginAndPaddingElements.push(value);
      }
      if (textEnum.indexOf(key) !== -1) {
        return textElements.push(value);
      }
      if (outwardEnum.indexOf(key) !== -1 || sizeEnum.indexOf(key) !== -1) {
        return outwardAndSizeElements.push(value);
      }
      if (positionEnum.indexOf(key) !== -1) {
        return positionElements.push(value);
      }
      if (floatEnum.indexOf(key) !== -1) {
        return floatElements.push(value);
      }
    });
    return (
      <Collapse bordered={false} style={{ background: "#fff" }} accordion>
        {textElements.length > 0 ? (
          <Panel header="文本与字体" key="text">
            <Row>{textElements}</Row>
          </Panel>
        ) : null}
        {marginAndPaddingElements.length > 0 ? (
          <Panel header="边距" key="margin_padding">
            <Row>{marginAndPaddingElements}</Row>
          </Panel>
        ) : null}
        {outwardAndSizeElements.length > 0 ? (
          <Panel header="外观与尺寸" key="outward">
            <Row>{outwardAndSizeElements}</Row>
          </Panel>
        ) : null}
        {positionElements.length > 0 ? (
          <Panel header="定位" key="position">
            <Row>{positionElements}</Row>
          </Panel>
        ) : null}
        {floatElements.length > 0 ? (
          <Panel header="浮动" key="position">
            <Row>{floatElements}</Row>
          </Panel>
        ) : null}
      </Collapse>
    );
  };

  BoxPropsStyleConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (
      chosen.boxProps === undefined ||
      Object.keys(chosen.boxProps).length === 0 ||
      !chosen.boxProps.style ||
      Object.keys(chosen.boxProps.style).length === 0
    ) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无可配置项" />
      );
    }
    let elements = {};
    Object.entries(chosen.boxProps.style).map(([key, value]) => {
      elements[key] = (
        <Col
          key={`${chosen.name}-props-style-${key}`}
          span={12}
          style={{ padding: 5 }}
        >
          <StyleItem
            styleName={key}
            value={value}
            handleChange={(value) => {
              setPropertyValue(chosen.name)(`boxProps.style.${key}`, value);
            }}
          />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {getStyleName(key)}
          </Text>
        </Col>
      );
    });
    return this.ConfiguratorBox(elements);
  };

  PropsStyleConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (
      chosen.props.style === undefined ||
      Object.keys(chosen.props.style).length === 0
    ) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无可配置项" />
      );
    }
    let elements = {};
    Object.entries(chosen.props.style).map(([key, value]) => {
      elements[key] = (
        <Col
          key={`${chosen.name}-props-style-${key}`}
          span={12}
          style={{ padding: 5 }}
        >
          <StyleItem
            styleName={key}
            value={value}
            handleChange={(value) => {
              setPropertyValue(chosen.name)(`props.style.${key}`, value);
            }}
          />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {getStyleName(key)}
          </Text>
        </Col>
      );
    });

    return this.ConfiguratorBox(elements);
  };

  LabelStyleConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (
      chosen.formItemProps.style === undefined ||
      Object.keys(chosen.formItemProps.style).length === 0
    ) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无可配置项" />
      );
    }
    let elements = {};
    Object.entries(chosen.formItemProps.style).map(([key, value]) => {
      elements[key] = (
        <Col
          key={`${chosen.name}-formItemProps-style-${key}`}
          span={12}
          style={{ padding: 5 }}
        >
          <StyleItem
            styleName={key}
            value={value}
            handleChange={(value) => {
              setPropertyValue(chosen.name)(
                `formItemProps.style.${key}`,
                value
              );
            }}
          />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {getStyleName(key)}
          </Text>
        </Col>
      );
    });

    return this.ConfiguratorBox(elements);
  };

  render() {
    const { chosen } = this.props;
    return (
      <>
        <Card
          title="组件样式"
          size="small"
          style={{ marginBottom: 1 }}
          bodyStyle={{ padding: 0 }}
        >
          {this.PropsStyleConfigurator()}
        </Card>
        {chosen.formItemProps === false ? null : (
          <Card
            title="标签样式"
            size="small"
            style={{ marginBottom: 1 }}
            bodyStyle={{ padding: 0 }}
          >
            {this.LabelStyleConfigurator()}
          </Card>
        )}
        <Card
          title="盒子样式"
          size="small"
          style={{ marginBottom: 1 }}
          bodyStyle={{ padding: 0 }}
        >
          {this.BoxPropsStyleConfigurator()}
        </Card>
      </>
    );
  }
}

export default StyleConfigurator;

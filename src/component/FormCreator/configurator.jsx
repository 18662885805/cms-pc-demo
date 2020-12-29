import React from "react";
import { FormCreatorContext } from "./form-creator";
import {
  Empty,
  Tabs,
  Radio,
  Card,
  InputNumber,
  Collapse,
  Row,
  Col,
  Typography,
} from "antd";
import PropertyConfigurator from "./components/PropertyConfigurator";
import StyleConfigurator from "./components/StyleConfigurator";

const { TabPane } = Tabs;
const { Text } = Typography;
const { Panel } = Collapse;

class Configurator extends React.PureComponent {
  static contextType = FormCreatorContext;

  state = {
    tapActived: "1",
  };

  handleTapChange = (activeKey) => {
    this.setState({
      tapActived: activeKey,
    });
  };

  render() {
    const { chosen, schema, setSchemaProps, setPropertyValue } = this.context;
    const { tapActived } = this.state;

    const { props: schemaProps, properties } = schema;

    return (
      <Tabs
        activeKey={tapActived}
        onChange={(activeKey) => this.handleTapChange(activeKey)}
      >
        <TabPane tab="组件属性" key="1">
          {Object.keys(chosen).length === 0 || !chosen ? (
            <Empty
              description={
                properties.length === 0 ? "请添加组件" : "请选择组件"
              }
            />
          ) : (
            <PropertyConfigurator
              schemaProps={schemaProps}
              chosen={chosen}
              setPropertyValue={setPropertyValue}
            />
          )}
        </TabPane>
        <TabPane tab="样式配置" key="2">
          {Object.keys(chosen).length === 0 || !chosen ? (
            <Empty
              description={
                properties.length === 0 ? "请添加组件" : "请选择组件"
              }
            />
          ) : (
            <StyleConfigurator
              schemaProps={schemaProps}
              chosen={chosen}
              setPropertyValue={setPropertyValue}
            />
          )}
        </TabPane>
        <TabPane tab="表单属性" key="3">
          <Collapse bordered={false} style={{ background: "#fff" }}>
            <Panel header="表单布局" key="schemaProps.layout">
              <Radio.Group
                value={schemaProps.layout}
                onChange={(e) => {
                  setSchemaProps({
                    ...schemaProps,
                    layout: e.target.value,
                  });
                }}
              >
                <Radio.Button value="horizontal">水平</Radio.Button>
                <Radio.Button value="vertical">垂直</Radio.Button>
              </Radio.Group>
            </Panel>
            {schemaProps.layout !== "horizontal"
              ? null
              : [
                  <Panel header="标签对齐方式" key="schemaProps.labelAlign">
                    <Radio.Group
                      value={schemaProps.labelAlign}
                      onChange={(e) => {
                        setSchemaProps(
                          {
                            ...schemaProps,
                            labelAlign: e.target.value,
                          },
                          ["labelAlign", e.target.value]
                        );
                      }}
                    >
                      <Radio.Button value="left">左对齐</Radio.Button>
                      <Radio.Button value="right">右对齐</Radio.Button>
                    </Radio.Group>
                  </Panel>,
                  <Panel header="标签布局" key="schemaProps.labelCol">
                    <Row>
                      <Col span={12} style={{ padding: 5 }}>
                        <InputNumber
                          min={0}
                          max={24}
                          value={schemaProps.labelCol.span}
                          onChange={(value) => {
                            setSchemaProps(
                              {
                                ...schemaProps,
                                labelCol: {
                                  ...schemaProps.labelCol,
                                  span: value,
                                },
                              },
                              ["labelCol.span", value]
                            );
                          }}
                        />
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Span
                        </Text>
                      </Col>
                      <Col span={12} style={{ padding: 5 }}>
                        <InputNumber
                          min={0}
                          max={24}
                          value={schemaProps.labelCol.offset}
                          onChange={(value) => {
                            setSchemaProps(
                              {
                                ...schemaProps,
                                labelCol: {
                                  ...schemaProps.labelCol,
                                  offset: value,
                                },
                              },
                              ["labelCol.offset", value]
                            );
                          }}
                        />
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Offset
                        </Text>
                      </Col>
                    </Row>
                  </Panel>,
                ]}
            <Panel header="组件布局" key="schemaProps.wrapperCol">
              <Row>
                <Col span={12} style={{ padding: 5 }}>
                  <InputNumber
                    min={0}
                    max={24}
                    value={schemaProps.wrapperCol.span}
                    onChange={(value) => {
                      setSchemaProps(
                        {
                          ...schemaProps,
                          wrapperCol: {
                            ...schemaProps.wrapperCol,
                            span: value,
                          },
                        },
                        ["wrapperCol.span", value]
                      );
                    }}
                  />
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Span
                  </Text>
                </Col>
                <Col span={12} style={{ padding: 5 }}>
                  <InputNumber
                    min={0}
                    max={24}
                    value={schemaProps.wrapperCol.offset}
                    onChange={(value) => {
                      setSchemaProps(
                        {
                          ...schemaProps,
                          wrapperCol: {
                            ...schemaProps.wrapperCol,
                            offset: value,
                          },
                        },
                        ["wrapperCol.offset", value]
                      );
                    }}
                  />
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Offset
                  </Text>
                </Col>
              </Row>
            </Panel>
            <Panel header="必选标记" key="schemaProps.hideRequiredMark">
              <Radio.Group
                value={schemaProps.hideRequiredMark}
                onChange={(e) => {
                  setSchemaProps({
                    ...schemaProps,
                    hideRequiredMark: e.target.value,
                  });
                }}
              >
                <Radio.Button value={false}>显示</Radio.Button>
                <Radio.Button value={true}>隐藏</Radio.Button>
              </Radio.Group>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>
    );
  }
}

export default Configurator;

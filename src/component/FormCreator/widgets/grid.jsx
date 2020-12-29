import React from "react";
import { Col } from "antd";
import { ReactSortable } from "react-sortablejs";
import { FormCreatorContext } from "../form-creator";
import ViewItem from "../components/ViewItem";
import ghost from "../ghost.module.css";

class Grid extends React.PureComponent {
  static contextType = FormCreatorContext;

  static defaultProps = {
    rowCount: 2,
    property: {},
  };

  ColRender = () => {
    const { rowCount, property, form, initialvalues } = this.props;

    const { getWidget, chosen, remove, setChosen, renderEditor } = this.context;

    const properties = property.properties || [];

    const elements = properties.map((_property) => {
      return (
        <Col span={Math.floor(24 / rowCount)} key={_property.name}>
          <ViewItem
            key={_property.name}
            property={_property}
            chosenName={chosen.name || null}
            widget={getWidget(_property.tagName)}
            handleRemove={(name) => remove(name)}
            handleChoose={setChosen}
            renderEditor={renderEditor}
            form={form}
            initialvalues={initialvalues}
          />
        </Col>
      );
    });
    return elements;
  };

  render() {
    const { setProperties, renderEditor } = this.context;
    const { property } = this.props;
    const properties = property.properties || [];
    if (!renderEditor) {
      return <div style={{ overflow: "auto" }}>{this.ColRender()}</div>;
    }
    return (
      <ReactSortable
        className="ant-row"
        animation={125}
        group="form-creator"
        list={properties}
        setList={(properties) => {
          const newProperties = properties.map((property, index) => {
            if (property.name || property.formItemProps === false) {
              return property;
            }
            return {
              ...property,
              formItemProps: {
                ...property.formItemProps,
                labelCol: {
                  span: index % 2 === 0 ? 8 : 4,
                  offset: 0,
                },
                wrapperCol: {
                  span: 12,
                  offset: 0,
                },
              },
            };
          });
          setProperties(property.name)(newProperties);
        }}
        style={{
          width: "100%",
          minHeight: 40,
          border: "1px dashed #999",
          padding: 10,
        }}
        ghostClass={ghost.ghost4}
      >
        {this.ColRender()}
      </ReactSortable>
    );
  }
}

export default Grid;

import React from "react";
import { Form } from "antd";
import ViewItemBox from "./box";
import _ from "lodash";
import moment from "moment";

class ViewItem extends React.PureComponent {
  createWidgetElement = (Widget, props, children) => {
    return React.createElement(Widget, { ...props, style: {} }, children);
  };

  createLabelElement = (children) => {
    return React.createElement("span", { style: {} }, children);
  };
  render() {
    const {
      property,
      widget,
      handleChoose,
      chosenName,
      handleRemove,
      renderEditor,
      form,
      initialvalues,
    } = this.props;

    let converted = property;
    if (widget.fieldConvertor) {
      converted = widget.fieldConvertor(property);
    }
    const Widget = widget.widget;
    const children = converted.children || converted.props.children || null;

    let widgetProps = {
      ...converted.props,
      property: converted,
      form: form,
      initialvalues: initialvalues,
    };

    if (initialvalues && initialvalues[converted.name]) {
      widgetProps["initialvalue"] = initialvalues[converted.name];
    }

    const widgetElement = this.createWidgetElement(
      Widget,
      widgetProps,
      children
    );

    /* console.log(converted.name, converted.props.style) */
    // Solution for style is read-only
    if (
      converted.props.style &&
      Object.keys(converted.props.style).length > 0
    ) {
      Object.entries(converted.props.style).map(([key, value]) => {
        widgetElement.props.style[key] = value;
      });
    }

    if (converted.formItemProps === false) {
      return (
        <ViewItemBox
          property={converted}
          handleChoose={handleChoose}
          chosenName={chosenName}
          handleRemove={handleRemove}
          renderEditor={renderEditor}
        >
          {widgetElement}
        </ViewItemBox>
      );
    }
    let formItemProps = Object.assign(
      { label: converted.tagName },
      converted.formItemProps
    );

    const { getFieldDecorator } = form;
    const LabelElement = this.createLabelElement(formItemProps.label);

    // Solution for style is read-only
    if (formItemProps.style && Object.keys(formItemProps.style).length > 0) {
      Object.entries(formItemProps.style).map(([key, value]) => {
        LabelElement.props.style[key] = value;
      });
    }
    // console.log(converted)
    let fieldDecoratorProps = {
      rules: formItemProps.rules,
      valuePropName: formItemProps.valuePropName || "value",
    };
    if (initialvalues && initialvalues[converted.name]) {
      let initialValue = initialvalues[converted.name];

      if (
        converted.tagName === "DatePicker" &&
        typeof initialValue === "string"
      ) {
        initialValue = moment(initialValue);
      }
      fieldDecoratorProps["initialValue"] = initialValue;
    }
    _.unset(formItemProps, "initialvalue");
    _.unset(formItemProps, "valuePropName");

    return (
      <ViewItemBox
        property={converted}
        handleChoose={handleChoose}
        chosenName={chosenName}
        handleRemove={handleRemove}
        renderEditor={renderEditor}
      >
        <Form.Item {...formItemProps} label={LabelElement}>
          {getFieldDecorator(
            converted.name,
            fieldDecoratorProps
          )(widgetElement)}
        </Form.Item>
      </ViewItemBox>
    );
  }
}

export default ViewItem;

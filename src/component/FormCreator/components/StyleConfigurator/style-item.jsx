import React from "react";
import { Input, InputNumber, Select, Popover } from "antd";
import { ChromePicker } from "react-color";

class StyleItem extends React.PureComponent {
  state = {
    displayColorPicker: false,
  };

  handleColorPickerOpen = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  render() {
    const { styleName, value, handleChange } = this.props;
    switch (styleName) {
      case "fontSize":
      case "textIndent":
      case "wordSpacing":
      case "letterSpacing":
      case "margin":
      case "marginTop":
      case "marginRight":
      case "marginBottom":
      case "marginLeft":
      case "padding":
      case "paddingTop":
      case "paddingRight":
      case "paddingBottom":
      case "paddingLeft":
        return (
          <InputNumber
            min={0}
            max={200}
            value={value}
            formatter={(value) => `${value}px`}
            parser={(value) => value.replace("px", "")}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          />
        );
      case "lineHeight":
        return (
          <InputNumber
            min={1}
            max={100}
            step={0.1}
            value={value}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          />
        );
      case "textDecoration":
        return (
          <Select
            value={value}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          >
            <Select.Option value="none">无装饰</Select.Option>
            <Select.Option value="overline">上划线</Select.Option>
            <Select.Option value="line-through">贯穿线</Select.Option>
            <Select.Option value="underline">下划线</Select.Option>
          </Select>
        );
      case "float":
        return (
          <Select
            value={value}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          >
            <Select.Option value="left">左浮动</Select.Option>
            <Select.Option value="right">右浮动</Select.Option>
            <Select.Option value="none">无浮动</Select.Option>
          </Select>
        );
      case "width":
      case "height":
        return (
          <Input
            value={value}
            onChange={(e) => {
              const { value } = e.target;
              handleChange(value);
            }}
          />
        );
      case "textAlign":
        return (
          <Select
            value={value}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          >
            <Select.Option value="left">居左</Select.Option>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="right">居右</Select.Option>
          </Select>
        );
      case "fontWeight":
        return (
          <Select
            value={value}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          >
            <Select.Option value="normal">normal</Select.Option>
            <Select.Option value="blod">blod</Select.Option>
            <Select.Option value="bloder">bloder</Select.Option>
            <Select.Option value="light">light</Select.Option>
            <Select.Option value="lighter">lighter</Select.Option>
            <Select.Option value={100}>100</Select.Option>
            <Select.Option value={200}>200</Select.Option>
            <Select.Option value={300}>300</Select.Option>
            <Select.Option value={400}>400</Select.Option>
            <Select.Option value={500}>500</Select.Option>
            <Select.Option value={600}>600</Select.Option>
            <Select.Option value={700}>700</Select.Option>
            <Select.Option value={800}>800</Select.Option>
            <Select.Option value={900}>900</Select.Option>
            <Select.Option value="inherit">inherit</Select.Option>
          </Select>
        );
      case "color":
      case "backgroundColor":
        return (
          <Popover
            content={
              <ChromePicker
                color={value}
                onChange={(color) => {
                  const { rgb } = color;
                  const value =
                    rgb.a === 1
                      ? color.hex
                      : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
                  handleChange(value);
                }}
              />
            }
          >
            <div
              style={{
                padding: "3px",
                background: "#fff",
                borderRadius: "1px",
                boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                display: "inline-block",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "25px",
                  borderRadius: "2px",
                  background: value,
                }}
              />
            </div>
          </Popover>
        );
      case "position":
        return (
          <Select
            value={value}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          >
            <Select.Option value="absolute">绝对定位</Select.Option>
            <Select.Option value="relative">相对定位</Select.Option>
            <Select.Option value="static">默认值</Select.Option>
            <Select.Option value="inherit">inherit</Select.Option>
          </Select>
        );
      case "zIndex":
        return (
          <InputNumber
            value={value}
            onChange={(value) => {
              handleChange(value);
            }}
            style={{ width: "100%" }}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => {
              const { value } = e.target;
              handleChange(value);
            }}
          />
        );
    }
  }
}

export default StyleItem;

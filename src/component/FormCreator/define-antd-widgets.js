import React from "react";
import FormCreator from "./form-creator";
import {
  Input,
  Checkbox,
  Switch,
  Button,
  Select,
  InputNumber,
  Radio,
  DatePicker,
  Rate,
  Typography,
  Divider,
} from "antd";
import _ from "lodash";
import Grid from "./widgets/grid";
import Logo from "./widgets/logo";
import Image from "./widgets/image";
import Upload from "./widgets/upload";
import Paragraph from "./widgets/paragraph";

const mapOptions = (options) => {
  if (!_.isArray(options)) {
    throw new Error("Options should be array");
  }
  return options.map((opt) => {
    if (_.isArray(opt)) {
      return { value: opt[0], label: opt[1] };
    } else if (_.isPlainObject(opt)) {
      return opt;
    } else {
      return { value: opt, label: opt };
    }
  });
};

FormCreator.defineWidget(
  Input,
  {
    tagName: "Input",
    widgetName: "文本框",
  },
  {
    formItemProps: {
      label: "文本框",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      placeholder: "",
      disabled: false,
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.65)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  Input.TextArea,
  {
    tagName: "TextArea",
    widgetName: "多行文本",
  },
  {
    formItemProps: {
      label: "多行文本框",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      placeholder: "",
      disabled: false,
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.65)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  InputNumber,
  {
    tagName: "InputNumber",
    widgetName: "数字输入",
  },
  {
    formItemProps: {
      label: "数量",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      disabled: false,
      style: {
        width: "156px",
        height: "31.6px",
        fontSize: "12px",
        fontWeight: "normal",
        color: "rgba(0, 0, 0, 0.65)",
        backgroundColor: "#fff",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  Radio.Group,
  {
    tagName: "RadioGroup",
    widgetName: "单选框组",
  },
  {
    options: ["选项1", "选项2", "选项3"],
    formItemProps: {
      label: "单选框组",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        color: "rgba(0, 0, 0, 0.85)",
        textDecoration: "none",
        letterSpacing: "0",
      },
    },
    props: {
      buttonGroup: false,
      disabled: false,
      style: {
        width: "100%",
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.65)",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  },
  (field) => {
    const RadioComp = field.props.buttonGroup ? Radio.Button : Radio;
    if (field.options && !field.children) {
      return {
        ...field,
        children: mapOptions(field.options).map((opt) => (
          <RadioComp
            value={opt.value}
            key={opt.value}
            style={{
              fontSize: field.props.style.fontSize || "12px",
              color: field.props.style.color || "rgba(0, 0, 0, 0.65)",
              fontWeight: field.props.style.fontWeight || "normal",
              textDecoration: field.props.style.textDecoration || "none",
              letterSpacing: field.props.style.letterSpacing || "0",
            }}
          >
            {opt.label}
          </RadioComp>
        )),
      };
    }
    return field;
  }
);

FormCreator.defineWidget(
  Checkbox.Group,
  {
    tagName: "CheckboxGroup",
    widgetName: "多选框组",
  },
  {
    options: ["选项1", "选项2", "选项3"],
    formItemProps: {
      label: "多选框组",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      disabled: false,
      style: {
        width: "100%",
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.65)",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  },
  (field) => {
    if (field.options && !field.children) {
      return {
        ...field,
        children: mapOptions(field.options).map((opt) => (
          <Checkbox
            value={opt.value}
            key={opt.value}
            style={{
              fontSize: field.props.style.fontSize || "12px",
              fontWeight: field.props.style.fontWeight || "normal",
              textDecoration: field.props.style.textDecoration || "none",
              letterSpacing: field.props.style.letterSpacing || "0",
              color: field.props.style.color || "rgba(0, 0, 0, 0.65)",
            }}
          >
            {opt.label}
          </Checkbox>
        )),
      };
    }
    return field;
  }
);

FormCreator.defineWidget(
  Select,
  {
    tagName: "Select",
    widgetName: "下拉选择框",
  },
  {
    options: ["选项1", "选项2", "选项3"],
    formItemProps: {
      label: "下拉选择框",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      disabled: false,
      style: {
        width: "100%",
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.65)",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  },
  (field) => {
    if (field.options && !field.children) {
      return {
        ...field,
        children: mapOptions(field.options).map((opt) => (
          <Select.Option
            value={opt.value}
            key={opt.value}
            style={{
              fontSize: field.props.style.fontSize || "12px",
              fontWeight: field.props.style.fontWeight || "normal",
              textDecoration: field.props.style.textDecoration || "none",
              letterSpacing: field.props.style.letterSpacing || "0",
              color: field.props.style.color || "rgba(0, 0, 0, 0.65)",
            }}
          >
            {opt.label}
          </Select.Option>
        )),
      };
    }
    return field;
  }
);

FormCreator.defineWidget(
  DatePicker,
  {
    tagName: "DatePicker",
    widgetName: "日期选择器",
  },
  {
    formItemProps: {
      label: "日期",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      disabled: false,
      showTime: false,
      style: {
        width: "156px",
        height: "31.6px",
        backgroundColor: "#fff",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  Rate,
  {
    tagName: "Rate",
    widgetName: "评分",
  },
  {
    formItemProps: {
      label: "评分",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      disabled: false,
      style: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  Switch,
  {
    tagName: "Switch",
    widgetName: "开关",
  },
  {
    formItemProps: {
      valuePropName: "checked",
      label: "开关",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      disabled: false,
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  Upload,
  {
    tagName: "Upload",
    widgetName: "文件上传",
    sort: "advanced",
  },
  {
    formItemProps: {
      valuePropName: "fileList",
      label: "文件",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        textDecoration: "none",
        letterSpacing: "0",
        color: "rgba(0, 0, 0, 0.85)",
      },
    },
    props: {
      children: "选择文件",
    },
  }
);

FormCreator.defineWidget(
  Typography.Title,
  {
    tagName: "Title",
    widgetName: "标题",
  },
  {
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    props: {
      children: "标题",
      style: {
        fontSize: "20px",
        fontWeight: 500,
        textAlign: "center",
        lineHeight: 1.5,
        textDecoration: "none",
        letterSpacing: "0",
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "20px",
        marginLeft: "0px",
        color: "#000",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    formItemProps: false,
  },
  (field) => {
    return {
      ...field,
      children: field.props.children,
    };
  }
);

FormCreator.defineWidget(
  Paragraph,
  {
    tagName: "Paragraph",
    widgetName: "段落",
  },
  {
    formItemProps: false,
    props: {
      children: "这是一行文本",
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        lineHeight: 1.5,
        textAlign: "left",
        textIndent: "24px",
        textDecoration: "none",
        letterSpacing: "0",
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "12px",
        marginLeft: "0px",
        color: "rgba(0, 0, 0, 0.65)",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  },
  (field) => {
    return {
      ...field,
      children: field.props.children,
    };
  }
);

FormCreator.defineWidget(
  Grid,
  {
    tagName: "Grid",
    widgetName: "栅格布局",
    sort: "layout",
  },
  {
    formItemProps: false,
    props: {
      rowCount: 2,
    },
  }
);

FormCreator.defineWidget(
  Divider,
  {
    tagName: "Divider",
    widgetName: "分割线",
    sort: "layout",
  },
  {
    formItemProps: false,
    props: {
      children: "分割线",
      orientation: "center",
      dashed: false,
      style: {
        fontSize: "12px",
        fontWeight: "normal",
        lineHeight: 1.57,
        letterSpacing: "0",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "16px",
        marginRight: "0px",
        marginBottom: "16px",
        marginLeft: "0px",
        color: "rgba(0, 0, 0, 0.65)",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  Logo,
  {
    tagName: "Logo",
    widgetName: "Logo",
    sort: "advanced",
    disabled: true
  },
  {
    formItemProps: false,
    props: {
      src: "",
      alt: "Logo",
      style: {
        width: "100%",
      },
    },
    boxProps: {
      style: {
        width: "100px",
        position: "absolute",
        zIndex: 1000,
        top: "0px",
        right: "",
        bottom: "",
        left: "0px",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

FormCreator.defineWidget(
  Image,
  {
    tagName: "Image",
    widgetName: "图片",
    sort: "advanced",
  },
  {
    formItemProps: false,
    props: {
      src: "",
      alt: "图片",
      style: {
        width: "150px",
      },
    },
    boxProps: {
      style: {
        width: "100%",
        textAlign: 'center',
        zIndex: 1,
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
    },
  }
);

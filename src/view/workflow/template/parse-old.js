
const { v4 } = require('uuid')

const parseOld = (old) => {
  let schema = {
    props: {
      hideRequiredMark: false,
      labelAlign: "right",
      layout: "horizontal",
      labelCol: {
        span: 6,
        offset: 0,
      },
      wrapperCol: {
        span: 20,
        offset: 0,
      },
      size: "middle",
    },
    properties: [],
  };

  if (old.config) {
    if (old.config.labelWidth) {
      schema.props.labelCol.span = old.config.labelWidth;
    }
    if (old.config.labelPosition) {
      schema.props.labelAlign = old.config.labelPosition;
    }

    if (old.data && old.data.length > 0) {
      old.data.forEach((element) => {
        /* if (element.type === 'logo') {
          schema.properties.push({
            name: `Logo_${new Date().getTime()}`,
            tagName: 'Logo',
            formItemProps: false,
          })
        } */
        if (element.type === "input") {
          const name = element.fieldName || `Input_${v4()}`;
          schema.properties.push({
            name,
            tagName: "Input",
            formItemProps: {
              label: element.label || "文本框",
              name,
              labelAlign: old.config.labelPosition || "right",
              labelCol: {
                span: old.config.labelWidth || 6,
                offset: 0,
              },
              wrapperCol: {
                span: 20,
                offset: 0,
              },
              rules: [
                {
                  required: element.required || false,
                  message: element.requiredMessage || "必填项",
                },
              ],
              style: {
                fontSize: "14px",
                fontWeight: "normal",
                color: "rgba(0, 0, 0, 0.85)",
                textDecoration: "none",
                letterSpacing: "0",
              },
            },
            boxProps: {
              style: {
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0)",
                paddingTop: "0px",
                paddingRight: "0px",
                paddingBottom: "0px",
                paddingLeft: "0px",
                marginTop: "0px",
                marginRight: "0px",
                marginBottom: "0px",
                marginLeft: "0px",
              },
            },
            props: {
              placeholder: "",
              disabled: false,
              style: {
                fontSize: "14px",
                fontWeight: "normal",
                color: "rgba(0, 0, 0, 0.65)",
                textDecoration: "none",
                letterSpacing: "0",
              },
            },
          });
        }
        if (element.type === 'textarea') {
          const name = element.fieldName || `TextArea_${v4()}`;
          schema.properties.push({
            name,
            tagName: "TextArea",
            formItemProps: {
              label: element.label || "多行文本框",
              name,
              labelAlign: old.config.labelPosition || "right",
              labelCol: {
                span: old.config.labelWidth || 6,
                offset: 0,
              },
              wrapperCol: {
                span: 20,
                offset: 0,
              },
              rules: [
                {
                  required: element.required || false,
                  message: element.requiredMessage || "必填项",
                },
              ],
              style: {
                fontSize: "14px",
                fontWeight: "normal",
                color: "rgba(0, 0, 0, 0.85)",
                textDecoration: "none",
                letterSpacing: "0",
              },
            },
            boxProps: {
              style: {
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0)",
                paddingTop: "0px",
                paddingRight: "0px",
                paddingBottom: "0px",
                paddingLeft: "0px",
                marginTop: "0px",
                marginRight: "0px",
                marginBottom: "0px",
                marginLeft: "0px",
              },
            },
            props: {
              placeholder: "",
              disabled: false,
              style: {
                fontSize: "14px",
                fontWeight: "normal",
                color: "rgba(0, 0, 0, 0.65)",
                textDecoration: "none",
                letterSpacing: "0",
              },
            },
          });
        }
      });
    }
  }
  return schema;
};

export default parseOld;

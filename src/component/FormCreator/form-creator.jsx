import React, { createContext, createRef } from "react";
import { fieldMapNormalizer, filterProperties, getProperty } from "./utils";
import PropTypes from "prop-types";
import _ from "lodash";
import { message } from "antd";

const widgetMap = {};
const sortList = ["basic", "advanced", "layout"];

const getWidget = (widget) => {
  if (widget === undefined) {
    return;
  }
  if (!widgetMap[widget] || !widgetMap[widget].widget) {
    throw new Error(`Widget '${widget}' not found.`);
  }
  return widgetMap[widget];
};

export const FormCreatorContext = createContext({
  schema: {},
  fieldMap: {},
  widgetMap: {},
  chosen: {},
  append: () => {},
  setProperties: () => () => {},
  renderEditor: true,
});

const defaultSchemaProps = {
  hideRequiredMark: false,
  labelAlign: "right",
  layout: "horizontal",
  labelCol: {
    span: 4,
    offset: 0,
  },
  wrapperCol: {
    span: 16,
    offset: 0,
  },
};
const defaultSchema = {
  props: defaultSchemaProps,
  properties: [],
  logo: {},
};

const defaultLogoProps = {
  style: {
    maxWidth: "100px",
    position: "absolute",
    top: "1px",
    right: "1px",
  },
};

class FormCreator extends React.PureComponent {
  state = {
    schema: defaultSchema,
    fieldMap: [],
    chosen: {},
  };

  static propTypes = {
    renderEditor: PropTypes.bool,
    initialSchema: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    schema: null,
    renderEditor: true,
    initialSchema: {},
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.initialized = createRef(false);
  }

  initialSchemaNormalizer = (initialSchema) => {
    let result = {
      ...defaultSchema,
    };
    if (initialSchema.props) {
      result.props = initialSchema.props;
    }
    if (initialSchema.properties && initialSchema.properties.length > 0) {
      result.properties = initialSchema.properties;
    }
    if (initialSchema.logo) {
      if (initialSchema.logo.props) {
        result.logo = initialSchema.logo;
      } else {
        result.logo = {
          ...initialSchema.logo,
          props: defaultLogoProps,
        };
      }
    }
    return result;
  };

  componentDidMount() {
    const { initialSchema, onChange } = this.props;
    const fieldMap = fieldMapNormalizer(widgetMap);
    this.setState({
      fieldMap,
    });

    if (!this.initialized.current) {
      this.initialized.current = true;
      if (initialSchema) {
        if (typeof initialSchema === "string") {
          const initialSchemaObejct = JSON.parse(initialSchema);
          if (Object.keys(initialSchemaObejct).length > 0) {
            const schema = this.initialSchemaNormalizer(initialSchemaObejct);
            this.setState({
              schema,
            });
            onChange(schema);
          }
        } else if (typeof initialSchema === "object") {
          if (Object.keys(initialSchema).length > 0) {
            const schema = this.initialSchemaNormalizer(initialSchema);
            this.setState({
              schema,
            });
            onChange(schema);
          }
        }
      }
    }
  }

  propertiesNormalizer = (properties) => {
    const { schema } = this.state;
    const { props: schemaProps } = schema;
    return properties.map((property) => {
      if (property.name) {
        return property;
      }
      let propertyValue = {
        name: `${property.tagName}_${new Date().getTime()}`,
        tagName: property.tagName,
      };
      propertyValue.formItemProps =
        property.formItemProps === undefined ? {} : property.formItemProps;

      if (propertyValue.formItemProps !== false) {
        const defaultFormItemProps = {
          valuePropName: "value",
          label: propertyValue.tagName,
          name: propertyValue.name,
          labelAlign: schemaProps.labelAlign || "right",
          labelCol: {
            span: schemaProps.labelCol.span || 4,
            offset: schemaProps.labelCol.offset || 0,
          },
          wrapperCol: {
            span: schemaProps.wrapperCol.span || 16,
            offset: schemaProps.wrapperCol.offset || 0,
          },
          rules: [
            {
              required: false,
              message: "必填项",
            },
          ],
        };
        propertyValue.formItemProps = {
          ...defaultFormItemProps,
          ...propertyValue.formItemProps,
        };
      }
      const widgetProps = property.widgetProps || {};
      const props = property.props || {};

      propertyValue.boxProps = property.boxProps || {};
      propertyValue.props = {
        ...widgetProps,
        ...props,
      };
      if (property.options) {
        propertyValue.options = property.options;
      }

      this.setState({
        chosen: propertyValue,
      });
      return propertyValue;
    });
  };

  mapSchemaProperties = (name, schemaProperties, properties) => {
    return schemaProperties.map((property) => {
      if (name === property.name) {
        return {
          ...property,
          properties: this.propertiesNormalizer(properties),
        };
      }

      if (property.properties) {
        return {
          ...property,
          properties: this.mapSchemaProperties(
            name,
            property.properties,
            properties
          ),
        };
      }

      return property;
    });
  };

  setProperties = (name = null) => (properties) => {
    const { onChange } = this.props;
    let propertiesValue = [];
    if (name) {
      const { schema } = this.state;
      propertiesValue = this.mapSchemaProperties(
        name,
        schema.properties,
        properties
      );
    } else {
      propertiesValue = this.propertiesNormalizer(properties);
    }
    const newSchema = {
      ...this.state.schema,
      properties: propertiesValue,
    };
    this.setState({
      schema: newSchema,
    });
    onChange(newSchema);
  };

  setSchemaProps = (props, kv = null) => {
    const { schema } = this.state;
    if (kv && Object.keys(schema.properties).length > 0) {
      const newProperties = this.setPropertyValue("all", schema.properties)(
        `formItemProps.${kv[0]}`,
        kv[1]
      );
      this.setState({
        schema: {
          props,
          properties: newProperties,
        },
      });
      const chosenValue = getProperty(this.state.chosen.name, newProperties);
      this.setState({
        chosen: chosenValue,
      });
    } else {
      this.setState({
        schema: {
          ...schema,
          props,
        },
      });
    }
  };

  setPropertyValue = (name, schemaProperties) => (propertyKey, value) => {
    return schemaProperties.map((property) => {
      if (name === "all") {
        if (property.properties) {
          /* 此处判断为，避免修改 formItemProps 为 false 时的情况
          修改全部属性暂时只有 formItemProps，如需要更多需要修改此处判断 */
          if (property.formItemProps === false) {
            return {
              ...property,
              properties: this.setPropertyValue(name, property.properties)(
                propertyKey,
                value
              ),
            };
          }
          return {
            ..._.set(_.cloneDeep(property), propertyKey, value),
            properties: this.setPropertyValue(name, property.properties)(
              propertyKey,
              value
            ),
          };
        }
        /* 此处判断为，避免修改 formItemProps 为 false 时的情况
          修改全部属性暂时只有 formItemProps，如需要更多需要修改此处判断 */
        if (property.formItemProps === false) {
          return property;
        }
        return _.set(_.cloneDeep(property), propertyKey, value);
      }
      if (name === property.name) {
        return _.set(_.cloneDeep(property), propertyKey, value);
      }
      if (property.properties) {
        return {
          ...property,
          properties: this.setPropertyValue(name, property.properties)(
            propertyKey,
            value
          ),
        };
      }
      return property;
    });
  };

  render() {
    const { children, renderEditor, schema: propsSchema } = this.props;
    const { schema: stateSchema, fieldMap, chosen } = this.state;

    let schema = stateSchema;
    if (propsSchema) {
      if (typeof propsSchema === "string") {
        const propsSchemaObejct = JSON.parse(propsSchema);
        if (Object.keys(propsSchemaObejct).length > 0) {
          if (!propsSchemaObejct.props || !propsSchemaObejct.properties) {
            message.error("旧表单已不受支持，请重新创建表单！");
          } else {
            schema = propsSchemaObejct;
          }
        }
      } else if (typeof propsSchema === "object") {
        if (Object.keys(propsSchema).length > 0) {
          if (!propsSchema.props || !propsSchema.properties) {
            message.error("旧表单已不受支持，请重新创建表单！");
          } else {
            schema = propsSchema;
          }
        }
      }
    }
    const { properties } = schema;

    const contextValue = {
      renderEditor,
      schema,
      fieldMap,
      widgetMap,
      chosen,
      append: (property) => {
        this.setProperties()(properties.concat([property]));
      },
      remove: (name) => {
        this.setProperties()(filterProperties(name, properties));
        if (chosen.name && chosen.name === name) {
          this.setState({
            chosen: {},
          });
        }
      },
      setChosen: (name) => {
        const chosenValue = getProperty(name, _.cloneDeep(properties));
        this.setState({
          chosen: chosenValue,
        });
      },
      getWidget,
      toJson: () => properties,
      setProperties: this.setProperties,
      setSchemaProps: this.setSchemaProps,
      setPropertyValue: (name) => (propertyKey, value) => {
        const newProperties = this.setPropertyValue(name, properties)(
          propertyKey,
          value
        );
        this.setProperties()(newProperties);
        const chosenValue = getProperty(name, newProperties);
        this.setState({
          chosen: chosenValue,
        });
      },
    };
    // console.log('contextValue', contextValue);
    return (
      <FormCreatorContext.Provider value={contextValue}>
        {typeof children === "function" ? children(contextValue) : children}
      </FormCreatorContext.Provider>
    );
  }
}

FormCreator.defineWidget = (
  widget,
  widgetProps,
  props = {},
  fieldConvertor = null
) => {
  if (widgetMap[widgetProps.tagName]) {
    throw new Error(`Widget "${widget.name}" already defined.`);
  }
  const disabled = widgetProps.disabled || false;
  let sort = widgetProps.sort || "basic";
  if (sortList.indexOf(sort) === -1) {
    sort = "basic";
  }
  widgetMap[widgetProps.tagName] = {
    widget,
    widgetName: widgetProps.widgetName,
    ...props,
    sort,
    disabled,
    fieldConvertor,
  };
};

export default FormCreator;

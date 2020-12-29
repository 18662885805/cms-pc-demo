import React from "react";
import PropTypes from "prop-types";
import { ReactSortable } from "react-sortablejs";
import { FormCreatorContext } from "./form-creator";
import { Form } from "antd";
import ViewItem from "./components/ViewItem";
import ghost from "./ghost.module.css";
import _ from "lodash";

const ColPropTypes = {
  span: PropTypes.number,
  offset: PropTypes.number,
};

class Render extends React.PureComponent {
  static contextType = FormCreatorContext;

  static propTypes = {
    hideRequiredMark: PropTypes.bool,
    labelAlign: PropTypes.oneOf(["left", "right"]),
    layout: PropTypes.oneOf(["horizontal", "vertical", "inline"]),
    labelCol: PropTypes.exact(ColPropTypes),
    wrapperCol: PropTypes.exact(ColPropTypes),
  };

  static defaultProps = {
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
    initialvalues: null
  };
  componentDidMount() {
    const { setSchemaProps } = this.context;
    /*     const { initialvalues } = this.props */
    const {
      hideRequiredMark,
      labelAlign,
      layout,
      labelCol,
      wrapperCol,
      size,
    } = this.props;
    setSchemaProps({
      hideRequiredMark,
      labelAlign,
      layout,
      labelCol,
      wrapperCol,
      size,
    });
    /* if (initialvalues) {
      setTimeout(()=> {
        this.props.form.setFieldsValue(initialvalues)
      }, 10)
    } */
  }

  render() {
    const {
      renderEditor,
      schema,
      setProperties,
      getWidget,
      setChosen,
      chosen,
      remove,
    } = this.context;
    const { props, properties } = schema;
    const { children, form, initialvalues } = this.props;

    const elements = properties.map((property) => {
      return (
        <ViewItem
          key={property.name}
          property={property}
          chosenName={chosen.name || null}
          widget={getWidget(property.tagName)}
          handleRemove={(name) => remove(name)}
          handleChoose={setChosen}
          renderEditor={renderEditor}
          form={form}
          initialvalues={initialvalues}
        />
      );
    });
    const formProps = Object.assign({}, this.props);
    _.unset(formProps, "initialvalues");
    return (
      <Form {...formProps} {...props}>
        {renderEditor ? (
          <ReactSortable
            animation={125}
            group="form-creator"
            list={properties}
            setList={(fields) => {
              setProperties()(fields);
            }}
            {...formProps}
            ghostClass={ghost.ghost1}
            style={{
              paddingBottom: 100
            }}
          >
            {elements}
          </ReactSortable>
        ) : (
          elements
        )}
        {children}
      </Form>
    );
  }
}

const RenderForm = Form.create()(Render);

export default RenderForm;

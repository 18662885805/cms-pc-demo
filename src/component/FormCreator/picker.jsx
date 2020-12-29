import React from "react";
import { ReactSortable } from "react-sortablejs";
import { FormCreatorContext } from "./form-creator";
import ViewWidget from "./components/ViewWidget";

class Picker extends React.PureComponent {
  static contextType = FormCreatorContext;

  render() {
    const { fieldMap, append } = this.context;

    const basicFieldMap = [];
    const advancedFieldMap = [];
    const layoutFieldMap = [];
    const basicElements = [];
    const advancedElements = [];
    const layoutElements = [];

    fieldMap.map((field) => {
      if (field.disabled && field.disabled === true) {
        return;
      }
      const element = (
        <ViewWidget key={field.key} field={field} handleAppend={append} />
      );
      if (field.sort === "basic") {
        basicFieldMap.push(field);
        basicElements.push(element);
      } else if (field.sort === "advanced") {
        advancedFieldMap.push(field);
        advancedElements.push(element);
      } else if (field.sort === "layout") {
        layoutFieldMap.push(field);
        layoutElements.push(element);
      } else {
        advancedFieldMap.push(field);
        advancedElements.push(element);
      }
    });

    return (
      <>
        {basicFieldMap.length > 0 ? (
          <>
            <div
              style={{
                borderBottom: "1px solid #e8e8e8",
                height: "44px",
                padding: "12px 5px",
                color: "rgba(0, 0, 0, 0.35)",
              }}
            >
              基础组件
            </div>
            <ReactSortable
              sort={false}
              list={basicFieldMap}
              setList={() => {}}
              clone={() => {}}
              group={{ name: "form-creator", pull: "clone", put: false }}
            >
              {basicElements}
            </ReactSortable>
          </>
        ) : null}
        {advancedFieldMap.length > 0 ? (
          <>
            <div
              style={{
                clear: "both",
                borderBottom: "1px solid #e8e8e8",
                height: "44px",
                padding: "12px 5px",
                color: "rgba(0, 0, 0, 0.35)",
              }}
            >
              高级组件
            </div>
            <ReactSortable
              sort={false}
              list={advancedFieldMap}
              setList={() => {}}
              clone={() => {}}
              group={{ name: "form-creator", pull: "clone", put: false }}
            >
              {advancedElements}
            </ReactSortable>
          </>
        ) : null}
        {layoutFieldMap.length > 0 ? (
          <>
            <div
              style={{
                clear: "both",
                borderBottom: "1px solid #e8e8e8",
                height: "44px",
                padding: "12px 5px",
                color: "rgba(0, 0, 0, 0.35)",
              }}
            >
              布局组件
            </div>
            <ReactSortable
              sort={false}
              list={layoutFieldMap}
              setList={() => {}}
              clone={() => {}}
              group={{ name: "form-creator", pull: "clone", put: false }}
            >
              {layoutElements}
            </ReactSortable>
          </>
        ) : null}
      </>
    );
  }
}

export default Picker;

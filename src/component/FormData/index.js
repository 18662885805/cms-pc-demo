import React, {Fragment} from "react";
import {Form} from "antd";
import CommonUtil from "@utils/common";

const FormItem = Form.Item;
let _util = new CommonUtil();

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {layout} = this.props;

    return (
      <Fragment>
        {
          this.props.data ? this.props.data.map((item, index) => {
            return (
              <FormItem
                key={index}
                label={item.text}
                extra={item.extra}
                hasFeedback
                {...layout}
              >
                {
                  item.value
                    ?
                    getFieldDecorator(item.field, {
                      initialValue: item.value,
                      rules: item.rules
                    })(
                      _util.switchItem(item, this)
                    )
                    :
                    getFieldDecorator(item.field, {
                      rules: item.rules
                    })(
                      _util.switchItem(item, this)
                    )
                }
              </FormItem>
            );
          }) : null
        }
      </Fragment>

    );
  }
}

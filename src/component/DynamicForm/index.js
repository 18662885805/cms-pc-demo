import React, { Component } from "react";
import {
  Input
} from "antd";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formObject: {}
    };

  }
  componentDidMount() {
    const { formData } = this.props;
  }

  genInput = input => {
    const { formObject } = this.state;
    const { field, clearable, disabled, autofocus, autocomplete } = input;

    return <Input
      value={formObject[field]}
      onChange={e => this.handleInput(e, field)}
      allowClear={clearable}
      disabled={disabled}
      autofocus={autofocus}
      autocomplete={autocomplete} />;
  }
  handleInput = (e, field) => {
    if (e) {
      this.handleForm(field, e.target.value);
    } else {
      this.handleForm(field, "");
    }
  }
  genForm = form => {
    const { type } = form;

    switch (type) {
    case "text":
      return this.genInput(form);
    }
  }
  handleForm = (field, value) => {
    const { formObject } = this.state;

    formObject[field] = value;
    this.setState({ formObject });
  }
  render() {
    return <div></div>;
  }
}
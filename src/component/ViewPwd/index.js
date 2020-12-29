import React from "react";
import {Form, Input, Icon} from "antd";
import MyIcon from "@component/MyIcon";
const FormItem = Form.Item;

class ViewPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pwdView: true
    };
  }

    toggleState = () => {
      this.setState({pwdView: !this.state.pwdView});
    }

    render() {
      const {pwd, inputName, placeholder, disabled} = this.props;

      return (

        <div>
          <Input name={inputName} style={{display: this.state.pwdView ? "block" : "none"}}
            disabled={!!disabled}
            prefix={<Icon type="lock"
              style={{color: "rgba(0,0,0,.25)"}}/>}
            suffix={<MyIcon type="anticon-eye_close" style={{color: "rgba(0,0,0,.25)"}}
              onClick={this.toggleState}/>}
            type="password"
            autoComplete='new-password'
            placeholder={placeholder} value={pwd} onChange={this.props.onChange.bind(this)}/>
          <Input name={inputName} style={{display: !this.state.pwdView ? "block" : "none"}}
            disabled={!!disabled}
            prefix={<Icon type="lock"
              style={{color: "rgba(0,0,0,.25)"}}/>}
            suffix={<MyIcon type="anticon-eye" style={{color: "rgba(0,0,0,.25)"}} onClick={this.toggleState}/>}
            type="text"
            autoComplete="off"
            placeholder={placeholder} value={pwd} onChange={this.props.onChange.bind(this)}/>
        </div>
      );
    }
}

// const ViewPwd = Form.create()(ViewPwdForm)
export default ViewPwd;

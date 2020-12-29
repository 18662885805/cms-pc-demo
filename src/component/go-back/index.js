import React from "react";
import { Button, Modal } from "antd";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";

const confirm = Modal.confirm;
const messages = defineMessages({
  sure_return: {
    id: "app.button.confirm.sureReturn",
    defaultMessage: "确认返回上一个页面?"
  },
  return_detail: {
    id: "app.button.confirm.returnDetail",
    defaultMessage: "单击确认按钮后，将会返回上一个页面"
  },
  ok_button: {
    id: "app.button.ok",
    defaultMessage: "确认"
  },
  cancel_button: {
    id: "app.button.cancel",
    defaultMessage: "取消"
  }
});

@injectIntl
class GoBackComponent extends React.Component {
  constructor (props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.showBackConfirm = this.showBackConfirm.bind(this);
  }

  showBackConfirm () {
    // 180627
    if (this.props.noConfirm) {
      this.goBack();
      return;
    }
    let _this = this;
    const {formatMessage} = this.props.intl;
    confirm({
      title:formatMessage(messages.sure_return),
      content:formatMessage(messages.return_detail),
      okText:formatMessage(messages.ok_button),
      cancelText:formatMessage(messages.cancel_button),
      onOk () {
        _this.goBack();
      },
      onCancel () {}
    });
  }

  goBack () {
    this.props.props.history.goBack();
  }

  render () {
    return (
      <Button style={this.props.style} onClick={this.showBackConfirm} size={this.props.size}>
        <FormattedMessage id="app.page.goback" defaultMessage="返回" />
      </Button>
    );
  }
}

export default GoBackComponent;

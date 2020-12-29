import React, {Fragment} from "react";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";

const translation = defineMessages({
  confirm_title: {
    id: "app.confirm.title.submit",
    defaultMessage: "确认提交?"
  },
  confirm_content: {
    id: "app.common.button.content",
    defaultMessage: "单击确认按钮后，将会提交数据"
  },
  okText: {
    id: "app.button.ok",
    defaultMessage: "确认"
  },
  cancelText: {
    id: "app.button.cancel",
    defaultMessage: "取消"
  },
  closeText: {
    id: "app.button.close",
    defaultMessage: "关闭"
  },
  saved: {
    id: "app.message.parking.saved",
    defaultMessage: "保存成功"
  },
  uploaded: {
    id: "app.message.parking.uploaded",
    defaultMessage: "上传成功"
  },
  deleted: {
    id: "app.message.parking.deleted",
    defaultMessage: "已删除"
  },
  select: {
    id: "app.placeholder.select",
    defaultMessage: "-- 请选择 --"
  },
  No: {
    id: "app.table.column.No",
    defaultMessage: "序号"
  },
  enable: {
    id: "page.parking.management.enable",
    defaultMessage: "启用"
  },
  disable: {
    id: "page.parking.management.disable",
    defaultMessage: "禁用"
  },
  status: {
    id: "app.table.column.status",
    defaultMessage: "状态"
  },
  active: {
    id: "app.message.parking.active",
    defaultMessage: "预约中"
  },
  entered: {
    id: "app.message.parking.entered",
    defaultMessage: "已进场"
  },
  left: {
    id: "app.message.parking.left",
    defaultMessage: "已离场"
  },
  invalid: {
    id: "app.message.parking.invalid",
    defaultMessage: "已失效"
  },
  fillattention: {
    id: "app.message.parking.fillattention",
    defaultMessage: "请填写注意事项!"
  },
  onlyoneday: {
    id: "app.message.parking.onlyoneday",
    defaultMessage: "不支持跨天预约"
  },
  days: {
    id: "page.parking.management.days",
    defaultMessage: "天"
  },
  hours: {
    id: "page.parking.management.hours",
    defaultMessage: "小时"
  },
  minutes: {
    id: "page.parking.management.minutes",
    defaultMessage: "分钟"
  },
  staff: {
    id: "page.parking.management.staff",
    defaultMessage: "员工"
  },
  visitor: {
    id: "page.parking.management.visitors",
    defaultMessage: "访客"
  },
  select_enable_data: {
    id: "app.component.tablepage.select_enable_data",
    defaultMessage: "请选择要启用的数据!"
  },
  selected_data: {
    id: "app.component.tablepage.selected_data",
    defaultMessage: "请选择要提交的数据!"
  },
  select_disable_data: {
    id: "app.component.tablepage.select_disable_data",
    defaultMessage: "请选择要禁用的数据!"
  }
});


export default translation;
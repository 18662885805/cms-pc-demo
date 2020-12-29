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
  operate: {
    id: "app.page.table.operate",
    defaultMessage: "操作"
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
  },
  export_data: {
    id: "app.component.tablepage.export_data",
    defaultMessage: "请选择要导出的数据!"
  },
  account: {
    id:"page.system.user.account",
    defaultMessage:"手机号"
  },
  group: {
    id:"page.system.user.group",
    defaultMessage:"组织"
  },
  name: {
    id:"page.system.user.name",
    defaultMessage:"姓名"
  },
  registertype: {
    id:"page.system.user.registertype",
    defaultMessage:"注册类型"
  },
  email: {
    id:"page.system.user.email",
    defaultMessage:"邮箱"
  },
  reason: {
    id:"page.system.user.reason",
    defaultMessage:"申请理由"
  },
  applytime: {
    id:"page.system.user.applytime",
    defaultMessage:"申请时间"
  },
  approver: {
    id:"page.system.user.approver",
    defaultMessage:"审批人"
  },
  approve_time: {
    id:"page.system.user.approve_time",
    defaultMessage:"审批时间"
  },
  remarks: {
    id:"page.system.user.remarks",
    defaultMessage:"审批备注"
  },

  role: {
    id:"page.system.user.role",
    defaultMessage:"角色"
  },
  rolename: {
    id:"page.system.user.rolename",
    defaultMessage:"角色名称"
  },
  roledesc: {
    id:"page.system.user.roledesc",
    defaultMessage:"角色描述"
  },
  position: {
    id: "page.system.user.position",
    defaultMessage: "身份"
  },
  created: {
    id: "app.page.system.created",
    defaultMessage: "创建人"
  },
  created_time: {
    id: "app.page.system.created_time",
    defaultMessage: "创建日期"
  },
  updated: {
    id: "app.page.system.updated",
    defaultMessage: "上次修改人"
  },
  updated_time: {
    id: "app.page.system.updated_time",
    defaultMessage: "修改日期"
  },
});


export default translation;
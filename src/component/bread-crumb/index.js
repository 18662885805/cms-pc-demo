import React, { Component } from "react";
import { Breadcrumb, Carousel,Icon, Modal } from "antd";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./index.css";
import { pushMessageInfo, msgInfoDetail } from "@apis/system/push-message";

const messages = defineMessages({
  homepage: {
    id: "menu.homepage",
    defaultMessage: "首页"
  },
  changepwd: {
    id: "page.component.breadcrumb.changepwd",
    defaultMessage: "修改密码"
  },
  personal_center: {
    id: "page.component.breadcrumb.personal_center",
    defaultMessage: "个人中心"
  },
  system_manage: {
    id: "page.component.breadcrumb.system_manage",
    defaultMessage: "系统管理"
  },
  projectsetting: {
    id: "page.component.breadcrumb.projectsetting",
    defaultMessage: "项目配置"
  },
  user_manage: {
    id: "page.component.breadcrumb.user_manage",
    defaultMessage: "用户管理"
  },
  add: {
    id: "page.component.breadcrumb.add",
    defaultMessage: "新增"
  },
  edit: {
    id: "page.component.breadcrumb.edit",
    defaultMessage: "修改"
  },
  detail: {
    id: "page.component.breadcrumb.detail",
    defaultMessage: "详情"
  },
  request_method: {
    id: "page.component.breadcrumb.request_method",
    defaultMessage: "请求方式"
  },
  dept_manage: {
    id: "page.component.breadcrumb.dept_manage",
    defaultMessage: "部门管理"
  },
  menu_manage: {
    id: "page.component.breadcrumb.menu_manage",
    defaultMessage: "菜单管理"
  },
  auth_manage: {
    id: "page.component.breadcrumb.auth_manage",
    defaultMessage: "权限管理"
  },
  register_manage: {
    id: "page.component.breadcrumb.register_manage",
    defaultMessage: "注册用户管理"
  },
  approval: {
    id: "page.component.breadcrumb.approval",
    defaultMessage: "审批"
  },
  apply: {
    id: "page.component.breadcrumb.apply",
    defaultMessage: "审批"
  },
  accesstype_manage: {
    id: "page.component.breadcrumb.accesstype_manage",
    defaultMessage: "访客类型管理"
  },
  channel_manage: {
    id: "page.component.breadcrumb.channel_manage",
    defaultMessage: "通道管理"
  },
  location_manage: {
    id: "page.component.breadcrumb.location_manage",
    defaultMessage: "区域管理"
  },
  // addlocation: {
  //   id: "page.component.breadcrumb.addlocation",
  //   defaultMessage: "建筑新增"
  // },
  // editlocation: {
  //   id: "page.component.breadcrumb.editlocation",
  //   defaultMessage: "建筑修改"
  // },
  // locationdetail: {
  //   id: "page.component.breadcrumb.locationdetail",
  //   defaultMessage: "建筑详情"
  // },
  // addfloor: {
  //   id: "page.component.breadcrumb.addfloor",
  //   defaultMessage: "楼层新增"
  // },
  // editfloor: {
  //   id: "page.component.breadcrumb.editfloor",
  //   defaultMessage: "楼层修改"
  // },
  map: {
    id: "page.component.breadcrumb.map",
    defaultMessage: "地图"
  },
  config: {
    id: "page.component.breadcrumb.config",
    defaultMessage: "配置"
  },
  // addroom: {
  //   id: "page.component.breadcrumb.addroom",
  //   defaultMessage: "房间新增"
  // },
  // editroom: {
  //   id: "page.component.breadcrumb.editroom",
  //   defaultMessage: "房间修改"
  // },
  // addfoor: {
  //   id: "page.component.breadcrumb.addfoor",
  //   defaultMessage: "门新增"
  // },
  // editfoor: {
  //   id: "page.component.breadcrumb.editfoor",
  //   defaultMessage: "门修改"
  // },
  // addlock: {
  //   id: "page.component.breadcrumb.addlock",
  //   defaultMessage: "锁芯新增"
  // },
  // editlock: {
  //   id: "page.component.breadcrumb.editlock",
  //   defaultMessage: "锁芯修改"
  // },
  reason_manage: {
    id: "page.component.breadcrumb.reason_manage",
    defaultMessage: "来访理由管理"
  },
  goodstype_manage: {
    id: "page.component.breadcrumb.goodstype_manage",
    defaultMessage: "货物类型管理"
  },
  myjoin: {
    id: "page.component.breadcrumb.myjoin",
    defaultMessage: "我的加入项目"
  },
  join: {
    id: "page.component.breadcrumb.join",
    defaultMessage: "项目加入审批"
  },
  vehicle_manage: {
    id: "page.component.breadcrumb.vehicle_manage",
    defaultMessage: "车辆通行证管理"
  },
  pushmessageerror: {
    id: "page.component.breadcrumb.pushmessageerror",
    defaultMessage: "消息推送失败管理"
  },
  my_application: {
    id: "page.component.breadcrumb.my_application",
    defaultMessage: "我的权限申请"
  },
  permission_audit: {
    id: "page.component.breadcrumb.permission_audit",
    defaultMessage: "权限申请审批"
  },
  permission_audit_record: {
    id: "page.component.breadcrumb.permission_audit_record",
    defaultMessage: "权限申请审批记录"
  },
  system_settings: {
    id: "page.component.breadcrumb.system_settings",
    defaultMessage: "系统配置"
  },
  feedback: {
    id: "page.component.breadcrumb.feedback",
    defaultMessage: "问题反馈"
  },
  message_manage: {
    id: "page.component.breadcrumb.message_manage",
    defaultMessage: "消息通知管理"
  },
  tags_manage: {
    id: "page.component.breadcrumb.tags_manage",
    defaultMessage: "标签管理"
  },
  factory_manage: {
    id: "page.component.breadcrumb.factory_manage",
    defaultMessage: "厂区管理"
  },
  addfactory: {
    id: "page.component.breadcrumb.addfactory",
    defaultMessage: "厂区新增"
  },
  editfactory: {
    id: "page.component.breadcrumb.editfactory",
    defaultMessage: "厂区修改"
  },
  factory_detail: {
    id: "page.component.breadcrumb.factory_detail",
    defaultMessage: "厂区详情"
  },
  event_manage: {
    id: "page.component.breadcrumb.event_manage",
    defaultMessage: "红码申请"
  },
  temp_card_manage: {
    id: "page.component.breadcrumb.temp_card_manage",
    defaultMessage: "临时卡管理"
  },
  blanklist_manage: {
    id: "page.component.breadcrumb.blanklist_manage",
    defaultMessage: "黑名单管理"
  },
  fit: {
    id: "page.component.breadcrumb.fit",
    defaultMessage: "散客登记"
  },
  cargo: {
    id: "page.component.breadcrumb.cargo",
    defaultMessage: "装卸货登记"
  },
  out_factory: {
    id: "page.component.breadcrumb.out_factory",
    defaultMessage: "访客出厂"
  },
  visitor_review: {
    id: "page.component.breadcrumb.visitor_review",
    defaultMessage: "访客浏览"
  },
  cargo_review: {
    id: "page.component.breadcrumb.cargo_review",
    defaultMessage: "装卸货浏览"
  },
  my_appointment: {
    id: "page.component.breadcrumb.my_appointment",
    defaultMessage: "我的预约"
  },
  my_visitor: {
    id: "page.component.breadcrumb.my_visitor",
    defaultMessage: "我的访客"
  },
  bookvisitor: {
    id: "page.component.breadcrumb.bookvisitor",
    defaultMessage: "预约访客登记"
  },
  authorization: {
    id: "page.component.breadcrumb.authorization",
    defaultMessage: "门禁管理管理"
  },
  enter_factory: {
    id: "page.component.breadcrumb.enter_factory",
    defaultMessage: "进厂"
  },
  wechat_self: {
    id: "page.component.breadcrumb.wechat_self",
    defaultMessage: "自助预约管理"
  },
  goodsrecord: {
    id: "page.component.breadcrumb.goodsrecord",
    defaultMessage: "物品携出记录"
  },
  viewworker: {
    id: "page.component.breadcrumb.viewworker",
    defaultMessage: "工人进出浏览"
  },
  // staffapply: {
  //   id: "page.component.breadcrumb.staffapply",
  //   defaultMessage: "集团员工电子证审批"
  // },
  // staffauth: {
  //   id: "page.component.breadcrumb.staffauth",
  //   defaultMessage: "集团员工电子证管理"
  // },
  // viprecord: {
  //   id: "page.component.breadcrumb.viprecord",
  //   defaultMessage: "我的团体预约"
  // },
  // viprecordaudit: {
  //   id: "page.component.breadcrumb.viprecordaudit",
  //   defaultMessage: "团体预约审批"
  // },
  // viprecordinfo: {
  //   id: "page.component.breadcrumb.viprecordinfo",
  //   defaultMessage: "团体审批记录"
  // },
  // vipinfo: {
  //   id: "page.component.breadcrumb.vipinfo",
  //   defaultMessage: "团体访客"
  // },
  construction: {
    id: "page.component.breadcrumb.construction",
    defaultMessage: "施工管理"
  },
  contractor: {
    id: "page.component.breadcrumb.contractor",
    defaultMessage: "承包商管理"
  },
  staff: {
    id: "page.component.breadcrumb.staff",
    defaultMessage: "员工管理"
  },
  staff_detail: {
    id: "page.component.breadcrumb.staff_detail",
    defaultMessage: "员工详情"
  },
  staff_audit: {
    id: "page.component.breadcrumb.staff_audit",
    defaultMessage: "员工审批"
  },
  staff_record: {
    id: "page.component.breadcrumb.staff_record",
    defaultMessage: "员工审批记录"
  },
  construction_reservation: {
    id: "page.component.breadcrumb.construction_reservation",
    defaultMessage: "施工预约"
  },
  subitem: {
    id: "page.component.breadcrumb.subitem",
    defaultMessage: "子项目创建"
  },
  subitem_edit: {
    id: "page.component.breadcrumb.subitem_edit",
    defaultMessage: "子项目修改"
  },
  itemList: {
    id: "page.component.breadcrumb.itemList",
    defaultMessage: "子项目"
  },
  construction_detail: {
    id: "page.component.breadcrumb.construction_detail",
    defaultMessage: "施工详情"
  },
  checklist: {
    id: "page.component.breadcrumb.checklist",
    defaultMessage: "检查单"
  },
  checklist_detail: {
    id: "page.component.breadcrumb.checklist_detail",
    defaultMessage: "检查单详情"
  },
  project_audit: {
    id: "page.component.breadcrumb.project_audit",
    defaultMessage: "施工审批"
  },
  audit_record: {
    id: "page.component.breadcrumb.audit_record",
    defaultMessage: "审批记录"
  },
  close: {
    id: "page.component.breadcrumb.close",
    defaultMessage: "关闭"
  },
  create_checklist: {
    id: "page.component.breadcrumb.create_checklist",
    defaultMessage: "检查单创建"
  },
  audit_info: {
    id: "page.component.breadcrumb.audit_info",
    defaultMessage: "审批信息"
  },
  project_review: {
    id: "page.component.breadcrumb.project_review",
    defaultMessage: "施工浏览"
  },
  construction_inspect: {
    id: "page.component.breadcrumb.construction_inspect",
    defaultMessage: "施工监控"
  },
  construction_record: {
    id: "page.component.breadcrumb.construction_record",
    defaultMessage: "施工记录"
  },
  ticket_manage: {
    id: "page.component.breadcrumb.ticket_manage",
    defaultMessage: "罚单管理"
  },
  ticket_rules: {
    id: "page.component.breadcrumb.ticket_rules",
    defaultMessage: "罚单规则管理"
  },
  ticket_record: {
    id: "page.component.breadcrumb.ticket_record",
    defaultMessage: "已开罚单"
  },
  my_ticket: {
    id: "page.component.breadcrumb.my_ticket",
    defaultMessage: "我的罚单"
  },
  todo: {
    id: "page.component.breadcrumb.todo",
    defaultMessage: "处理"
  },
  allticket: {
    id: "page.component.breadcrumb.allticket",
    defaultMessage: "所有罚单"
  },
  logs: {
    id: "page.component.breadcrumb.logs",
    defaultMessage: "日志管理"
  },
  my_log: {
    id: "page.component.breadcrumb.my_log",
    defaultMessage: "我的日志"
  },
  carryout: {
    id: "page.component.breadcrumb.carryout",
    defaultMessage: "物品携出"
  },
  mycarryout: {
    id: "page.component.breadcrumb.mycarryout",
    defaultMessage: "我的携出登记"
  },
  carryout_audit: {
    id: "page.component.breadcrumb.carryout_audit",
    defaultMessage: "物品携出审批"
  },
  myapproval: {
    id: "page.component.breadcrumb.myapproval",
    defaultMessage: "我的审批记录"
  },
  carryout_record: {
    id: "page.component.breadcrumb.carryout_record",
    defaultMessage: "携出记录"
  },
  safe_training: {
    id: "page.component.breadcrumb.safe_training",
    defaultMessage: "入厂培训"
  },
  materials: {
    id: "page.component.breadcrumb.materials",
    defaultMessage: "培训资料"
  },
  papers: {
    id: "page.component.breadcrumb.papers",
    defaultMessage: "试题库"
  },
  training_record: {
    id: "page.component.breadcrumb.training_record",
    defaultMessage: "培训记录"
  },
  safety_notice: {
    id: "page.component.breadcrumb.safety_notice",
    defaultMessage: "安全须知"
  },
  workorder: {
    id: "page.component.breadcrumb.workorder",
    defaultMessage: "报修管理"
  },
  mywork: {
    id: "page.component.breadcrumb.mywork",
    defaultMessage: "我的报修"
  },
  hotwork: {
    id: "page.component.breadcrumb.hotwork",
    defaultMessage: "座席报修"
  },
  work_todo: {
    id: "page.component.breadcrumb.work_todo",
    defaultMessage: "待处理报修"
  },
  work_type: {
    id: "page.component.breadcrumb.work_type",
    defaultMessage: "报修类型"
  },
  allwork: {
    id: "page.component.breadcrumb.allwork",
    defaultMessage: "所有报修"
  },
  project_management: {
    id: "page.component.breadcrumb.project_management",
    defaultMessage: "项目管理"
  },
  myproject: {
    id: "page.component.breadcrumb.myproject",
    defaultMessage: "我的项目"
  },
  execution: {
    id: "page.component.breadcrumb.execution",
    defaultMessage: "执行"
  },
  allproject: {
    id: "page.component.breadcrumb.allproject",
    defaultMessage: "所有项目"
  },
  stage_approval: {
    id: "page.component.breadcrumb.stage_approval",
    defaultMessage: "阶段审批"
  },
  stage_approval_record: {
    id: "page.component.breadcrumb.stage_approval_record",
    defaultMessage: "阶段审批记录"
  },
  mydoc: {
    id: "page.component.breadcrumb.mydoc",
    defaultMessage: "我的文档"
  },
  alldoc: {
    id: "page.component.breadcrumb.alldoc",
    defaultMessage: "所有文档"
  },
  document: {
    id: "page.component.breadcrumb.document",
    defaultMessage: "文档管理"
  },
  directory: {
    id: "page.component.breadcrumb.directory",
    defaultMessage: "目录管理"
  },
  register: {
    id: "page.component.breadcrumb.register",
    defaultMessage: "注册文档区"
  },
  meeting: {
    id: "page.component.breadcrumb.meeting",
    defaultMessage: "会议管理"
  },
  meetingtype: {
    id: "page.component.breadcrumb.meetingtype",
    defaultMessage: "会议类型"
  },
  minutes: {
    id: "page.component.breadcrumb.minutes",
    defaultMessage: "会议纪要"
  },
  mytask: {
    id: "page.component.breadcrumb.mytask",
    defaultMessage: "我的任务"
  },
  alltask: {
    id: "page.component.breadcrumb.alltask",
    defaultMessage: "所有任务"
  },
  type_config: {
    id: "page.component.breadcrumb.type_config",
    defaultMessage: "类型配置"
  },
  stage_config: {
    id: "page.component.breadcrumb.stage_config",
    defaultMessage: "阶段配置"
  },
  costcenter: {
    id: "page.component.breadcrumb.costcenter",
    defaultMessage: "成本中心"
  },
  e_auth: {
    id: "page.component.breadcrumb.e_auth",
    defaultMessage: "电子认证管理"
  },
  e_auth_approval: {
    id: "page.component.breadcrumb.e_auth_approval",
    defaultMessage: "电子认证审批"
  },
  onestop: {
    id: "page.component.breadcrumb.onestop",
    defaultMessage: "卡证一站式"
  },
  mycard: {
    id: "page.component.breadcrumb.mycard",
    defaultMessage: "我的卡证"
  },
  card_apply: {
    id: "page.component.breadcrumb.card_apply",
    defaultMessage: "卡证申请"
  },
  cardaudit: {
    id: "page.component.breadcrumb.cardaudit",
    defaultMessage: "申请审批"
  },
  card_record: {
    id: "page.component.breadcrumb.card_record",
    defaultMessage: "申请查询"
  },
  info_service: {
    id: "page.component.breadcrumb.info_service",
    defaultMessage: "信息查询"
  },
  chip_card: {
    id: "page.component.breadcrumb.chip_card",
    defaultMessage: "芯片卡库"
  },
  annual_audit: {
    id: "page.component.breadcrumb.annual_audit",
    defaultMessage: "年审管理"
  },
  annual_audit_record: {
    id: "page.component.breadcrumb.annual_audit_record",
    defaultMessage: "年审记录"
  },
  settings_config: {
    id: "page.component.breadcrumb.settings_config",
    defaultMessage: "注意事项配置"
  },
  settings_unsure: {
    id: "page.component.breadcrumb.settings_unsure",
    defaultMessage: "卡证批量导入"
  },
  key_manage: {
    id: "page.component.breadcrumb.key_manage",
    defaultMessage: "钥匙管理"
  },
  key_info: {
    id: "page.component.breadcrumb.key_info",
    defaultMessage: "钥匙维护"
  },
  key_apply: {
    id: "page.component.breadcrumb.key_apply",
    defaultMessage: "钥匙申请"
  },
  key_approval: {
    id: "page.component.breadcrumb.key_approval",
    defaultMessage: "钥匙审批"
  },
  key_approval_record: {
    id: "page.component.breadcrumb.key_approval_record",
    defaultMessage: "钥匙审批查询"
  },
  keylist: {
    id: "page.component.breadcrumb.keylist",
    defaultMessage: "钥匙单创建"
  },
  key_annual_audit: {
    id: "page.component.breadcrumb.key_annual_audit",
    defaultMessage: "钥匙年审"
  },
  eqpt_manage: {
    id: "page.component.breadcrumb.eqpt_manage",
    defaultMessage: "设备管理"
  },
  privacy: {
    id: "page.component.breadcrumb.privacy",
    defaultMessage: "隐私条款"
  },
  key_list: {
    id: "page.component.breadcrumb.key_list",
    defaultMessage: "key维护"
  },
  system_eqpt: {
    id: "page.component.breadcrumb.system_eqpt",
    defaultMessage: "系统设备"
  },
  task_sheet: {
    id: "page.component.breadcrumb.task_sheet",
    defaultMessage: "任务单"
  },
  m_record: {
    id: "page.component.breadcrumb.m_record",
    defaultMessage: "维护记录"
  },
  rules: {
    id: "page.component.breadcrumb.rules",
    defaultMessage: "规则管理"
  },
  related: {
    id: "page.component.breadcrumb.related",
    defaultMessage: "已关联"
  },
  norelated: {
    id: "page.component.breadcrumb.norelated",
    defaultMessage: "待关联"
  },
  packages: {
    id: "page.component.breadcrumb.packages",
    defaultMessage: "任务包管理"
  },
  break: {
    id: "page.component.breadcrumb.break",
    defaultMessage: "中断"
  },
  schedule: {
    id: "page.component.breadcrumb.schedule",
    defaultMessage: "日历"
  },
  worksheet: {
    id: "page.component.breadcrumb.worksheet",
    defaultMessage: "我的任务单"
  },
  check: {
    id: "page.component.breadcrumb.check",
    defaultMessage: "检查"
  },
  allworksheet: {
    id: "page.component.breadcrumb.allworksheet",
    defaultMessage: "所有任务单"
  },
  m_type: {
    id: "page.component.breadcrumb.m_type",
    defaultMessage: "维护类型"
  },
  myrecord: {
    id: "page.component.breadcrumb.myrecord",
    defaultMessage: "我的维护记录"
  },
  orderlist: {
    id: "page.component.breadcrumb.orderlist",
    defaultMessage: "工单"
  },
  dashboard: {
    id: "page.component.breadcrumb.dashboard",
    defaultMessage: "报表"
  },
  mymaintcard: {
    id: "page.component.breadcrumb.mymaintcard",
    defaultMessage: "我的维修卡"
  },
  allmaintcard: {
    id: "page.component.breadcrumb.allmaintcard",
    defaultMessage: "所有维修卡"
  },
  supplier: {
    id: "page.component.breadcrumb.supplier",
    defaultMessage: "供应商"
  },
  cardtype: {
    id: "page.component.breadcrumb.cardtype",
    defaultMessage: "维修卡类型"
  },
  allrecords: {
    id: "page.component.breadcrumb.allrecords",
    defaultMessage: "所有维护记录"
  },
  systemRole: {
    id: "page.component.breadcrumb.systemRole",
    defaultMessage: "角色管理"
  },
  systemSite: {
    id: "page.component.breadcrumb.systemSite",
    defaultMessage: "站点管理"
  },
  in_training:{
    id: "page.component.breadcrumb.inTraining",
    defaultMessage: "内部培训"
  },
  in_training_training:{
    id: "menu.training",
    defaultMessage: "培训管理"
  },
  in_training_certificate:{
    id: "page.component.breadcrumb.inTrainingCertificate",
    defaultMessage: "我的培训证书"
  },
  in_training_certificate_detail:{
    id: "page.component.breadcrumb.inTrainingCertificateDetail",
    defaultMessage:"证书详情"
  },
  in_training_mytraining:{
    id: "page.component.breadcrumb.inTrainingMyTraining",
    defaultMessage:"我的内部培训"
  },
  in_training_paper:{
    id: "page.component.breadcrumb.inTrainingPaper",
    defaultMessage:"培训试题库"
  },
  in_training_paper_detail:{
    id: "page.component.breadcrumb.inTrainingPaperDetail",
    defaultMessage:"试卷详情"
  },
  in_training_material:{
    id: "page.component.breadcrumb.inTrainingMaterial",
    defaultMessage:"培训资料库"
  },
  in_training_myrecord:{
    id: "page.component.breadcrumb.inTrainingMyRecord",
    defaultMessage:"我的培训记录"
  },
  in_training_allrecord:{
    id: "page.component.breadcrumb.inTrainingAllRecord",
    defaultMessage:"所有培训记录"
  },
  public_aerial:{
    id: "page.component.breadcrumb.publicAerial",
    defaultMessage:"天线配置"
  },
  test_car:{
    id: "page.component.breadcrumb.testCar",
    defaultMessage:"测试车管理"
  },
  test_car_aerial:{
    id: "page.component.breadcrumb.testCarAerial",
    defaultMessage:"天线管理"
  },
  test_car_area:{
    id: "page.component.breadcrumb.testCarArea",
    defaultMessage:"停车区域管理"
  },
  test_car_outType:{
    id: "page.component.breadcrumb.testCarOutType",
    defaultMessage:"出厂类型管理"
  },
  test_car_businessunit:{
    id: "page.component.breadcrumb.testCarBusinessunit",
    defaultMessage:"业务单元管理"
  },
  test_car_mainengine:{
    id: "page.component.breadcrumb.testCarMainengine",
    defaultMessage:"主机厂管理"
  },
  test_car_cartype:{
    id: "page.component.breadcrumb.testCarCarType",
    defaultMessage:"车辆类型管理"
  },
  test_car_enginetype:{
    id: "page.component.breadcrumb.testCarEnginetype",
    defaultMessage:"引擎类型管理"
  },
  test_car_rfid:{
    id: "page.component.breadcrumb.testCarRfid",
    defaultMessage:"RFID绑定"
  },
  test_car_Setting:{
    id: "page.component.breadcrumb.testCarSetting",
    defaultMessage:"基础数据配置"
  },
  test_car_driverRecord:{
    id: "page.component.breadcrumb.testCarDriverRecord",
    defaultMessage:"驾驶员申请/更新"
  },
  test_car_driverRecordAudit:{
    id: "page.component.breadcrumb.testCarDriverRecordAudit",
    defaultMessage:"驾驶员审批"
  },
  test_car_driverRecordInfo:{
    id: "page.component.breadcrumb.testCarDriverRecordInfo",
    defaultMessage:"驾驶员审批记录"
  },
  test_car_driver:{
    id: "page.component.breadcrumb.testCarDriver",
    defaultMessage:"驾驶员管理"
  },
  test_car_carInfo:{
    id: "page.component.breadcrumb.testCarCarinfo",
    defaultMessage:"车辆信息维护"
  },
  test_car_carInfoAll:{
    id: "page.component.breadcrumb.testCarCarinfoAll",
    defaultMessage:"所有车辆信息维护"
  },
  test_car_carBinding:{
    id: "page.component.breadcrumb.testCarCarBinding",
    defaultMessage:"车辆绑定管理"
  },
  test_car_car:{
    id: "page.component.breadcrumb.testCarCar",
    defaultMessage:"车辆管理"
  },
  test_car_tmpcar:{
    id: "page.component.breadcrumb.testCarTmpcar",
    defaultMessage:"我的车辆(负责人)"
  },
  test_car_drivercar:{
    id: "page.component.breadcrumb.testCarDrivercar",
    defaultMessage:"我的车辆(驾驶员)"
  },
  test_car_carrecord:{
    id: "page.component.breadcrumb.testCarCarrecord",
    defaultMessage:"我的车辆申请"
  },
  test_car_carrecordaudit:{
    id: "page.component.breadcrumb.testCarCarrecordaudit",
    defaultMessage:"车辆审批"
  },
  test_car_carrecordinfo:{
    id: "page.component.breadcrumb.testCarCarrecordinfo",
    defaultMessage:"车辆审批记录"
  },
  test_car_violation:{
    id: "page.component.breadcrumb.testCarViolation",
    defaultMessage:"违规记录"
  },
  test_car_myviolation:{
    id: "page.component.breadcrumb.myTestCarViolation",
    defaultMessage:"我的违规记录"
  },
  test_car_historyrecord:{
    id: "page.component.breadcrumb.testCarHistoryrecord",
    defaultMessage:"车辆进出记录"
  },
  test_car_zombie:{
    id: "page.component.breadcrumb.testCarZombie",
    defaultMessage:"僵尸车查询"
  },
  parking: {
    id: "page.component.breadcrumb.parking",
    defaultMessage: "停车管理"
  },
  parkingarea: {
    id: "page.component.breadcrumb.parkingarea",
    defaultMessage: "停车场配置"
  },
  vehiclesearch: {
    id: "page.component.breadcrumb.vehiclesearch",
    defaultMessage: "车辆查询"
  },
  parkingauth: {
    id: "page.component.breadcrumb.parkingauth",
    defaultMessage: "车辆授权"
  },
  parkingvisitor: {
    id: "page.component.breadcrumb.parkingvisitor",
    defaultMessage: "我的访客停车"
  },
  parkingregister: {
    id: "page.component.breadcrumb.parkingregister",
    defaultMessage: "访客停车登记"
  },
  parkingrecords: {
    id: "page.component.breadcrumb.parkingrecords",
    defaultMessage: "停车记录"
  },
  staffrecord: {
    id: "page.component.breadcrumb.staffrecord",
    defaultMessage: "员工停车记录"
  },
  visitorrecord: {
    id: "page.component.breadcrumb.visitorrecord",
    defaultMessage: "访客停车记录"
  },
  blacklist: {
    id: "page.component.breadcrumb.blacklist",
    defaultMessage: "黑名单"
  },
  inspection:{
    id: "page.inspection",
    defaultMessage: "巡检管理"
  },
  inspection_area:{
    id: "page.inspection.area",
    defaultMessage: "巡检点位"
  },
  inspection_route:{
    id: "page.inspection.route",
    defaultMessage: "巡检线路"
  },
  inspection_group:{
    id: "page.inspection.group",
    defaultMessage: "路线分组"
  },
  inspection_scheduling:{
    id: "page.inspection.scheduling",
    defaultMessage: "排班管理"
  },
  approvalManagement: {
    id: "page.component.breadcrumb.approvalManagement",
    defaultMessage: "审批流管理"
  },
  approvalPerson: {
    id: "page.component.breadcrumb.approvalPerson",
    defaultMessage: "审批人配置"
  },
  approvalFlow: {
    id: "page.component.breadcrumb.approvalFlow",
    defaultMessage: "审批流配置"
  }
});

@injectIntl
class MyBreadcrumbComponent extends Component {
    //利用PropTypes记住所跳转每个页面的位置
    static contextTypes = {
      router: PropTypes.object
    };
    constructor(props, context) {
      super(props, context);
      const {formatMessage} = this.props.intl;
      this.state = {
        topMessage: [],
        pathSnippets: null,
        extraBreadcrumbItems: null,
        showModal: false,
        menuDict: {
          "/": formatMessage(messages.homepage), //首页
          "/password": formatMessage(messages.changepwd), //修改密码
          "/account/info": formatMessage(messages.personal_center), //个人中心


          "/today": '今日现场', 
          "/today/message": '消息通知', 
          "/today/message/add": formatMessage(messages.add), 
          "/today/message/edit": formatMessage(messages.edit), 
          "/today/message/detail": formatMessage(messages.detail), 
          "/today/propaganda": '轮播图', 
          "/today/barometer": '晴雨表', 
          "/today/barometer/detail":  formatMessage(messages.detail), 


          "/staff": '入场管理', 
          "/staff/add": formatMessage(messages.add),
          "/staff/edit":formatMessage(messages.edit), 
          "/staff/approve": '红码审批', 
          "/staff/approve/audit": formatMessage(messages.approval), 
          "/staff/approve/detail":formatMessage(messages.detail), 
        

          "/safety":'安防管理',
          "/staff/list/factoryapply": '绿码申请', 
          "/staff/list/factoryapply/add": formatMessage(messages.add),
          "/staff/list/factoryapply/detail": formatMessage(messages.detail),
         
          "/safety/accesscard": '门禁管理', 
          "/safety/accesscard/detail": formatMessage(messages.detail),
          "/safety/entryrecord": '临时出入', 
          "/safety/entryrecord/detail": formatMessage(messages.detail),
          "/system/turnstile": '闸机管理', 


          "/system": formatMessage(messages.system_manage), //系统管理
          "/system/project": formatMessage(messages.projectsetting), //项目配置
          "/system/user": formatMessage(messages.user_manage), //用户管理
          "/system/user/add": formatMessage(messages.add), //新增
          "/system/user/edit": formatMessage(messages.edit), //修改
          "/system/user/detail": formatMessage(messages.detail), //详情
          "/system/settings": <FormattedMessage id="menu.system.setting" defaultMessage="项目配置" />, //系统配置
          "/system/role": '角色权限',
          "/system/role/add": formatMessage(messages.add), //新增
          "/system/role/edit": formatMessage(messages.edit), //修改
          "/system/role/detail": formatMessage(messages.detail), //详情




          "/training": '培训管理', //安全培训
          "/training/add": formatMessage(messages.add),
          "/training/edit": formatMessage(messages.edit),
          "/training/detail": formatMessage(messages.detail),
          "/training/material": '资料库', //培训资料
          "/training/material/add": formatMessage(messages.add), //新增
          "/training/material/edit": formatMessage(messages.edit), //修改
          "/training/material/detail": formatMessage(messages.detail), //详情
          "/training/paper": formatMessage(messages.papers), //试题库
          "/training/paper/add": formatMessage(messages.add), //新增
          "/training/paper/edit": formatMessage(messages.edit), //修改
          "/training/paper/detail": formatMessage(messages.detail), //详情
          "/training/notice": '培训须知', //试题库
          "/training/start/training": '培训启动', //培训启动
          "/training/start/training/add": formatMessage(messages.add), //新增
          "/training/start/training/edit": formatMessage(messages.edit), //修改
          "/training/start/training/detail": formatMessage(messages.detail), //详情
          "/training/record": formatMessage(messages.training_record), //培训记录
          "/training/record/detail": formatMessage(messages.detail), //详情
          "/training/myrecord": '培训记录', //培训记录
          "/training/myrecord/detail": formatMessage(messages.detail), //详情
          "/training/safety": formatMessage(messages.safety_notice), //安全须知
          "/training/safety/detail": formatMessage(messages.detail), //详情


          

    

          "/document": formatMessage(messages.document), //文档管理
          "/document/directory": formatMessage(messages.directory), //目录管理
          "/document/directory/add": formatMessage(messages.add), //新增
          "/document/directory/edit": formatMessage(messages.edit), //修改
          "/document/directory/detail": formatMessage(messages.detail), //详情
          "/document/register": formatMessage(messages.register), //注册文档区
          "/document/register/add": formatMessage(messages.add), //新增
          "/document/register/edit": formatMessage(messages.edit), //修改
          "/document/register/detail": formatMessage(messages.detail), //详情
          "/document/workflow": '工作流文档', 

          "/meeting": formatMessage(messages.meeting), //会议管理
          "/meeting/type": formatMessage(messages.meetingtype), //会议类型
          "/meeting/type/detail": formatMessage(messages.detail), //详情
          "/meeting/minutes": formatMessage(messages.minutes), //会议纪要
          "/meeting/minutes/detail": formatMessage(messages.detail), //详情


          "/admin":"系统管理员",
          "/admin/user":'用户管理',
          "/admin/project":'项目管理',
          "/myadmin":"后台管理",
          "/myadmin/user":"用户管理",
          "/myadmin/project":'项目管理',
          "/myadmin/project/add":formatMessage(messages.add),
          "/myadmin/project/edit":formatMessage(messages.edit),
          "/myadmin/permission":'权限管理',
          "/myadmin/permission/add":formatMessage(messages.add),
          "/myadmin/permission/add/:id":formatMessage(messages.edit),
          "/myadmin/privacy":'隐私政策',

          "/workflow": "工作流管理",
          "/workflow/template": '模板管理',
          "/workflow/template/detail": '详情',
          "/workflow/manage": '工作流配置',
          "/workflow/manage/detail": '详情',

          "/account": "账户",
          "/account/changePhone":"修改手机号"
        },
        msgCreatedTime: "",
        msgName: "",
        msgTitle: ""
      };
    }
    getPath() {
      let _this = this;
      let tempPathSnippets = this.context.router.history.location.pathname.split("/").filter(i => i);
      let tempExtraBreadcrumbItems = tempPathSnippets.map((_, index) => {
        const url = `/${tempPathSnippets.slice(0, index + 1).join("/")}`;
        let staticUrl = ["/system", "/event", "/log", "/construction", "/carryout", "/training", "/workorder", "/workflow"];
        if (staticUrl.indexOf(url) !== -1) {
          return (
            <Breadcrumb.Item key={url}>
              <span style={{color: "rgba(0, 0, 0, .65)"}}>{_this.state.menuDict[url]}</span>
            </Breadcrumb.Item>
          );
        }
        return (
          <Breadcrumb.Item key={url}>
            <Link to={url}>
              {_this.state.menuDict[url]}
            </Link>
          </Breadcrumb.Item>
        );
      });
      //对路径进行切分，存放到this.state.pathSnippets中
      this.setState({
        pathSnippets: tempPathSnippets,
        extraBreadcrumbItems: tempExtraBreadcrumbItems
      });
      //将切分的路径读出来，形成面包屑，存放到this.state.extraBreadcrumbItems
    }

    componentWillMount() {
      //首次加载的时候调用，形成面包屑
      this.getPath();
    }

    componentWillReceiveProps(){
      //任何子页面发生改变，均可调用，完成路径切分以及形成面包屑
      this.getPath();
    }

    showMsgDetail = id => {

      msgInfoDetail(id).then(res => {
        const { created_time, name, title } = res.data.results;
        this.setState({
          msgCreatedTime: created_time,
          msgName: name,
          msgTitle: title,
          showModal: true
        });
      });
    }

    handleModalCancel = () => {
      this.setState({
        showModal: false
      });
    }

    render() {
      let {extraBreadcrumbItems} = this.state;
      const breadcrumbItems = [(
        <Breadcrumb.Item key="home">
          <Link to="/"><FormattedMessage id="menu.homepage" defaultMessage="首页" /></Link>
        </Breadcrumb.Item>
      )].concat(extraBreadcrumbItems);

      return (
        <div className={styles.pageHeader}>
          <Breadcrumb>
            {
              this.props.bread
                ?
                this.props.bread.map((b, bIndex) => {
                  return (
                    <Breadcrumb.Item key={bIndex}>
                      {
                        b.url
                          ?
                          <Link to={b.url}>{b.name}</Link>
                          :
                          b.name
                      }
                    </Breadcrumb.Item>
                  );
                })
                :
                breadcrumbItems
            }
            <Breadcrumb.Item key="right" style={{
              float: "right",
              width: "50%"
            }}>

            </Breadcrumb.Item>
          </Breadcrumb>

        </div>
      );
    }
}
export default MyBreadcrumbComponent;

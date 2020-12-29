import React from "react";
import { FormattedMessage } from "react-intl";
import intl from "react-intl-universal";

const menuList =
    [
        {
            "title": "setting", "name": <FormattedMessage id="menu.system" defaultMessage="系统管理" />, "to": "/system", "children": [
                { "title": "", "name": "组织类型配置", "to": "/system/org/type", "children": [], "is_show": false, "order": 1, "wx_url": null,"is_super":true },               
                { "title": "", "name": "角色权限", "to": "/system/role", "children": [], "is_show": false, "order": 2, "wx_url": null,"is_super":true },    
                { "title": "", "name": "闸机管理", "to": "/system/turnstile", "children": [], "is_show": false, "order": 3, "wx_url": null,"is_super":true },   
                { "title": "", "name": <FormattedMessage id="menu.system.setting" defaultMessage="项目配置" />, "to": "/system/settings", "children": [], "is_show": false, "order": 4, "wx_url": null, },              
                { "title": "", "name": <FormattedMessage id="menu.system.org-apply" defaultMessage="组织创建" />, "to": "/system/org", "children": [], "is_show": false, "order": 5, "wx_url": null },
                { "title": "", "name": <FormattedMessage id="menu.system.org-audit" defaultMessage="组织审批" />, "to": "/system/org/application", "children": [], "is_show": false, "order": 6, "wx_url": null },            
                { "title": "", "name":<FormattedMessage id="menu.system.user" defaultMessage="用户管理" />, "to": "/system/user", "children": [], "is_show": false, "order": 7, "wx_url": null },           
            ], "is_show": false, "order": 1, "wx_url": null
        },
        {
            "title": "environment", "name": <FormattedMessage id="menu.today" defaultMessage="今日现场" />, "to": "/today", "children": [
                { "title": "", "name": <FormattedMessage id="menu.today.message" defaultMessage="消息通知" />, "to": "/today/message", "children": [], "is_show": true, "order": 1, },
                { "title": "", "name": <FormattedMessage id="menu.today.propaganda" defaultMessage="轮播图" />, "to": "/today/propaganda", "children": [], "is_show": true, "order": 2, },
                { "title": "", "name": <FormattedMessage id="menu.today.barometer" defaultMessage="晴雨表" />, "to": "/today/barometer", "children": [], "is_show": true, "order": 3, },
            ], "is_show": true, "order": 2, "wx_url": null
        },
        {
            "title": "idcard", "name": '入场管理', "to": "/staff", "children": [
                { "title": "", "name": '红码申请', "to": "/staff/org", "children": [], "is_show": true, "order": 1, "wx_url": null },
                { "title": "", "name": '红码审批', "to": "/staff/approve", "children": [], "is_show": true, "order": 2, "wx_url": null },
                { "title": "", "name": '绿码申请', "to": "/staff/list/factoryapply", "children": [], "is_show": true, "order": 3, "wx_url": null },
                { "title": "", "name": '绿码审批', "to": "/staff/my/factoryapply", "children": [], "is_show": true, "order": 4, "wx_url": null },
                { "title": "", "name": '入场配置', "to": "/staff/config", "children": [], "is_show": true, "order": 5, "wx_url": null },
              
            ], "is_show": true, "order": 3, "wx_url": null
        },
        {
            "title": "safety-certificate", "name":  <FormattedMessage id="menu.safety" defaultMessage="安防管理" />, "to": "/safety", "children": [    
                { "title": "", "name": '门禁管理', "to": "/safety/accesscard", "children": [], "is_show": true, "order": 3, "wx_url": null },
                { "title": "", "name": '临时出入', "to": "/safety/enabled/accesscard", "children": [], "is_show": true, "order": 4, "wx_url": null },
                { "title": "", "name": <FormattedMessage id="menu.safety.entryrecord" defaultMessage="进出记录" />, "to": "/safety/entryrecord", "children": [], "is_show": true, "order": 5, "wx_url": null },
                // { "title": "", "name": '组织进出记录', "to": "/safety/org/entryrecord", "children": [], "is_show": true, "order": 6, "wx_url": null },
            ], "is_show": true, "order": 4, "wx_url": null
        },
        {
            "title": "book", "name": <FormattedMessage id="menu.training" defaultMessage="培训管理" />, "to": "/training", "children": [
                { "title": "", "name": '试题库', "to": "/training/paper", "children": [], "is_show": true, "order": 1, },
                { "title": "", "name": '资料库', "to": "/training/material", "children": [], "is_show": true, "order": 2, },
                { "title": "", "name": '培训配置', "to": "/training/management", "children": [], "is_show": true, "order": 3, },
                { "title": "", "name": '培训启动', "to": "/training/start/training", "children": [], "is_show": true, "order": 4, },
                { "title": "", "name": '培训记录', "to": "/training/myrecord", "children": [], "is_show": true, "order": 5, },
                // { "title": "", "name": <FormattedMessage id="menu.training.record" defaultMessage="所有培训记录" />, "to": "/training/record", "children": [], "is_show": true, "order": 6, },
                // { "title": "", "name": "组织培训记录", "to": "/training/org/record", "children": [], "is_show": true, "order": 7, },
            ], "is_show": true, "order": 5, "wx_url": null
        },
        {
            "title": "folder", "name": <FormattedMessage id="menu.document" defaultMessage="文档管理" />, "to": "/document", "children": [
                { "title": "", "name": <FormattedMessage id="menu.document.directory" defaultMessage="注册文档目录" />, "to": "/document/directory", "children": [], "is_show": true, "order": 1 },
                { "title": "", "name": <FormattedMessage id="menu.document.register.document" defaultMessage="注册文档管理" />, "to": "/document/register/document", "children": [], "is_show": true, "order": 2 },
                { "title": "", "name": <FormattedMessage id="menu.document.temporary.document" defaultMessage="临时文档管理" />, "to": "/document/temporary/document", "children": [], "is_show": true, "order": 3 },
                { "title": "", "name": <FormattedMessage id="menu.document.workflow.document" defaultMessage="工作流文档" />, "to": "/document/workflow", "children": [], "is_show": true, "order": 4 }
            ], "is_show": true, "order": 6
        },
        {
            "title": "fund", "name": '重要问题', "to": "/task", "children": [
                { "title": "", "name": '问题类型', "to": "/task/type", "children": [], "is_show": true, "order": 1 },
                { "title": "", "name": '关闭理由', "to": "/task/close-reason", "children": [], "is_show": true, "order": 2 },
                { "title": "", "name": '提醒规则', "to": "/task/remind-rule", "children": [], "is_show": true, "order": 3 },
                { "title": "", "name": '问题发起', "to": "/task/task-start", "children": [], "is_show": true, "order": 4 },
                { "title": "", "name": '问题处理', "to": "/task/task-resolve", "children": [], "is_show": true, "order": 5 },
            ], "is_show": true, "order": 6
        },
        {
            "title": "check-square", "name": "巡更管理", "to": "/inspection", "children": [
                { "title": "", "name": "巡更点位", "to": "/inspection/1", "children": [], "is_show": false, "order": 1, },
                { "title": "", "name": "巡更路线", "to": "/inspection/2", "children": [], "is_show": false, "order": 2, },
                { "title": "", "name": "巡更分组", "to": "/inspection/3", "children": [], "is_show": false, "order": 3, },
                { "title": "", "name": "巡更管理", "to": "/inspection/4", "children": [], "is_show": false, "order": 4, },
                { "title": "", "name": "我的巡更", "to": "/inspection/5", "children": [], "is_show": false, "order": 5, },
                { "title": "", "name": "巡更记录", "to": "/inspection/6", "children": [], "is_show": false, "order": 6, },
            ], "is_show": false, "order": 6
        },
        {
            "title": "bug", "name": "缺陷管理", "to": "/defects", "children": [
                { "title": "", "name": "缺陷类型管理", "to": "/defects/1", "children": [], "is_show": false, "order": 1 },
                { "title": "", "name": "我的缺陷工单", "to": "/defects/2", "children": [], "is_show": false, "order": 2 },
                { "title": "", "name": "待处理缺陷", "to": "/defects/3", "children": [], "is_show": false, "order": 3 },
                { "title": "", "name": "所有缺陷", "to": "/defects/4", "children": [], "is_show": false, "order": 4 }
            ], "is_show": false, "order": 7
        },
        {
            "title": "profile", "name": "竣工文档", "to": "/completion", "children": [
                { "title": "", "name": "类型配置", "to": "/completion/type", "children": [], "is_show": false, "order": 1 },
                { "title": "", "name": "竣工文档管理", "to": "/completion/document", "children": [], "is_show": false, "order": 2 }
            ], "is_show": false, "order": 7
        },
        {
            "title": "code-sandbox", "name": "TPM管理", "to": "/eqp", "children": [
                { "title": "", "name": "维修卡类型", "to": "/eqp/cardtype", "children": [], "is_show": false, "order": 16, "wx_url": null },
                { "title": "", "name": "供应商", "to": "/eqp/supplier", "children": [], "is_show": false, "order": 15, "wx_url": null },
                { "title": "", "name": "所有维修卡", "to": "/eqp/maintcard", "children": [], "is_show": false, "order": 14, "wx_url": null },
                { "title": "", "name": "我的维修卡", "to": "/eqp/mymaintcard", "children": [], "is_show": false, "order": 13, "wx_url": null },
                { "title": "", "name": "常用报表", "to": "/eqp/dashboard", "children": [], "is_show": false, "order": 12, "wx_url": null },
                { "title": "", "name": "我的维护记录", "to": "/eqp/mychecklist", "children": [], "is_show": false, "order": 8, "wx_url": null },
                { "title": "", "name": "所有维护记录", "to": "/eqp/checklist", "children": [], "is_show": false, "order": 9, "wx_url": null },
                { "title": "", "name": "维护类型", "to": "/eqp/mtype", "children": [], "is_show": false, "order": 7, "wx_url": null },
                { "title": "", "name": "所有任务单", "to": "/eqp/task", "children": [], "is_show": false, "order": 6, "wx_url": null },
                { "title": "", "name": "我的任务单", "to": "/eqp/mytask", "children": [], "is_show": false, "order": 5, "wx_url": null },
                { "title": "", "name": "任务包管理", "to": "/eqp/package", "children": [], "is_show": false, "order": 4, "wx_url": null },
                { "title": "", "name": "规则管理", "to": "/eqp/rule", "children": [], "is_show": false, "order": 3, "wx_url": null },
                { "title": "", "name": "系统设备", "to": "/eqp/syseqp", "children": [], "is_show": false, "order": 2, "wx_url": null },
                { "title": "", "name": "Key维护", "to": "/eqp/key", "children": [], "is_show": false, "order": 1, "wx_url": null }
            ], "is_show": false, "order": 8, "wx_url": null
        },
        {
            "title": "shopping-cart", "name": "材料进场(二期)", "to": "/logistics", "children": [
                { "title": "", "name": "设备材料注册", "to": "/logistics/1", "children": [], "is_show": false, "order": 1, },
                { "title": "", "name": "设备材料审批", "to": "/logistics/2", "children": [], "is_show": false, "order": 2, },
                { "title": "", "name": "设备材料进场", "to": "/logistics/2", "children": [], "is_show": false, "order": 3, },
            ], "is_show": false, "order": 9
        },
        {
            "title": "fire", "name": "能源管理(二期)", "to": "/energy", "children": [
                { "title": "", "name": "用电管理", "to": "/energy/1", "children": [], "is_show": false, "order": 1, },
                { "title": "", "name": "用水管理", "to": "/energy/2", "children": [], "is_show": false, "order": 2, },
                { "title": "", "name": "报警条件设置", "to": "/energy/3", "children": [], "is_show": false, "order": 3, },
            ], "is_show": false, "order": 10
        },
        {
            "title": "file", "name": "图纸管理(二期)", "to": "/papers", "children": [
                { "title": "", "name": "我的图纸", "to": "/papers/1", "children": [], "is_show": false, "order": 1 },
                { "title": "", "name": "所有图纸", "to": "/papers/2", "children": [], "is_show": false, "order": 2 }
            ], "is_show": false, "order": 11
        },
        {
            "title": "slack", "name": "SuperOpl(二期)", "to": "/super", "children": [
                { "title": "", "name": "escalation规则管理", "to": "/super/1", "children": [], "is_show": false, "order": 1 },
                { "title": "", "name": "我的OPL", "to": "/super/2", "children": [], "is_show": false, "order": 2 },
                { "title": "", "name": "所有OPL", "to": "/super/3", "children": [], "is_show": false, "order": 3 }
            ], "is_show": false, "order": 12
        },
        {
            "title": "usergroup-add", "name": "会议管理", "to": "/meeting", "children": [
                { "title": "", "name": "会议类型", "to": "/meeting/type", "children": [], "is_show": false, "order": 1 },
                { "title": "", "name": "会议纪要", "to": "/meeting/minutes", "children": [], "is_show": false, "order": 2 }
                // { "title": "", "name": "会议室预订", "to": "/meeting/2", "children": [], "is_show": false, "order": 3 }
            ], "is_show": false, "order": 13
        },
        {
            "title": "snippets", "name": "知识管理(二期)", "to": "/knowledge", "children": [
                { "title": "", "name": "子模块一", "to": "/knowledge/1", "children": [], "is_show": false, "order": 1, },
                { "title": "", "name": "子模块二", "to": "/knowledge/2", "children": [], "is_show": false, "order": 2, },
            ], "is_show": false, "order": 14
        },
        {
            "title": "youtube", "name": "安全监控(二期)", "to": "/monitoring", "children": [
                { "title": "", "name": "子模块一", "to": "/monitoring/1", "children": [], "is_show": false, "order": 1, },
                { "title": "", "name": "子模块二", "to": "/monitoring/2", "children": [], "is_show": false, "order": 2, },
            ], "is_show": false, "order": 15
        },
        {
            "title": "bank", "name": "商务管理(二期)", "to": "/business", "children": [
                { "title": "", "name": "子模块一", "to": "/business/1", "children": [], "is_show": false, "order": 1, },
                { "title": "", "name": "子模块二", "to": "/business/2", "children": [], "is_show": false, "order": 2, },
            ], "is_show": false, "order": 16
        },
        {
            "title": "heat-map", "name": "施工管理", "to": "/construction", "children": [
                { "title": "", "name": "职务管理", "to": "/construction/worktype", "children": [], "is_show": false, "order": 1, "wx_url": null },
                { "title": "", "name": "组织管理", "to": "/construction/contractor", "children": [], "is_show": false, "order": 2, "wx_url": null },
                { "title": "", "name": "工人管理", "to": "/construction/worker", "children": [], "is_show": false, "order": 3, "wx_url": null },
                { "title": "", "name": "工人审批", "to": "/construction/worker/pending", "children": [], "is_show": false, "order": 4, "wx_url": null },
                { "title": "", "name": "工人审批记录", "to": "/construction/worker/do", "children": [], "is_show": false, "order": 5, "wx_url": null },
                { "title": "", "name": "施工预约", "to": "/construction/order", "children": [], "is_show": false, "order": 6, "wx_url": null },
                { "title": "", "name": "施工审批", "to": "/construction/order/pending", "children": [], "is_show": false, "order": 7, },
                { "title": "", "name": "施工审批记录", "to": "/construction/order/do", "children": [], "is_show": false, "order": 8, "wx_url": null },
                { "title": "", "name": "施工浏览", "to": "/construction/viewproject", "children": [], "is_show": false, "order": 9, "wx_url": null },
                { "title": "", "name": "施工人员监控", "to": "/construction/viewlistener", "children": [], "is_show": false, "order": 10, "wx_url": null },
            ], "is_show": false, "order": 99, "wx_url": null
        },
        {
            "title": "code-sandbox", "name": <FormattedMessage id="menu.workflow" defaultMessage="工作流管理" />, "to": "/workflow", "children": [
                { "title": "", "name": "表单配置", "to": "/workflow/template", "children": [], "is_show": true, "order": 1 },
                { "title": "", "name": "审批流配置", "to": "/approval/flow/template", "children": [], "is_show": true, "order": 2 },
                // { "title": "", "name": "分类配置", "to": "/workflow/classification", "children": [], "is_show": false, "order": 3 },
                { "title": "", "name": "工作流类型", "to": "/workflow/flow", "children": [], "is_show": true, "order": 4 },
                { "title": "", "name": "我的工作流", "to": "/workflow/record", "children": [], "is_show": true, "order": 5 },
                { "title": "", "name": "待处理工作流", "to": "/workflow/record/wait", "children": [], "is_show": true, "order": 6 },
                // { "title": "", "name": "所有工作流记录", "to": "/workflow/allrecord", "children": [], "is_show": true, "order": 7 },
                // { "title": "", "name": "工作流文档", "to": "/workflow/source", "children": [], "is_show": true, "order": 8 },
            ], "is_show": true, "order": 17
        },
        {
            "title": "snippets", "name":'任务管理', "to": "/assignment", "children": [
                { "title": "", "name": "区域管理", "to": "/assignment/area", "children": [], "is_show": true, "order": 1 },
                { "title": "", "name": "任务类型", "to": "/assignment/type", "children": [], "is_show": true, "order": 2 },
                { "title": "", "name": "执行规则", "to": "/assignment/rule", "children": [], "is_show": false, "order": 3 },
                { "title": "", "name": "我的任务", "to": "/assignment/record", "children": [], "is_show": true, "order": 4 },
                // { "title": "", "name": "任务浏览", "to": "/assignment/all", "children": [], "is_show": true, "order": 5 },
                { "title": "", "name": "待处理任务", "to": "/assignment/wait", "children": [], "is_show": true, "order": 6 },
                // { "title": "", "name": "任务图表", "to": "/hotline/dashboard", "children": [], "is_show": true, "order": 6 },
                // { "title": "", "name": "所有工作流记录", "to": "/workflow/allrecord", "children": [], "is_show": true, "order": 7 },
                // { "title": "", "name": "工作流文档", "to": "/workflow/source", "children": [], "is_show": true, "order": 8 },
            ], "is_show": true, "order": 18
        },
    ];


export default menuList;
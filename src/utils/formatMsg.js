import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import React from "react";

const messages = defineMessages({
	// 系统管理placeholder
	InputlockID: {
		id: "page.system.accessType.InputlockID",
		defaultMessage: "请输入锁芯编号",
	},
	inputLockName: {
		id: "page.system.accessType.inputLockName",
		defaultMessage: "请输入锁芯名称"
	},
	inputIDnumber: {
		id: "page.system.accessType.inputIDnumber",
		defaultMessage: "证件号码"
	},
	InputfloorID: {
		id: "page.system.accessType.InputfloorID",
		defaultMessage: "请输入楼层编号"
	},
	InputfloorName: {
		id: "page.system.accessType.InputfloorName",
		defaultMessage: "请输入楼层名称"
	},
	inputroomId: {
		id: "page.system.reason.inputroomId",
		defaultMessage: "请输入房间编号"
	},
	InputbuildNo: {
		id: "page.system.accessType.InputbuildNo",
		defaultMessage: "请输入建筑编号"
	},
	inputroomName: {
		id: "page.system.reason.inputroomName",
		defaultMessage: "请输入房间名称"
	},
	InputDoorID: {
		id: "page.system.accessType.InputDoorID",
		defaultMessage: "请输入门编号"
	},
	InputdoorName: {
		id: "page.system.accessType.InputdoorName",
		defaultMessage: "请输入门名称"
	},
	filePlz: {
		id: "page.system.accessType.filePlz",
		defaultMessage: "请填写"
	},
	inputTitle: {
		id: "page.system.accessType.inputTitle",
		defaultMessage: "请输入标题"
	},
	inputContent: {
		id: "page.system.accessType.inputContent",
		defaultMessage: "请输入内容"
	},

	// 承包商管理(已翻译)
	inputCertId: {
		id: "page.construction.staff.certId",
		defaultMessage: "作业证编号"
	},
	inputCardNum: {
		id: "page.construction.staff.cardNumber",
		defaultMessage: "证件号码:"
	},
	inStaffName: {
		id: "page.construction.staff.cardName",
		defaultMessage: "员工姓名"
	},
	inSystem1:{
		id: "page.system.placeholder.inSystem1",
		defaultMessage: "承包商注册"
	},
	inSystem2:{
		id: "page.system.placeholder.inSystem2",
		defaultMessage: "用户注册"
	},


	// 承包商管理(未翻译)
	inConstructionContent: {
		id: "page.construction.input.Content",
		defaultMessage: "完成日期不能在项目开始日期前和项目结束日期之后"
	},
	inConstructionName: {
		id: "page.construction.input.name",
		defaultMessage: "输入承包商公司名或联系人名称搜索"
	},
	inConPhone: {
		id: "page.construction.staff.phone",
		defaultMessage: "手机号"
	},
	inConDate: {
		id: "page.construction.input.date",
		defaultMessage: "请选择有效期"
	},
	inInput: {
		id: "page.construction.input.input",
		defaultMessage: "请填写"
	},
	inSelect: {
		id: "page.construction.input.select",
		defaultMessage: "请选择"
	},
	inCon1: {
		id: "page.construction.input.con1",
		defaultMessage: "其他"
	},
	inCon2: {
		id: "page.construction.input.con2",
		defaultMessage: "输入承包商监督人员名称搜索"
	},
	inCon3: {
		id: "page.construction.input.con3",
		defaultMessage: "开工日期不能在项目开始日期前和项目结束日期之后, 不能大于当前日期两天"
	},
	inCon4: {
		id: "page.construction.input.con4",
		defaultMessage: "输入业主监督人员名称搜索"
	},
	inCon5: {
		id: "page.construction.input.con5",
		defaultMessage: "请选择吊挂机具有效期"
	},
	inCon6: {
		id: "page.construction.input.con6",
		defaultMessage: "请输入"
	},
	inCon7: {
		id: "page.construction.input.con7",
		defaultMessage: "请输入项目名"
	},
	inCon8: {
		id: "page.construction.input.con8",
		defaultMessage: "请选择施工区域"
	},
	inCon9: {
		id: "page.construction.project.projectName",
		defaultMessage: "项目名"
	},
	inCon10: {
		id: "page.construction.input.con10",
		defaultMessage: "例:HSE办公室"
	},
	inCon11: {
		id: "page.construction.input.con11",
		defaultMessage: "请输入详细描述"
	},
	inCon12: {
		id: "page.construction.input.con12",
		defaultMessage: "请选择预计开工日期"
	},
	inCon13: {
		id: "page.construction.input.con13",
		defaultMessage: "施工时间最长30天"
	},
	inCon14: {
		id: "page.construction.input.con14",
		defaultMessage: "请选择预计完成日期"
	},
	inCon15: {
		id: "page.construction.input.con15",
		defaultMessage: "请选择开始工作时间"
	},
	inCon16: {
		id: "page.construction.input.con16",
		defaultMessage: "选择时间"
	},
	inCon17: {
		id: "page.construction.input.con17",
		defaultMessage: "请选择结束工作时间"
	},
	inCon18: {
		id: "page.construction.input.con18",
		defaultMessage: "请选择承包商"
	},
	inCon19: {
		id: "page.construction.input.con19",
		defaultMessage: "使用设备工具"
	},
	inCon20: {
		id: "page.construction.input.con20",
		defaultMessage: "从事工作"
	},
	inCon21: {
		id: "page.construction.input.con21",
		defaultMessage: "涉及高风险作业"
	},
	inCon22: {
		id: "page.construction.input.con22",
		defaultMessage: "请选择风险评估"
	},
	inCon23: {
		id: "page.construction.input.con23",
		defaultMessage: "如需使用特殊工具（叉车、挖掘机等）、特殊的施工方法（如：吊装、大型钢构）请备注；如涉及电工作业，提供用电人员电工证详细信息。"
	},
	inCon24: {
		id: "page.construction.input.con24",
		defaultMessage: "请选择现场安全措施"
	},
	inCon25: {
		id: "page.construction.input.con25",
		defaultMessage: "化学品名称"
	},
	inCon26: {
		id: "page.construction.input.con26",
		defaultMessage: "化学品风险"
	},
	inCon27: {
		id: "page.construction.input.con27",
		defaultMessage: "个人防护用品"
	},
	inCon28: {
		id: "page.construction.input.con28",
		defaultMessage: "请选择承包商监督人员"
	},
	inCon29: {
		id: "page.construction.input.con29",
		defaultMessage: "请输入作业地点"
	},
	inCon30: {
		id: "page.construction.input.con30",
		defaultMessage: "请输入相关设备"
	},
	inCon31: {
		id: "page.construction.input.con31",
		defaultMessage: "请输入作业工具"
	},
	inCon32: {
		id: "page.construction.input.con32",
		defaultMessage: "请选择个人劳防用品"
	},
	inCon33: {
		id: "page.construction.input.con33",
		defaultMessage: "请选择作业内容"
	},
	inCon34: {
		id: "page.construction.input.con34",
		defaultMessage: "请选择要推送的卡证"
	},
	inCon35: {
		id: "page.construction.input.con35",
		defaultMessage: "请选择要推送的人"
	},
	inCon36: {
		id: "page.construction.input.con36",
		defaultMessage: "请填写推送内容!"
	},
	inCon37: {
		id: "page.construction.input.con37",
		defaultMessage: "请选择要提交的数据"
	},
	inCon38: {
		id: "page.construction.input.con38",
		defaultMessage: "请选择要导出的数据"
	},
	inCon39: {
		id: "page.construction.input.con39",
		defaultMessage: "请选择要撤回的数据"
	},
	inCon40: {
		id: "page.construction.input.con40",
		defaultMessage: "过期时间"
	},
	inCon41: {
		id: "page.construction.input.con41",
		defaultMessage: "搜索抄送人"
	},
	inCon42: {
		id: "page.construction.input.con42",
		defaultMessage: "请选择施工人员"
	},

	//卡证一站式
	inOne1: {
		id: "page.one.input.one1",
		defaultMessage: "请输入员工号"
	},
	inOne2: {
		id: "page.one.input.one2",
		defaultMessage: "请输入姓名"
	},
	inOne3: {
		id: "page.one.input.one3",
		defaultMessage: "请输入公司代码"
	},
	inOne4: {
		id: "page.one.input.one4",
		defaultMessage: "请输入员工组"
	},
	inOne5: {
		id: "page.one.input.one5",
		defaultMessage: "请选择成本中心"
	},
	inOne6: {
		id: "page.one.input.one6",
		defaultMessage: "请选择部门"
	},
	inOne7: {
		id: "page.one.input.one7",
		defaultMessage: "请选择厂区"
	},
	inOne8: {
		id: "page.one.input.one8",
		defaultMessage: "请选择直接/间接"
	},
	inOne9: {
		id: "page.one.input.one9",
		defaultMessage: "请输入加入时间"
	},
	inOne10: {
		id: "page.one.input.one10",
		defaultMessage: "请输入理由"
	},
	inOne11: {
		id: "page.one.input.one11",
		defaultMessage: "搜索员工号"
	},
	inOne12: {
		id: "page.one.input.one12",
		defaultMessage: "请输入车牌号"
	},
	inOne13: {
		id: "page.one.input.one13",
		defaultMessage: "请输入品牌"
	},
	inOne14: {
		id: "page.one.input.one14",
		defaultMessage: "请输入手机"
	},
	inOne15: {
		id: "page.one.input.one15",
		defaultMessage: "请选择开始日期"
	},
	inOne16: {
		id: "page.one.input.one16",
		defaultMessage: "请选择结束日期"
	},
	inOne17: {
		id: "page.one.input.one17",
		defaultMessage: "请输入固定资产号"
	},
	inOne18: {
		id: "page.one.input.one18",
		defaultMessage: "请输入电脑型号"
	},
	inOne19: {
		id: "page.one.input.one19",
		defaultMessage: "请输入序列号"
	},
	inOne20: {
		id: "page.one.input.one20",
		defaultMessage: "请输入身份证号"
	},
	inOne21: {
		id: "page.one.input.one21",
		defaultMessage: "请输入公司全称"
	},
	inOne22: {
		id: "page.one.input.one22",
		defaultMessage: "请输入公司法人代表"
	},
	inOne23: {
		id: "page.one.input.one23",
		defaultMessage: "请输入公司地址"
	},
	inOne24: {
		id: "page.one.input.one24",
		defaultMessage: "请输入电话"
	},
	inOne25: {
		id: "page.one.input.one25",
		defaultMessage: "请输入博世公司联络人"
	},
	inOne26: {
		id: "page.one.input.one26",
		defaultMessage: "请输入联系方式"
	},
	inOne27: {
		id: "page.one.input.one27",
		defaultMessage: "请输入工作范围"
	},
	inOne28: {
		id: "page.one.input.one28",
		defaultMessage: "请输入设备名称"
	},
	inOne29: {
		id: "page.one.input.one29",
		defaultMessage: "请输入外部人员姓名"
	},
	inOne30: {
		id: "page.one.input.one30",
		defaultMessage: "请输入外部人员证件号码"
	},
	inOne31: {
		id: "page.one.input.one31",
		defaultMessage: "请输入外部人员公司"
	},
	inOne32: {
		id: "page.one.input.one32",
		defaultMessage: "请输入外部人员部门"
	},
	inOne33: {
		id: "page.one.input.one33",
		defaultMessage: "请输入其他方式"
	},
	inOne34: {
		id: "page.one.input.one34",
		defaultMessage: "请输入其他区域"
	},
	inOne35: {
		id: "page.one.input.one35",
		defaultMessage: "请输入区域详情"
	},
	inOne36: {
		id: "page.one.input.one36",
		defaultMessage: "请输入部门协调员"
	},
	inOne37: {
		id: "page.one.input.one37",
		defaultMessage: "请输入卡号"
	},
	inOne38: {
		id: "page.one.input.one38",
		defaultMessage: "请输入金额"
	},
	inOne39: {
		id: "page.one.input.one39",
		defaultMessage: "成本中心"
	},
	inOne40: {
		id: "page.one.input.one40",
		defaultMessage: "部门"
	},
	inOne41: {
		id: "page.one.input.one41",
		defaultMessage: "卡片类型"
	},
	inOne42: {
		id: "page.one.input.one42",
		defaultMessage: "状态"
	},
	inOne43: {
		id: "page.one.input.one43",
		defaultMessage: "搜索"
	},
	inOne44: {
		id: "page.one.input.one44",
		defaultMessage: "开始月份"
	},
	inOne45: {
		id: "page.one.input.one45",
		defaultMessage: "结束月份"
	},
	inOne46: {
		id: "page.one.input.one46",
		defaultMessage: "请填写"
	},
	inOne47: {
		id: "page.one.input.one47",
		defaultMessage: "请输入使用人工号"
	},
	inOne48: {
		id: "page.one.input.one48",
		defaultMessage: "请输入使用人姓名"
	},
	inOne49: {
		id: "page.one.input.one49",
		defaultMessage: "年审"
	},
	inOne50: {
		id: "page.one.input.one50",
		defaultMessage: "补办年审"
	},
	inOne51: {
		id: "page.one.input.one51",
		defaultMessage: "请输入合法的金额"
	},
	inOne52: {
		id: "page.one.input.one52",
		defaultMessage: "请选择是否是电动车"
	},
	inOne53: {
		id: "page.one.input.one53",
		defaultMessage: "芯片卡库管理"
	},
	inOne54: {
		id: "page.one.input.one54",
		defaultMessage: "异常，请刷新浏览器!"
	},
	inOne55: {
		id: "page.one.input.one55",
		defaultMessage: "请填写完整数据!"
	},
	inOne56: {
		id: "page.one.input.one56",
		defaultMessage: "请先查询"
	},
	inOne57: {
		id: "page.one.input.one57",
		defaultMessage: "请先输入查询条件!"
	},
	inOne58: {
		id: "page.one.input.one58",
		defaultMessage: "请重新搜索"
	},
	inOne59: {
		id: "page.one.input.one59",
		defaultMessage: "申请审批"
	},
	inOne60: {
		id: "page.one.input.one60",
		defaultMessage: "我的卡片"
	},
	inOne61: {
		id: "page.one.input.one61",
		defaultMessage: "请填写推送内容!"
	},
	inOne62: {
		id: "page.one.input.one62",
		defaultMessage: "请输入工号"
	},
	inOne63: {
		id: "page.one.input.one63",
		defaultMessage: "请输入新卡号"
	},
	inOne64: {
		id: "app.component.tablepage.select_approver",
		defaultMessage: "请选择审批人!"
	},
	inOne65: {
		id: "page.one.input.one65",
		defaultMessage: "请选择制卡人!"
	},
	inOne66: {
		id: "page.one.input.one66",
		defaultMessage: "请确认是否删除吊挂作业子工单?"
	},
	inOne67: {
		id: "page.one.input.one67",
		defaultMessage: "请确认是否删除高处作业子工单?"
	},
	inOne68: {
		id: "page.one.input.one68",
		defaultMessage: "请确认是否删除动火作业子工单?"
	},
	inOne69: {
		id: "page.one.input.one69",
		defaultMessage: "请确认是否删除密闭空间作业子工单?"
	},
	inOne70: {
		id: "page.one.input.one70",
		defaultMessage: "请确认是否删除动土作业子工单?"
	},
	inOne71: {
		id: "page.work.my.title5",
		defaultMessage: "报修类型"
	},
	inOne72: {
		id: "page.carryout.record.factory",
		defaultMessage: "厂区"
	},
	inOne73: {
		id: "page.component.breadcrumb.mywork",
		defaultMessage: "我的报修"
	},
	inOne74: {
		id: "page.component.breadcrumb.allwork",
		defaultMessage: "所有报修"
	},
	inOneCard1:{
		id:"page.oneStop.cardAnnual.staffCard",
		defaultMessage:"员工卡"
	},
	inOneCard2:{
		id:"page.oneStop.cardAnnual.tempCard",
		defaultMessage:"临时卡"
	},
	inOneCard3:{
		id:"page.oneStop.cardAnnual.permissionCard",
		defaultMessage:"特殊权限卡"
	},
	inOneCard4:{
		id:"page.oneStop.cardAnnual.vipCard",
		defaultMessage:"VIP餐卡"
	},
	inOneCard5:{
		id:"page.oneStop.cardAnnual.contractorCard",
		defaultMessage:"供应商短期出入证"
	},
	inOneCard6:{
		id:"page.oneStop.cardAnnual.computerCard",
		defaultMessage:"电脑卡"
	},
	inOneCard7:{
		id:"page.oneStop.cardAnnual.equipmentCard",
		defaultMessage:"设备携出卡"
	},
	inOneCard8:{
		id:"page.oneStop.cardAnnual.photoCard",
		defaultMessage:"照相卡"
	},
	inOneCard9:{
		id:"page.oneStop.cardAnnual.parkCard",
		defaultMessage:"停车卡"
	},
	idNum:{
		id:"page.oneStop.cardOperation.idNum",
		defaultMessage:"身份证"
	},
	driveCard:{
		id:"page.construction.staff.driveCard",
		defaultMessage:"驾驶证"
	},
	licenceCard:{
		id:"page.construction.staff.licenceCard",
		defaultMessage:"护照"
	},

	// message.success/error/warning
	alarm1: {
		id: "app.button.sureSubmit",
		defaultMessage: "确定提交？"
	},
	alarm2: {
		id: "app.button.sureSubmitInfo",
		defaultMessage: "单击确认按钮后，将会提交数据"
	},
	alarm3: {
		id: "app.button.ok",
		defaultMessage: "确认"
	},
	alarm4: {
		id: "app.button.cancel",
		defaultMessage: "取消"
	},
	alarm5: {
		id: "app.button.alarm.alarm5",
		defaultMessage: "修改成功",
	},
	alarm6: {
		id: "app.button.alarm.alarm6",
		defaultMessage: "微信轮播图最多只能配置5张!"
	},
	alarm7: {
		id: "app.button.alarm.alarm7",
		defaultMessage: "保存成功"
	},
	alarm8: {
		id: "app.button.alarm.alarm8",
		defaultMessage: "提交成功"
	},
	alarm9: {
		id: "app.button.alarm.alarm9",
		defaultMessage: "已删除"
	},
	alarm10: {
		id: "app.button.alarm.alarm10",
		defaultMessage: "删除成功"
	},
	alarm11: {
		id: "app.button.alarm.alarm11",
		defaultMessage: "审批通过"
	},
	alarm12: {
		id: "app.button.alarm.alarm12",
		defaultMessage: "审批未通过"
	},
	alarm13: {
		id: "app.button.alarm.alarm13",
		defaultMessage: "添加成功"
	},
	alarm14: {
		id: "app.button.alarm.alarm14",
		defaultMessage: "审批备注最大长度不能超过200字节"
	},
	alarm15: {
		id: "app.button.alarm.alarm15",
		defaultMessage: "请先确认注意事项!"
	},
	alarm16: {
		id: "app.button.alarm.alarm16",
		defaultMessage: "超出项目预计完成日期，不能添加特种作业!"
	},
	alarm17: {
		id: "app.button.alarm.alarm17",
		defaultMessage: "请先添加图层"
	},
	alarm18: {
		id: "app.button.alarm.alarm18",
		defaultMessage: "图片加载失败"
	},
	alarm19: {
		id: "app.button.alarm.alarm19",
		defaultMessage: "请选择角色审批人!"
	},
	alarm20: {
		id: "app.button.alarm.alarm20",
		defaultMessage: "请选择需要离职变更的用户!"
	},
	alarm21: {
		id: "app.button.alarm.alarm21",
		defaultMessage: "请选择类型!"
	},
	alarm22: {
		id: "app.button.alarm.alarm22",
		defaultMessage: "请填写标题!"
	},
	alarm23: {
		id: "app.button.alarm.alarm23",
		defaultMessage: "请填写内容!"
	},
	alarm24: {
		id: "app.button.alarm.alarm24",
		defaultMessage: "数据不能重复提交"
	},
	alarm25: {
		id: "app.button.alarm.alarm25",
		defaultMessage: "请选择相同类型数据提交!"
	},
	alarm26: {
		id: "app.button.alarm.alarm26",
		defaultMessage: "请选择角色!"
	},
	alarm27: {
		id: "app.button.alarm.alarm27",
		defaultMessage: "请输入理由!"
	},
	alarm28: {
		id: "app.button.alarm.alarm28",
		defaultMessage: "请选择承包商过期时间"
	},
	alarm29: {
		id: "app.button.alarm.alarm29",
		defaultMessage: "请先标记坐标"
	},
	alarm30: {
		id: "app.button.alarm.alarm30",
		defaultMessage: "请先选择成本中心"
	},
	alarm31: {
		id: "app.button.alarm.alarm31",
		defaultMessage: "已提交"
	},
	alarm32: {
		id: "app.button.alarm.alarm32",
		defaultMessage: "已变更"
	},
	alarm33: {
		id: "app.button.alarm.alarm33",
		defaultMessage: "操作成功"
	},
	alarm34: {
		id: "app.button.alarm.alarm34",
		defaultMessage: "请填写备注"
	},
	alarm35: {
		id: "app.button.alarm.alarm35",
		defaultMessage: "表单中有必选的内容还没选择，请检查"
	},
	alarm36: {
		id: "app.button.alarm.alarm36",
		defaultMessage: "表单中有必填的内容还没填写，请检查"
	},
	alarm37: {
		id: "app.button.alarm.alarm37",
		defaultMessage: "提交失败"
	},
	alarm38: {
		id: "app.button.alarm.alarm38",
		defaultMessage: "最多选择12个月！"
	},
	alarm39: {
		id: "app.button.alarm.alarm39",
		defaultMessage: "请选择日期"
	},
	alarm40: {
		id: "app.button.alarm.alarm40",
		defaultMessage: "请输入工号再搜索!"
	},
	alarm41: {
		id: "app.button.alarm.alarm41",
		defaultMessage: "该员工号暂无此类型卡!"
	},
	alarm42: {
		id: "app.button.alarm.alarm42",
		defaultMessage: "请选择理由!"
	},
	alarm43: {
		id: "app.button.alarm.alarm43",
		defaultMessage: "请填写其他理由!"
	},
	alarm44: {
		id: "app.button.alarm.alarm44",
		defaultMessage: "没有找到有关卡片信息"
	},
	alarm45: {
		id: "app.button.alarm.alarm45",
		defaultMessage: "请输入要搜索的员工号"
	},
	alarm46: {
		id: "app.button.alarm.alarm46",
		defaultMessage: "卡片未全部归还!"
	},
	alarm47: {
		id: "app.button.alarm.alarm47",
		defaultMessage: "请检查拍照小程序是否开启"
	},
	alarm48: {
		id: "app.button.alarm.alarm48",
		defaultMessage: "证件号码格式不正确!"
	},
	alarm49: {
		id: "app.button.alarm.alarm49",
		defaultMessage: "请选择短期识别卡!"
	},
	alarm50: {
		id: "app.button.alarm.alarm50",
		defaultMessage: "附件格式不正确"
	},
	alarm51: {
		id: "app.button.alarm.alarm51",
		defaultMessage: "附件大小不超过3MB!"
	},
	alarm52: {
		id: "app.button.alarm.alarm52",
		defaultMessage: "至少有一个施工人员"
	},
	alarm53: {
		id: "app.button.alarm.alarm53",
		defaultMessage: "有未关闭的施工单,暂不能创建"
	},
	alarm54: {
		id: "app.button.alarm.alarm54",
		defaultMessage: "人员删除成功"
	},
	alarm55: {
		id: "app.button.alarm.alarm55",
		defaultMessage: "请至少选择一个审批人"
	},
	alarm56: {
		id: "app.button.alarm.alarm56",
		defaultMessage: "当前时间大于项目预计完成日期，不能提交!"
	},
	alarm57: {
		id: "app.button.alarm.alarm57",
		defaultMessage: "修改成功 可以添加人员并提交"
	},
	alarm58: {
		id: "app.button.alarm.alarm58",
		defaultMessage: "添加人员？"
	},
	alarm59: {
		id: "app.button.alarm.alarm59",
		defaultMessage: "提交审核前请先添加人员"
	},
	alarm60: {
		id: "app.button.alarm.alarm60",
		defaultMessage: "不能重复提交施工单"
	},
	alarm61: {
		id: "app.button.alarm.alarm61",
		defaultMessage: "不能提交已审核的施工单"
	},
	search_placeholder: {
		id: "page.one.input.one43",
		defaultMessage: "搜索"
	},
	roleManagement:{
		id:"page.system.accessType.roleManagement",
		defaultMessage: "角色管理"
	},
	revise:{
		id:"app.page.text.modify",
		defaultMessage: "修改"
	},
	add:{
		id:"component.tablepage.add",
		defaultMessage: "新增"
	},
	alarm63: {
		id: "page.contractor.projectRecord.closeTitle",
		defaultMessage: "异常关闭会导致承包商禁用"
	},
	alarm64: {
		id: "app.button.alarm.alarm64",
		defaultMessage: "请确认"
	},
	alarm65: {
		id: "app.button.alarm.alarm65",
		defaultMessage:"筛选当前页"
	},
	alarm66: {
		id: "app.button.alarm.alarm66",
		defaultMessage: "有"
	},
	alarm67: {
		id: "page.construction.staff.hasTrained",
		defaultMessage: "已培训"
	},
	alarm68: {
		id: "page.construction.staff.notTrained",
		defaultMessage: "未培训"
	},
	alarm69: {
		id: "app.button.alarm.alarm69",
		defaultMessage: "未通过"
	},
	searchapprover: {
		id: "app.component.tablepage.search_approver",
		defaultMessage: "搜索审批人"
	},
	alarm71: {
		id: "app.button.alarm.alarm71",
		defaultMessage: "请选择要退回的数据"
	},
	alarm72: {
		id: "app.button.alarm.alarm72",
		defaultMessage: "施工审批记录"
	},
	alarm73: {
		id: "app.button.alarm.alarm73",
		defaultMessage: "已关闭"
	},
	alarm74: {
		id: "app.button.alarm.alarm74",
		defaultMessage: "请确认已经了解注意事项!"
	},
	alarm75: {
		id: "app.button.alarm.alarm75",
		defaultMessage: "所选类型不一致或不能提交审批!"
	},
	alarm76: {
		id: "app.button.alarm.alarm76",
		defaultMessage: "所选条目中类型不一致!"
	},
	alarm77: {
		id: "app.button.alarm.alarm77",
		defaultMessage: "如果想删除人员，请先点该人员右侧X号删减"
	},
	alarm78: {
		id: "app.button.alarm.alarm78",
		defaultMessage: "输入的金额需要为整数"
	},
	alarm79: {
		id: "app.button.alarm.alarm79",
		defaultMessage: "请输入卡号再搜索!"
	},
	alarm80: {
		id: "app.button.alarm.alarm80",
		defaultMessage: "该员工号暂无此类型卡!"
	},
	alarm81: {
		id: "app.button.alarm.alarm81",
		defaultMessage: "您已经添加了动土作业"
	},
	alarm82: {
		id: "app.button.alarm.alarm82",
		defaultMessage: "您已经添加了吊挂作业"
	},
	alarm83: {
		id: "app.button.alarm.alarm83",
		defaultMessage: "您已经添加了高处作业"
	},
	alarm84: {
		id: "app.button.alarm.alarm84",
		defaultMessage: "您已经添加了动火作业"
	},
	alarm85: {
		id: "app.button.alarm.alarm85",
		defaultMessage: "您已经添加了密闭空间作业"
	},
	order1: {
		id: "app.button.alarm.order1",
		defaultMessage:"请选择提交用户"
	},
	order2: {
		id: "app.button.alarm.order2",
		defaultMessage:"请输入座机或姓名搜索负责人"
	},
	order3: {
		id: "app.button.alarm.order3",
		defaultMessage:"备注不能为空"
	},
	order4: {
		id: "app.button.alarm.order4",
		defaultMessage:"请填写报修类型"
	},
	order5: {
		id: "app.button.alarm.order5",
		defaultMessage:"请选择负责人!"
	},
	order6: {
		id: "app.button.alarm.order6",
		defaultMessage:"报修类型管理"
	},
	order7: {
		id: "app.button.alarm.order7",
		defaultMessage:"请输入座机或姓名搜索接单人"
	},
	order8: {
		id: "app.button.alarm.order8",
		defaultMessage:"请选择报修地点"
	},
	order9: {
		id: "app.button.alarm.order9",
		defaultMessage:"请根据实际情况选择对应报修类型"
	},
	order10: {
		id: "app.button.alarm.order10",
		defaultMessage:"请详细描述要报修的内容"
	},
	keys1: {
		id: "app.button.alarm.keys1",
		defaultMessage:"确定删除?"
	},
	keys2: {
		id: "app.button.alarm.keys2",
		defaultMessage:"申请权限管理"
	},
	keys3: {
		id: "app.button.alarm.keys3",
		defaultMessage:"成本中心"
	},
	keys4: {
		id: "app.button.alarm.keys4",
		defaultMessage:"部门"
	},
	keys5: {
		id: "page.keys.annual.searchKey",
		defaultMessage:"请搜索钥匙"
	},
	keys6: {
		id: "page.keys.annual.chooseStatus",
		defaultMessage:"请选择钥匙状态!"
	},
	keys7: {
		id: "page.keys.annual.annualSuccess",
		defaultMessage:"年审成功"
	},
	keys8: {
		id: "app.button.alarm.keys8",
		defaultMessage:"输入搜索"
	},
	keys9: {
		id: "page.keys.info.chooseLock",
		defaultMessage:"请选择锁芯"
	},
	keys10: {
		id: "page.keys.info.chooseType",
		defaultMessage:"请选择钥匙类型"
	},
	keys11: {
		id: "app.button.alarm.keys11",
		defaultMessage:"请选择钥匙"
	},
	keys12: {
		id: "app.button.alarm.keys12",
		defaultMessage:"请选择归还时间!"
	},
	keys13: {
		id: "app.button.alarm.keys13",
		defaultMessage:"输入编号"
	},
	keys14: {
		id: "app.button.alarm.keys14",
		defaultMessage:"请输入编号"
	},
	keys15: {
		id: "app.button.alarm.keys15",
		defaultMessage:"选择或搜索"
	},
	keys16: {
		id: "app.button.alarm.keys16",
		defaultMessage:"请求错误，请刷新页面"
	},
	keys17: {
		id: "app.button.alarm.keys17",
		defaultMessage:"选择或搜索"
	},
	keys18: {
		id: "app.button.alarm.keys18",
		defaultMessage:"请输入数字！"
	},
	keys19: {
		id: "app.button.alarm.keys19",
		defaultMessage:"请先上传附件!"
	},
	keys20: {
		id: "app.button.alarm.keys20",
		defaultMessage:"请填写完整信息!"
	},
	keys21: {
		id: "app.button.alarm.keys21",
		defaultMessage:"请添加审批人"
	},
	keys22: {
		id: "app.button.alarm.keys22",
		defaultMessage:"已撤回"
	},
	keys23: {
		id: "app.button.alarm.keys23",
		defaultMessage:"已关闭提醒"
	},
	keys24: {
		id: "app.button.alarm.keys24",
		defaultMessage:"请选择文档模板!"
	},
	keys25: {
		id: "app.button.alarm.keys25",
		defaultMessage:"请填写文档名称!"
	},
	keys26: {
		id: "app.button.alarm.keys26",
		defaultMessage:"结束日期不能小于开始日期!"
	},
	keys27: {
		id: "app.button.alarm.keys27",
		defaultMessage:"下次提醒日期必须大于当天!"
	},
	keys28: {
		id: "app.button.alarm.keys28",
		defaultMessage:"请输入文档描述"
	},
	keys29: {
		id: "app.button.alarm.keys29",
		defaultMessage:"请选择开始时间"
	},
	keys30: {
		id: "app.button.alarm.keys30",
		defaultMessage:"请选择结束时间"
	},
	keys31: {
		id: "app.button.alarm.keys31",
		defaultMessage:"请选择提醒时间"
	},
	keys32: {
		id: "app.button.alarm.keys32",
		defaultMessage:"请填写模板名称!"
	},
	keys33: {
		id: "app.button.alarm.keys33",
		defaultMessage:"请填写表单名称!"
	},
	keys34: {
		id: "app.button.alarm.keys34",
		defaultMessage:"请选择表单类型!"
	},
	keys35: {
		id: "app.button.alarm.keys35",
		defaultMessage:"请填写选项内容!"
	},
	keys36: {
		id: "page.doc.template.form1",
		defaultMessage:"单行文本"
	},
	keys37: {
		id: "page.doc.template.form2",
		defaultMessage:"数字"
	},
	keys38: {
		id: "page.doc.template.form3",
		defaultMessage:"多行文本"
	},
	keys39: {
		id: "page.doc.template.form4",
		defaultMessage:"下拉单选"
	},
	keys40: {
		id: "page.doc.template.form5",
		defaultMessage:"下拉多选"
	},
	keys41: {
		id: "app.button.alarm.keys41",
		defaultMessage:"请选择罚单规则"
	},
	keys42: {
		id: "app.button.alarm.keys42",
		defaultMessage:"请选择最后处理期限"
	},
	keys43: {
		id: "app.button.alarm.keys43",
		defaultMessage:"请选择要关闭的罚单"
	},
	keys44: {
		id: "app.button.alarm.keys44",
		defaultMessage:"已驳回"
	},
	export_data: {
		id: "app.component.tablepage.export_data",
		defaultMessage: "请选择要导出的数据!",
	},
	enabled: {
		id: "app.component.tablepage.enabled",
		defaultMessage: "已启用",
	},
	disabled: {
		id: "app.component.tablepage.disabled",
		defaultMessage: "已禁用",
	},
	select_disable_data: {
		id: "app.component.tablepage.select_disable_data",
		defaultMessage: "请选择要禁用的数据!",
	},
	select_enable_data: {
		id: "app.component.tablepage.select_enable_data",
		defaultMessage: "请选择要启用的数据!",
	},
	created: {
		id: "app.carryout.status.created",
		defaultMessage: "创建",
	},
	to_assigned: {
		id: "app.carryout.status.to_assigned",
		defaultMessage: "待分配",
	},
	wait_approve: {
		id: "app.carryout.status.wait_approve",
		defaultMessage: "待审批",
	},
	approved: {
		id: "app.carryout.status.approved",
		defaultMessage: "审批通过",
	},
	not_approved: {
		id: "app.carryout.status.not_approved",
		defaultMessage: "审批未通过",
	},
	withdraw: {
		id: "app.carryout.status.withdraw",
		defaultMessage: "撤回",
	},
	return_back: {
		id: "app.carryout.status.return_back",
		defaultMessage: "退回",
	},
	bewithdraw: {
		id: "app.carryout.status.bewithdraw",
		defaultMessage: "被撤回",
	},
	bereturn: {
		id: "app.carryout.status.bereturn",
		defaultMessage: "被退回",
	},
	closed: {
		id: "app.carryout.status.closed",
		defaultMessage: "已关闭",
	},
	exception_closed: {
		id: "app.carryout.status.exception_closed",
		defaultMessage: "异常关闭",
	},
	not_active: {
		id: "app.carryout.status.not_active",
		defaultMessage: "未生效",
	},
	submit: {
		id: "app.carryout.status.submit",
		defaultMessage: "提交",
	},

	// 测试车管理
    spare: {
		id: "app.testcar.status.spare",
		defaultMessage: "请输入剩余车位数!",
	},
	testCarName: {
		id: "page.testcar.area.testCarName",
		defaultMessage: "请输入区域名称",
	},
	modify_success: {
		id: 'app.message.vip.modify_success',
		defaultMessage: '修改成功',
	},
	saved: {
		id: 'app.button.alarm.alarm7',
		defaultMessage: '保存成功',
	},
	bindUsing: {
		id: 'page.testCar.bind.using',
		defaultMessage: '使用中',
	},
	bindUntie: {
		id: 'page.testCar.bind.unting',
		defaultMessage: '拆车中',
	},
	bindReturn: {
		id: 'page.testCar.bind.returned',
		defaultMessage: '已还车',
	},
	testCarFrame: {
		id: "page.testcar.area.testCarFrame",
		defaultMessage: "车架号不能为空",
	},
	testCar1: {
		id: "page.testcar.area.testCar1",
		defaultMessage: "请输入总车位数",
	},
	testCar2: {
		id: "page.testcar.area.testCar2",
		defaultMessage: "请选择入口天线",
	},
	testCar3: {
		id: "page.testcar.area.testCar3",
		defaultMessage: "请选择出口天线",
	},
	testCar4: {
		id: "page.testcar.area.testCar4",
		defaultMessage: "请输入区域名称",
	},
	testCar5: {
		id: "page.testcar.area.testCar5",
		defaultMessage: "请输入车架号搜索",
	},
	testCar6: {
		id: "page.testcar.area.testCar6",
		defaultMessage: "请填写rfid二维码!",
	},
	testCar7: {
		id: "page.testcar.area.testCar7",
		defaultMessage: "rfid二维码中不能含中文",
	},
	testCar8: {
		id: "page.testcar.area.testCar8",
		defaultMessage: "绑定成功",
	},
	testCar9: {
		id: "page.testcar.area.testCar9",
		defaultMessage: "车辆已解绑",
	},
	testCar10: {
		id: "page.testcar.area.testCar10",
		defaultMessage: "请输入rfid二维码号",
	},
	testCar11: {
		id: "page.testcar.area.testCar11",
		defaultMessage: "请先分配驾驶员",
	},
	testCar12: {
		id: "page.testcar.area.testCar12",
		defaultMessage: "驾驶员分配成功",
	},
	testCar13: {
		id: "page.testcar.area.testCar13",
		defaultMessage: "请先选择负责人",
	},
	testCar14: {
		id: "page.testcar.area.testCar14",
		defaultMessage: "请上传车保附件",
	},
	testCar15: {
		id: "page.testcar.area.testCar15",
		defaultMessage: "请输入车架号",
	},
	testCar16: {
		id: "page.testcar.area.testCar16",
		defaultMessage: "请输入项目类型",
	},
	testCar17: {
		id: "page.testcar.area.testCar17",
		defaultMessage: "请输入项目名称",
	},
	testCar18: {
		id: "page.testcar.area.testCar18",
		defaultMessage: "请输入车辆类型",
	},
	testCar19: {
		id: "page.testcar.area.testCar19",
		defaultMessage: "请输入引擎类型",
	},
	testCar20: {
		id: "page.testcar.area.testCar20",
		defaultMessage: "请输入车辆尺寸",
	},
	testCar21: {
		id: "page.testcar.area.testCar21",
		defaultMessage: "请输入车辆品牌",
	},
	testCar22: {
		id: "page.testcar.area.testCar22",
		defaultMessage: "请输入车辆型号",
	},
	testCar23: {
		id: "page.testcar.area.testCar23",
		defaultMessage: "请输入车辆颜色",
	},
	testCar24: {
		id: "page.testcar.area.testCar24",
		defaultMessage: "请输入临时牌照",
	},
	testCar25: {
		id: "page.testcar.area.testCar25",
		defaultMessage: "请输入临时牌照过期时间",
	},
	testCar26: {
		id: "page.testcar.area.testCar26",
		defaultMessage: "请输入车保编号",
	},
	testCar27: {
		id: "page.testcar.area.testCar27",
		defaultMessage: "请输入车保过期时间",
	},
	testCar28: {
		id: "page.testcar.area.testCar28",
		defaultMessage: "请选择出厂类型",
	},
	testCar29: {
		id: "page.testcar.area.testCar29",
		defaultMessage: "新增前请先在个人中心补全您的手机号",
	},
	testCar30: {
		id: "page.testcar.area.testCar30",
		defaultMessage: "请上传驾驶证附件",
	},
	testCar31: {
		id: "page.testcar.area.testCar31",
		defaultMessage: "请上传内部驾驶证附件",
	},
	testCar32: {
		id: "page.testcar.area.testCar32",
		defaultMessage: "请输入驾驶证",
	},
	testCar33: {
		id: "page.testcar.area.testCar33",
		defaultMessage: "请输入驾驶证过期时间",
	},
	testCar34: {
		id: "page.testcar.area.testCar34",
		defaultMessage: "请输入内部驾驶证",
	},
	testCar35: {
		id: "page.testcar.area.testCar35",
		defaultMessage: "请输入内部驾驶证过期时间",
	},
	testCar36: {
		id: "page.testcar.area.testCar36",
		defaultMessage: "请选择要移交的人员",
	},
	testCar37: {
		id: "page.testcar.area.testCar37",
		defaultMessage: "请选择出厂类型",
	},
	testCar38: {
		id: "page.testcar.area.testCar38",
		defaultMessage: "请填写出厂类型名称!",
	},
	testCar39: {
		id: "page.testcar.area.testCar39",
		defaultMessage: "请输入出厂类型名称",
	},
	testCar40: {
		id: "page.testcar.area.testCar40",
		defaultMessage: "请输入RFID芯片号",
	},
    testCar41: {
		id: "page.testcar.area.testCar41",
		defaultMessage: "二维码号不能为空",
	},
	testCar42: {
		id: "page.testcar.area.testCar42",
		defaultMessage: "扫码或输入RFID二维码号，不超过10位",
	},
	testCar43: {
		id: "page.testcar.area.testCar43",
		defaultMessage: "配置成功",
	},
	testCar44: {
		id: "page.testcar.area.testCar44",
		defaultMessage: "出厂抽查概率不能为空",
	},
	testCar45: {
		id: "page.testcar.area.testCar45",
		defaultMessage: "所填数字需为0~100间的整数",
	},
	testCar46: {
		id: "page.testcar.area.testCar46",
		defaultMessage: "请输入出厂抽查概率，35即等于35%",
	},
	testCar47: {
		id: "page.testcar.area.testCar47",
		defaultMessage: "请选择天线类型!",
	},
	testCar48: {
		id: "page.testcar.area.testCar48",
		defaultMessage: "请填写天线名称!",
	},
	testCar49: {
		id: "page.testcar.area.testCar49",
		defaultMessage: "请填写设备唯一标识!",
	},
	testCar50: {
		id: "page.testcar.area.testCar50",
		defaultMessage: "请输入偏移车位数!",
	},
	testCar51: {
		id: "page.testcar.area.testCar51",
		defaultMessage: "请输入RBU业务单元的名称",
	},
	testCar52: {
		id: "page.testcar.area.testCar52",
		defaultMessage: "所填名称不能为空",
	},
	testCar53: {
		id: "page.testcar.area.testCar53",
		defaultMessage: "请输入主机厂的名称",
	},
	testCar54: {
		id: "page.testcar.area.testCar54",
		defaultMessage: "请输入车辆的类型名称",
	},
	testCar55: {
		id: "page.testcar.area.testCar55",
		defaultMessage: "请输入引擎的类型名称",
	},
	testCar56: {
		id: "page.testcar.area.testCar56",
		defaultMessage: "车架号为17位的号码",
	},
	testCar57: {
		id: "page.testcar.area.testCar57",
		defaultMessage: "格式：长*宽*高，单位mm",
	},
	testCar58: {
		id: "page.testcar.area.testCar58",
		defaultMessage: "请输入该车在博世内部的编号",
	},
	testCar59: {
		id: "page.testcar.area.testCar59",
		defaultMessage: "请选择主机厂",
	},
	testCar60: {
		id: "page.testcar.area.testCar60",
		defaultMessage: "请选择业务单元",
	},
	testCar61: {
		id: "page.testcar.area.testCar61",
		defaultMessage: "请选择车辆类型",
	},
	testCar62: {
		id: "page.testcar.area.testCar62",
		defaultMessage: "请选择引擎类型",
	},
	workOrder1: {
		id: "page.work.my.title22",
		defaultMessage: "请输入您想要提交的接单人",
	},
	workOrder2: {
		id: "page.work.my.title23",
		defaultMessage: "请选择优先级",
	},
	workOrder3: {
		id: "page.work.my.title24",
		defaultMessage: "直接修改接单人无效，请先手动将报修类型选为其他",
	},
	workOrder4: {
		id: "page.work.my.title28",
		defaultMessage: "请选择类型",
	},
    workOrder5: {
		id: "page.component.breadcrumb.hotwork",
		defaultMessage: "坐席报修",
	},
	workOrder6: {
		id: "page.component.breadcrumb.workOrder6",
		defaultMessage: "请输入11位手机号码",
	},
	workOrder7: {
		id: "page.component.breadcrumb.workOrder7",
		defaultMessage: "请输入中文或拼音姓名",
	},
	workOrder8: {
		id: "page.component.breadcrumb.workOrder8",
		defaultMessage: "例如:RBAC/PRS",
	},
	workOrder9: {
		id: "page.component.breadcrumb.workOrder9",
		defaultMessage: "例如:0512-62920000",
	},
	workOrder10: {
		id: "page.component.breadcrumb.workOrder10",
		defaultMessage: "指定接单人",
	},
	workOrder11: {
		id: "page.component.breadcrumb.workOrder11",
		defaultMessage: "指定接单人",
	},
	workOrder12: {
		id: "page.component.breadcrumb.workOrder12",
		defaultMessage: "请输入您在本工单上花费的金额，单位元",
	},
	workOrder13: {
		id: "page.component.breadcrumb.workOrder13",
		defaultMessage: "开始时间",
	},
	workOrder14: {
		id: "page.component.breadcrumb.workOrder14",
		defaultMessage: "结束时间",
	},
	workOrder15: {
		id: "page.component.breadcrumb.workOrder15",
		defaultMessage: "工作日接单",
	},
	workOrder16: {
		id: "page.component.breadcrumb.workOrder16",
		defaultMessage: "周末接单",
	},
	workOrder17: {
		id: "page.workOrder.breadcrumb.workOrder17",
		defaultMessage: "天",
	},
	workOrder18: {
		id: "page.workOrder.breadcrumb.workOrder18",
		defaultMessage: "小时",
	},
	workOrder19: {
		id: "page.workOrder.breadcrumb.workOrder19",
		defaultMessage: "分钟",
	},
	workOrder20: {
		id: "page.workOrder.breadcrumb.workOrder20",
		defaultMessage: "秒",
	},
    start_placeholder: {
    id: 'app.placeholder.viewvisitor.start_placeholder',
    defaultMessage: '开始日期',
  },
  end_placeholder: {
    id: 'app.placeholder.viewvisitor.end_placeholder',
    defaultMessage: '结束日期',
  },
	area_history: {
    id: 'app.placeholder.viewvisitor.area_placeholder',
    defaultMessage: '区域',
  },
	search_text: {
    id: 'page.event.vipvisitor.search_text',
    defaultMessage: '根据姓名或者座机搜索审批人',
  },
	area_placeholder: {
    id: 'app.placeholder.viewvisitor.area_placeholder',
    defaultMessage: '区域名称',
  },
	workOrder21: {
		id: "page.workOrder.breadcrumb.workOrder21",
		defaultMessage: "催单成功",
	},
});


export default messages;
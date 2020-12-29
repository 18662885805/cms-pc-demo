const menuConfig = [
    {"title":"index","name":"首页","to":"/","children":[],"is_show":true},
    // {"title":"xunjian","name":"巡检管理","to":"/inspection","children":[
    //     {"title":"","name":"我的巡检","to":"/inspection/myrecord","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"巡检记录","to":"/inspection/record","children":[],"is_show":true,"order":6,"wx_url":null},
    //     {"title":"","name":"排班管理","to":"/inspection/scheduling","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"路线分组","to":"/inspection/group","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"巡检路线","to":"/inspection/route","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"巡检点位","to":"/inspection/area","children":[],"is_show":true,"order":1,"wx_url":null}
    // ],"is_show":true,"order":100,"wx_url":null},
    {"title":"parking","name":"停车管理","to":"/parking","children":[
        {"title":"","name":"停车注意事项","to":"/parking/notice","children":[],"is_show":true,"order":9,"wx_url":null},
        {"title":"","name":"黑名单","to":"/parking/blacklist","children":[],"is_show":true,"order":8,"wx_url":null},
        {"title":"","name":"临时停车记录","to":"/parking/records/visitor","children":[],"is_show":true,"order":7,"wx_url":null},
        {"title":"","name":"员工停车记录","to":"/parking/records/staff","children":[],"is_show":true,"order":6,"wx_url":null},
        {"title":"","name":"临时停车登记","to":"/parking/register","children":[],"is_show":true,"order":5,"wx_url":null},
        {"title":"","name":"我的临时停车","to":"/parking/myvisitor","children":[],"is_show":true,"order":4,"wx_url":null},
        {"title":"","name":"车辆授权","to":"/parking/auth","children":[],"is_show":true,"order":3,"wx_url":null},
        {"title":"","name":"车辆查询","to":"/parking/search","children":[],"is_show":true,"order":2,"wx_url":null},
        {"title":"","name":"停车场配置","to":"/parking/area","children":[],"is_show":true,"order":1,"wx_url":null}
    ],"is_show":true,"order":28,"wx_url":null},
    // {"title":"gongdan","name":"报修管理","to":"/workorder","children":[
    //     {"title":"","name":"座席报修","to":"/workorder/orderhotline","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"报修报表","to":"/workorder/dashboard","children":[],"is_show":true,"order":11,"wx_url":null},
    //     {"title":"","name":"所有报修","to":"/workorder/orderall","children":[],"is_show":true,"order":9,"wx_url":null},
    //     {"title":"","name":"报修类型","to":"/workorder/ordercategory","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"待处理报修","to":"/workorder/ordertodo","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"我的报修","to":"/workorder/order","children":[],"is_show":true,"order":3,"wx_url":null}
    // ],"is_show":true,"order":4,"wx_url":null},
    // {"title":"maintenance","name":"设备管理","to":"/eqp","children":[
    //     {"title":"","name":"维修卡类型","to":"/eqp/cardtype","children":[],"is_show":true,"order":16,"wx_url":null},
    //     {"title":"","name":"供应商","to":"/eqp/supplier","children":[],"is_show":true,"order":15,"wx_url":null},
    //     {"title":"","name":"所有维修卡","to":"/eqp/maintcard","children":[],"is_show":true,"order":14,"wx_url":null},
    //     {"title":"","name":"我的维修卡","to":"/eqp/mymaintcard","children":[],"is_show":true,"order":13,"wx_url":null},
    //     {"title":"","name":"常用报表","to":"/eqp/dashboard","children":[],"is_show":true,"order":12,"wx_url":null},
    //     {"title":"","name":"我的维护记录","to":"/eqp/mychecklist","children":[],"is_show":true,"order":8,"wx_url":null},
    //     {"title":"","name":"所有维护记录","to":"/eqp/checklist","children":[],"is_show":true,"order":9,"wx_url":null},
    //     {"title":"","name":"维护类型","to":"/eqp/mtype","children":[],"is_show":true,"order":7,"wx_url":null},
    //     {"title":"","name":"所有任务单","to":"/eqp/task","children":[],"is_show":true,"order":6,"wx_url":null},
    //     {"title":"","name":"我的任务单","to":"/eqp/mytask","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"任务包管理","to":"/eqp/package","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"规则管理","to":"/eqp/rule","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"系统设备","to":"/eqp/syseqp","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"Key维护","to":"/eqp/key","children":[],"is_show":true,"order":1,"wx_url":null}
    // ],"is_show":true,"order":12,"wx_url":null},
    // {"title":"training","name":"入厂培训","to":"/training","children":[
    //     {"title":"","name":"入厂培训管理","to":"/training/manage","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"安全须知记录","to":"/training/safety","children":[],"is_show":true,"order":99,"wx_url":null},
    //     {"title":"","name":"培训记录","to":"/training/record","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"试题库","to":"/training/paper","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"资料库","to":"/training/material","children":[],"is_show":true,"order":2,"wx_url":null}
    // ],"is_show":true,"order":6,"wx_url":null},
    // {"title":"book","name":"内部培训","to":"/in_training","children":[
    //     {"title":"","name":"所有培训记录","to":"/in_training/allrecord","children":[],"is_show":true,"order":6,"wx_url":null},
    //     {"title":"","name":"培训管理","to":"/in_training/train","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"我的培训证书","to":"/in_training/certificate","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"我的内部培训","to":"/in_training/my_training","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"培训试题库","to":"/in_training/papers","children":[],"is_show":true,"order":0,"wx_url":null},
    //     {"title":"","name":"培训资料库","to":"/in_training/materials","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"我的培训记录","to":"/in_training/myrecord","children":[],"is_show":true,"order":4,"wx_url":null}
    // ],"is_show":true,"order":100,"wx_url":null},
    // {"title":"team","name":"访客管理","to":"/event","children":[
    //     {"title":"","name":"团体预约审批记录","to":"/event/viprecordinfo","children":[],"is_show":true,"order":62,"wx_url":null},
    //     {"title":"","name":"团体访客登记","to":"/event/vipinfo","children":[],"is_show":true,"order":63,"wx_url":null},
    //     {"title":"","name":"团体预约审批","to":"/event/viprecordaudit","children":[],"is_show":true,"order":61,"wx_url":null},
    //     {"title":"","name":"我的团体预约","to":"/event/viprecord","children":[],"is_show":true,"order":60,"wx_url":null},
    //     {"title":"","name":"集团员工电子证管理","to":"/event/staffauth","children":[],"is_show":true,"order":37,"wx_url":null},
    //     {"title":"","name":"集团员工电子证审批","to":"/event/staffapply","children":[],"is_show":true,"order":36,"wx_url":null},
    //     {"title":"","name":"物品携出记录","to":"/event/goodsrecord","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"自助预约管理","to":"/event/selfappointment","children":[],"is_show":true,"order":9,"wx_url":null},
    //     {"title":"","name":"我的访客","to":"/event/myvisitor","children":[],"is_show":true,"order":8,"wx_url":null},
    //     {"title":"","name":"装卸货浏览","to":"/event/viewcargo","children":[],"is_show":true,"order":11,"wx_url":null},
    //     {"title":"","name":"访客浏览","to":"/event/viewvisitor","children":[],"is_show":true,"order":10,"wx_url":null},
    //     {"title":"","name":"我的预约","to":"/event/appointment","children":[],"is_show":true,"order":7,"wx_url":null},
    //     {"title":"","name":"访客出厂","to":"/event/accessrecord","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"预约访客登记","to":"/event/bookvisitor","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"装卸货登记","to":"/event/cargo","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"散客登记","to":"/event/fit","children":[],"is_show":true,"order":0,"wx_url":null},
    //     {"title":"","name":"黑名单管理","to":"/event/blanklist","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"临时卡管理","to":"/event/temporarycard","children":[],"is_show":true,"order":6,"wx_url":null}
    // ],"is_show":true,"order":1,"wx_url":null},
    // {"title":"che","name":"测试车","to":"/testcar","children":[
    //     {"title":"","name":"我的车辆（驾驶员）","to":"/testcar/drivercar","children":[],"is_show":true,"order":24,"wx_url":null},
    //     {"title":"","name":"车辆信息维护","to":"/testcar/carinfo","children":[],"is_show":true,"order":15,"wx_url":null},
    //     {"title":"","name":"基础数据配置","to":"/testcar/settings","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"车辆进出记录","to":"/testcar/historyrecord","children":[],"is_show":true,"order":30,"wx_url":null},
    //     {"title":"","name":"车辆审批记录","to":"/testcar/carrecordinfo","children":[],"is_show":true,"order":27,"wx_url":null},
    //     {"title":"","name":"我的车辆申请","to":"/testcar/carrecord","children":[],"is_show":true,"order":25,"wx_url":null},
    //     {"title":"","name":"车辆绑定管理","to":"/testcar/carbinding","children":[],"is_show":true,"order":21,"wx_url":null},
    //     {"title":"","name":"出厂类型管理","to":"/testcar/outtype","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"天线管理","to":"/testcar/aerial","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"车辆管理","to":"/testcar/car","children":[],"is_show":true,"order":22,"wx_url":null},
    //     {"title":"","name":"驾驶员管理","to":"/testcar/driver","children":[],"is_show":true,"order":14,"wx_url":null},
    //     {"title":"","name":"车辆审批","to":"/testcar/carrecordaudit","children":[],"is_show":true,"order":26,"wx_url":null},
    //     {"title":"","name":"僵尸车查询","to":"/testcar/zombie","children":[],"is_show":true,"order":31,"wx_url":null},
    //     {"title":"","name":"停车区域管理","to":"/testcar/area","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"违规记录","to":"/testcar/violation","children":[],"is_show":true,"order":29,"wx_url":null},
    //     {"title":"","name":"我的车辆（负责人）","to":"/testcar/tpmcar","children":[],"is_show":true,"order":23,"wx_url":null},
    //     {"title":"","name":"RFID绑定","to":"/testcar/rfid","children":[],"is_show":true,"order":4,"wx_url":null}
    // ],"is_show":true,"order":14,"wx_url":null},
    // {"title":"spare","name":"备件管理","to":"/warehouse","children":[
    //     {"title":"","name":"备件申领记录","to":"/warehouse/allreceiving","children":[],"is_show":true,"order":9,"wx_url":null},
    //     {"title":"","name":"发料管理","to":"/warehouse/receiving","children":[],"is_show":true,"order":8,"wx_url":null},
    //     {"title":"","name":"所有审批记录","to":"/warehouse/allrecord","children":[],"is_show":true,"order":7,"wx_url":null},
    //     {"title":"","name":"备件审批记录","to":"/warehouse/recordinfo","children":[],"is_show":true,"order":6,"wx_url":null},
    //     {"title":"","name":"我的审批","to":"/warehouse/recordaudit","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"我的申请","to":"/warehouse/record","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"备件库存","to":"/warehouse/inventory","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"存放地点","to":"/warehouse/area","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"备件类型","to":"/warehouse/type","children":[],"is_show":true,"order":1,"wx_url":null}
    // ],"is_show":true,"order":11,"wx_url":null},
    // {"title":"work","name":"E-POST","to":"/epost","children":[
    //     {"title":"","name":"我的寄件","to":"/epost/mypost","children":[],"is_show":true,"order":0,"wx_url":null},
    //     {"title":"","name":"所有寄件","to":"/epost/all_post","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"盖章审批","to":"/epost/stamp_operation","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"盖章浏览","to":"/post/stamp_record","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"收发室","to":"/epost/mailroom","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"常用联系人","to":"/epost/contact","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"基本配置","to":"/epost/setting","children":[],"is_show":true,"order":6,"wx_url":null},
    //     {"title":"","name":"常用地址","to":"/epost/address","children":[],"is_show":true,"order":7,"wx_url":null}
    // ],"is_show":true,"order":13,"wx_url":null},
    {"title":"setting","name":"系统管理","to":"/system","children":[
        {"title":"","name":"权限申请管理","to":"/system/allapplyroleinfo","children":[],"is_show":true,"order":10,"wx_url":null},
        {"title":"","name":"用户注册管理","to":"/system/allregister","children":[],"is_show":true,"order":3,"wx_url":null},
        {"title":"","name":"权限申请审批记录","to":"/system/applyroleinfo","children":[],"is_show":true,"order":7,"wx_url":null},
        {"title":"","name":"权限申请审批","to":"/system/applyroleaudit","children":[],"is_show":true,"order":7,"wx_url":null},
        // {"title":"","name":"成本中心","to":"/system/costcenter","children":[],"is_show":true,"order":5,"wx_url":null},
        // {"title":"","name":"电子认证管理","to":"/system/visitorauth","children":[],"is_show":true,"order":12,"wx_url":null},
        // {"title":"","name":"电子认证审批","to":"/system/visitoraudit","children":[],"is_show":true,"order":11,"wx_url":null},
        {"title":"","name":"区域管理","to":"/system/factory","children":[],"is_show":true,"order":4,"wx_url":null},
        {"title":"","name":"消息通知管理","to":"/system/message","children":[],"is_show":true,"order":18,"wx_url":null},
        // {"title":"","name":"系统配置","to":"/system/settings","children":[],"is_show":true,"order":0,"wx_url":null},
        {"title":"","name":"我的权限申请","to":"/system/applyrole","children":[],"is_show":true,"order":7,"wx_url":null},
        {"title":"","name":"装卸货进厂限制管理","to":"/system/vehiclepermit","children":[],"is_show":true,"order":17,"wx_url":null},
        {"title":"","name":"货物类型管理","to":"/system/goodstype","children":[],"is_show":true,"order":16,"wx_url":null},
        {"title":"","name":"来访理由管理","to":"/system/reason","children":[],"is_show":true,"order":15,"wx_url":null},
        {"title":"","name":"通道管理","to":"/system/channel","children":[],"is_show":true,"order":13,"wx_url":null},
        {"title":"","name":"用户注册审批","to":"/system/register","children":[],"is_show":true,"order":2,"wx_url":null},
        // {"title":"","name":"部门管理","to":"/system/department","children":[],"is_show":true,"order":6,"wx_url":null},
        {"title":"","name":"角色管理","to":"/system/role","children":[],"is_show":true,"order":3,"wx_url":null},
        {"title":"","name":"用户管理","to":"/system/user","children":[],"is_show":true,"order":1,"wx_url":null}
    ],"is_show":true,"order":0,"wx_url":null},
    // {"title":"profile","name":"文档管理","to":"/document","children":[
    //     {"title":"","name":"我的文档审批记录","to":"/document/myauditrecord","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"我的文档审批","to":"/document/myaudit","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"所有文档","to":"/document/alldocument","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"我的文档","to":"/document/mydocument","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"模板管理","to":"/document/templates","children":[],"is_show":true,"order":0,"wx_url":null}
    // ],"is_show":true,"order":10,"wx_url":null},
    // {"title":"project","name":"项目管理","to":"/project","children":[
    //     {"title":"","name":"阶段审批","to":"/project/myaudit","children":[],"is_show":true,"order":6,"wx_url":null},
    //     {"title":"","name":"阶段审批记录","to":"/project/myauditrecord","children":[],"is_show":true,"order":7,"wx_url":null},
    //     {"title":"","name":"阶段配置","to":"/project/stage","children":[],"is_show":true,"order":8,"wx_url":null},
    //     {"title":"","name":"类型配置","to":"/project/type","children":[],"is_show":true,"order":9,"wx_url":null},
    //     {"title":"","name":"所有任务","to":"/project/alltask","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"我的任务","to":"/project/mytask","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"所有附件","to":"/project/alldoc","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"我的附件","to":"/project/mydoc","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"所有项目","to":"/project/allproject","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"我的项目","to":"/project/myproject","children":[],"is_show":true,"order":0,"wx_url":null}
    // ],"is_show":true,"order":9,"wx_url":null},
    // {"title":"onestop","name":"卡证一站式","to":"/onestop","children":[
    //     {"title":"","name":"注意事项配置","to":"/onestop/settings","children":[],"is_show":true,"order":13,"wx_url":null},
    //     {"title":"","name":"卡证年审管理","to":"/onestop/annualtrial","children":[],"is_show":true,"order":11,"wx_url":null},
    //     {"title":"","name":"卡证库","to":"/onestop/chip","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"卡证信息查询","to":"/onestop/service","children":[],"is_show":true,"order":9,"wx_url":null},
    //     {"title":"","name":"申请审批记录","to":"/onestop/cardrecord","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"申请审批","to":"/onestop/cardaudit","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"卡证申请","to":"/onestop/cardoperation","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"我的卡证","to":"/onestop/card","children":[],"is_show":true,"order":7,"wx_url":null}
    // ],"is_show":true,"order":7,"wx_url":null},
    // {"title":"carryout","name":"资产出厂","to":"/carryout","children":[
    //     {"title":"","name":"物品携出浏览","to":"/carryout/allrecord","children":[],"is_show":true,"order":100,"wx_url":null},
    //     {"title":"","name":"我的审批记录","to":"/carryout/goodsrecordinfo","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"物品携出审批","to":"/carryout/goodsrecordaudit","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"我的携出登记","to":"/carryout/goodsrecord","children":[],"is_show":true,"order":0,"wx_url":null}
    // ],"is_show":true,"order":3,"wx_url":null},
    // {"title":"keys","name":"钥匙管理","to":"/keys","children":[
    //     {"title":"","name":"钥匙年审","to":"/keys/annualtrial","children":[],"is_show":true,"order":5,"wx_url":null},
    //     {"title":"","name":"钥匙单创建","to":"/keys/list","children":[],"is_show":true,"order":4,"wx_url":null},
    //     {"title":"","name":"钥匙审批查询","to":"/keys/record","children":[],"is_show":true,"order":3,"wx_url":null},
    //     {"title":"","name":"钥匙审批","to":"/keys/audit","children":[],"is_show":true,"order":2,"wx_url":null},
    //     {"title":"","name":"钥匙申请","to":"/keys/operation","children":[],"is_show":true,"order":1,"wx_url":null},
    //     {"title":"","name":"钥匙维护","to":"/keys/info","children":[],"is_show":true,"order":0,"wx_url":null}
    // ],"is_show":true,"order":8,"wx_url":null},
    {"title":"construction","name":"施工管理","to":"/construction","children":[
        {"title":"","name":"员工审批记录","to":"/construction/staffrecordinfo","children":[],"is_show":true,"order":3,"wx_url":null},
        {"title":"","name":"施工人员监控","to":"/construction/viewlistener","children":[],"is_show":true,"order":8,"wx_url":null},
        {"title":"","name":"施工浏览","to":"/construction/viewproject","children":[],"is_show":true,"order":7,"wx_url":null},
        {"title":"","name":"施工审批记录","to":"/construction/projectrecord","children":[],"is_show":true,"order":6,"wx_url":null},
        {"title":"","name":"施工审批","to":"/construction/projectaudit","children":[],"is_show":true,"order":5,"wx_url":"/construct/toexamin"},
        {"title":"","name":"施工预约","to":"/construction/project","children":[],"is_show":true,"order":4,"wx_url":null},
        {"title":"","name":"员工审批","to":"/construction/staffrecord","children":[],"is_show":true,"order":2,"wx_url":null},
        {"title":"","name":"员工管理","to":"/construction/worker","children":[],"is_show":true,"order":1,"wx_url":null},
        {"title":"","name":"承包商管理","to":"/construction/contractor","children":[],"is_show":true,"order":0,"wx_url":null},
        {"title":"","name":"职务管理","to":"/404","children":[],"is_show":true,"order":10,"wx_url":null}
    ],"is_show":true,"order":2,"wx_url":null},
    // {"title":"ticket","name":"罚单管理","to":"/ticket","children":[
    //     {"title":"","name":"所有罚单","to":"/ticket/allrecord","children":[],"is_show":true,"order":2,"wx_url":"/tickets/ticketsAllList"},
    //     {"title":"","name":"我的罚单","to":"/ticket/myrecord","children":[],"is_show":true,"order":1,"wx_url":"/tickets/ticketslist"},
    //     {"title":"","name":"已开罚单","to":"/ticket/record","children":[],"is_show":true,"order":0,"wx_url":"/tickets/ticketslists"},
    //     {"title":"","name":"罚单规则管理","to":"/ticket/rules","children":[],"is_show":true,"order":3,"wx_url":"/ticket/rules"}
    // ],"is_show":true,"order":5,"wx_url":"/tickets/ticketindex"},
    // {"title":"logs","name":"日志管理","to":"/log","children":[
    //     {"title":"","name":"我的日志","to":"/log/info","children":[],"is_show":true,"order":0,"wx_url":"/log/myLog"}
    // ],"is_show":true,"order":11,"wx_url":"/log"}
]
export default menuConfig;
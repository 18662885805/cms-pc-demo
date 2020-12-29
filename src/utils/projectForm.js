const projectForm =  {
    "formItemLayout":
    {
        "labelCol":{"xs":{"span":24},"sm":{"span":6}},
        "wrapperCol":{"xs":{"span":24},"sm":{"span":16}}},
        "tailFormItemLayout":{
            "wrapperCol":{"xs":{"span":6,"offset":0},"sm":{"span":6,"offset":12}}
        },
        "content":
        [
            {"field":"name","text":"项目名","rules":[{"required":true,"message":"请输入项目名"}],"type":"char","placeholder":"项目名","value":null,"icon":""},
            {"field":"location_id","text":"建筑物","rules":[{"required":true,"message":"请选择建筑物"}],"type":"select","placeholder":"建筑物","value":null,"options":[{"id":"7dc02ef4-3b25-4a83-a5b2-b3d1e8698ed2","name":"停车楼"},{"id":"b3315515-b74d-49d6-8028-b66701a82559","name":"停车楼"},{"id":"d38e5b87-fb7f-4921-9d13-95bad4eb839a","name":"警卫室"},{"id":"0d65073d-4d66-49a5-bf3c-981d956c19b4","name":"RBCC"},{"id":"f6d524d2-b2a7-4208-90ba-58aedab872ee","name":"RBCC101"},{"id":"a26708cf-d4d5-4a4e-99f9-9ec1d00f57a1","name":"103"},{"id":"577b68fb-ddac-451c-b682-128349c50557","name":"码头6"},{"id":"1ac8caf3-6758-4c31-a3fd-525a93f7fd78","name":"s102"},{"id":"b78a5a6d-e114-4bda-8e27-bef87d6f43b9","name":"00"},{"id":"6e001ea4-3142-47af-b854-434e77f7f43f","name":"码头6"},{"id":"bb844cbf-2374-44c6-950f-f2b09de4aa16","name":"码头2"},{"id":"1604d465-80d1-4947-a929-5cd39658e676","name":"码头1"},{"id":"37b71de2-5d41-4062-ad62-f72a07c501c8","name":"44"},{"id":"6962883f-e8da-4c5c-bc3d-19d604e7f496","name":"test"},{"id":"ac67df78-46fc-47f4-bdf1-7e673c5e321a","name":"码头"},{"id":"cf209f54-79fa-44e8-84c0-f1139b381722","name":"jaack"},{"id":"d0cb905e-9d68-4a01-9a19-ca7724c96590","name":"h102"},{"id":"e987f46f-5f45-4cd2-ba37-a7bdee995c7d","name":"222"},{"id":"b70cd6ff-3dbd-413c-91de-9c68f09b2584","name":"s101"}]},
            {"field":"floor","text":"楼层","rules":[{"required":true,"message":"请选择楼层"}],"type":"select","placeholder":"楼层","value":null,"options":[{"id":1,"name":"1F"},{"id":2,"name":"2F"},{"id":3,"name":"3F"}]},
            {"field":"area","text":"区域","rules":[{"required":true,"message":"请输入区域"}],"type":"char","placeholder":"例: HSE办公室","value":null,"icon":""},
            {"field":"start_time","text":"预计开工日期","rules":[{"required":true,"message":"请选择预计开工日期"}],"type":"date","placeholder":"施工时间最长30天","value":null},
            {"field":"end_time","text":"预计完成日期","rules":[{"required":true,"message":"请选择预计完成日期"}],"type":"date","placeholder":"施工时间最长30天","value":null},
            {"field":"start_hour","text":"开始工作时间","rules":[{"required":true,"message":"请选择开始工作时间"}],"type":"time","placeholder":"工作时间才能进厂","value":null},
            {"field":"end_hour","text":"结束工作时间","rules":[{"required":true,"message":"请选择结束工作时间"}],"type":"time","placeholder":"工作时间才能进厂","value":null},
            {"field":"contractor_id","text":"承包商","rules":[{"required":true,"message":"请选择承包商"}],"type":"search","placeholder":"输入承包商公司名或联系人名称搜索","value":null},
            {"field":"equipment","text":"使用设备工具","rules":[{"required":true,"message":"请输入使用设备工具"}],"type":"char","placeholder":"使用设备工具","value":null,"icon":""},
            {"field":"working","text":"从事工作","rules":[{"required":true,"message":"请输入从事工作"}],"type":"char","placeholder":"从事工作","value":null,"icon":""},
            {"field":"high_risk","text":"涉及高风险作业","rules":[{"required":true,"message":"请输入涉及高风险作业"}],"type":"char","placeholder":"涉及高风险作业","value":null,"icon":""},
            {"field":"risk_assessment","text":"风险评估","rules":[],"type":"checkbox","placeholder":"","value":null,"options":[{"id":1,"name":"坠落/碰撞/塌埋","desc":"高处作业，挖掘工作"},{"id":2,"name":"压力/工作强度","desc":"在封闭的空间/容器工作"},{"id":3,"name":"运输","desc":"可移动部分，工具，运输、吊装"},{"id":4,"name":"机械伤害","desc":"坠落/翻转/挤压"},{"id":5,"name":"电击","desc":"电击/电弧"},{"id":6,"name":"生物方面","desc":"微生物，病毒"},{"id":7,"name":"环境方面","desc":"地下水保护，废水排放"},{"id":8,"name":"火灾/爆炸","desc":"易燃/易氧化的液体/固体/气体/蒸汽,爆炸环境"},{"id":9,"name":"有害物质","desc":"皮肤接触，吸入，腐蚀，化学反应（气体/蒸汽，粉尘）"},{"id":10,"name":"组织管理方面","desc":"指导/监督/培训/能力，个人防护用品，协调，检查"},{"id":11,"name":"工作环境","desc":"交通路线，楼梯，绊倒危险，滑跌，照明，气候，电缆，灭火器，气体/液体传感器"},{"id":12,"name":"物理方面","desc":"噪声，震动，热、冷介质，辐射（离子/非离子），相关电磁辐射，高温，低温"}]},
            {"field":"info","text":"附加解释/其他信息","rules":[],"type":"long","placeholder":"如需使用特殊工具（叉车、挖掘机等）、特殊的施工方法（如：吊装、大型钢构）请备注；如涉及电工作业，提供用电人员电工证详细信息。","value":null,"icon":""},{"field":"measures_1","text":"1","rules":[{"required":true,"message":"请选择现场安全措施"}],"type":"checkbox","placeholder":"","value":null,"options":[{"id":1,"name":"安全帽"},{"id":2,"name":"安全眼镜"},{"id":3,"name":"安全鞋"},{"id":4,"name":"全身式安全带"},{"id":5,"name":"防护手套"},{"id":6,"name":"耳塞"},{"id":7,"name":"面具"},{"id":8,"name":"口罩"},{"id":9,"name":"呼吸保护器"},{"id":10,"name":"其他"}]},
            {"field":"measures_1_other","text":"其他","rules":[],"type":"char","placeholder":"其他","value":null,"icon":""},
            {"field":"measures_2","text":"2","rules":[{"required":true,"message":"请选择现场安全措施"}],"type":"checkbox","placeholder":"","value":null,"options":[{"id":1,"name":"隔离工作区域"},{"id":2,"name":"道路禁行"},{"id":3,"name":"气体测试"}]},
            {"field":"measures_3","text":"3","rules":[],"type":"checkbox","placeholder":"","value":null,"options":[{"id":1,"name":"临时用电许可（如有需要请勾选），并注意以下风险","desc":"（1）注意漏电防护 （2）延长线保护（防止人员踩踏、车辆轧）"}]},
            {"field":"has_chemicals","text":"4","rules":[],"type":"checkbox","placeholder":"","value":null,"options":[{"id":1,"name":"化学品携带许可（如有需要请勾选）"}]},
            {"field":"chemicals_name","text":"化学品名称","rules":[],"type":"char","placeholder":"化学品名称","value":null,"icon":""},
            {"field":"chemicals_risk","text":"化学品风险","rules":[],"type":"char","placeholder":"化学品风险","value":null,"icon":""},
            {"field":"chemicals_measure","text":"个人防护用品","rules":[],"type":"char","placeholder":"个人防护用品","value":null,"icon":""}
        ],
        "old_data":{"search_id":null,"project_id":null,"contractor_id":null}
}
export default projectForm;

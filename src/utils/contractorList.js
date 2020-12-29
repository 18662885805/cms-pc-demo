const contractorList = {
    count:4,
    results:[
        {username:'18662885888',company:'南通六建',address:'崇川区',name:'张三',email:'123456@163.com',expire_time:'2021-1-1',status:1},
        {username:'18662885666',company:'通州建总',address:'通州区',name:'李四',email:'787878@163.com',expire_time:'2021-1-1',status:1},
        {username:'13377881234',company:'中南集团',address:'海门市',name:'赵五',email:'666666@163.com',expire_time:'2021-1-1',status:1},
        {username:'13912345678',company:'江中集团',address:'如皋市',name:'王二',email:'999999@163.com',expire_time:'2021-1-1',status:1}
    ]
}

const staffList = {
    count:4,
    results:[
        {mobile:'13112345678',type:"管理人员",anquanId:'',gongzhong:'',contractor:'南通六建',address:'崇川区',name:'张三',email:'123456@163.com',expire_time:'2021-1-1',status:4,status_desc: "审批通过",work_permit_num:1},
        {mobile:'13134234323',type:"安全员",anquanId:'SZ890227',gongzhong:'',contractor:'南通六建',address:'通州区',name:'李四',email:'787878@163.com',expire_time:'2021-1-1',status:4,status_desc: "审批通过",work_permit_num:1},
        {mobile:'13112345678',type:"普工",anquanId:'',gongzhong:'水电工',contractor:'中南集团',address:'海门市',name:'赵五',email:'666666@163.com',expire_time:'2021-1-1',status:4,status_desc: "审批通过",work_permit_num:1},
        {mobile:'13112345678',type:"普工",anquanId:'',gongzhong:'木工',contractor:'江中集团',address:'如皋市',name:'王二',email:'999999@163.com',expire_time:'2021-1-1',status:4,status_desc: "审批通过",work_permit_num:1}
    ]
}

const workType = {
    count:4,
    results:[
        {type:'瓦工',desc:'瓦工',status_desc:'启用'},
        {type:'电工',desc:'电工',status_desc:'启用'},
        {type:'水工',desc:'水工',status_desc:'启用'},
        {type:'保安',desc:'保安',status_desc:'启用'},
    ]
}

const yuyueList={
    count:1,
    results:[
        {
            code:'SZ2020011001',
            name:'门窗安装',
            location_name:'12#幢B单元',
            contractor_company:'中建四局',
            created:'石七',
            created_time:'2020-01-01',
            start_time:'2020-01-03',
            end_time:'2020-01-04',
            status_desc:'过期'
        },
    ]
}

const viewList = {
    count:1,
    results:[
        {code:'SZ-2019120101',name:'保安室保温层安装'}
    ]
}


const userSystemAdmin = {
    count:2,
    results:[
        {phone:'18662885888',company:'南通六建',name:'张三',email:'123456@163.com',project:"苏州万科，上海绿地",status:1,type:'组织'},
        {phone:'18663656721',company:'金螳螂',name:'李四',email:'lisi@163.com',project:"三亚碧桂园",status:1,type:'组织'},
    ]
}

const projectSystemAdmin = {
    count:2,
    results:[
       {name:'苏州万科工地',desc:'一级在建项目',address:'江苏省苏州工业园区',admin:'张张'},
       {name:'上海绿地工地',desc:'二级在建项目',address:'上海市浦东新区康桥镇',admin:'孙孙'},
    ]
}

const HomeData = [
    {staff:'中建四局',anquan:1,guanli:1,pugong:10,tezhongrenshu:3},
    {staff:'通州建总',anquan:2,guanli:3,pugong:42,tezhongrenshu:0},
    {staff:'标龙建设',anquan:2,guanli:1,pugong:20,tezhongrenshu:0},
]

const HomeData2 = [
    {staff:100,anquan:95,visit:5},

]

const messageData={
    count:2,
    results:[
        {id:1,title:'message-1',type_desc:1,content:'xxxx....',created:'jmy',created_time:"2020-02-27"},
        {id:2,title:'message-2',type_desc:1,content:'xxxx....',created:'jmy',created_time:"2020-02-27"},
    ]
}

const imageData={
    count:2,
    results:[
        {id:1,title:'图片一',desc:'desc-1',created:'jmy',created_time:"2020-02-27"},
        {id:2,title:'图片二',desc:'desc-2',created:'jmy',created_time:"2020-02-27"},
    ]
}

const workerData={
    count:0,
    results:[
    ]
}



export {contractorList,staffList,workType,yuyueList,viewList,userSystemAdmin,projectSystemAdmin,HomeData,HomeData2,messageData,imageData,workerData};
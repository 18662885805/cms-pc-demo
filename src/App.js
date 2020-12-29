import React, { createElement } from "react";
import {
  Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Provider } from "mobx-react";

import SideLayout from "@view/side-layout/";
import PrivateRoute from "@view/authRouter";

import menuState from "./store/menu-state";
import appState from "./store/app-state";

import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {
  inject,
  observer
} from "mobx-react";

import zhCN from "antd/lib/locale-provider/zh_CN";
import { LocaleProvider } from "antd";
import { history } from "./store/app-state";

import Loadable from "react-loadable";

import { Spin } from "antd";
import "./App.css";
import "./App.less";
//Add by JiangMinYu on 2019/09/20
import CommonUtil from "@utils/common";

const dynamicWrapper = (component) => {
  return Loadable({
    loader: () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    }
  });
};

const Login = dynamicWrapper(() => import("@view/login/"));
const RegisterPage = dynamicWrapper(() => import("@view/login/register"));
const Forget = dynamicWrapper(() => import("@view/forget/"));
const ForgetStepTwo = dynamicWrapper(() => import( '@view/forget/step-two' ))
const ForbiddenPage = dynamicWrapper(() => import("@view/Exception/403"));
const NotFoundPage = dynamicWrapper(() => import("@view/Exception/404"));
const ErrorPage = dynamicWrapper(() => import("@view/Exception/500"));
const ErrorPageOut = dynamicWrapper(() => import("@view/Exception/500500"));
const WelcomePage = dynamicWrapper(() => import("@view/welcome/index"));
const PassWord =  dynamicWrapper(() => import("@view/password/index"));
const DownloadURL = dynamicWrapper(() => import("@view/downloadURL/index"));


//MJK管理员主页
const MyAdminHome = dynamicWrapper(() => import("@view/myadmin/home"));
const MyAdminUser = dynamicWrapper(() => import("@view/myadmin/user/"));
const MyAdminUserAdd = dynamicWrapper(() => import("@view/myadmin/user/add-form"));
const MyAdminProject = dynamicWrapper(() => import("@view/myadmin/project/"));
const MyAdminProjectAdd = dynamicWrapper(() => import("@view/myadmin/project/add"));
const MyAdminProjectEdit = dynamicWrapper(() => import("@view/myadmin/project/edit"));
const MyAdminPermission = dynamicWrapper(() => import("@view/myadmin/permission/"));
const MyAdminPermissionAdd = dynamicWrapper(() => import("@view/myadmin/permission/add-form"));
const Privacy = dynamicWrapper(() => import("@view/myadmin/privacy"));
const PrivacyAdd = dynamicWrapper(() => import("@view/myadmin/privacy/add"));
const PrivacyEdit = dynamicWrapper(() => import("@view/myadmin/privacy/edit"));
const PrivacyDetail = dynamicWrapper(() => import("@view/myadmin/privacy/detail"));

//系统管理
const Home = dynamicWrapper(() => import("@view/home/"));
const Orgtype = dynamicWrapper(() => import("@view/system/orgtype"));
const OrgtypeAdd = dynamicWrapper(() => import("@view/system/orgtype/add-form"));
const OrgtypeDetail = dynamicWrapper(() => import("@view/system/orgtype/detail"));
const Organize = dynamicWrapper(() => import("@view/system/organize"));
const OrganizeAdd = dynamicWrapper(() => import("@view/system/organize/add-form"));
const OrganizeEdit = dynamicWrapper(() => import("@view/system/organize/edit-form"));
const OrganizeDetail = dynamicWrapper(() => import("@view/system/organize/detail"));
const OrganizeApply = dynamicWrapper(() => import("@view/system/apply-organize"));
const OrganizeApplyAudit = dynamicWrapper(() => import("@view/system/apply-organize/audit"));
const OrganizeApplyDetail = dynamicWrapper(() => import("@view/system/apply-organize/detail"));
const User = dynamicWrapper(() => import("@view/system/user/"));
const UserAdd = dynamicWrapper(() => import('@view/system/user/add-form'))
const UserDetail = dynamicWrapper(() => import('@view/system/user/detail'))
const ProjectSetting = dynamicWrapper(() => import("@view/system/project/edit-form"));
const WorkTypes = dynamicWrapper(() => import("@view/system/worktype"));
const WorkTypesAdd = dynamicWrapper(() => import("@view/system/worktype/add-form"));
const WorkTypesDetail = dynamicWrapper(() => import("@view/system/worktype/detail"));
const Role = dynamicWrapper(() => import('@view/worker/role/'))
const RoleAdd = dynamicWrapper(() => import('@view/worker/role/add-form'))
const RoleDetail = dynamicWrapper(() => import('@view/worker/role/detail'))
const GateMachine = dynamicWrapper(() => import('@view/security/gate-machine'))


//今日现场
const TodayMessage = dynamicWrapper(() => import('@view/today/message/'))
const TodayMessageAdd = dynamicWrapper(() => import('@view/today/message/add'))
const TodayMessageEdit = dynamicWrapper(() => import('@view/today/message/edit'))
const TodayMessageDetail = dynamicWrapper(() => import('@view/today/message/detail'))
const TodayImage = dynamicWrapper(() => import('@view/today/image/'))
const TodayWeather = dynamicWrapper(() => import('@view/today/weather/'))
const TodayWeatherDetail = dynamicWrapper(() => import('@view/today/weather/detail'))
//红码申请
const WorkerApply = dynamicWrapper(() => import('@view/worker/apply/'))
const WorkerApplyAdd = dynamicWrapper(() => import('@view/worker/apply/add'))
const WorkerApplyEdit = dynamicWrapper(() => import('@view/worker/apply/edit'))
const WorkerApplyDetail = dynamicWrapper(() => import('@view/worker/apply/detail'))
const WorkerRecord = dynamicWrapper(() => import('@view/worker/audit/'))
const WorkerRecordAudit = dynamicWrapper(() => import('@view/worker/audit/audit'))
const WorkerRecordDetail = dynamicWrapper(() => import('@view/worker/audit/detail'))
const Entrance = dynamicWrapper(() => import('@view/security/entrance'))
const EntranceAdd = dynamicWrapper(() => import('@view/security/entrance/add'))
const EntranceEdit = dynamicWrapper(() => import('@view/security/entrance/edit'))
const EntranceDetail = dynamicWrapper(() => import('@view/security/entrance/detail'))
const EntranceRecord = dynamicWrapper(() => import('@view/security/entrance-audit'))
const EntranceRecordAudit = dynamicWrapper(() => import('@view/security/entrance-audit/audit'))
const EntranceRecordDetail = dynamicWrapper(() => import('@view/security/entrance-audit/detail'))

//安防管理
const EntranceGuard = dynamicWrapper(() => import('@view/security/entrance-guard'))
const EntranceGuardDetail = dynamicWrapper(() => import('@view/security/entrance-guard/detail'))
const EntranceRegister = dynamicWrapper(() => import('@view/security/entrance-register'))
const EntranceRegisterDetail = dynamicWrapper(() => import('@view/security/entrance-register/detail'))
const EntranceRegisterAdd = dynamicWrapper(() => import('@view/security/entrance-register/add'))
const EntrancePersonRecord = dynamicWrapper(() => import('@view/security/entrance-record'))
const EntrancePersonRecordDetail = dynamicWrapper(() => import('@view/security/entrance-record/detail'))
const EntranceOrgPersonRecord = dynamicWrapper(() => import('@view/security/entrance-org-record'))
const EntranceOrgPersonRecordDetail = dynamicWrapper(() => import('@view/security/entrance-org-record/detail'))
const EntranceConfig = dynamicWrapper(() => import('@view/security/config'))


//培训管理
const TrainingPaper = dynamicWrapper(() => import('@view/training/paper'))
const TrainingPaperDetail = dynamicWrapper(() => import('@view/training/paper/detail'))
const TrainingPaperEdit = dynamicWrapper(() => import('@view/training/paper/edit-form'))
const TrainingPaperAdd = dynamicWrapper(() => import('@view/training/paper/add-form'))
const TrainingMaterial = dynamicWrapper(() => import('@view/training/material'))
const TrainingMaterialDetail = dynamicWrapper(() => import('@view/training/material/detail'))
const TrainingMaterialEdit = dynamicWrapper(() => import('@view/training/material/edit-form'))
const TrainingMaterialAdd = dynamicWrapper(() => import('@view/training/material/add-form'))
const TrainingManage = dynamicWrapper(() => import('@view/training/manage'))
const TrainingManageDetail = dynamicWrapper(() => import('@view/training/manage/detail'))
const TrainingManageEdit = dynamicWrapper(() => import('@view/training/manage/edit-form'))
const TrainingManageAdd = dynamicWrapper(() => import('@view/training/manage/add-form'))
const TrainingTrain = dynamicWrapper(() => import('@view/training/train'))
const TrainingTrainAdd = dynamicWrapper(() => import('@view/training/train/add'))
const TrainingTrainEdit = dynamicWrapper(() => import('@view/training/train/edit'))
const TrainingTrainDetail = dynamicWrapper(() => import('@view/training/train/detail'))
const TrainingMyRecord = dynamicWrapper(() => import('@view/training/myrecord'))
const TrainingMyRecordDetail = dynamicWrapper(() => import('@view/training/myrecord/detail'))
const TrainingRecord = dynamicWrapper(() => import('@view/training/record'))
const TrainingRecordDetail = dynamicWrapper(() => import('@view/training/record/detail'))
const TrainingNotice = dynamicWrapper(() => import('@view/training/notice'))
const TrainingOrgRecord = dynamicWrapper(() => import('@view/training/orgrecord'))

//文档管理
const DocumentDirectory = dynamicWrapper(() => import('@view/document/directory'))
const DocumentDirectoryAdd = dynamicWrapper(() => import('@view/document/directory/add-form'))
const DocumentDirectoryEdit = dynamicWrapper(() => import('@view/document/directory/edit'))
const DocumentDirectoryDetail = dynamicWrapper(() => import('@view/document/directory/detail'))
const DocumentRegister = dynamicWrapper(() => import('@view/document/register'))
const DocumentRegisterAdd = dynamicWrapper(() => import('@view/document/register/add-form'))
const DocumentRegisterDetail = dynamicWrapper(() => import('@view/document/register/detail'))
const DocumentRegisterShare = dynamicWrapper(() => import('@view/document/register/share_record'))
const DocumentTemp = dynamicWrapper(() => import('@view/document/temp'))
const DocumentTempDetail = dynamicWrapper(() => import('@view/document/temp/detail'))
const DocumentTempAdd = dynamicWrapper(() => import('@view/document/temp/add'))
const DocumentWorkflow = dynamicWrapper(() => import('@view/document/workflow'))
const DocumentWorkflowDetail = dynamicWrapper(() => import('@view/document/workflow/detail'))

//会议管理
const MeetingType = dynamicWrapper(() => import('@view/meeting/type'))
const MeetingTypeAdd = dynamicWrapper(() => import('@view/meeting/type/add-form'))
const MeetingTypeDetail = dynamicWrapper(() => import('@view/meeting/type/detail'))
const MeetingMinutes = dynamicWrapper(() => import('@view/meeting/minutes'))
const MeetingMinutesAdd = dynamicWrapper(() => import('@view/meeting/minutes/add-form'))
const MeetingMinutesDetail = dynamicWrapper(() => import('@view/meeting/minutes/detail'))

// 个人中心
const Info = dynamicWrapper(() => import('@view/account/info'))
const ChangePhone = dynamicWrapper(() => import('@view/account/changePhone'))
const ChangePwd = dynamicWrapper(() => import('@view/account/changePwd'))
const JoinProject = dynamicWrapper(() => import('@view/account/joinProject'))

// 工作流管理
const FlowClassification = dynamicWrapper(() => import('@view/workflow/classification'))
const FlowClassificationAdd = dynamicWrapper(() => import('@view/workflow/classification/add-form'))
const FlowClassificationDetail = dynamicWrapper(() => import('@view/workflow/classification/detail'))
const FlowTemplate = dynamicWrapper(() => import('@view/workflow/template'));
const FlowTemplateAdd = dynamicWrapper(() => import('@view/workflow/template/add-form'));
const FlowTemplateDrag = dynamicWrapper(() => import('@view/workflow/template/drag-form'));
const FlowApproval = dynamicWrapper(() => import('@view/workflow/approval'));
const FlowApprovalAdd = dynamicWrapper(() => import('@view/workflow/approval/add-form'));
const FlowApprovalEdit = dynamicWrapper(() => import('@view/workflow/approval/edit-form'));
const FlowFlow = dynamicWrapper(() => import('@view/workflow/flow'));
const FlowFlowAdd = dynamicWrapper(() => import('@view/workflow/flow/add-form'));
const FlowRecord = dynamicWrapper(() => import('@view/workflow/record'));
const FlowRecordAdd = dynamicWrapper(() => import('@view/workflow/record/add-form'));
const FlowRecordDrag = dynamicWrapper(() => import('@view/workflow/record/add-drag'));
const FlowRecordDetail = dynamicWrapper(() => import('@view/workflow/record/detail'));
const FlowRecordApproval = dynamicWrapper(() => import('@view/workflow/record/add-approval'));
const FlowWait = dynamicWrapper(() => import('@view/workflow/wait'));
const FlowWaitDetail = dynamicWrapper(() => import('@view/workflow/wait/detail'));
const FlowWaitPdfDetail = dynamicWrapper(() => import('@view/workflow/wait/pdfDetail'));
const FlowAllRecord = dynamicWrapper(() => import('@view/workflow/allrecord'));
const FlowAllRecordDetail = dynamicWrapper(() => import('@view/workflow/allrecord/detail'));
const FlowSource = dynamicWrapper(() => import('@view/workflow/source'));

//重要问题
const TaskType = dynamicWrapper(() => import('@view/task/task-type'))
const TaskCloseReason = dynamicWrapper(() => import('@view/task/close-reason'))
const TaskRemindRule = dynamicWrapper(() => import('@view/task/remind-rule'))
const TaskRemindRuleAdd = dynamicWrapper(() => import('@view/task/remind-rule/add'))
const TaskStart = dynamicWrapper(() => import('@view/task/task-start'))
const TaskStartAdd = dynamicWrapper(() => import('@view/task/task-start/add'))
const TaskResolve = dynamicWrapper(() => import('@view/task/task-resolve'))
const TaskResolveDetail = dynamicWrapper(() => import('@view/task/task-resolve/detail'))
const TaskResolveDetail2 = dynamicWrapper(() => import('@view/task/task-resolve/detail2'))
// 任务管理
const MyOrder = dynamicWrapper(() => import( '@view/workorder/order'))
const OrderWait = dynamicWrapper(() => import( '@view/workorder/wait'))
const OrderWaitDetail = dynamicWrapper(() => import( '@view/workorder/wait/detail'))
const MyOrderAdd = dynamicWrapper(() => import( '@view/workorder/order/add-form'))
const MyOrderDetail = dynamicWrapper(() => import( '@view/workorder/order/detail'))
const OrderArea = dynamicWrapper(() => import( '@view/workorder/area'))
// const OrderAreaDetail = dynamicWrapper(() => import( '@view/workorder/area/detail'))
const OrderType = dynamicWrapper(() => import( '@view/workorder/type'))
// const OrderTypeAdd = dynamicWrapper(() => import( '@view/workorder/type/add-form'))
// const OrderTypeDetail = dynamicWrapper(() => import( '@view/workorder/type/detail'))
const OrderSearch = dynamicWrapper(() => import( '@view/workorder/orderall' ))
const OrderSearchDetail = dynamicWrapper(() => import( '@view/workorder/orderall/detail' ))
const OrderDashboard = dynamicWrapper(() => import( '@view/workorder/dashboard' ))
const OrderRule = dynamicWrapper(() => import( '@view/workorder/rule'))
const OrderRuleAdd = dynamicWrapper(() => import( '@view/workorder/rule/add-form'))
const OrderRuleDetail = dynamicWrapper(() => import( '@view/workorder/rule/detail'))
// const HotOrder = dynamicWrapper(() => import( '@view/workorder/area'));
// const HotOrderAdd = dynamicWrapper(() => import( '@view/workorder/area/add-form'))
// const HotOrderDetail = dynamicWrapper(() => import( '@view/workorder/area/detail'));

//竣工文档
const completion = dynamicWrapper(() => import('@view/completion/type'))
const completionAdd = dynamicWrapper(() => import('@view/completion/type/add-form'))
const completionDetail = dynamicWrapper(() => import('@view/completion/type/detail'))
const completionDocument = dynamicWrapper(() => import('@view/completion/document'))


let _util = new CommonUtil();

@inject("menuState")
@observer
class Ppa extends React.Component {

  //Add by JiangMinYu on 2019/09/20
  componentDidMount() {
    _util.removeSession("currentPage");
    _util.removeSession("scrollTop");
    _util.removeSession("pageSize");
  }


  render() {
    const { language } = this.props.menuState;

    return (
      <LocaleProvider
        locale={
          language === "en"
            ? null
            : language === "zh"
              ? zhCN
              : null
        }>
        <Provider menuState={menuState} appState={appState}>
          <Router history={history}>
            <Switch>
              <Route path='/login' component={Login} />
              <Route path='/register' component={RegisterPage} />
              <Route path='/welcome' component={WelcomePage} />
              <Route path='/error' component={ErrorPageOut} />
              <Route path='/forget' exact component={Forget} />
              <Route path='/forget/step/two' component={ForgetStepTwo}/>
              <Route path='/downloadURL' component={DownloadURL} />
              
              <Route path='/' render={() => (
                <SideLayout>
                  <Switch>
                    {/* 项目主页 */}
                    <PrivateRoute exact component={Home} path='/' />
                    <PrivateRoute exact path='/403' component={ForbiddenPage} />
                    <PrivateRoute exact path='/500' component={ErrorPage} />
                    <PrivateRoute exact path='/404' component={NotFoundPage} />                  
                    <PrivateRoute exact component={PassWord} path='/password' />

                    {/* MJK管理员主页 */}
                    <PrivateRoute exact component={MyAdminHome} path='/myadmin/home' />
                    <PrivateRoute exact component={MyAdminUser} path='/myadmin/user' />
                    <PrivateRoute exact component={MyAdminUserAdd} path='/myadmin/user/add/:id?' />
                    <PrivateRoute exact component={MyAdminProject} path='/myadmin/project' />
                    <PrivateRoute exact component={MyAdminProjectAdd} path='/myadmin/project/add' />
                    <PrivateRoute exact component={MyAdminProjectEdit} path='/myadmin/project/edit' />
                    <PrivateRoute exact component={MyAdminPermission} path='/myadmin/permission' />
                    <PrivateRoute exact component={MyAdminPermissionAdd} path='/myadmin/permission/add/:id?' />
                    <PrivateRoute exact component={Privacy} path='/myadmin/privacy' />
                    <PrivateRoute exact component={PrivacyAdd} path='/myadmin/privacy/add' />
                    <PrivateRoute exact component={PrivacyEdit} path='/myadmin/privacy/edit' />
                    <PrivateRoute exact component={PrivacyDetail} path='/myadmin/privacy/detail' />


                   

                     {/* 个人中心 */}
                    <PrivateRoute exact component={Info} path='/account/info' />
                    <PrivateRoute exact component={ChangePhone} path='/account/changePhone' />
                    <PrivateRoute exact component={ChangePwd} path='/account/changePwd' />
                    <PrivateRoute exact component={JoinProject} path='/account/joinProject' />

                    {/* 系统管理 */}
                    <PrivateRoute exact component={Orgtype} path='/system/org/type' />
                    <PrivateRoute exact component={OrgtypeAdd} path='/system/org/type/add/:id?' />
                    <PrivateRoute exact component={OrgtypeDetail} path='/system/org/type/detail' />
                    <PrivateRoute exact component={Organize} path='/system/org' />
                    <PrivateRoute exact component={OrganizeAdd} path='/system/org/add/:id?' />
                    <PrivateRoute exact component={OrganizeEdit} path='/system/org/edit' />
                    <PrivateRoute exact component={OrganizeDetail} path='/system/org/detail' />
                    <PrivateRoute exact component={OrganizeApply} path='/system/org/application' />
                    <PrivateRoute exact component={OrganizeApplyAudit} path='/system/org/application/audit/:id' />
                    <PrivateRoute exact component={OrganizeApplyDetail} path='/system/org/application/detail' /> 
                    <PrivateRoute exact component={User} path='/system/user' />
                    <PrivateRoute exact component={UserAdd} path='/system/user/add/:id?' />
                    <PrivateRoute exact component={UserDetail} path='/system/user/detail' />
                    <PrivateRoute exact component={ProjectSetting} path='/system/settings' />                 
                    <PrivateRoute exact component={WorkTypes} path='/system/work/type' />
                    <PrivateRoute exact component={WorkTypesAdd} path='/system/work/type/add/:id?' />
                    <PrivateRoute exact component={WorkTypesDetail} path='/system/work/type/detail' />
                    <PrivateRoute exact component={Role} path='/system/role' />
                    <PrivateRoute exact component={RoleAdd} path='/system/role/add/:id?' />
                    <PrivateRoute exact component={RoleDetail} path='/system/role/detail' />
                    <PrivateRoute exact component={GateMachine} path='/system/turnstile' />
             
                    {/* 今日现场 */}
                    <PrivateRoute exact component={TodayMessage} path='/today/message' />
                    <PrivateRoute exact component={TodayMessageAdd} path='/today/message/add' />
                    <PrivateRoute exact component={TodayMessageEdit} path='/today/message/edit' />
                    <PrivateRoute exact component={TodayMessageDetail} path='/today/message/detail' />
                    <PrivateRoute exact component={TodayImage} path='/today/propaganda'/>
                    <PrivateRoute exact component={TodayWeather} path='/today/barometer' />
                    <PrivateRoute exact component={TodayWeatherDetail} path='/today/barometer/detail' />
                    {/* 红码申请 */}
                    <PrivateRoute exact component={WorkerApply} path='/staff/org' />
                    <PrivateRoute exact component={WorkerApplyAdd} path='/staff/org/add' />
                    <PrivateRoute exact component={WorkerApplyEdit} path='/staff/org/edit' />
                    <PrivateRoute exact component={WorkerApplyDetail} path='/staff/org/detail' />
                    <PrivateRoute exact component={WorkerRecord} path='/staff/approve' />
                    <PrivateRoute exact component={WorkerRecordAudit} path='/staff/approve/audit' />
                    <PrivateRoute exact component={WorkerRecordDetail} path='/staff/approve/detail' />  
                    <PrivateRoute exact component={Entrance} path='/staff/list/factoryapply' />
                    <PrivateRoute exact component={EntranceAdd} path='/staff/list/factoryapply/add' />
                    <PrivateRoute exact component={EntranceEdit} path='/staff/list/factoryapply/edit' />
                    <PrivateRoute exact component={EntranceDetail} path='/staff/list/factoryapply/detail' />
                    <PrivateRoute exact component={EntranceRecord} path='/staff/my/factoryapply' />
                    <PrivateRoute exact component={EntranceRecordAudit} path='/staff/my/factoryapply/audit' />
                    <PrivateRoute exact component={EntranceRecordDetail} path='/staff/my/factoryapply/detail' /> 
                    <PrivateRoute exact component={EntranceConfig} path='/staff/config' />   
                      
                   
                    {/* 安防管理 */}    
                    <PrivateRoute exact component={EntranceGuard} path='/safety/accesscard' />
                    <PrivateRoute exact component={EntranceGuardDetail} path='/safety/accesscard/detail' />
                    <PrivateRoute exact component={EntranceRegister} path='/safety/enabled/accesscard' />
                    <PrivateRoute exact component={EntranceRegisterDetail} path='/safety/enabled/accesscard/detail' />
                    <PrivateRoute exact component={EntranceRegisterAdd} path='/safety/enabled/accesscard/add' />
                    <PrivateRoute exact component={EntrancePersonRecord} path='/safety/entryrecord' />
                    <PrivateRoute exact component={EntrancePersonRecordDetail} path='/safety/entryrecord/detail' />
                    <PrivateRoute exact component={EntranceOrgPersonRecord} path='/safety/org/entryrecord' />
                    <PrivateRoute exact component={EntranceOrgPersonRecordDetail} path='/safety/org/entryrecord/detail' />
                    

                    {/* 培训管理 */}
                    <PrivateRoute exact component={TrainingPaper} path='/training/paper' />
                    <PrivateRoute exact component={TrainingPaperDetail} path='/training/paper/detail' />
                    <PrivateRoute exact component={TrainingPaperEdit} path='/training/paper/edit' />
                    <PrivateRoute exact component={TrainingPaperAdd} path='/training/paper/add' />
                    <PrivateRoute exact component={TrainingMaterial} path='/training/material' />
                    <PrivateRoute exact component={TrainingMaterialDetail} path='/training/material/detail' />
                    <PrivateRoute exact component={TrainingMaterialEdit} path='/training/material/edit' />
                    <PrivateRoute exact component={TrainingMaterialAdd} path='/training/material/add' />
                    <PrivateRoute exact component={TrainingManage} path='/training/management' />
                    <PrivateRoute exact component={TrainingManageDetail} path='/training/management/detail' />
                    <PrivateRoute exact component={TrainingManageEdit} path='/training/management/edit' />
                    <PrivateRoute exact component={TrainingManageAdd} path='/training/management/add' />
                    <PrivateRoute exact component={TrainingTrain} path='/training/start/training' />
                    <PrivateRoute exact component={TrainingTrainDetail} path='/training/start/training/detail' />
                    <PrivateRoute exact component={TrainingTrainEdit} path='/training/start/training/edit' />
                    <PrivateRoute exact component={TrainingTrainAdd} path='/training/start/training/add' />
                    <PrivateRoute exact component={TrainingMyRecord} path='/training/myrecord' />
                    <PrivateRoute exact component={TrainingMyRecordDetail} path='/training/myrecord/detail' />
                    <PrivateRoute exact component={TrainingRecord} path='/training/record' />
                    <PrivateRoute exact component={TrainingRecordDetail} path='/training/record/detail' />
                    <PrivateRoute exact component={TrainingNotice} path='/training/notice' />
                    <PrivateRoute exact component={TrainingOrgRecord} path='/training/org/record' />

                    {/* 文档管理 */}
                    <PrivateRoute exact component={DocumentDirectory} path='/document/directory' />
                    <PrivateRoute exact component={DocumentDirectoryAdd} path='/document/directory/add/:id?' />
                    <PrivateRoute exact component={DocumentDirectoryEdit} path='/document/directory/edit' />
                    <PrivateRoute exact component={DocumentDirectoryDetail} path='/document/directory/detail' />
                    <PrivateRoute exact component={DocumentRegister} path='/document/register/document' />
                    <PrivateRoute exact component={DocumentRegisterAdd} path='/document/register/document/add/:id?' />
                    <PrivateRoute exact component={DocumentRegisterDetail} path='/document/register/document/detail' />
                    <PrivateRoute exact component={DocumentRegisterShare} path='/document/register/document/share' />
                    
                    <PrivateRoute exact component={DocumentTemp} path='/document/temporary/document' />
                    <PrivateRoute exact component={DocumentTempDetail} path='/document/temporary/document/detail' />
                    <PrivateRoute exact component={DocumentTempAdd} path='/document/temporary/document/add' />
                    <PrivateRoute exact component={DocumentWorkflow} path='/document/workflow' />
                    <PrivateRoute exact component={DocumentWorkflowDetail} path='/document/workflow/detail' />

                    {/* 会议管理 */}
                    <PrivateRoute exact component={MeetingType} path='/meeting/type' />
                    <PrivateRoute exact component={MeetingTypeAdd} path='/meeting/type/add/:id?' />
                    <PrivateRoute exact component={MeetingTypeDetail} path='/meeting/type/detail' />
                    <PrivateRoute exact component={MeetingMinutes} path='/meeting/minutes' />
                    <PrivateRoute exact component={MeetingMinutesAdd} path='/meeting/minutes/add/:id?' />
                    <PrivateRoute exact component={MeetingMinutesDetail} path='/meeting/minutes/detail/:id?' />
                   
                    {/*工作流管理*/}
                    <PrivateRoute exact component={FlowClassification} path='/workflow/classification' />
                    <PrivateRoute exact component={FlowClassificationAdd} path='/workflow/classification/add/:id?' />
                    <PrivateRoute exact component={FlowClassificationDetail} path='/workflow/classification/detail' />
                    <PrivateRoute exact component={FlowTemplate} path='/workflow/template' />
                    <PrivateRoute exact component={FlowTemplateAdd} path='/workflow/template/add/:id?' />
                    <PrivateRoute exact component={FlowTemplateDrag} path='/workflow/template/drag' />
                    <PrivateRoute exact component={FlowApproval} path='/approval/flow/template' />
                    <PrivateRoute exact component={FlowApprovalAdd} path='/workflow/approval/add/:id?' />
                    <PrivateRoute exact component={FlowApprovalEdit} path='/workflow/approval/edit/:id?' />
                    <PrivateRoute exact component={FlowFlow} path='/workflow/flow' />
                    <PrivateRoute exact component={FlowFlowAdd} path='/workflow/flow/add/:id?' />
                    <PrivateRoute exact component={FlowRecord} path='/workflow/record' />
                    <PrivateRoute exact component={FlowRecordAdd} path='/workflow/record/add/:id?' />
                    <PrivateRoute exact component={FlowRecordDrag} path='/workflow/record/fill' />
                    <PrivateRoute exact component={FlowRecordDetail} path='/workflow/record/detail' />
                    <PrivateRoute exact component={FlowRecordApproval} path='/workflow/record/approval' />
                    <PrivateRoute exact component={FlowWait} path='/workflow/record/wait' />
                    <PrivateRoute exact component={FlowWaitDetail} path='/workflow/record/wait/detail' />
                    <PrivateRoute exact component={FlowWaitPdfDetail} path='/workflow/record/wait/pdf' />
                    <PrivateRoute exact component={FlowAllRecord} path='/workflow/allrecord' />
                    <PrivateRoute exact component={FlowAllRecordDetail} path='/workflow/allrecord/detail' />
                    <PrivateRoute exact component={FlowSource} path='/workflow/source' />

                    {/* 重要问题 */}
                    <PrivateRoute exact component={TaskType} path='/task/type' />
                    <PrivateRoute exact component={TaskCloseReason} path='/task/close-reason' />
                    <PrivateRoute exact component={TaskRemindRule} path='/task/remind-rule' />
                    <PrivateRoute exact component={TaskRemindRuleAdd} path='/task/remind-rule/add' />
                    <PrivateRoute exact component={TaskStart} path='/task/task-start' />
                    <PrivateRoute exact component={TaskStartAdd} path='/task/task-start/add' />
                    <PrivateRoute exact component={TaskResolve} path='/task/task-resolve' />
                    <PrivateRoute exact component={TaskResolveDetail} path='/task/task-resolve/detail' />
                    <PrivateRoute exact component={TaskResolveDetail2} path='/task/task-resolve/detail2' />

                    {/*任务管理*/}
                    <PrivateRoute exact component={MyOrder} path='/assignment/record'/>
                    <PrivateRoute exact component={OrderWait} path='/assignment/wait'/>
                    <PrivateRoute exact component={OrderWaitDetail} path='/assignment/wait/detail'/>
                    <PrivateRoute exact component={MyOrderAdd} path='/assignment/record/add'/>
                    <PrivateRoute exact component={MyOrderDetail} path='/assignment/record/detail'/>
                    <PrivateRoute exact component={OrderArea} path='/assignment/area'/>
                    {/*<PrivateRoute exact component={OrderAreaDetail} path='/assignment/area/detail'/>*/}
                    <PrivateRoute exact component={OrderType} path='/assignment/type'/>
                    {/*<PrivateRoute exact component={OrderTypeAdd} path='/assignment/type/add'/>*/}
                    {/*<PrivateRoute exact component={OrderTypeDetail} path='/assignment/type/detail'/>*/}
                    <PrivateRoute exact component={OrderSearch} path='/assignment/all'/>
                    <PrivateRoute exact component={OrderSearchDetail} path='/assignment/all/detail'/>
                    <PrivateRoute exact component={OrderDashboard} path='/assignment/dashboard'/>
                    <PrivateRoute exact component={OrderRule} path='/assignment/rule'/>
                    <PrivateRoute exact component={OrderRuleAdd} path='/assignment/rule/add'/>
                    <PrivateRoute exact component={OrderRuleDetail} path='/assignment/rule/detail'/>
                    {/*<PrivateRoute exact component={this.checkPermission('hotline') ? Home : HotOrder} path='/hotline/orderhotline'/>*/}
                    {/*<PrivateRoute exact component={this.checkPermission('hotline') ? Home : HotOrderAdd} path='/hotline/orderhotline/add'/>*/}
                    {/*<PrivateRoute exact component={this.checkPermission('hotline') ? Home : HotOrderDetail} path='/hotline/orderhotline/detail'/>*/}

                    <PrivateRoute exact component={completion} path='/completion/type' />
                    <PrivateRoute exact component={completionAdd} path='/completion/type/add/:id?' />
                    <PrivateRoute exact component={completionDetail} path='/completion/type/detail' />
                    <PrivateRoute exact component={completionDocument} path='/completion/document' />
                    
                    
                    <Redirect from='*' to='/404' />
                  </Switch>
                </SideLayout>
              )
              } />
              {/* <Redirect from='/' to='/login'/> */}
            </Switch>
          </Router>
        </Provider>
      </LocaleProvider>
    );
  }
}

export default DragDropContext(HTML5Backend)(Ppa);

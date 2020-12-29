import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/construction/order/";
const _url2 = `${_url}param/`;

//列表
const project = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//详情
const projectDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//新增
const projectPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//修改
const projectPut = (id,params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//删除
const projectDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//提交
const projectSubmit = (id,params) => { return axios.post(_util.getServerUrl(`${_url}sub/?project_id=${id}`), params); };

//撤回
const projectRecall = (id,params) => { return axios.post(_util.getServerUrl(`${_url}recall/?project_id=${id}`), params); };

//待审批列表
const projectPending = params => { return axios.get(_util.getServerUrl(`${_url}pending/param/`), { params: params }); };

//待审批详情
const projectPendingDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url}pending/param/${params.id}/?project_id=${id}`), { params: params })};

//审批
const projectAudit = (id,params) => { return axios.post(_util.getServerUrl(`${_url}audit/param/?project_id=${id}`), params); };

//退回
const projectBack = (id,params) => { return axios.post(_util.getServerUrl(`${_url}back/?project_id=${id}`), params); };

//审批记录
const projectDo = params => { return axios.get(_util.getServerUrl(`${_url}do/param/`), { params: params }); };

//所有检查单
const projectCheckList = (id,params) => { return axios.get(_util.getServerUrl(`${_url}checklist/param/?project_id=${id}`), { params: params }); };

const projectCanCreate = params => { return axios.get(_util.getServerUrl("/construction/checked/"), { params: params }); };
const projectForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };
const projectAttention = params => { return axios.get(_util.getServerUrl(`${_url}attention/`), { params: params }); };
const projectPersonInfo = params => { return axios.get(_util.getServerUrl("/construction/staff/worker/"), { params: params }); };
const projectPersonPost = params => { return axios.post(_util.getServerUrl("/construction/project/worker/"), params); };
const projectPersonDel = params => { return axios.post(_util.getServerUrl("/construction/project/worker/del/"), params); };



const workPermitPost = params => { return axios.post(_util.getServerUrl("/construction/workpermit/param/"), params); };

const addworkPermit = params => { return axios.post(_util.getServerUrl("/construction/workpermit/param/"), params); };

const hangingPost = params => { return axios.post(_util.getServerUrl("/construction/hanging/param/"), params); };

const highWorkPermitPost = params => { return axios.post(_util.getServerUrl("/construction/highworkpermit/param/"), params); };

const hotWorkPermitPost = params => { return axios.post(_util.getServerUrl("/construction/hotworkpermit/param/"), params); };

const confinedPost = params => { return axios.post(_util.getServerUrl("/construction/confined/param/"), params); };

const location = params => { return axios.post(_util.getServerUrl("/form/construction/location/"), params); };

const confinedPut = (id, p_id, params) => { return axios.put(_util.getServerUrl(`/construction/confined/param/${id}/?project_id=` + p_id), params); };

const constructor = params => { return axios.get(_util.getServerUrl("/construction/staff/worker/?project_id=" + params.project_id + "&search_type=" + params.search_type), params); };

const supervisor1 = params => { return axios.get(_util.getServerUrl("/construction/project/supervisor/"), { params: params }); };

const workpermitPost = params => { return axios.post(_util.getServerUrl("/construction/workpermit/param/"), params); };

const hangingworkPost = params => { return axios.post(_util.getServerUrl("/construction/hanging/param/"), params); };

const highworkPost = params => { return axios.post(_util.getServerUrl("/construction/highworkpermit/param/"), params); };

const hotworkPost = params => { return axios.post(_util.getServerUrl("/construction/hotworkpermit/param/"), params); };

const workpermitdetail = params => { return axios.get(_util.getServerUrl(`/construction/workpermit/param/${params.id}/`), { params: params }); };

const hangingdetail = params => { return axios.get(_util.getServerUrl(`/construction/hanging/param/${params.id}/`), { params: params }); };

const highworkdetail = params => { return axios.get(_util.getServerUrl(`/construction/highworkpermit/param/${params.id}/`), { params: params }); };

const hotworkdetail = params => { return axios.get(_util.getServerUrl(`/construction/hotworkpermit/param/${params.id}/`), { params: params }); };

const confineddetail = params => { return axios.get(_util.getServerUrl(`/construction/confined/param/${params.id}/`), { params: params }); };

// const workpermitModify = params => { return axios.put(_util.getServerUrl(`/construction/workpermit/param/${params.id}/`), {params: {project_id:params.project_id, created_in_parent:params.created_in_parent}} ) }

// const workpermitModify = params => { return axios.put(_util.getServerUrl('/construction/confined/param/' + params.id + '/?project_id='+ params.project_id + '&created_in_parent='+ params.created_in_parent), params.values ) }

const workpermitModify = params => { return axios.put(_util.getServerUrl(`/construction/workpermit/param/${params.id}/?project_id=` + params.project_id + "&created_in_parent=" + params.created_in_parent), params.values); };

const hangingworkModify = params => { return axios.put(_util.getServerUrl(`/construction/hanging/param/${params.id}/?project_id=` + params.project_id + "&created_in_parent=" + params.created_in_parent), params.values); };

const highworkModify = params => { return axios.put(_util.getServerUrl(`/construction/highworkpermit/param/${params.id}/?project_id=` + params.project_id + "&created_in_parent=" + params.created_in_parent), params.values); };

const hotworkModify = params => { return axios.put(_util.getServerUrl(`/construction/hotworkpermit/param/${params.id}/?project_id=` + params.project_id + "&created_in_parent=" + params.created_in_parent), params.values); };

const confinedModify = params => { return axios.put(_util.getServerUrl(`/construction/confined/param/${params.id}/?project_id=` + params.project_id + "&created_in_parent=" + params.created_in_parent), params.values); };

const workpermitSubItem = params => { return axios.get(_util.getServerUrl("/construction/workpermit/param/"), { params: params }); };

const HangingWorkSubItem = params => { return axios.get(_util.getServerUrl("/construction/hanging/param/"), { params: params }); };

const HighWorkSubItem = params => { return axios.get(_util.getServerUrl("/construction/highworkpermit/param/"), { params: params }); };

const HotWorkSubItem = params => { return axios.get(_util.getServerUrl("/construction/hotworkpermit/param/"), { params: params }); };

const ConfinedWorkSubItem = params => { return axios.get(_util.getServerUrl("/construction/confined/param/"), { params: params }); };

const workpermitDelete = params => { return axios.delete(_util.getServerUrl(`/construction/workpermit/param/${params.id}/`), { params: params }); };

const hangingDelete = params => { return axios.delete(_util.getServerUrl(`/construction/hanging/param/${params.id}/`), { params: params }); };

const highworkDelete = params => { return axios.delete(_util.getServerUrl(`/construction/highworkpermit/param/${params.id}/`), { params: params }); };

const hotworkDelete = params => { return axios.delete(_util.getServerUrl(`/construction/hotworkpermit/param/${params.id}/`), { params: params }); };

const confinedDelete = params => { return axios.delete(_util.getServerUrl(`/construction/confined/param/${params.id}/`), { params: params }); };

export {
  project,
  projectPending,
  projectPendingDetail,
  projectRecall,
  projectAudit,
  projectBack,
  projectCanCreate,
  projectPost,
  projectPut,
  projectDelete,
  projectDetail,
  projectDo,
  projectCheckList,
  projectForm,
  projectAttention,
  projectSubmit,
  workPermitPost,
  hangingPost,
  highWorkPermitPost,
  hotWorkPermitPost,
  confinedPost,
  projectPersonInfo,
  projectPersonPost,
  projectPersonDel,
  location,
  addworkPermit,
  confinedPut,
  constructor,
  supervisor1,
  workpermitPost,
  hangingworkPost,
  highworkPost,
  hotworkPost,
  workpermitdetail,
  hangingdetail,
  highworkdetail,
  hotworkdetail,
  confineddetail,
  workpermitModify,
  hangingworkModify,
  highworkModify,
  hotworkModify,
  confinedModify,
  workpermitSubItem,
  HangingWorkSubItem,
  HighWorkSubItem,
  HotWorkSubItem,
  ConfinedWorkSubItem,
  workpermitDelete,
  hangingDelete,
  highworkDelete,
  hotworkDelete,
  confinedDelete
};

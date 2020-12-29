import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workflow/record/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const record = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const recordPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const recordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const recordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const recordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const recordAllFlow = params => { return axios.get(_util.getServerUrl(`/workflow/flow/info/`), { params: params }); };

const recordAllFlowDetail = params => { return axios.get(_util.getServerUrl(`/workflow/flow/detail/`), { params: params }); };

const recordSub = params => { return axios.post(_util.getServerUrl(`/workflow/flow/sub/?project_id=${params.project_id}`), params); };

const recordAudit = params => { return axios.post(_util.getServerUrl(`/workflow/flow/audit/`), params); };

const recordRecall = params => { return axios.post(_util.getServerUrl(`/workflow/flow/recall/?project_id=${params.project_id}`), params); };

export {
  record,
  recordPost,
  recordPut,
  recordDelete,
  recordDetail,
  recordAllFlow,
  recordAllFlowDetail,
  recordSub,
  recordAudit,
  recordRecall
};

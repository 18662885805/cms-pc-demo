import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workflow/record/wait/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const wait = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const waitPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const waitPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const waitDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const waitDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const waitAudit = params => { return axios.post(_util.getServerUrl(`/workflow/flow/audit/?project_id=${params.project_id}`), params); };

const waitBack = params => { return axios.post(_util.getServerUrl(`/workflow/flow/back/?project_id=${params.project_id}`), params); };

const waitStop = params => { return axios.post(_util.getServerUrl(`/workflow/flow/stop/?project_id=${params.project_id}`), params); };

const waitProxy = params => { return axios.post(_util.getServerUrl(`/workflow/flow/proxy/?project_id=${params.project_id}`), params); };

const waitJump = params => { return axios.post(_util.getServerUrl(`/workflow/flow/jump/?project_id=${params.project_id}`), params); };

const waitChild = params => { return axios.post(_util.getServerUrl(`/workflow/flow/child/?project_id=${params.project_id}`), params); };

const waitSub = params => { return axios.post(_util.getServerUrl(`/workflow/flow/sub/?project_id=${params.project_id}`), params); };

const ChildFlow = params => { return axios.post(_util.getServerUrl(`/workflow/flow/child/?project_id=${params.project_id}`), params); };
export {
  wait,
  waitPost,
  waitPut,
  waitDelete,
  waitDetail,
  waitAudit,
  waitBack,
  waitStop,
  waitProxy,
  waitJump,
  waitChild,
  waitSub,
  ChildFlow
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/org/application/";
const _url2 = `${_url}param/`;

const orgapply = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const orgapplyPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const orgapplyPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const orgapplyDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const orgapplyDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

// const organizeForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const organizeExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const applyAuditPost = params => { return axios.post(_util.getServerUrl(`${_url}apply/param/?project_id=${params.project_id}`), params); };

export {
  orgapply,
  orgapplyPost,
  orgapplyPut,
  orgapplyDelete,
  orgapplyDetail,
  // organizeForm,
  organizeExcelPost,
  applyAuditPost
};

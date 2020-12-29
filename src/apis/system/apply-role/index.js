import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

// const _url = "/system/applyrole/";
const _url = "/system/rolerecord/";
const _url2 = `${_url}param/`;

const applyRole = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const rolePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const rolePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const roleDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

// const roleDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const applyRolePost = params => { return axios.post(_util.getServerUrl(`${_url}info/param/`), params); };

const applyRoleDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const applyRoleInfoDetail = (id, params) => { return axios.get(_util.getServerUrl(`/system/applyroleinfo/param/${id}/`), params); };

const applyRoleAuditDetail = (id, params) => { return axios.get(_util.getServerUrl(`/system/rolerecord/pending/param/${id}/`), { params: params }); };

const applyRoleExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const applyRoleAudit = params => { return axios.get(_util.getServerUrl("/system/rolerecord/pending/param/"), { params: params }); };

const applyRoleAuditPost = params => { return axios.post(_util.getServerUrl(`/system/rolerecord/audit/param/?project_id=${params.project_id}`), params); };

const applyRoleAuditExcel = params => { return axios.post(_util.getServerUrl("/system/applyroleaudit/excel/"), params); };

const applyRoleInfo = params => { return axios.get(_util.getServerUrl("/system/applyroleinfo/param/"), { params: params }); };

const applyRoleRecordExcel = params => { return axios.post(_util.getServerUrl("/system/applyroleinfo/excel/"), params); };

const applyRoleSubmit = params => { return axios.post(_util.getServerUrl(`/system/rolerecord/sub/?project_id=${params.project}`), params); };

const applyRoleWithdraw = params => { return axios.post(_util.getServerUrl(`/system/rolerecord/recall/?project_id=${params.project}`), params); };

const applyRoleBack = params => { return axios.post(_util.getServerUrl(`/system/rolerecord/back/?project_id=${params.project_id}`), params); };

const applyRoleInfoAll = params => { return axios.get(_util.getServerUrl("/system/allapplyroleinfo/param/"), { params: params }); };

const applyRoleInfoAllDetail = (id, params) => { return axios.get(_util.getServerUrl(`/system/allapplyroleinfo/param/${id}/`), params); };

export {
  applyRole,
  applyRoleDetail,
  applyRolePost,
  applyRoleExcelPost,
  rolePost,
  rolePut,
  roleDelete,
  // roleDetail,
  applyRoleAudit,
  applyRoleAuditPost,
  applyRoleAuditExcel,
  applyRoleInfo,
  applyRoleRecordExcel,
  applyRoleSubmit,
  applyRoleWithdraw,
  applyRoleBack,
  applyRoleInfoDetail,
  applyRoleAuditDetail,
  applyRoleInfoAll,
  applyRoleInfoAllDetail
};

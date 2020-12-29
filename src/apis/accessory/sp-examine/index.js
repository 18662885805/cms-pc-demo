import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/recordaudit/";
const audit = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const auditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const auditPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const auditPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const auditDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const auditApply = params => { return axios.post(_util.getServerUrl("/warehouse/record/apply/param/"), params); };
const auditBack = params => { return axios.post(_util.getServerUrl("/warehouse/record/back/"), params); };

export {
  audit,
  auditDetail,
  auditPost,
  auditPut,
  auditDelete,
  auditApply,
  auditBack
};

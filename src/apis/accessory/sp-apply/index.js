import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/record/";
const apply = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const applyDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const applyPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const applyPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const applyDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const searchPers = params => { return axios.get(_util.getServerUrl("/warehouse/search/part_no/"), { params: params }); };
const applyAudit = params => { return axios.post(_util.getServerUrl("/warehouse/record/submit/"), params); };
const applyWithdraw = params => { return axios.post(_util.getServerUrl("/warehouse/record/withdraw/"), params); };

export {
  apply,
  applyDetail,
  applyPost,
  applyPut,
  applyDelete,
  searchPers,
  applyAudit,
  applyWithdraw
};

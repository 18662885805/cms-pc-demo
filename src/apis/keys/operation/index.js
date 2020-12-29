import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/keys/operation/";
const _url2 = `${_url}param/`;

const keysOperation = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const keysOperationDetail = id => { return axios.get(_util.getServerUrl(_url2 + id + "/")); };

const areaInfo = params => { return axios.get(_util.getServerUrl("/keys/area/"), { params: params }); };

const keysSubmit = params => { return axios.post(_util.getServerUrl(`${_url}submit/`), params); };

const keysWithdraw = params => { return axios.post(_util.getServerUrl("/keys/record/withdraw/"), params); };

const keysBack = params => { return axios.post(_util.getServerUrl("/keys/recordinfo/back/"), params); };

const keysApply = params => { return axios.post(_util.getServerUrl("/keys/audit/apply/param/"), params); };

const keysOperationPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const keysOperationPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const keysOperationDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const doorSearch = params => { return axios.get(_util.getServerUrl("/keys/door/search/"), { params: params }); };

export {
  keysOperation,
  areaInfo,
  keysSubmit,
  keysWithdraw,
  keysBack,
  keysApply,
  keysOperationPost,
  doorSearch,
  keysOperationDetail,
  keysOperationPut,
  keysOperationDelete
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/keys/list/";
const _url2 = `${_url}param/`;
const _url3 = "/keys/record/edit/";

const keysRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const areaInfo = params => { return axios.get(_util.getServerUrl("/keys/area/"), { params: params }); };

const keysRecordSearch = params => { return axios.get(_util.getServerUrl("/keys/search/?code=" + params)); };

const keysRecordPost = params => { return axios.post(_util.getServerUrl(`${_url2}`), params); };

const keysRecordOperation = params => { return axios.post(_util.getServerUrl("/keys/record/operation/"), params); };

const keysRecordDetail = id => { return axios.get(_util.getServerUrl(_url2 + id + "/")); };

const returnTimeEdit = (params) => { return axios.post(_util.getServerUrl(`${_url3}`), params); };

export {
  keysRecordSearch,
  areaInfo,
  keysRecord,
  keysRecordPost,
  keysRecordOperation,
  keysRecordDetail,
  returnTimeEdit
};

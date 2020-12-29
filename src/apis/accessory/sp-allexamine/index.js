import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/allrecord/";
const allRecord = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const allRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const allRecordPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const allRecordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const allRecordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  allRecord,
  allRecordDetail,
  allRecordPost,
  allRecordPut,
  allRecordDelete
};

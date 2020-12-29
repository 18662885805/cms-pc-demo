import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/recordinfo/";
const record = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const recordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const recordPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const recordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const recordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  record,
  recordDetail,
  recordPost,
  recordPut,
  recordDelete
};

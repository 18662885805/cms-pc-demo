import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/ticket/record/";
const _url2 = `${_url}param/`;

const record = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const recordPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const recordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const recordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const recordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const recordForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const recordExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const recordClosedPost = params => { return axios.post(_util.getServerUrl(`${_url}closed/`), params); };

export {
  record,
  recordPost,
  recordPut,
  recordDelete,
  recordDetail,
  recordForm,
  recordExcelPost,
  recordClosedPost
};

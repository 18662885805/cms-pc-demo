import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/reason/";
const _url2 = `${_url}param/`;

const reason = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const reasonPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project}`), params); };

const reasonPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const reasonDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const reasonDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const reasonForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const reasonExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  reason,
  reasonPost,
  reasonPut,
  reasonDelete,
  reasonDetail,
  reasonForm,
  reasonExcelPost
};

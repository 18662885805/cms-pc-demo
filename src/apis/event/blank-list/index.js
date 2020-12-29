import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/blanklist/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}enabled/param/`;
const _url4 = `${_url}disabled/param/`;

const blankList = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const blankListPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const blankListDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const blankListDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const blankListPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const blankListForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const blankListExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(_url4), params); };

const SearchVisitor = params => { return axios.post(_util.getServerUrl(`/event/visitor/info/param/?project_id=${params.project_id}`), params); };

export {
  blankList,
  blankListPost,
  blankListDelete,
  blankListPut,
  blankListDetail,
  blankListForm,
  blankListExcelPost,
  disabledPost,
  enabledPost,
  SearchVisitor
};

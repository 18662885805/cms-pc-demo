import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/appointment/";
const _url2 = `${_url}param/`;

const bookVisitor = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const bookVisitorPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const bookVisitorDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const bookVisitorSearch = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

const bookVisitorTemporaryCardPost = params => { return axios.post(_util.getServerUrl(`${_url}temporarycard/`), params); };

const bookExternalPost = params => { return axios.post(_util.getServerUrl("/event/staffauth/enter/"), params); };

const bookVisitorEnter = params => { return axios.post(_util.getServerUrl(`/event/enter/param/?project_id=${params.project_id}`), params); };

export {
  bookVisitor,
  bookVisitorPut,
  bookVisitorDetail,
  bookVisitorSearch,
  bookVisitorTemporaryCardPost,
  bookExternalPost,
  bookVisitorEnter
};

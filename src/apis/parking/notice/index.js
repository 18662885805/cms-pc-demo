import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/parking/notice/";
const _url2 = `${_url}param/`;

const notice = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };
const noticePost = params => { return axios.post(_util.getServerUrl(_url2), params); };
const noticePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };
const privacyDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };
const privacyDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };
const noticeDetail = (id, params) => { return axios.get(_util.getServerUrl("/parking/get/notice/"), params); };
const disabledPost = params => { return axios.post(_util.getServerUrl(`${_url}disabled/param/`), params); };
const enabledPost = params => { return axios.post(_util.getServerUrl(`${_url}enabled/param/`), params); };
const privacySearch = params => { return axios.get(_util.getServerUrl("/account/privacy/info/search/"), { params: params }); };

export {
  notice,
  noticePost,
  noticePut,
  privacyDelete,
  privacyDetail,
  noticeDetail,
  disabledPost,
  enabledPost,
  privacySearch
};

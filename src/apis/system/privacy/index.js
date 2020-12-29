import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/public/privacy/";
const _url2 = `${_url}param/`;

const privacy = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };
const privacyPost = params => { return axios.post(_util.getServerUrl(_url2), params); };
const privacyPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };
const privacyDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };
const privacyDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };
const disabledPost = params => { return axios.post(_util.getServerUrl(`${_url}disabled/param/`), params); };
const enabledPost = params => { return axios.post(_util.getServerUrl(`${_url}enabled/param/`), params); };
const privacySearch = params => { return axios.get(_util.getServerUrl("/account/privacy/"), { params: params }); };

export {
  privacy,
  privacyPost,
  privacyPut,
  privacyDelete,
  privacyDetail,
  disabledPost,
  enabledPost,
  privacySearch
};

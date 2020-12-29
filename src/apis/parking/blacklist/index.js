import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/parking/blacklist/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}enabled/param/`;
const _url4 = `${_url}disabled/param/`;

const BlackList = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const BlackListPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const BlackListPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const BlackListDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const BlackListDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(_url4), params); };


export {
  BlackList,
  BlackListPost,
  BlackListPut,
  BlackListDelete,
  BlackListDetail,
  enabledPost,
  disabledPost
};

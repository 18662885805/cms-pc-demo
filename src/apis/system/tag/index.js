import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/tags/";
const _url2 = `${_url}param/`;

const tag = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const tagPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const tagPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const tagDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const tagDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  tag,
  tagPost,
  tagPut,
  tagDelete,
  tagDetail
};

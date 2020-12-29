import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/keys/info/";
const _url2 = `${_url}param/`;

const keys = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const keysDetail = id => { return axios.get(_util.getServerUrl(_url2 + id + "/")); };

const keysArea = params => { return axios.get(_util.getServerUrl("/keys/area/"), { params: params }); };

const keysPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const keysDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const keysForm = params => { return axios.post(_util.getServerUrl(`/form${_url}/`), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(`${_url}disabled/param/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(`${_url}enabled/param/`), params); };

export {
  keys,
  keysPost,
  keysDelete,
  keysForm,
  disabledPost,
  enabledPost,
  keysArea,
  keysDetail
};

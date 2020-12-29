import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/keys/";
const _url2 = `${_url}param/`;

const keys = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const keysPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const keysDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const keysForm = params => { return axios.post(_util.getServerUrl(`/form${_url}/`), params); };

export {
  keys,
  keysPost,
  keysDelete,
  keysForm
};

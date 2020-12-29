import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/key/";
const _url2 = `${_url}param/`;

const Keys = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const KeyList = params => { return axios.get(_util.getServerUrl("/eqp/key/search/all/"), { params: params }); };

const KeyPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const KeyPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const KeyDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const KeyDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const KeyType = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const keySearch = params => { return axios.get(_util.getServerUrl(`${_url}search/by/type/`), { params: params }); };

const relatedSearch = params => { return axios.get(_util.getServerUrl(`${_url}search/by/related/`), { params: params }); };

export {
  Keys,
  KeyList,
  KeyPost,
  KeyPut,
  KeyDelete,
  KeyDetail,
  KeyType,
  keySearch,
  relatedSearch
};

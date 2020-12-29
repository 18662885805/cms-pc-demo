import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/mtype/";
const _url2 = `${_url}param/`;

const Types = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const TypePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const TypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const TypeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const TypeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  Types,
  TypePost,
  TypePut,
  TypeDelete,
  TypeDetail
};

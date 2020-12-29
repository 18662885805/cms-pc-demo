import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/type/";
const type = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const typeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const typePost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const typePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const typeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  type,
  typeDetail,
  typePost,
  typePut,
  typeDelete
};

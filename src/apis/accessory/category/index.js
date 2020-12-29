import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/accessory/category/";
const category = params => { return axios.get(_util.getServerUrl(_url), { params: params }); };
const categoryDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const categoryPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const categoryPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const categoryDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  category,
  categoryDetail,
  categoryPost,
  categoryPut,
  categoryDelete
};

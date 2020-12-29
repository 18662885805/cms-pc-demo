import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/public/menu/";
const _url2 = `${_url}param/`;

const menu = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const menuPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const menuPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const menuDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const menuDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const menuForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

export {
  menu,
  menuPost,
  menuPut,
  menuDelete,
  menuDetail,
  menuForm
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/public/action/";
const _url2 = `${_url}param/`;

const action = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const actionPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const actionPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const actionDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const actionDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const actionForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

export {
  action,
  actionPost,
  actionPut,
  actionDelete,
  actionDetail,
  actionForm
};

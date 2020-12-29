import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/super/permission/";
const _url2 = `${_url}param/`;

const permission = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const permissionPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const permissionPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const permissionDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const permissionDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const permissionForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const permissionList = params => { return axios.get(_util.getServerUrl('/super/permission/info/'), { params: params }); };

export {
  permission,
  permissionPost,
  permissionPut,
  permissionDelete,
  permissionDetail,
  permissionForm,
  permissionList
};

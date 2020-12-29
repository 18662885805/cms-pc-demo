import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/role/";
const _url2 = `${_url}param/`;

const role = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const roleInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

const orgRoleInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

// const orgRoleInfo = params => { return axios.get(_util.getServerUrl('/system/org/role/info/'), { params: params }); };

const rolePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const rolePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const roleDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const roleDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const roleForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const roleExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const rolePermission = params => { return axios.get(_util.getServerUrl(`/system/role/permission/`), { params: params }); };

export {
  role,
  roleInfo,
  rolePost,
  rolePut,
  roleDelete,
  roleDetail,
  roleForm,
  roleExcelPost,
  rolePermission,
  orgRoleInfo 
};

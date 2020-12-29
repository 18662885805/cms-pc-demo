import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/join/";
const _url2 = `${_url}param/`;

const ProjectJoin = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

// const roleInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

// const rolePost = params => { return axios.post(_util.getServerUrl(_url2), params); };

// const rolePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

// const roleDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const JoinDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

// const roleForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

// const roleExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

// const rolePermission = params => { return axios.get(_util.getServerUrl(`/system/role/permission/`), { params: params }); };

const JoinPost = params => { return axios.post(_util.getServerUrl(`/system/join/status/param/?project_id=${params.project_id}`), params); };

export {
  ProjectJoin,
  JoinDetail,
  JoinPost
  // roleInfo,
  // rolePost,
  // rolePut,
  // roleDelete,
  // roleDetail,
  // roleForm,
  // roleExcelPost,
  // rolePermission
};

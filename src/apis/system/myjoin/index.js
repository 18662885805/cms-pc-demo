import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/myjoin/";
const _url2 = `${_url}param/`;

const myProjectJoin = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

// const roleInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

const myJoinPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const myJoinPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

// const roleDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const myJoinDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), { params: params }); };

// const roleForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

// const roleExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

// const rolePermission = params => { return axios.get(_util.getServerUrl(`/system/role/permission/`), { params: params }); };

export {
  myProjectJoin,
  myJoinPost,
  myJoinDetail,
  myJoinPut
  // roleInfo,
  // rolePost,
  // rolePut,
  // roleDelete,
  // roleDetail,
  // roleForm,
  // roleExcelPost,
  // rolePermission
};

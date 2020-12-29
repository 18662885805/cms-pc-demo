import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/user/";
const _url2 = `${_url}param/`;

const user = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const userPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const userPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const userDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const userDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const userForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(`${_url}/disabled/param/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(`${_url}/enabled/param/`), params); };

const userExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const userStatusChange = params => { return axios.post(_util.getServerUrl(`/system/project/user/is_active/param/?project_id=${params.project_id}`), params); };

const SearchProjectUser = params => { return axios.get(_util.getServerUrl(`/system/user/search/`), { params: params }); };

const SearchUserPhone = params => { return axios.post(_util.getServerUrl(`/system/user/phone/search/`), params); };

export {
  user,
  userPost,
  userPut,
  userDelete,
  userDetail,
  userForm,
  disabledPost,
  enabledPost,
  userExcelPost,
  userStatusChange,
  SearchProjectUser,
  SearchUserPhone
};

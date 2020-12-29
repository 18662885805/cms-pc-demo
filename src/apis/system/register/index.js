import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/register/";
const _url2 = `${_url}param/`;

const register = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

// const registerPost = params => { return axios.post(_util.getServerUrl(`${_url}info/param/`), params); };

const registerDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const registerExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const getFactory = params => { return axios.get(_util.getServerUrl("/system/factory/info/"), { params: params }); };

const costList = params => { return axios.get(_util.getServerUrl("/system/department/info/"), { params: params }); };

const getDept = params => { return axios.get(_util.getServerUrl("/system/department/info/"), { params: params }); };

const registerPost = params => { return axios.post(_util.getServerUrl(`/system/register/status/param/?project_id=${params.project_id}`), params); };

export {
  register,
  registerDetail,
  registerPost,
  registerExcelPost,
  getFactory,
  costList,
  getDept
};

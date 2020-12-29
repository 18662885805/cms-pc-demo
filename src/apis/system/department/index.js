import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/department/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const department = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const departmentPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const departmentPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const departmentDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const departmentDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const getDepartment = (id, params) => { return axios.get(_util.getServerUrl(`${_url3}?cost_center_id=${id}`), params); };

const departmentForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const departmentExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  department,
  departmentPost,
  departmentPut,
  departmentDelete,
  departmentDetail,
  departmentForm,
  departmentExcelPost,
  getDepartment
};

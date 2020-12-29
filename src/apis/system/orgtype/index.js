import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/org/type/";
const _url2 = `${_url}param/`;

const orgtype = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const orgtypePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const orgtypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const orgtypeDelete = params => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${params.project_id}`), { params: params }); };

const orgtypeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const orgtypeForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const orgtypeExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const orgtypeInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

export {
  orgtype,
  orgtypePost,
  orgtypePut,
  orgtypeDelete,
  orgtypeDetail,
  orgtypeForm,
  orgtypeExcelPost,
  orgtypeInfo
};

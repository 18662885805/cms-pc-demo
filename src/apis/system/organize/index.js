import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/org/";
const _url2 = `${_url}param/`;

const organize = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const organizePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const organizePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const organizeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const organizeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const organizeForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const organizeExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const ProjectInfo = params => { return axios.post(_util.getServerUrl(`/system/project/info/?project_id=${params.project_id}`), params); };

const turnstileInfo = params => { return axios.get(_util.getServerUrl('/system/turnstile/info/'), { params: params }); };


export {
  organize,
  organizePost,
  organizePut,
  organizeDelete,
  organizeDetail,
  organizeForm,
  organizeExcelPost,
  ProjectInfo,
  turnstileInfo
};

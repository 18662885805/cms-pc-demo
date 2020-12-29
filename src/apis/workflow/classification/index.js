import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workflow/classification/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const classification = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const classificationPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const classificationPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const classificationDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const classificationDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

export {
  classification,
  classificationPost,
  classificationPut,
  classificationDelete,
  classificationDetail,
};

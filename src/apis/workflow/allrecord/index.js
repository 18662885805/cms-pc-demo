import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workflow/allrecord/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const allrecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const allrecordPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const allrecordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const allrecordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const allrecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

export {
  allrecord,
  allrecordPost,
  allrecordPut,
  allrecordDelete,
  allrecordDetail,
};

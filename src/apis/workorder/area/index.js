import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/assignment/area/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

const area = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };
const areaPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params) };
const areaPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };
const areaDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };
const areaDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };
const areaForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };
const getArea = (params) => { return axios.post(_util.getServerUrl(`/assignment/getarea/?project_id=${params.project_id}`), params); };

export {
  area,
  areaPost,
  areaPut,
  areaDelete,
  areaDetail,
  areaForm,
    getArea,
};

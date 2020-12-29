import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/approval/person/";
const person = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const personDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const personPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const personPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const personDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const personAdd = params => { return axios.post(_util.getServerUrl("/approval/person/add/param/"), params); };
const personRevise = params => { return axios.post(_util.getServerUrl("/approval/person/edit/param/"), params); };

export {
  person,
  personDetail,
  personPost,
  personPut,
  personDelete,
  personAdd,
  personRevise
};

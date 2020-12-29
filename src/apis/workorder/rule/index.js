import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/assignment/rule/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

const rule = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const rulePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const rulePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const ruleDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const ruleDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const ruleUser = (params) => { return axios.post(_util.getServerUrl(`/assignment/getorguser/?project_id=${params.project_id}`), params); };

const rulePerson = (params) => { return axios.post(_util.getServerUrl(`/assignment/getorgalluser/?project_id=${params.project_id}`), params); };

export {
  rule,
  rulePost,
  rulePut,
  ruleDelete,
  ruleDetail,
  ruleUser,
  rulePerson
};

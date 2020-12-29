import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workflow/manage/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const Assign = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const AssignPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const AssignPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const AssignDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const AssignDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const WorkFlowInfo =  params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

export {
  Assign,
  AssignPost,
  AssignPut,
  AssignDelete,
  AssignDetail,
  WorkFlowInfo
};

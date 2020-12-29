import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/approval/flow/template/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const approval = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const approvalPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const approvalPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const approvalDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const approvalDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

export {
  approval,
  approvalPost,
  approvalPut,
  approvalDelete,
  approvalDetail,
};

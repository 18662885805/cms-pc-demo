import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/approval/flow/";
const flow = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const flowDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const flowPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const flowPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const flowDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const flowInfo = params => { return axios.get(_util.getServerUrl("/approval/flow/info/"), { params: params }); };
const personInfo = params => { return axios.get(_util.getServerUrl("/approval/person/info/"), { params: params }); };

export {
  flow,
  flowDetail,
  flowPost,
  flowPut,
  flowDelete,
  flowInfo,
  personInfo
};

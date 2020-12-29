import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/receiving/";
const manifest = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const manifestDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const manifestPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const manifestPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const manifestDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const manifestSearch = params => { return axios.get(_util.getServerUrl("/warehouse/search/code/"), {params: params}); };
const manifestIssue = params => { return axios.post(_util.getServerUrl("/warehouse/issue/"), params); };

export {
  manifest,
  manifestDetail,
  manifestPost,
  manifestPut,
  manifestDelete,
  manifestSearch,
  manifestIssue
};

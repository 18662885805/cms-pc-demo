import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/channel/";
const _url2 = `${_url}param/`;

const channel = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const channelPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project}`), params); };

const channelPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const channelDelete = params => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${params.project}`), { params: params }); };

// const channelDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params) }
// const channelDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), { params: { factory_id: params.factory_id } }); };
const channelDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const channelForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const channelExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  channel,
  channelPost,
  channelPut,
  channelDelete,
  channelDetail,
  channelForm,
  channelExcelPost
};

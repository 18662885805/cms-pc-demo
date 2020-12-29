import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/allreceiving/";
const allReceive = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const allReceiveDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const allReceivePost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const allReceivePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const allReceiveDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  allReceive,
  allReceiveDelete,
  allReceiveDetail,
  allReceivePost,
  allReceivePut
};

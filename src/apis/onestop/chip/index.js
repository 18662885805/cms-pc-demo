import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/chip/";
const _url2 = `${_url}param/`;

const chip = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const chipPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const chipDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const chipForm = params => { return axios.post(_util.getServerUrl(`/form${_url}/`), params); };

const chipDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  chip,
  chipPost,
  chipDelete,
  chipForm,
  chipDetail
};

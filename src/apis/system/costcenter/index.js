import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/costcenter/";
const _url2 = `${_url}param/`;

const costcenter = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const costcenterPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const costcenterPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const costcenterDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const costcenterDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const costcenterForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

export {
  costcenter,
  costcenterPost,
  costcenterPut,
  costcenterDelete,
  costcenterDetail,
  costcenterForm
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/public/accesstype/";
const _url2 = `${_url}param/`;

const accessType = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const accessTypePost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const accessTypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const accessTypeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const accessTypeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const accessTypeForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

export {
  accessType,
  accessTypePost,
  accessTypePut,
  accessTypeDelete,
  accessTypeDetail,
  accessTypeForm
};

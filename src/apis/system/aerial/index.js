import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/public/aerial/";
const _url2 = `${_url}param/`;

const aerial = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const aerialPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const aerialPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const aerialDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const aerialDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  aerial,
  aerialPost,
  aerialPut,
  aerialDelete,
  aerialDetail
};

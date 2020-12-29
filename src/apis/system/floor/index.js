import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/floor/";
const _url2 = `${_url}param/`;

const floor = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const floorPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const floorPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const floorDelete = params => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/`), { params: params }); };

const floorDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), { params: params }); };

const floorForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const floorExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  floor,
  floorPost,
  floorPut,
  floorDelete,
  floorDetail,
  floorForm,
  floorExcelPost
};

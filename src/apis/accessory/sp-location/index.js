import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/area/";
const area = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const areaDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const areaPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const areaPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const areaDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const areaInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

export {
  area,
  areaDetail,
  areaPost,
  areaPut,
  areaDelete,
  areaInfo
};

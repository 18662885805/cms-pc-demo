import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/warehouse/inventory/";
const inventory = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const inventoryDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const inventoryPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const inventoryPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const inventoryDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const countPost = params => { return axios.post(_util.getServerUrl("/warehouse/operation/count/param/"), params); };
const storage = params => { return axios.post(_util.getServerUrl("/warehouse/storage/"), params ); };

export {
  inventory,
  inventoryDetail,
  inventoryPost,
  inventoryPut,
  inventoryDelete,
  countPost,
  storage
};

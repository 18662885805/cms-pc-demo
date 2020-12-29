import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workorder/ordercategory/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

const typeOrder = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const typeOrderPost = params => { return axios.post(_util.getServerUrl(_url2), params); };
const typeOrderPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };
const typeOrderDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderHandlePost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const myOrderPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const typeOrderDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const typeEnable = params => { return axios.post(_util.getServerUrl("/workorder/ordercategory/enabled/param/"), params); };

// const typeEnable= params => { return axios.post(_util.getServerUrl(`${_url}enabled/param`), params) }

const typeDisable= params => { return axios.post(_util.getServerUrl(`${_url}disabled/param/`), params); };

const typeCategory = params => { return axios.get(_util.getServerUrl("/workorder/order/getcategory/"), { params: params }); };
export {
  typeOrder,
  typeOrderPost,
  typeOrderPut,
  typeOrderDelete,
  myOrderPut,
  myOrderDelete,
  typeOrderDetail,
  myOrderForm,
  myOrderHandlePost,
  typeEnable,
  typeDisable,
  typeCategory
};

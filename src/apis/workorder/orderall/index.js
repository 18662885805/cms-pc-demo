import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workorder/order/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

const myOrder = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const myOrderPost = params => { return axios.post(_util.getServerUrl(_url2), params); };
const myOrderHandlePost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const myOrderPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const contactSearch = params => { return axios.get(_util.getServerUrl("/workorder/order/contacts/"), { params: params }); };

export {
  myOrder,
  myOrderPost,
  myOrderPut,
  myOrderDelete,
  myOrderDetail,
  myOrderForm,
  myOrderHandlePost,
  contactSearch
};

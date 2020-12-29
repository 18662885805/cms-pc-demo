import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workorder/ordertodo/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

// const todoOrder = params => { return axios.get(_util.getServerUrl(_url2), { params: params }) }
// const todoOrder = params => { return axios.get(_util.getServerUrl(_url2), { params: {todo: true,filter:{"status__in":[1,2,3,7,8,10]},...params} }) }
const todoOrder = params => { return axios.get(_util.getServerUrl(_url2), { params: {todo: true,...params} }); };

const myOrderPost = params => { return axios.post(_util.getServerUrl(_url2), params); };
const myOrderHandlePost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const myOrderPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const myOrderForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

export {
  todoOrder,
  myOrderPost,
  myOrderPut,
  myOrderDelete,
  myOrderDetail,
  myOrderForm,
  myOrderHandlePost
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workorder/orderall/";
const _url2 = `${_url}param/`;

const allOrder = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };
const allOrderDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  allOrder,
  allOrderDetail
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/supplier/";
const _url2 = `${_url}param/`;

const Supplier = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const SupplierPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const SupplierPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const SupplierDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const SupplierDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const SupplierList = params => { return axios.get(_util.getServerUrl("/eqp/main/search/all/supplier/"), { params: params }); };

export {
  Supplier,
  SupplierPost,
  SupplierPut,
  SupplierDelete,
  SupplierDetail,
  SupplierList
};

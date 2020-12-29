import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/cardtype/";
const _url2 = `${_url}param/`;

const CardType = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const CardTypePost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const CardTypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const CardTypeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const CardTypeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const CardTypeList = params => { return axios.get(_util.getServerUrl("/eqp/main/search/all/supplier/"), { params: params }); };

export {
  CardType,
  CardTypePost,
  CardTypePut,
  CardTypeDelete,
  CardTypeDetail,
  CardTypeList
};

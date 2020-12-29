import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/cardoperation/";
const _url2 = `${_url}param/`;

const newCard = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const newCardDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const newCardPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const newCardPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const newCardSubmit = params => { return axios.post(_util.getServerUrl(`${_url}submit/`), params); };

const newCardWithdraw = params => { return axios.post(_util.getServerUrl("/onestop/cardrecord/withdraw/"), params); };

const search = params => { return axios.get(_util.getServerUrl(`${_url}search/`), { params: params }); };

const newCardDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const cardInfoEdit = params => { return axios.post(_util.getServerUrl("/onestop/cardinfo/edit/param/"), params); };

const cardSerach = (params) => { return axios.post(_util.getServerUrl("/onestop/cardinfo/param/"), params); };

const cardUpdate = params => { return axios.post(_util.getServerUrl("/onestop/cardoperation/updated/param/"), params); };

const cardAppend = params => { return axios.post(_util.getServerUrl("/onestop/cardrecord/source/"), params); };

const setOnestopRule = params => { return axios.post(_util.getServerUrl("/onestop/settings/edit/param/"), params); };
const getOnestopRule = params => { return axios.get(_util.getServerUrl("/onestop/settings/param/"), { params: params }); };
const getOnestopRuleAll = params => { return axios.get(_util.getServerUrl("/onestop/settings/all/"), { params: params }); };
const vipSearch = (params) => { return axios.post(_util.getServerUrl("/onestop/cardinfo/vip/"), params); };
export {
  newCard,
  newCardDetail,
  newCardPost,
  newCardSubmit,
  newCardWithdraw,
  search,
  newCardDelete,
  newCardPut,
  cardInfoEdit,
  cardSerach,
  cardUpdate,
  getOnestopRule,
  setOnestopRule,
  getOnestopRuleAll,
  cardAppend,
  vipSearch
};

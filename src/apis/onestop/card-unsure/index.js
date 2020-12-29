import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/unsure/";
const _url2 = `${_url}param/`;

const unsureCard = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };
const unsureCardPost = params => { return axios.post(_util.getServerUrl("/onestop/insert/param/"), params); };
const unsureCardSure = params => { return axios.post(_util.getServerUrl("/onestop/sure/param/"), params); };
const unsureCardDelete = params => { return axios.post(_util.getServerUrl("/onestop/delete/param/"), params); };
const unsureCardDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

// const unsureCardForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params) }
//
// const unsureCardRemark = (id, params) => { return axios.get(_util.getServerUrl(`${_url}remarks/?id=${id}`), params) }
//
// const unsureCardSendMsg = params => { return axios.post(_util.getServerUrl(`${_url}send/param/`), params) }

export {
  unsureCard,
  unsureCardSure,
  unsureCardDelete,
  unsureCardPost,
  unsureCardDetail
};

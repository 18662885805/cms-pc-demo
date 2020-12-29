import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/service/";
const _url2 = `${_url}param/`;
const _url3 = "/onestop/service/detail/";
const _url4 = `${_url3}param/`;
const _url5 = "/onestop/service/leave/";
const _url6 = `${_url5}param/`;

const service = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const serviceDetail = id => { return axios.get(_util.getServerUrl(_url4 + "?id=" + id)); };

const serviceReturn = params => { return axios.post(_util.getServerUrl("/onestop/card/return/param/"), params); };

const serviceLeave = params => { return axios.post(_util.getServerUrl(_url6), params); };

const savePeopleBelongs = params => { return axios.post(_util.getServerUrl("/upload/leave/"), params); };

const changeCardStatus = params => { return axios.post(_util.getServerUrl("/onestop/card/status/param/"), params); };

const recoveryCard = params => { return axios.post(_util.getServerUrl("/onestop/card/change/status/param/"), params); };

const serviceOne = params => { return axios.get(_util.getServerUrl("/onestop/service/one/detail/"), { params: params }); };

export {
  service,
  serviceDetail,
  serviceReturn,
  serviceLeave,
  savePeopleBelongs,
  changeCardStatus,
  recoveryCard,
  serviceOne
};

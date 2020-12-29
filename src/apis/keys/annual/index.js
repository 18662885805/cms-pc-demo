import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/keys/annualtrial/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}enabled/param/`;
const _url4 = `${_url}disabled/param/`;

const annualtrial = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const annualtrialrecord = (id, params) => { return axios.get(_util.getServerUrl(`${_url}record/param/?id=${id}`), { params: params }); };

const annualtrialrecordPost = (params) => { return axios.post(_util.getServerUrl(`${_url}record/param/`), params); };

const annualtrialPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const annualtrialDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const annualtrialDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const annualtrialPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const annualtrialForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const annualtrialExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(_url4), params); };

const annualtrialSure = params => { return axios.post(_util.getServerUrl("/keys/annualtrial/sure/"), params); };

const keySearch = q => { return axios.get(_util.getServerUrl(`/keys/key/search/?q=${q}`)); };

export {
  annualtrial,
  annualtrialPost,
  annualtrialDelete,
  annualtrialPut,
  annualtrialDetail,
  annualtrialForm,
  annualtrialExcelPost,
  disabledPost,
  enabledPost,
  annualtrialSure,
  annualtrialrecord,
  annualtrialrecordPost,
  keySearch
};

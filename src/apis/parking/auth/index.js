import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/parking/auth/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}enabled/param/`;
const _url4 = `${_url}disabled/param/`;

const ParkingAuth = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const ParkingAuthPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const ParkingAuthPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingAuthDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingAuthDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(_url4), params); };

const personSerach = params => { return axios.get(_util.getServerUrl("/parking/auth/search/user/by/no/"), { params: params }); };

export {
  ParkingAuth,
  ParkingAuthPost,
  ParkingAuthPut,
  ParkingAuthDelete,
  ParkingAuthDetail,
  enabledPost,
  disabledPost,
  personSerach
};

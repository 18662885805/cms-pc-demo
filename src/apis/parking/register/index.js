import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/parking/visitor/auth/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}enabled/param/`;
const _url4 = `${_url}disabled/param/`;

const ParkingVisitor = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const ParkingVisitorPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const ParkingVisitorPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingVisitorDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingVisitorDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(_url4), params); };

const ParkingCheckIn = params => { return axios.post(_util.getServerUrl("/parking/records/check/in/"), params); };

const ParkingCheckOut = params => { return axios.post(_util.getServerUrl("/parking/records/check/out/"), params); };

export {
  ParkingVisitor,
  ParkingVisitorPost,
  ParkingVisitorPut,
  ParkingVisitorDelete,
  ParkingVisitorDetail,
  enabledPost,
  disabledPost,
  ParkingCheckIn,
  ParkingCheckOut
};

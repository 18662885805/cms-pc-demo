import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/public/gatesite/";
const _url2 = `${_url}param/`;

const ParkingGateList = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const ParkingGatePost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const ParkingGatePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingGateDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingGateDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  ParkingGateList,
  ParkingGatePost,
  ParkingGatePut,
  ParkingGateDetail,
  ParkingGateDelete
};

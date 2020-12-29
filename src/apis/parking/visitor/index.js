import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/parking/myvisitor/";
const _url2 = `${_url}param/`;
// const _url3 = `${_url}enabled/param/`
// const _url4 = `${_url}disabled/param/`

const ParkingVisitor = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const ParkingVisitorPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const ParkingVisitorPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingVisitorDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingVisitorDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingCarList = params => { return axios.get(_util.getServerUrl("/parking/auth/search/car/no/"), { params: params }); };

const ParkingLeftList = params => { return axios.get(_util.getServerUrl("/parking/area/search/left/no/"), { params: params }); };

// const enabledPost = params => { return axios.post(_util.getServerUrl(_url3), params) }
//
// const disabledPost = params => { return axios.post(_util.getServerUrl(_url4), params) }


export {
  ParkingVisitor,
  ParkingVisitorPost,
  ParkingVisitorPut,
  ParkingVisitorDelete,
  ParkingVisitorDetail,
  ParkingCarList,
  ParkingLeftList
  // enabledPost,
  // disabledPost
};

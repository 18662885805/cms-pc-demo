import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/parking/area/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}enabled/param/`;
const _url4 = `${_url}disabled/param/`;

const ParkingArea = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const ParkingAreaPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const ParkingAreaPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingAreaDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const ParkingAreaDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(_url3), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(_url4), params); };

const ParkingAreaToFactory = params => { return axios.get(_util.getServerUrl("/parking/area/search/by/factory/"), { params: params }); };

const ParkingIDs = params => { return axios.get(_util.getServerUrl("/parking/area/search/gate/by/site/"), { params: params }); };

const ParkingAllArea = params => { return axios.get(_util.getServerUrl("/parking/search/param/"), { params: params }); };

const ParkingNumberPost = params => { return axios.post(_util.getServerUrl("/parking/area/change/current/no/param/"), params); };
// const VipVisitorSubmit = params => { return axios.post(_util.getServerUrl(`${_url}submit/`), params) }
//
// const VipAuditWithDraw = params => { return axios.post(_util.getServerUrl(`/event/viprecordinfo/withdraw/`), params) }

// const fitExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params) }

// const getFitChart = params => { return axios.post(_util.getServerUrl('/event/dashboard/'), params) }

// const getFitAll = params => { return axios.post(_util.getServerUrl('/event/allcount/'), params) }

export {
  ParkingArea,
  ParkingAreaPost,
  ParkingAreaPut,
  ParkingAreaDelete,
  ParkingAreaDetail,
  enabledPost,
  disabledPost,
  ParkingAreaToFactory,
  ParkingIDs,
  ParkingAllArea,
  ParkingNumberPost
  // VipVisitorSubmit,
  // VipAuditWithDraw,
  // fitExcelPost,
  // getFitChart,
  // getFitAll
};

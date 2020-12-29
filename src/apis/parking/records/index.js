import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/parking/records/staff/";
const _url2 = `${_url}param/`;

const ParkingRecords = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const ParkingRecordsDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

// const ParkingAreaDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params) }

const ParkingVisitorRecords = params => { return axios.get(_util.getServerUrl("/parking/records/visitor/param/"), { params: params }); };

const ParkingVisitorRecordsDetail = (id, params) => { return axios.get(_util.getServerUrl(`/parking/records/visitor/param/${id}/`), params); };

export {
  ParkingRecords,
  ParkingRecordsDetail,
  ParkingVisitorRecords,
  ParkingVisitorRecordsDetail
};

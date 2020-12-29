import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const project_id = _util.getStorage('project_id');

const _url = "/training/record/";
const _url2 = `${_url}param/`;
const _url3 = `/training/myrecord/param/`;
const _url4 = `/training/org/record/param/`;

const trainRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const myTrainRecord = params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

const orgTrainRecord = params => { return axios.get(_util.getServerUrl(_url4), { params: params }); };

const trainRecordDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${project_id}`), { params: params }); };

const myTrainRecordDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url3}${params.id}/?project_id=${project_id}`), { params: params }); };

export {
  trainRecord,
  trainRecordDetail,
  myTrainRecord,
  myTrainRecordDetail,
  orgTrainRecord 
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/checklist/";
const _url2 = `${_url}param/`;

const MaintenanceRecords = params => { return axios.get(_util.getServerUrl("/eqp/checklist/param/"), { params: params }); };

const MyMaintenanceRecords = params => { return axios.get(_util.getServerUrl("/eqp/mychecklist/param/"), { params: params }); };

const MyRecordsDetail = (id, params) => { return axios.get(_util.getServerUrl(`/eqp/mychecklist/param/${id}/`), params); };

const MaintenanceRecordsBaseTime = params => { return axios.get(_util.getServerUrl(`${_url}search/by/time/`), { params: params }); };

const ChecklistRecordsTask = params => { return axios.get(_util.getServerUrl(`${_url}search/by/task/`), { params: params }); };

const RecordsDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const WorkOrderBaseRecords = params => { return axios.get(_util.getServerUrl("/eqp/checklist/search/order/list/"), { params: params }); };

const WorkOrderPost = params => { return axios.post(_util.getServerUrl("/eqp/checklist/save/order/"), params); };

const WorkOrderStatus = params => { return axios.get(_util.getServerUrl("/eqp/checklist/order/status/update/"), { params: params }); };

const RecordDelete = params => { return axios.delete(_util.getServerUrl("/eqp/checklist/multi/delete/param/"), { params: params }); };

export {
  MaintenanceRecords,
  MyMaintenanceRecords,
  MyRecordsDetail,
  MaintenanceRecordsBaseTime,
  ChecklistRecordsTask,
  RecordsDetail,
  WorkOrderBaseRecords,
  WorkOrderPost,
  WorkOrderStatus,
  RecordDelete
};

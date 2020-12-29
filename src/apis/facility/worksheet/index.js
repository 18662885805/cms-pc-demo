import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/mytask/";
const _url2 = `${_url}param/`;

const MyWorkSheet = params => { return axios.get(_util.getServerUrl("/eqp/mytask/param/"), { params: params }); };

const WorkOrderInfo = params => { return axios.get(_util.getServerUrl("/eqp/checklist/search/info/"), { params: params }); };

const WorkSheetDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };

const CheckPost = params => { return axios.post(_util.getServerUrl("/eqp/task/submit/"), params); };

const Taskcycle = params => { return axios.get(_util.getServerUrl("/eqp/daily/task/check/"), { params: params }); };

// const packagePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params) }
//
// const packageDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params) }
//
// const TaskList = params => { return axios.get(_util.getServerUrl(`/eqp/task/param/`), { params: params }) }
//
// const TaskPost = params => { return axios.post(_util.getServerUrl(`/eqp/task/add/`), params) }
//
// const TaskDelete = (id, params) => { return axios.delete(_util.getServerUrl(`/eqp/task/add/${id}/`), params) }

export {
  MyWorkSheet,
  WorkOrderInfo,
  WorkSheetDetail,
  CheckPost,
  Taskcycle
  // packagePost,
  // packagePut,
  // packageDelete,
  // TaskList,
  // TaskPost,
  // TaskDelete
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/package/";
const _url2 = `${_url}param/`;

const Packages = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const PackagePost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const PackagePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const PackageDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const PackageDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const PackageBreak = params => { return axios.post(_util.getServerUrl("/eqp/break/param/"), params); };

const TaskBreakList = params => { return axios.get(_util.getServerUrl("/eqp/break/param/"), { params: params }); };

const TaskList = params => { return axios.get(_util.getServerUrl("/eqp/task/search/by/package/"), { params: params }); };

const TaskPost = params => { return axios.post(_util.getServerUrl("/eqp/task/add/param/"), params); };

const TaskPut = params => { return axios.put(_util.getServerUrl("/eqp/task/modify/param/"), params); };

const TaskDetail = (id, params) => { return axios.get(_util.getServerUrl(`/eqp/task/param/${id}/`), params); };

// const TaskDelete = (id, params) => { return axios.delete(_util.getServerUrl(`/eqp/task/param/${id}/`), params) }

const TaskDelete = params => { return axios.delete(_util.getServerUrl("/eqp/task/multi/delete/param/"), { params: params }); };

const getPackages = params => { return axios.get(_util.getServerUrl("/eqp/package/search/all/"), { params: params }); };

const PackageTask = params => { return axios.get(_util.getServerUrl("/eqp/package/search/plan/"), { params: params }); };

export {
  Packages,
  PackagePost,
  PackagePut,
  PackageDelete,
  PackageDetail,
  PackageBreak,
  TaskBreakList,
  TaskList,
  TaskPost,
  TaskPut,
  TaskDetail,
  TaskDelete,
  getPackages,
  PackageTask
};

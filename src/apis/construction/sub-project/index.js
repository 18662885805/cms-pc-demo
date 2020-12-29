import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const workPermit = params => { return axios.get(_util.getServerUrl("/construction/workpermit/param/"), { params: params }); };

const hanging = params => { return axios.get(_util.getServerUrl("/construction/hanging/param/"), { params: params }); };

const highWorkPermit = params => { return axios.get(_util.getServerUrl("/construction/highworkpermit/param/"), { params: params }); };

const hotWorkPermit = params => { return axios.get(_util.getServerUrl("/construction/hotworkpermit/param/"), { params: params }); };

const confined = params => { return axios.get(_util.getServerUrl("/construction/confined/param/"), { params: params }); };

const workPermitDelete = (id, params) => { return axios.delete(_util.getServerUrl("/construction/workpermit/param/" + id + "/?project_id=" + params)); };

const hangingDelete = (id, params) => { return axios.delete(_util.getServerUrl("/construction/hanging/param/" + id + "/?project_id=" + params)); };

const highWorkPermitDelete = (id, params) => { return axios.delete(_util.getServerUrl("/construction/highworkpermit/param/" + id + "/?project_id=" + params)); };

const hotWorkPermitDelete = (id, params) => { return axios.delete(_util.getServerUrl("/construction/hotworkpermit/param/" + id + "/?project_id=" + params)); };

const confinedDelete = (id, params) => { return axios.delete(_util.getServerUrl("/construction/confined/param/" + id + "/?project_id=" + params)); };

export {
  workPermit,
  hanging,
  highWorkPermit,
  hotWorkPermit,
  confined,
  workPermitDelete,
  hangingDelete,
  highWorkPermitDelete,
  hotWorkPermitDelete,
  confinedDelete
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const publicSite = params => { return axios.get(_util.getServerUrl("/public/site/info/"), { params: params }); };

const publicFactory = params => { return axios.get(_util.getServerUrl("/public/factory/info/param/"), { params: params }); };

const SelfeqptList = params => { return axios.get(_util.getServerUrl("/public/selfequipment/param/"), { params: params }); };

const SelfeqptPost = params => { return axios.post(_util.getServerUrl("/public/selfequipment/param/"), params); };

const SelfeqptPut = (id, params) => { return axios.put(_util.getServerUrl(`/public/selfequipment/param/${id}/`), params); };

const SelfeqptDetail = params => { return axios.get(_util.getServerUrl(`/public/selfequipment/param/${params.id}/`), params); };

const SelfeqptDelete = (id, params) => { return axios.delete(_util.getServerUrl(`/public/selfequipment/param/${id}/`), params); };

const enabledSelfeqpt = params => { return axios.post(_util.getServerUrl("/public/selfequipment/enabled/param/"), params); };

const disableSelfeqpt = params => { return axios.post(_util.getServerUrl("/public/selfequipment/disabled/param/"), params); };

export {
  publicSite,
  publicFactory,
  SelfeqptList,
  SelfeqptPost,
  SelfeqptPut,
  SelfeqptDetail,
  SelfeqptDelete,
  enabledSelfeqpt,
  disableSelfeqpt
};

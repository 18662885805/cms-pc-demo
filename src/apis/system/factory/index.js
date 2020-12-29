import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/factory/";
const _url2 = `${_url}param/`;

const factory = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const publicFactory = params => { return axios.get(_util.getServerUrl("/public/factory/param/"), { params: params }); };

const areaInfo = params => { return axios.get(_util.getServerUrl("/system/area/info/"), { params: params }); };

const factoryPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const factoryPublicPost = params => { return axios.post(_util.getServerUrl("/public/factory/param/"), params); };

const factoryPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const factoryPublicPut = params => { return axios.put(_util.getServerUrl(`/public/factory/param/${params.id}/?site_id=` + params.site_id), params.values); };

const factoryDelete = params => { return axios.delete(_util.getServerUrl(`/public/factory/param/${params.id}/`), { params: params }); };

const factoryDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const factoryPublicDetail = params => { return axios.get(_util.getServerUrl(`/public/factory/param/${params.id}/`), { params: params }); };

const factoryForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const factoryList = params => { return axios.get(_util.getServerUrl("/system/factory/param/"), { params: params }); };

const factoryInfo = params => { return axios.get(_util.getServerUrl("/system/factory/info/"), { params: params }); };

const mapAxisPost = params => { return axios.post(_util.getServerUrl("/system/factory/coordinate/"), params); };

const mapAxis = params => { return axios.get(_util.getServerUrl("/system/factory/coordinate/info/"), { params: params }); };

export {
  factory,
  areaInfo,
  factoryPost,
  factoryPublicPost,
  factoryPut,
  factoryDelete,
  factoryDetail,
  factoryPublicDetail,
  factoryForm,
  factoryList,
  mapAxisPost,
  mapAxis,
  publicFactory,
  factoryPublicPut,
  factoryInfo
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/area/";
const _url2 = `${_url}param/`;

const Area = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const areaInfo = params => { return axios.get(_util.getServerUrl(`/system/project/area/info/`), { params: params }); };

const AreaPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const AreaPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const AreaDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

export {
  Area,
  areaInfo,
  AreaPost,
  AreaPut,
  AreaDetail
};

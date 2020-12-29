import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const project_id = _util.getStorage('project_id');

const _url = "/training/material/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const materials = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const materialsInfo = params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

const materialsPost = (id, params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const materialsPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const materialsDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const materialsDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), { params: params }); };

const disabledPost = params => {
  return axios.post(_util.getServerUrl(`${_url}/disabled/`), params);
};

const enabledPost = params => {
  return axios.post(_util.getServerUrl(`${_url}/enabled/`), params);
};

export {
  materials,
  materialsInfo,
  materialsPost,
  materialsPut,
  materialsDelete,
  materialsDetail,
  disabledPost,
  enabledPost
};

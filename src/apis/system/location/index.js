import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/location/";
const _url2 = `${_url}param/`;

const location = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const locationPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const locationPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const locationDelete = params => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/`), { params: params }); };

const locationDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), { params: { factory_id: params.factory_id } }); };

// const locationDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.factory_id}/`), {params: params}) }

const locationForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const locationExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const visitInfo = params => { return axios.get(_util.getServerUrl("/event/data/info/"), { params: params }); };

export {
  location,
  locationPost,
  locationPut,
  locationDelete,
  locationDetail,
  locationForm,
  locationExcelPost,
  visitInfo
};

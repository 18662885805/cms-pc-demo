import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/fit/";
const _url2 = `${_url}param/`;
const _url3 = "/event/record/info/";

const fit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const fitPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const fitDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const fitForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const fitExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const followPrev = params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

const getFitChart = params => { return axios.post(_util.getServerUrl("/event/dashboard/"), params); };

const getFitAll = params => { return axios.post(_util.getServerUrl("/event/allcount/"), params); };

const ReasonInfo = params => { return axios.get(_util.getServerUrl(`/event/reason/info/`), { params: params }); };

export {
  fit,
  fitPost,
  fitDetail,
  fitForm,
  fitExcelPost,
  followPrev,
  getFitChart,
  getFitAll,
  ReasonInfo
};

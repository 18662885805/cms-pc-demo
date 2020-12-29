import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/checklist/";
const _url2 = `${_url}param/`;

const FacilityDataInfo = params => { return axios.get(_util.getServerUrl("/eqp/checklist/search/total/report/info/"), { params: params }); };
const FacilityTaskChart = params => { return axios.get(_util.getServerUrl("/eqp/checklist/search/month/no/report/"), { params: params }); };
const FacilityRatioLineChart = params => { return axios.get(_util.getServerUrl("/eqp/checklist/search/month/complete/rate/report/"), { params: params }); };

export {
  FacilityDataInfo,
  FacilityTaskChart,
  FacilityRatioLineChart
};

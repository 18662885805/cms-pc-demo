import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/cardrecord/";
const _url2 = `${_url}param/`;

const cardRecordInfo = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const cardRecordInfoPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const cardRecordInfoDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const cardRecordInfoBack = params => { return axios.post(_util.getServerUrl("/onestop/cardrecordinfo/back/"), params); };

export {
  cardRecordInfo,
  cardRecordInfoBack,
  cardRecordInfoDetail
};

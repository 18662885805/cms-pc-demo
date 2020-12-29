import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/carryout/allrecord/";
const _url2 = `${_url}param/`;

const carryoutRecord = params => { return axios.get(_util.getServerUrl("/carryout/allrecord/param/"), { params: params }); };

const carryoutDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), params); };

const carryoutDetailExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  carryoutRecord,
  carryoutDetail,
  carryoutDetailExcelPost
};

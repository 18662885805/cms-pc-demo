import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/construction/staffrecord/";
const _url2 = `${_url}param/`;

const staffRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const staffRecordPost = params => { return axios.post(_util.getServerUrl(`${_url}audit/param/`), params); };

const staffRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const staffRecordInfoBack = params => { return axios.post(_util.getServerUrl(`${_url}back/`), params); };
const staffRecordInfoWithDraw = params => { return axios.post(_util.getServerUrl(`${_url}withdraw/`), params); };
export {
  staffRecord,
  staffRecordPost,
  staffRecordDetail,
  staffRecordInfoBack,
  staffRecordInfoWithDraw
};

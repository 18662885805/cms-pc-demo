import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/construction/staffrecordinfo/";
const _url2 = `${_url}param/`;

const staffRecordInfo = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const staffRecordInfoPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const staffRecordInfoDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const staffRecordInfoExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const staffRecordInfoWithDraw = params => { return axios.post(_util.getServerUrl(`${_url}withdraw/`), params); };

const staffRecordInfoInfoBack = params => { return axios.post(_util.getServerUrl(`${_url}back/`), params); };

export {
  staffRecordInfo,
  staffRecordInfoPost,
  staffRecordInfoDetail,
  staffRecordInfoExcelPost,
  staffRecordInfoWithDraw,
  staffRecordInfoInfoBack
};

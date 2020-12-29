import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/ticket/allrecord/";
const _url2 = `${_url}param/`;

const totalRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const totalRecordPost = params => { return axios.post(_util.getServerUrl(`${_url}handle/`), params); };

const totalRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const totalRecordExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  totalRecord,
  totalRecordPost,
  totalRecordDetail,
  totalRecordExcelPost
};

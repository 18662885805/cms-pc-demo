import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/ticket/myrecord/";
const _url2 = `${_url}param/`;

const myRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const myRecordPost = params => { return axios.post(_util.getServerUrl(`${_url}handle/`), params); };

const myRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const myRecordExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  myRecord,
  myRecordPost,
  myRecordDetail,
  myRecordExcelPost
};

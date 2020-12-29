import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/pushmessageerror/";
const _url2 = `${_url}param/`;

const pushMessageError = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const pushMessageErrorDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const pushMessageErrorExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  pushMessageError,
  pushMessageErrorDetail,
  pushMessageErrorExcelPost
};

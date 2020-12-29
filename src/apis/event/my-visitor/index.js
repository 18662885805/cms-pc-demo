import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/myvisitor/";
const _url2 = `${_url}param/`;

const myVisitor = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const myVisitorDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const myVisitorExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const myVisitorSureOutPost = params => { return axios.post(_util.getServerUrl(`${_url}sure/`), params); };

export {
  myVisitor,
  myVisitorDetail,
  myVisitorExcelPost,
  myVisitorSureOutPost
};

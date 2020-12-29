import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/viewvisitor/";
const _url2 = `${_url}param/`;

const viewVisitor = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const viewVisitorDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const viewVisitorExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  viewVisitor,
  viewVisitorDetail,
  viewVisitorExcelPost
};

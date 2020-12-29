import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/construction/viewproject/";
const _url2 = `${_url}param/`;

const viewProject = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };
const viewProjectChild = params => { return axios.get(_util.getServerUrl(`${_url}child/`), { params: params }); };

const viewProjectDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const genPDF = params => { return axios.get(_util.getServerUrl("/construction/pdf/"), { params: params }); };
const pdfInfo = params => { return axios.get(_util.getServerUrl("/construction/pdf/info/"), { params: params }); };
const viewListenerDetail = params => { return axios.post(_util.getServerUrl("/construction/viewproject/access/param/"), params); };

export {
  viewProject,
  viewProjectDetail,
  genPDF,
  pdfInfo,
  viewProjectChild,
  viewListenerDetail
};

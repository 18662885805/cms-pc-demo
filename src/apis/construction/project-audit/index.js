import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/construction/order/audit/";
const _url2 = `${_url}param/`;

const projectAudit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const projectAuditPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const projectAuditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const projectAuditExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const projectAuditFirstApply = params => { return axios.post(_util.getServerUrl("/construction/projectaudit/apply/first/param/"), params); };

const projectAuditApply = params => { return axios.post(_util.getServerUrl(`${_url}apply/param/`), params); };

const projectAuditWithDraw = params => { return axios.post(_util.getServerUrl(`${_url}withdraw/`), params); };

const projectAuditBack = params => { return axios.post(_util.getServerUrl(`${_url}back/`), params); };

// const projectAuditDetail = (id, params) => { return axios.get(_util.getServerUrl(`/construction/projectaudit/param/`), params) }

export {
  projectAudit,
  projectAuditPost,
  projectAuditDetail,
  projectAuditExcelPost,
  projectAuditFirstApply,
  projectAuditApply,
  projectAuditWithDraw,
  projectAuditBack
};

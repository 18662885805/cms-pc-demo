import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/keys/audit/";
const _url2 = `${_url}param/`;

const keysAudit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const keysAuditApply = params => { return axios.post(_util.getServerUrl(`${_url}apply/param/`), params); };

const keysAuditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  keysAudit,
  keysAuditApply,
  keysAuditDetail
};

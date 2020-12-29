import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/carryout/goodsrecordaudit/";
const _url2 = `${_url}param/`;

const goodsRecordAudit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const goodsRecordAuditPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const goodsRecordAuditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const goodsRecordAuditExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const goodsRecordAuditApply = params => { return axios.post(_util.getServerUrl(`${_url}apply/param/`), params); };

export {
  goodsRecordAudit,
  goodsRecordAuditPost,
  goodsRecordAuditDetail,
  goodsRecordAuditExcelPost,
  goodsRecordAuditApply
};

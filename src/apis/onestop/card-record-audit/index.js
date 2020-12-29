import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/cardaudit/";
const _url2 = `${_url}param/`;

const cardRecordAudit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const cardRecordAuditPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const cardRecordAuditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const cardRecordAuditApply = params => { return axios.post(_util.getServerUrl(`${_url}apply/param/`), params); };

const cardMsgPush = params => { return axios.post(_util.getServerUrl("/onestop/msg/"), params); };

export {
  cardRecordAudit,
  cardRecordAuditPost,
  cardRecordAuditDetail,
  cardRecordAuditApply,
  cardMsgPush
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/accessory/goodsrecordaudit/";
const goodsRecordAudit = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const goodsRecordAuditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  goodsRecordAudit,
  goodsRecordAuditDetail
};
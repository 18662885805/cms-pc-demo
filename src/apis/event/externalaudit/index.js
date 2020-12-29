import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/staffapply/";
const _url2 = `${_url}param/`;

const externalaudit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const externalauditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const externalauditApply = params => { return axios.post(_util.getServerUrl("/event/staffapply/audit/param/"), params); };

export {
  externalaudit,
  externalauditDetail,
  externalauditApply
};

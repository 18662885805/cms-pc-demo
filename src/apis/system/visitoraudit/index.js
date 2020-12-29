import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/visitoraudit/";
const _url2 = `${_url}param/`;

const visitoraudit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const visitorauditDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const visitorauditApply = params => { return axios.post(_util.getServerUrl("/system/visitoraudit/apply/param/"), params); };

export {
  visitoraudit,
  visitorauditDetail,
  visitorauditApply
};

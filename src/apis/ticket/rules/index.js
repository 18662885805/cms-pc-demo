import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/ticket/rules/";
const _url2 = `${_url}param/`;

const rules = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const rulesPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const rulesPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const rulesDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const rulesDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const rulesForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const rulesExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  rules,
  rulesPost,
  rulesPut,
  rulesDelete,
  rulesDetail,
  rulesForm,
  rulesExcelPost
};

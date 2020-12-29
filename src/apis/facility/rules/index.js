import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/rule/";
const _url2 = `${_url}param/`;

const Rules = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const RulesPost = params => { return axios.post(_util.getServerUrl(`${_url}add/`), params); };

const RulesPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}modify/`), params); };

const RulesDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const RulesDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const RulesType = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const enabledPost = params => { return axios.post(_util.getServerUrl("/eqp/rule/set/is/open/param/"), params); };

export {
  Rules,
  RulesPost,
  RulesPut,
  RulesDelete,
  RulesDetail,
  RulesType,
  enabledPost
};

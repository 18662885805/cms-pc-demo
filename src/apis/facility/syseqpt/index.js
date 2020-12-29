import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/syseqp/";
const _url2 = `${_url}param/`;

const Syseqpt = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const SyseqptList = params => { return axios.get(_util.getServerUrl("/eqp/syseqp/search/all/"), { params: params }); };

const SyseqptPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

// const SyseqptPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params) }

const SyseqptPut = params => { return axios.put(_util.getServerUrl("/eqp/syseqp/multi/modify/param/"), params); };

// const SyseqptDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params) }

const SyseqptDelete = params => { return axios.delete(_util.getServerUrl("/eqp/syseqp/multi/delete/param/"), { params: params }); };

const SyseqptDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const tradeSearch = params => { return axios.get(_util.getServerUrl(`${_url}search/sys/by/trade/`), { params: params }); };

const randomSearch = params => { return axios.get(_util.getServerUrl(`${_url}random/no/`), { params: params }); };

const randomCheck = params => { return axios.get(_util.getServerUrl(`${_url}random/exist/`), { params: params }); };

const SysEqptTree = params => { return axios.get(_util.getServerUrl(`${_url}data/info/`), { params: params }); };

const RelatedKeySearch = params => { return axios.get(_util.getServerUrl(`${_url}search/by/key/`), { params: params }); };

const RelatedRuleSearch = params => { return axios.get(_util.getServerUrl("/eqp/rule/search/by/key/"), { params: params }); };

const RuleSearchEqpt = params => { return axios.get(_util.getServerUrl("/eqp/syseqp/search/by/rule/"), { params: params }); };

// const EqptTaskList = params => { return axios.get(_util.getServerUrl(`/eqp/checklist/search/by/eqp/`), { params: params }) }
const EqptTaskList = params => { return axios.get(_util.getServerUrl("/eqp/task/search/by/syseqp/"), { params: params }); };

const EqptRecordList = params => { return axios.get(_util.getServerUrl("/eqp/checklist/search/by/task/"), { params: params }); };

const eqptCopyPost = params => { return axios.post(_util.getServerUrl("/eqp/syseqp/copy/"), params); };

export {
  Syseqpt,
  SyseqptList,
  SyseqptPost,
  SyseqptPut,
  SyseqptDelete,
  SyseqptDetail,
  tradeSearch,
  randomSearch,
  randomCheck,
  SysEqptTree,
  RelatedKeySearch,
  RelatedRuleSearch,
  RuleSearchEqpt,
  EqptTaskList,
  EqptRecordList,
  eqptCopyPost
};

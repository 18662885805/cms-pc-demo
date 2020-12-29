import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/carryout/goodsrecord/";
const _url2 = `${_url}param/`;

const goodsRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const goodsRecordPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const goodsRecordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const goodsRecordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const goodsRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const goodsRecordExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const goodsRecordSubmit = params => { return axios.post(_util.getServerUrl(`${_url}submit/`), params); };

const goodsRecordReturn = params => { return axios.post(_util.getServerUrl(`${_url}return/`), params); };

export {
  goodsRecord,
  goodsRecordPost,
  goodsRecordPut,
  goodsRecordDelete,
  goodsRecordDetail,
  goodsRecordExcelPost,
  goodsRecordSubmit,
  goodsRecordReturn
};

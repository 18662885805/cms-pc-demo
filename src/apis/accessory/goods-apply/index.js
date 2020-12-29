import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/accessory/goodsrecord/";
const goodsRecord = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const goodsRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const goodsRecordPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const goodsRecordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const goodsRecordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  goodsRecord,
  goodsRecordDetail,
  goodsRecordPost,
  goodsRecordPut,
  goodsRecordDelete
};
import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/carryout/goodsrecordinfo/";
const _url2 = `${_url}param/`;

const goodsRecordInfo = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const goodsRecordInfoPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const goodsRecordInfoDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const goodsRecordInfoExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const goodsRecordInfoWithDraw = params => { return axios.post(_util.getServerUrl(`${_url}withdraw/`), params); };

const goodsRecordInfoBack = params => { return axios.post(_util.getServerUrl(`${_url}back/`), params); };

export {
  goodsRecordInfo,
  goodsRecordInfoPost,
  goodsRecordInfoDetail,
  goodsRecordInfoExcelPost,
  goodsRecordInfoWithDraw,
  goodsRecordInfoBack
};

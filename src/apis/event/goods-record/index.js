import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/goodsrecord/";
const _url2 = `${_url}param/`;

const goodsRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const goodsRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const goodsRecordSure = params => { return axios.post(_util.getServerUrl(`${_url}sure/`), params); };

export {
  goodsRecord,
  goodsRecordSure,
  goodsRecordDetail
};

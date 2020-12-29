import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/accessory/goodsrecordinfo/";
const goodsRecordInfo = params => { return axios.get(_util.getServerUrl(`${_url}param/`), { params: params }); };
const goodsRecordInfoDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };

export {
  goodsRecordInfo,
  goodsRecordInfoDetail
};
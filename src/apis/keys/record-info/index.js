import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/keys/record/";
const _url2 = `${_url}param/`;

const keysRecordInfo = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

export {
  keysRecordInfo
};

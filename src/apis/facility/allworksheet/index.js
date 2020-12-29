import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/task/";
const _url2 = `${_url}param/`;

const AllWorkSheet = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const AllWorkSheetDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  AllWorkSheet,
  AllWorkSheetDetail
};

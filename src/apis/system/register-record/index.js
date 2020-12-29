import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/allregister/";
const _url2 = `${_url}param/`;

const allregister = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };
const allregisterPost = params => { return axios.post(_util.getServerUrl(`${_url}info/param/`), params); };
const allregisterDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), params); };

export {
  allregister,
  allregisterPost,
  allregisterDetail
};

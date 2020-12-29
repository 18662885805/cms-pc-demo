import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/visitorauth/";
const _url2 = `${_url}param/`;

const visitorauth = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const disabledPost = params => { return axios.post(_util.getServerUrl(`${_url}/disabled/param/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(`${_url}/enabled/param/`), params); };

const visitorauthDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  visitorauth,
  enabledPost,
  disabledPost,
  visitorauthDetail
};

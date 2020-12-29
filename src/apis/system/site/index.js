import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/public/site/";
const _url2 = `${_url}param/`;

const site = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const sitePost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const sitePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const siteDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const siteDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const siteForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

export {
  site,
  sitePost,
  sitePut,
  siteDelete,
  siteDetail,
  siteForm
};

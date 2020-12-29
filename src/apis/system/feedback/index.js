import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/feedback/";
const _url2 = `${_url}param/`;

const feedback = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const feedbackPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const feedbackPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const feedbackDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const feedbackDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  feedback,
  feedbackPost,
  feedbackPut,
  feedbackDelete,
  feedbackDetail
};

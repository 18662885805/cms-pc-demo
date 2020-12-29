import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/onestop/card/";
const _url2 = `${_url}param/`;

const myCard = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const myCardDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const myCardForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const myCardRemark = (id, params) => { return axios.get(_util.getServerUrl(`${_url}remarks/?id=${id}`), params); };

const myCardRemarkPost = params => { return axios.post(_util.getServerUrl(`${_url}remarks/`), params); };

const myCardSendMsg = params => { return axios.post(_util.getServerUrl(`${_url}send/param/`), params); };

export {
  myCard,
  myCardDetail,
  myCardForm,
  myCardRemark,
  myCardRemarkPost,
  myCardSendMsg
};

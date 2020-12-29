import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/maintcard/";
const _url2 = `${_url}param/`;

const MaintCard = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

// const CardTypePost = params => { return axios.post(_util.getServerUrl(_url2), params) }
//
// const CardTypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params) }

const MaintCardDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const MaintCardDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  MaintCard,
  MaintCardDelete,
  MaintCardDetail
};

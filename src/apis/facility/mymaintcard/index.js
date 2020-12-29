import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/eqp/mymaintcard/";
const _url2 = `${_url}param/`;

const MyMaintCard = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const MyMaintCardPost = params => { return axios.post(_util.getServerUrl("/eqp/main/create/card/"), params); };

const MyMaintCardPut = params => { return axios.put(_util.getServerUrl("/eqp/main/modify/card/"), params); };

const MyMaintCardDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const MyMaintCardDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
  MyMaintCard,
  MyMaintCardPost,
  MyMaintCardPut,
  MyMaintCardDelete,
  MyMaintCardDetail
};

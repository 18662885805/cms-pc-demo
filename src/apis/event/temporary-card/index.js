import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/temporarycard/";
const _url2 = `${_url}param/`;

const temporaryCard = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const temporaryCardPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const temporaryCardPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const temporaryCardDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const temporaryCardDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const temporaryCardDetailInfo = (params) => { return axios.post(_util.getServerUrl("/event/temporary/info/"), params); };

const temporaryCardForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const temporaryCardExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  temporaryCard,
  temporaryCardPost,
  temporaryCardPut,
  temporaryCardDelete,
  temporaryCardDetail,
  temporaryCardForm,
  temporaryCardExcelPost,
  temporaryCardDetailInfo
};

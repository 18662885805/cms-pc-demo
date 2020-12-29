import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/accessory/goods/";
const goods = params => { return axios.get(_util.getServerUrl(_url), { params: params }); };
const goodsSearch = params => { return axios.get(_util.getServerUrl(`${_url}/search/`), { params: params }); };
const goodsDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}param/${id}/`), params); };
const goodsPost = params => { return axios.post(_util.getServerUrl(`${_url}param/`), params); };
const goodsPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url}param/${id}/`), params); };
const goodsDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url}param/${id}/`), params); };
const goodsSubmit = params => { return axios.post(_util.getServerUrl("/accessory/goodsrecord/submit/"), params); };
const goodsApply = params => { return axios.post(_util.getServerUrl("/accessory/goodsrecordaudit/apply/param/"), params); };
const goodsWithdraw = params => { return axios.post(_util.getServerUrl("/accessory/goodsrecordinfo/withdraw/"), params); };
const goodsBack = params => { return axios.post(_util.getServerUrl("/accessory/goodsrecordinfo/back/"), params); };
const goodsReturn = params => { return axios.post(_util.getServerUrl("/accessory/goodsrecordinfo/return/"), params); };

export {
  goods,
  goodsSearch,
  goodsDetail,
  goodsPost,
  goodsPut,
  goodsDelete,
  goodsSubmit,
  goodsApply,
  goodsWithdraw,
  goodsBack,
  goodsReturn
};

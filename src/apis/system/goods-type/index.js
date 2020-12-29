import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/goodstype/";
const _url2 = `${_url}param/`;

const goodsType = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const goodsTypePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project}`), params); };

const goodsTypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const goodsTypeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const goodsTypeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const goodsTypeForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const goodsTypeExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  goodsType,
  goodsTypePost,
  goodsTypePut,
  goodsTypeDelete,
  goodsTypeDetail,
  goodsTypeForm,
  goodsTypeExcelPost
};

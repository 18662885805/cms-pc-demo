import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/cargo/";
const _url2 = `${_url}param/`;

const cargo = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const cargoPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const cargoDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const cargoForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const cargoExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };


const goodsType = params => { return axios.get(_util.getServerUrl(`/event/goodstype/info/`), { params: params }); };

export {
  cargo,
  cargoPost,
  cargoDetail,
  cargoForm,
  cargoExcelPost,
  goodsType
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/viewcargo/";
const _url2 = `${_url}param/`;

const viewCargo = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const viewCargoDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const viewCargoExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  viewCargo,
  viewCargoDetail,
  viewCargoExcelPost
};

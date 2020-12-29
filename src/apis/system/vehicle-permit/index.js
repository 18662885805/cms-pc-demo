import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/vehiclepermit/";
const _url2 = `${_url}param/`;

const vehiclePermit = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const vehiclePermitPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const vehiclePermitPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const vehiclePermitDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const vehiclePermitDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const vehiclePermitForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const vehiclePermitFormExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  vehiclePermit,
  vehiclePermitPost,
  vehiclePermitPut,
  vehiclePermitDelete,
  vehiclePermitDetail,
  vehiclePermitForm,
  vehiclePermitFormExcelPost
};

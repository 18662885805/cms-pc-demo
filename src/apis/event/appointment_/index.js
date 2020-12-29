import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/appointment/";
const _url2 = `${_url}param/`;
const _url3 = "/event/frecontacts/del/";

const appointment = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const appointmentFitPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const appointmentCargoPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const appointmentDelete = params => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/`), params); };

const appointmentDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const appointmentFitForm = params => { return axios.post(_util.getServerUrl(`/form${_url}fit/`), params); };

const appointmentCargoForm = params => { return axios.post(_util.getServerUrl(`/form${_url}cargo/`), params); };

const appointmentExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(`${_url}/disabled/`), params); };

const enabledPost = params => { return axios.post(_util.getServerUrl(`${_url}/enabled/`), params); };

const deleteContact = (params) => { return axios.post(_util.getServerUrl(`${_url3}`), params); };

const advanceEnter = params => { return axios.post(_util.getServerUrl("/event/appointment/sure/"), params); };

const eventDataInfo = params => { return axios.get(_util.getServerUrl("/event/data/info/"), { params: params }); };

export {
  appointment,
  appointmentFitPost,
  appointmentCargoPost,
  appointmentDetail,
  appointmentFitForm,
  appointmentExcelPost,
  appointmentDelete,
  appointmentCargoForm,
  disabledPost,
  enabledPost,
  deleteContact,
  advanceEnter,
  eventDataInfo
};

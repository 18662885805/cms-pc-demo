import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/selfappointment/";
const _url2 = `${_url}param/`;

const selfAppointment = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const selfAppointmentPost = params => { return axios.post(_util.getServerUrl(`${_url}audit/param/`), params); };

const selfAppointmentDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const selfAppointmentExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  selfAppointment,
  selfAppointmentPost,
  selfAppointmentDetail,
  selfAppointmentExcelPost
};

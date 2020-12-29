import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/construction/projectrecord/";
const _url2 = `${_url}param/`;

const projectRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const projectRecordPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const projectRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), params); };

const projectRecordExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

const projectRecordWithDraw = params => { return axios.post(_util.getServerUrl(`${_url}withdraw/`), params); };

const projectRecordBack = params => { return axios.post(_util.getServerUrl(`${_url}back/`), params); };

const projectCheckList = params => { return axios.get(_util.getServerUrl("/construction/checklist/param/"), { params: params }); };
// const projectCheckList = (id, params) => { return axios.get(_util.getServerUrl(`/construction/checklist/param/`), params) }

const projectCheckView = params => { return axios.get(_util.getServerUrl(`/construction/checklist/param/${params.id}/`), { params: { record_id: params.record_id } }); };

const projectCheckPost = params => { return axios.post(_util.getServerUrl("/construction/checklist/param/"), params); };

const projectClose = params => { return axios.post(_util.getServerUrl("/construction/project/closed/"), params); };

const workpermitRecord = params => { return axios.get(_util.getServerUrl("/construction/workpermitrecord/param/"), { params: params }); };

const hangingRecord = params => { return axios.get(_util.getServerUrl("/construction/hangingrecord/param/"), { params: params }); };

const highworkRecord = params => { return axios.get(_util.getServerUrl("/construction/highworkpermitrecord/param/"), { params: params }); };

const hotworkRecord = params => { return axios.get(_util.getServerUrl("/construction/hotworkpermitrecord/param/"), { params: params }); };

const confinedRecord = params => { return axios.get(_util.getServerUrl("/construction/confinedrecord/param/"), { params: params }); };

const ProjectAuditDetail = params => { return axios.post(_util.getServerUrl("/construction/projectrecord/detail/param/"), params); };

const checklistDetail = params => { return axios.get(_util.getServerUrl(`/construction/project/param/${params.id}/`), params); };

const projectDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), params); };

const checklistDelete = params => { return axios.delete(_util.getServerUrl(`/construction/checklist/param/${params.id}/`), { params: { record_id: params.record_id } }); };

export {
  projectRecord,
  projectRecordPost,
  projectRecordDetail,
  projectRecordExcelPost,
  projectRecordWithDraw,
  projectRecordBack,
  projectCheckList,
  projectCheckPost,
  projectClose,
  projectCheckView,
  workpermitRecord,
  hangingRecord,
  highworkRecord,
  hotworkRecord,
  confinedRecord,
  ProjectAuditDetail,
  checklistDetail,
  checklistDelete
};

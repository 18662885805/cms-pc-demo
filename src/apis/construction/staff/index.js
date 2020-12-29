import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/construction/worker/";
const _url2 = `${_url}param/`;

//List
const staff = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//Detail
const staffDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Info
const staffInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

//Add
const staffPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//Edit
const staffPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Delete
const staffDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Submit
const staffSubmit = (id,params) => { return axios.post(_util.getServerUrl(`${_url}sub/?project_id=${id}`), params); };

//Audit
const staffAudit = (id,params) => { return axios.post(_util.getServerUrl(`${_url}audit/param/?project_id=${id}`), params); };

//Recall
const staffRecall = (id,params) => { return axios.post(_util.getServerUrl(`${_url}recall/?project_id=${id}`), params); };

//Back
const staffBack = (id,params) => { return axios.post(_util.getServerUrl(`${_url}back/?project_id=${id}`), params); };

//Pending
const staffPending = params => { return axios.get(_util.getServerUrl(`${_url}pending/param/`), { params: params }); };

//Pending-Detail
const staffPendingDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}pending/param/${params.id}/?project_id=${id}`), { params: params }); };

//Do
const staffDo = params => { return axios.get(_util.getServerUrl(`${_url}pending/param/`), { params: params }); };
//---------------------------------------------------------------------------------------------

const staffForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const staffCertificate = params => { return axios.post(_util.getServerUrl("/construction/upload/staff/"), params); };





export {
  staff,
  staffInfo,
  staffPost,
  staffPut,
  staffDelete,
  staffDetail,
  staffForm,
  staffSubmit,
  staffCertificate,
  staffPending,
  staffPendingDetail,
  staffAudit,
  staffRecall,
  staffBack,
  staffDo
};

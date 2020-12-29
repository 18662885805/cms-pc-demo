import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/accessrecord/";
const _url2 = `${_url}param/`;

const accessRecord = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const accessRecordPost = params => { return axios.post(_util.getServerUrl(`/event/out/param/?project_id=${params.project_id}`), params); };

const accessRecordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const accessRecordRemarks = params => { return axios.get(_util.getServerUrl(`/event/record/remarks/param/`), { params: params }); };

const accessRecordRemarksPost = params => { return axios.post(_util.getServerUrl(`/event/record/remarks/param/?project_id=${params.project_id}`), params); };

const accessRecordInfoPost = params => { return axios.get(_util.getServerUrl(`${_url}info/`), params); };

const accessRecordInfo = (q, type) => { return axios.get(_util.getServerUrl(`${_url}info/?q=${q}&type=${type}`)); };

export {
  accessRecord,
  accessRecordPost,
  accessRecordDetail,
  accessRecordRemarks,
  accessRecordRemarksPost,
  accessRecordInfoPost,
  accessRecordInfo
};

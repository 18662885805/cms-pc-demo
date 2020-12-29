import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/authorization/";
const _url2 = `${_url}param/`;

const authorization = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const authorizationPost = params => { return axios.post(_util.getServerUrl(`/event/out/param/?project_id=${params.project_id}`), params); };

const authorizationDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const enabledPost = params => { return axios.post(_util.getServerUrl(`/event/appointment/status/param/?project_id=${params.project_id}`), params); };

const disabledPost = params => { return axios.post(_util.getServerUrl(`/event/appointment/status/param/?project_id=${params.project_id}`), params); };
// const accessRecordRemarks = params => { return axios.get(_util.getServerUrl(`/event/record/remarks/`), { params: params }); };

// const accessRecordRemarksPost = params => { return axios.post(_util.getServerUrl(`/event/record/remarks/?project_id=${params.project_id}`), params); };

// const accessRecordInfoPost = params => { return axios.get(_util.getServerUrl(`${_url}info/`), params); };

// const accessRecordInfo = (q, type) => { return axios.get(_util.getServerUrl(`${_url}info/?q=${q}&type=${type}`)); };

export {
  authorization,
  authorizationPost,
  authorizationDetail,
  enabledPost,
  disabledPost
};

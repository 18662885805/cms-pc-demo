import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/meeting/minutes/";
const _url2 = `${_url}param/`;

const MeetingMinutes = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const MeetingMinutesPost = params => { return axios.post(_util.getServerUrl(`${_url2}?meeting_type_id=${params.meeting_type}&project_id=${params.project_id}`), params); };

const MeetingMinutesPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const MeetingMinutesDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const MeetingMinutesDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const MeetingMinutesSubmit = params => { return axios.post(_util.getServerUrl(`/meeting/minutes/sub/?project_id=${params.project_id}`), params); };

const MeetingMinutesAudit = params => { return axios.post(_util.getServerUrl(`/meeting/minutes/audit/?project_id=${params.project_id}`), params); };

const TaskCodeSearch = params => { return axios.post(_util.getServerUrl(`/assignment/gettask/?project_id=${params.project_id}`), params); };

export {
  MeetingMinutes,
  MeetingMinutesPost,
  MeetingMinutesPut,
  MeetingMinutesDetail,
  MeetingMinutesDelete,
  MeetingMinutesSubmit,
  MeetingMinutesAudit,
  TaskCodeSearch
};
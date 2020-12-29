import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/meeting/type/";
const _url2 = `${_url}param/`;
const _url3 = `/meeting/type/node/create/`;
const _url4 = `/meeting/type/node/update/`;
const _url5 = `/meeting/type/node/delete/`;

const MeetingType = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const MeetingTypePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const MeetingTypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const MeetingTypeDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const MeetingTypeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

//1级会议类型
const MeetingTypeInfo = params => { return axios.get(_util.getServerUrl(`/meeting/type/info/`), { params: params }); };

//2级会议类型
const MeetingTypeNodeInfo = params => { return axios.get(_util.getServerUrl(`/meeting/type/node/info/`), { params: params }); };

const SubTypePost = params => { return axios.post(_util.getServerUrl(`${_url3}?project_id=${params.project_id}`), params); };

const SubTypePut = params => { return axios.post(_util.getServerUrl(`${_url4}?id=${params.id}&project_id=${params.project_id}`), params); };

const SubTypeDelete = params => { return axios.post(_util.getServerUrl(`${_url5}?id=${params.id}&project_id=${params.project_id}`), params); };

export {
  MeetingType,
  MeetingTypePost,
  MeetingTypePut,
  MeetingTypeDetail,
  MeetingTypeDelete,
  MeetingTypeInfo,
  MeetingTypeNodeInfo,
  SubTypePost,
  SubTypePut,
  SubTypeDelete
};
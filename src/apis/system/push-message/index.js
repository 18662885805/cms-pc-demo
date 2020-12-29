import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/message/";
const _url2 = `${_url}param/`;

const _url3 = "/system/notification/info/";

const pushMessage = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const getMessageTitle = (id, params) => { return axios.get(_util.getServerUrl(`${_url}title/?project_id=${id}`), { params: params }); };

const getMessageContent = (params) => { return axios.get(_util.getServerUrl(`${_url}content/`), { params: params }); };

const pushMessagePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project}`), params); };

const pushMessagePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const pushMessageDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project}`), params); };

const pushMessageDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const disabledpushMessage = params => { return axios.post(_util.getServerUrl(`${_url}disabled/param/`), params); };

const enabledpushMessage = params => { return axios.post(_util.getServerUrl(`${_url}enabled/param/`), params); };

const pushMessageInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), params); };

const msgInfoDetail = id => { return axios.get(_util.getServerUrl(`${_url}info/detail/?id=${id}`)); };

const notificationInfo = params => { return axios.get(_util.getServerUrl(`${_url3}`), params); };

const notificationReadOne = (id, params) => { return axios.get(_util.getServerUrl(`/system/notification/detail/?id=${id}`), params); };
const notificationReadAll = (ids, params) => { return axios.get(_util.getServerUrl(`/system/notification/detail/?ids=${ids}`), params); };

const notificationDeleteOne = (id, params) => { return axios.get(_util.getServerUrl(`/system/notification/del/?id=${id}`), params); };
const notificationDeleteAll = (ids, params) => { return axios.get(_util.getServerUrl(`/system/notification/del/?ids=${ids}`), params); };

const todoDeleteOne = (id, params) => { return axios.get(_util.getServerUrl(`/system/needhandle/del/?id=${id}`), params); };
const todoDeleteAll = (ids, params) => { return axios.get(_util.getServerUrl(`/system/needhandle/del/?ids=${ids}`), params); };

const NoticeMessage = params => { return axios.get(_util.getServerUrl(`/system/notice/param/`), { params: params }); };

const todoList = params => { return axios.get(_util.getServerUrl(`/system/todo/param/`), { params: params }); };

export {
  pushMessage,
  getMessageTitle,
  getMessageContent,
  pushMessagePost,
  pushMessagePut,
  pushMessageDelete,
  pushMessageDetail,
  disabledpushMessage,
  enabledpushMessage,
  pushMessageInfo,
  msgInfoDetail,
  notificationInfo,
  notificationReadOne,
  notificationReadAll,
  notificationDeleteOne,
  notificationDeleteAll,
  todoDeleteOne,
  todoDeleteAll,
  NoticeMessage,
  todoList
};

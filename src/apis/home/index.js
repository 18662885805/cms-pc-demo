import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const logs = params => { return axios.get(_util.getServerUrl("/system/logs/param/"), { params: params }); };

const PropagandaList = params => { return axios.get(_util.getServerUrl("/today/propaganda/list/"), { params: params }); };

const messageList = params => { return axios.get(_util.getServerUrl("/today/message/list/"), { params: params }); };

const SearchStaffTypeByOrg = params => { return axios.get(_util.getServerUrl("/staff/search/staff/type/by/org/"), { params: params }); };

const SearchStaffEntryByOrg = params => { return axios.get(_util.getServerUrl("/staff/search/staff/entry/by/org/"), { params: params }); };

const noticeList = params =>  { return axios.get(_util.getServerUrl("/system/notice/"), { params: params }); };

const todoList = params =>  { return axios.get(_util.getServerUrl("/system/todo/"), { params: params }); };

const todoDelete = (id, params)  =>  { return axios.post(_util.getServerUrl(`/system/todo/delete/?project_id=${id}`), params); };

const noticeDelete = (id, params)  =>  { return axios.post(_util.getServerUrl(`/system/notice/delete/?project_id=${id}`), params); };

const noticeRead = (id, params)  =>  { return axios.post(_util.getServerUrl(`/system/notice/read/?project_id=${id}`), params); };

export {
    logs,
    PropagandaList,
    messageList,
    SearchStaffTypeByOrg,
    SearchStaffEntryByOrg,
    noticeList,
    todoList,
    todoDelete,
    noticeDelete,
    noticeRead 
};

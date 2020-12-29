import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/safety/entryrecord/";
const _url2 = `${_url}param/`;
const _url3 = "/safety/org/entryrecord/param/"
const _url4 = "/safety/all/entryrecord/param/"

//List
const entry = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const orgEntry = params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

const allEntry = params => { return axios.get(_util.getServerUrl(_url4), { params: params }); };

//Detail
const entryDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const orgEntryDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}`), params); };

const allEntryDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url4}${params.id}/?project_id=${id}`), params); };

//Add
const entryPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//Edit
const entryPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Delete
const entryDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//查询员工是否有门禁
const SearchStaffAccessCard = params => { return axios.get(_util.getServerUrl('/safety/access/search/by/staff/'), { params: params }); }; //project_id,staff_id

//登记进场
const EntryRecordIn = params => { return axios.post(_util.getServerUrl('/safety/entry/record/in/'), params); }; //project_id,staff_id,turnstile_id

//登记出场
const EntryRecordOut = params => { return axios.post(_util.getServerUrl('/safety/entry/record/out/'), params); }; //project_id,entry_record_id

//查询组织的人员进出记录
const SearchEntryRecordByOrganization = params => { return axios.get(_util.getServerUrl('/safety/entry/search/by/org/'), { params: params }); }; //project_id,org_id

//查询人员的进出记录
const SearchEntryRecordByStaff = params => { return axios.get(_util.getServerUrl('/safety/entry/search/by/staff/'), { params: params }); }; //project_id,staff_id

//所有记录
const AllEntryList = params => { return axios.get(_util.getServerUrl('/safety/entry/search/all/'), { params: params }); };


const AllEntryList2 = params => { return axios.get(_util.getServerUrl('/safety/my/factoryapply/'), { params: params }); };

export {
    entry,
    entryDelete,
    entryDetail,
    entryPost,
    entryPut,
    SearchStaffAccessCard,
    EntryRecordIn,
    EntryRecordOut,
    SearchEntryRecordByOrganization,
    SearchEntryRecordByStaff,
    AllEntryList,
    AllEntryList2,
    orgEntry,
    orgEntryDetail,
    allEntry,
    allEntryDetail
};

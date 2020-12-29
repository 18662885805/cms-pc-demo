import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/safety/factoryapply/";
const _url2 = `${_url}param/`;

//List
const entrance = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//Detail
const entranceDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Add
const entrancePost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//Edit
const entrancePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Delete
const entranceDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//改组织下所有人，待审批&&已审批
const org_staff = params => { return axios.get(_util.getServerUrl('/staff/search/by/organization/'), { params: params }); };

//绿码审批通过
const FactoryapplyAccess = params => { return axios.post(_util.getServerUrl('/safety/factory/apply/access/'), params); };

//绿码审批未通过
const FactoryapplyDenial = params => { return axios.post(_util.getServerUrl('/safety/factory/apply/denial/'), params); };

//通过列表
const entryAeecssList = params => { return axios.get(_util.getServerUrl('/safety/factory/access/list/'), { params: params }); };//project_id,org_id

//待审批列表
const entryWaitList = params => { return axios.get(_util.getServerUrl('/safety/factory/wait/list/'), { params: params }); };

//绿码审批人1
const orgApprove = params => { return axios.get(_util.getServerUrl('/system/org/approval/info/'), { params: params }); };

//绿码审批人2
const orgApproveList = params => { return axios.get(_util.getServerUrl('/safety/approve/search/by/org/'), { params: params }); };

//training
const EntryTraining = params => { return axios.get(_util.getServerUrl('/training/entry/search/all/'), { params: params }); };

//
const entryPending = params => { return axios.get(_util.getServerUrl('/staff/my/factoryapply/param/'), { params: params }); };

const entryPendingDetail = (id, params) => { return axios.get(_util.getServerUrl(`/staff/my/factoryapply/param/${params.id}/?project_id=${id}`), params); };

const Factoryapply = params => { return axios.get(_util.getServerUrl('/staff/my/factoryapply/param/'), { params: params }); };

const Factoryapply2 = params => { return axios.get(_util.getServerUrl('/staff/list/factoryapply/param/'), { params: params }); };

const FactoryapplyDetail2 = (id, params) => { return axios.get(_util.getServerUrl(`/staff/list/factoryapply/param/${params.id}/?project_id=${id}`), params); };

const FactoryapplyPost2 = (id, params) => { return axios.post(_util.getServerUrl(`/staff/list/factoryapply/param/?project_id=${id}`), params); };

const entranceConfig = params => { return axios.get(_util.getServerUrl('/staff/config/param/'), { params: params }); };

const entranceConfigPost = (id,params) => { return axios.post(_util.getServerUrl(`/staff/config/param/?project_id=${id}`), params); };

const entranceConfigPut = (id,params) => { return axios.put(_util.getServerUrl(`/staff/config/param/${params.id}/?project_id=${id}`), params); };

export {
    entrance,
    entranceDelete,
    entranceDetail,
    entrancePost,
    entrancePut,
    org_staff,
    FactoryapplyAccess,
    FactoryapplyDenial,
    entryAeecssList,
    entryWaitList,
    orgApprove,
    EntryTraining,
    orgApproveList,
    entryPending,
    entryPendingDetail,
    Factoryapply2,
    FactoryapplyDetail2,
    FactoryapplyPost2,
    entranceConfig,
    entranceConfigPost,
    entranceConfigPut
};

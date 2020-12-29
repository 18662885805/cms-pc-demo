import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/staff/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}org/param/`;

//List
const staff = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//Detail
const staffDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Add
const staffPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//Edit
const staffPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Delete
const staffDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//List
const StaffOrg = params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

//Detail
const staffOrgDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&organization_id=${params.organization_id}`), params); };

//Add
const staffOrgPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url3}?project_id=${id}&organization_id=${params.organization_id}`), params); };

//Edit
const staffOrgPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&organization_id=${params.organization_id}`), params); };

//Delete
const staffOrgDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&organization_id=${params.organization_id}`), params); };


//搜索用户
const staffSearch = (id, params) => { return axios.post(_util.getServerUrl(`/system/user/phone/search/?project_id=${id}`), params); };

//获取职务
const workerType = params => { return axios.get(_util.getServerUrl('/system/work/type/info/'),  { params: params }); };

//根据组织ID查询组织员工 project_id,organization_id
const SearchByOrganization = params => { return axios.get(_util.getServerUrl(`${_url}search/by/organization/`), { params: params }); };

//根据职务查询员工 project_id,work_type_id
const SearchByWorkType = params => { return axios.get(_util.getServerUrl(`${_url}search/by/work/type/`), { params: params }); };

//根据人员类型查询员工 project_id,staff_type
const SearchByStaffType = params => { return axios.get(_util.getServerUrl(`${_url}search/by/staff/type/`), { params: params }); };

//查询员工的证件 project_id,staff_id
const SearchStaffCertificate = params => { return axios.get(_util.getServerUrl(`${_url}search/certificate/by/staff/`), { params: params }); };

//组织信息
const OrgList = params => { return axios.get(_util.getServerUrl(`${_url}search/certificate/by/staff/`), { params: params }); };

//角色信息
const RoleList = params => { return axios.get(_util.getServerUrl(`/system/role/info/`), { params: params }); };


//审批通过
const StaffAccess  = params => { return axios.post(_util.getServerUrl(`/staff/access/approve/`), params); };

//审批拒绝
const StaffDenial  = params => { return axios.post(_util.getServerUrl(`/staff/refuse/approve/`), params); };

//待审批员工
const PendingStaff = params => { return axios.get(_util.getServerUrl(`${_url}search/by/org/`), { params: params }); };

const StaffApprove =  params => { return axios.get(_util.getServerUrl(`${_url}approve/param/`), { params: params }); };

const StaffApproveDetail = (id, org_id,params) => { return axios.get(_util.getServerUrl(`${_url}approve/param/${params.id}/?project_id=${id}&organization_id=${org_id}`), { params: params }); };

const ProjecWorkType = params => { return axios.get(_util.getServerUrl('/training/search/work/type/'), { params: params }); };

export {
    staff,
    staffDelete,
    staffDetail,
    staffPost,
    staffPut,

    StaffOrg,
    staffOrgDetail,
    staffOrgPost,
    staffOrgPut,
    staffOrgDelete,

    staffSearch,
    workerType,
    SearchByOrganization,
    SearchByWorkType,
    SearchByStaffType,
    SearchStaffCertificate,
    RoleList,
    StaffAccess,
    StaffDenial,
    PendingStaff,
    StaffApprove,
    StaffApproveDetail,
    ProjecWorkType
};

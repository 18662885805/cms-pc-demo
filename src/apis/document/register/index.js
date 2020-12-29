import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/document/register/";
const _url2 = `${_url}param/`;
const _url3 = "/document/register/document/param/";

const documentRegister = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const documentRegisterDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const documentRegisterPost = (id, params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const documentRegisterPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const documentRegisterDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const documentRegisterInfo = params => { return axios.get(_util.getServerUrl(`/document/directory/info/`), { params: params }); };

//新增子目录
const CreateNodeDirectory =(id, params) => { return axios.post(_util.getServerUrl(`/document/directory/node/create/?project_id=${id}`), params); };

//删除子目录
const DeleteNodeDirectory =(project_id, params) => { return axios.post(_util.getServerUrl(`/document/directory/node/delete/?project_id=${project_id}&id=${params.id}`), params); };

//修改子目录
const UpdateNodeDirectory =(project_id, params) => { return axios.post(_util.getServerUrl(`/document/directory/node/update/?project_id=${project_id}&id=${params.id}`), params); };

//获取子目录
const GetDirectoryNode = params => { return axios.get(_util.getServerUrl('/document/directory/node/info/'), { params: params }); };

//注册区文档
const documentRegisterFile = params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

const documentRegisterFileDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&directory_id=${params.directory}&show_dis=${params.show_dis}`),  params); };

const documentRegisterFilePost = (id, params) => { return axios.post(_util.getServerUrl(`${_url3}?project_id=${id}`), params); };

const documentRegisterFilePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&directory_id=${params.directory}`), params); };

const documentRegisterFileDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&directory_id=${params.directory}`), params); };

const GetTemporaryDocument = params => { return axios.get(_util.getServerUrl('/document/temporary/document/info/'), { params: params }); };

const getRegisterDocument = params => { return axios.get(_util.getServerUrl('/document/register/document/info/'), { params: params }); };

//提交
const SubDocument = (id, params) => { return axios.post(_util.getServerUrl(`/document/register/document/sub/?project_id=${id}`), params); };

//审批
const AuditDocument = (id, params) => { return axios.post(_util.getServerUrl(`/document/register/document/audit/?project_id=${id}`), params); };

//禁用
const DisableDocument = (id, params) => { return axios.post(_util.getServerUrl(`/document/register/document/disabled/?project_id=${id}`), params); };

//替换
const ReplaceDocument = (id, params) => { return axios.post(_util.getServerUrl(`/document/register/document/replace/?project_id=${id}`), params); };

//分享
const SharedDocument = (id, params) => { return axios.post(_util.getServerUrl(`/document/register/document/shared/?project_id=${id}`), params); };

//下载
const DownLoadShare = (params) => { return axios.post(_util.getServerUrl(`/document/register/document/shared/download/`), params); };

//禁用分享
const DisabledShared = (id, params) => { return axios.post(_util.getServerUrl(`/document/register/document/shared/disabled/?project_id=${id}`), params); };

export {
    documentRegister,
    documentRegisterDetail,
    documentRegisterPost,
    documentRegisterPut,
    documentRegisterDelete,
    CreateNodeDirectory,
    GetDirectoryNode,
    documentRegisterFile,
    documentRegisterFilePost,
    documentRegisterFilePut,
    documentRegisterFileDelete,
    GetTemporaryDocument,
    getRegisterDocument,
    SubDocument,
    AuditDocument,
    UpdateNodeDirectory,
    DisableDocument,
    ReplaceDocument,
    DeleteNodeDirectory,
    documentRegisterFileDetail,
    documentRegisterInfo,
    SharedDocument,
    DownLoadShare,
    DisabledShared

};
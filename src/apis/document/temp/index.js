import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/document/temporary/directory/";
const _url2 = `${_url}param/`;
const _url3 = "/document/temporary/document/param/";

const Temporary = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const TemporaryDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const TemporaryPost = (id, params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const TemporaryPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const TemporaryDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const TemporaryDocument = params => { return axios.get(_util.getServerUrl(_url3), { params: params }); };

const TemporaryDocumentDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&directory_id=${params.directory}`), params); };

const TemporaryDocumentPost = (id, params) => { return axios.post(_util.getServerUrl(`${_url3}?project_id=${id}`), params); };

const TemporaryDocumentPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&directory_id=${params.directory}`), params); };

const TemporaryDocumentDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url3}${params.id}/?project_id=${id}&directory_id=${params.directory}`), params); };


export {
    Temporary,
    TemporaryDetail,
    TemporaryPost,
    TemporaryPut,
    TemporaryDelete,
    TemporaryDocument,
    TemporaryDocumentDetail,
    TemporaryDocumentPost,
    TemporaryDocumentPut,
    TemporaryDocumentDelete
};
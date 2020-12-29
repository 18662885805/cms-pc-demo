import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/assignment/record/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

const record = params => { return axios.get(_util.getServerUrl(`${_url2}`), { params: params }); };

const recordPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const recordPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const recordDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const recordDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const recordHandle = (id, params) => { return axios.post(_util.getServerUrl(`/assignment/handle/?project_id=${params.project_id}`), params); };

const recordOrg = params => { return axios.get(_util.getServerUrl(`/assignment/recordorg/param/?project_id=${params.project_id}`), {params:params}); };

const recordAll = params => { return axios.get(_util.getServerUrl(`/assignment/recordall/param/?project_id=${params.project_id}`), {params:params}); };

const recordReviseDate = (params) => { return axios.post(_util.getServerUrl(`/assignment/modifywithrecord/?project_id=${params.project_id}`), params); };

const recordPdf = (params) => { return axios.post(_util.getServerUrl(`/assignment/genpdf/?project_id=${params.project_id}`), params); };

const recordOrgDetail = (id, params) => { return axios.get(_util.getServerUrl(`/assignment/recordorg/param/${id}/?project_id=${params.project_id}`), params); };

const recordAllDetail = (id, params) => { return axios.get(_util.getServerUrl(`/assignment/recordall/param/${id}/?project_id=${params.project_id}`), params); };
export {
    record,
    recordPost,
    recordPut,
    recordDelete,
    recordDetail,
    recordHandle,
    recordOrg,
    recordAll,
    recordReviseDate,
    recordPdf,
    recordOrgDetail,
    recordAllDetail
};

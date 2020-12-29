import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const project_id = _util.getStorage('project_id');

const _url = "/construction/worktype/";
const _url2 = `${_url}param/`;

const workType = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const workTypeInfo = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}?project_id=${id}`), { params: params }); };

const workTypeDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), { params: params }); };

const workTypePost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const workTypePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const workTypeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params) }

export {
    workType,
    workTypeInfo,
    workTypeDetail,
    workTypePost,
    workTypePut,
    workTypeDelete
};
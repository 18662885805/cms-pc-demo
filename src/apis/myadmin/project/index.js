import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/super/project/";
const _url2 = `${_url}param/`;

const project = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const projectDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), { params: params }); };

const projectPermission = params => { return axios.get(_util.getServerUrl(`${_url}permission/`), { params: params }); };

const userSearch = params => { return axios.get(_util.getServerUrl('/super/user/info/'), { params: params }); };

const projectPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const projectPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const projectDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

export {
    project,
    projectPermission,
    userSearch,
    projectPost,
    projectPut,
    projectDelete,
    projectDetail,
};

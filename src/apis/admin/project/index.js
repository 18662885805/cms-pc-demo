import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/admin/project/";
const _url2 = `${_url}param/`;

const project = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const projectDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), { params: params }); };

const userSearch = params => { return axios.get(_util.getServerUrl('/admin/user/info/'), { params: params }); };

const projectPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const AddProjectUser = (id, params) => { return axios.post(_util.getServerUrl(`/admin/project/user/?project_id=${id}`), params); };

export {
    project,
    userSearch,
    projectPut,
    projectDetail,
    AddProjectUser
};
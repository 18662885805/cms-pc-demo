import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/assignment/wait/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

const wait = params => { return axios.get(_util.getServerUrl(`${_url2}`), { params: params }); };

const waitPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const waitPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const waitDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const waitDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

export {
    wait,
    waitPost,
    waitPut,
    waitDelete,
    waitDetail,
};

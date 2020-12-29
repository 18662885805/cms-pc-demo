import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/document/directory/";
const _url2 = `${_url}param/`;

const documentDirectory = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const documentDirectoryDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), { params: params }); };

const documentDirectoryPost = (id, params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const documentDirectoryPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const documentDirectoryDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

export {
    documentDirectory,
    documentDirectoryDetail,
    documentDirectoryPost,
    documentDirectoryPut,
    documentDirectoryDelete
};
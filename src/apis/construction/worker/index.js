import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const project_id = _util.getStorage('project_id');


const _url = "/construction/worker/";
const _url2 = `${_url}param/`;

const worker = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const workerInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

const workerDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), { params: params }); };

const workerPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${project_id}`), params); };

const workerPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const workerDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params) }

export {
    worker,
    workerInfo,
    workerDetail,
    workerPost,
    workerPut,
    workerDelete
};
import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const project_id = _util.getStorage('project_id');

const _url = "/training/start/training/";
const _url2 = `${_url}param/`;


const trainstartList = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const trainstartDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), { params: params }); };

const trainstartPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const trainstartPut = (id,params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const trainstartDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const trainingInfoList =  params => { return axios.get(_util.getServerUrl('/training/info/list/'), { params: params }); };

const DelStartTrainingUser = (id, params) => { return axios.post(_util.getServerUrl(`/training/del/start/user/?project_id=${id}`), params); };




export {
 trainstartList,
 trainstartDetail,
 trainstartPost,
 trainstartPut,
 trainstartDelete,
 trainingInfoList,
 DelStartTrainingUser
};
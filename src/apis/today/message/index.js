import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/today/message/";
const _url2 = `${_url}param/`;


//List
const messageList = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//Detail
const messageDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Add
const messagePost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//Edit
const messagePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Delete
const messageDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };


export {
    messageList,
    messageDetail,
    messagePost,
    messagePut,
    messageDelete
};

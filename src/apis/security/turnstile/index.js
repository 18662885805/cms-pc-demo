import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/system/turnstile/";
const _url2 = `${_url}param/`;

//List
const turnstile = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//Detail
const turnstileDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Add
const turnstilePost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//Edit
const turnstilePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Delete
const turnstileDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };


export {
    turnstile,
    turnstileDelete,
    turnstileDetail,
    turnstilePost,
    turnstilePut
};

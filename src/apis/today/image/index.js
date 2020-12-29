import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/today/propaganda/";
const _url2 = `${_url}param/`;


//List
const imageList = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//Detail
const imageDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Add
const imagePost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

//Edit
const imagePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//Delete
const imageDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };


export {
    imageList,
    imageDetail,
    imagePost,
    imagePut,
    imageDelete
};

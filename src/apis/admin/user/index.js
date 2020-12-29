import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/admin/user/";
const _url2 = `${_url}param/`;

const user = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const userDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), { params: params }); };

const userPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const userPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/`), params); };

const userDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params) }


const disabledPost = params => {
    return axios.post(_util.getServerUrl(`${_url}is_active/`), params);
};
  
const enabledPost = params => {
    return axios.post(_util.getServerUrl(`${_url}is_active/`), params);
};


export {
    user,
    userDetail,
    userPost,
    userPut,
    userDelete,
    disabledPost,
    enabledPost,
};
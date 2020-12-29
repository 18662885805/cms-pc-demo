import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();


const _url = "/training/notice/";
const _url2 = `${_url}param/`;


const notice = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const noticeInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

const noticePost = (id, params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const noticePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const noticeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };


export {
  notice,
  noticeInfo,
  noticePost,
  noticePut,
  noticeDelete,
}
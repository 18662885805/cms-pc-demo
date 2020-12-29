import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const project_id = _util.getStorage('project_id');

const _url = "/training/paper/";
const _url2 = `${_url}param/`;


const papers = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const papersInfo = params => { return axios.get(_util.getServerUrl(`${_url}info/`), { params: params }); };

const papersPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const papersPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const papersDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const papersDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), { params: params }); };

export {
  papers,
  papersInfo,
  papersPost,
  papersPut,
  papersDelete,
  papersDetail,
};

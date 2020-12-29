import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/assignment/type/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}handle/`;

const type = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const typePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const typePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const typeDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const typeInfo = (params) => { return axios.post(_util.getServerUrl(`/assignment/getcates/?project_id=${params.project_id}`), params); };
//const contactSearch = params => { return axios.get(_util.getServerUrl("/workorder/order/contacts/"), { params: params }); };

export {
  type,
  typePost,
  typePut,
  typeDelete,
    typeInfo
};

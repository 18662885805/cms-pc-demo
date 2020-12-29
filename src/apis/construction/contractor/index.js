import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const project_id = _util.getStorage('project_id');

const _url = "/construction/contractor/";
const _url2 = `${_url}param/`;

const contractor = params => {
  return axios.get(_util.getServerUrl(_url2), { params: params });
};

const contractorDetail = (id, params) => {
  return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), { params: params });
};

const contractorPut = (id, params) => {
  return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params);
};




const disabledPost = params => {
  return axios.post(_util.getServerUrl(`${_url}is_active/`), params);
};

const enabledPost = params => {
  return axios.post(_util.getServerUrl(`${_url}is_active/`), params);
};



const contractorPost = params => {
  return axios.post(_util.getServerUrl(_url2), params);
};



const contractorDelete = (id, params) => {
  return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params);
};

const contractorForm = params => {
  return axios.post(_util.getServerUrl(`/form${_url}`), params);
};

const contractorExcelPost = params => {
  return axios.post(_util.getServerUrl(`${_url}excel/param/`), params);
};

const contractorSearch = params => {
  return axios.get(_util.getServerUrl(`${_url}info/`), { params: params });
};



const contractorCodeSearch = params => { return axios.get(_util.getServerUrl("/construction/project/info/"), { params: params }); };

export {
  contractor,
  contractorDetail,
  contractorPost,
  contractorPut,
  contractorDelete,
  contractorForm,
  contractorExcelPost,
  contractorSearch,
  disabledPost,
  enabledPost,
};

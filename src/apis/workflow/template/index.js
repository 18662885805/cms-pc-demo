import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workflow/template/";
const _url2 = `${_url}param/`;

const Template = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const TemplateInfo = params => { return axios.get(_util.getServerUrl(`/workflow/template/info/`), { params: params }); };

const TemplatePost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const TemplatePut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const TemplateDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const TemplateDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

export {
  Template,
  TemplateInfo,
  TemplatePost,
  TemplatePut,
  TemplateDetail,
  TemplateDelete
};

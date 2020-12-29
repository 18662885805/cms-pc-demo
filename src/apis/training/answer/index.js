import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/training/paper/";
const _url2 = `${_url}param/`;

const papers = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const papersPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const papersPut = params => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/`), params); };

const papersDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/`), params); };

const papersDetail = params => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/`), params); };

const trainForm = params => { return axios.post(_util.getServerUrl("/form/training/training/"), params); };

const GetTrainingType = params => { return axios.get(_util.getServerUrl("/form/training/accesstype/info/"), { params: params }); };

const login = params => { return axios.post(_util.getServerUrl("/training/login/"), params); };

const GetMaterials = params => { return axios.get(_util.getServerUrl("/training/material/out/"), { params: params }); };//获取培训资料(PDF+Video)

const examination = params => { return axios.get(_util.getServerUrl("/training/paper/out/"), { params: params }); };//获取考试题目

const examHandIn = params => { return axios.post(_util.getServerUrl("/training/answer/"), params); };//提交考试答案

export {
  papers,
  papersPost,
  papersPut,
  papersDelete,
  papersDetail,
  trainForm,
  GetTrainingType,
  login,
  examination,
  examHandIn,
  GetMaterials
};

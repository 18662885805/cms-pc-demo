import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();


const _url = "/training/management/";
const _url2 = `${_url}param/`;


const trainList = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const trainDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), { params: params }); };

const trainPost = (id,params) => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${id}`), params); };

const trainPut = (id,params) => { return axios.put(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const trainDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

const trainDisabled = (params) => {return axios.post(_util.getServerUrl(`/training/disabled/`), params);};

const trainEnabled = (params) => {return axios.post(_util.getServerUrl(`/training/enabled/`), params);};

//paper-info
const paperInfo = params => { return axios.get(_util.getServerUrl('/training/paper/info/'), { params: params }); };


//material-info
const materialInfo = params => { return axios.get(_util.getServerUrl('/training/material/info/'), { params: params }); };

//培训启动
const startTraining = (id,params) => { return axios.post(_util.getServerUrl(`/training/start/training/param/?project_id=${id}`), params); };


export {
  trainList,
  trainDetail,
  trainPost,
  trainPut,
  trainDelete,
  trainDisabled,
  trainEnabled,
  paperInfo,
  materialInfo,
  startTraining
};
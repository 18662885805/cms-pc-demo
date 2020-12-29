import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/project/";
const _url2 = `${_url}param/`;

const projectConfig = params => { return axios.post(_util.getServerUrl(`/system/settings/param/?project_id=${params.project_id}`), params); };

const projectPut = (id, params) => { return axios.put(_util.getServerUrl(`/system/settings/param/${id}/?project_id=${params.project_id}`), params); };

const projectInfoList = params => { return axios.get(_util.getServerUrl(`/system/settings/param/`), { params: params }); };

const projectInfo = params => { return axios.get(_util.getServerUrl(`/system/settings/param/${params.id}/`), { params: params }); };

const UserProject = params => { return axios.get(_util.getServerUrl(_url), params); };

const projectPermission = params => { return axios.post(_util.getServerUrl(`/system/project/permission/?project_id=${params.project_id}`), params); };

const SwitchProject = params => { return axios.post(_util.getServerUrl(`/system/project/info/?project_id=${params.project_id}`), params); };

export {
  projectInfo,
  projectInfoList,
  projectConfig,
  projectPut,
  UserProject,
  projectPermission,
  SwitchProject
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/workflow/flow/";
const _url2 = `${_url}param/`;
const _url3 = `${_url}info/`;

const flow = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const flowPost = params => { return axios.post(_util.getServerUrl(`${_url2}?project_id=${params.project_id}`), params); };

const flowPut = (id, params) => { return axios.put(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const flowDelete = (id, params) => { return axios.delete(_util.getServerUrl(`${_url2}${id}/?project_id=${params.project_id}`), params); };

const flowDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

const flowForm = params => { return axios.get(_util.getServerUrl('/workflow/form/info/'), { params: params })};

const flowClassification = params => { return axios.get(_util.getServerUrl('/workflow/classification/info/'), { params: params }); };

const flowApproval = params => { return axios.get(_util.getServerUrl('/approval/flow/info/'), { params: params }); };

const flowSearch = params => { return axios.get(_util.getServerUrl('/system/user/info/'), { params: params }); };

const flowRoleInfo = params => { return axios.get(_util.getServerUrl('/system/org/type/info/'), { params: params }); };

export {
  flow,
  flowPost,
  flowPut,
  flowDelete,
  flowDetail,
    flowForm,
flowApproval,
    flowClassification,
    flowSearch,
    flowRoleInfo
};

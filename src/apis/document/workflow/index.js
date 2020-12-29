import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/document/workflow/";
const _url2 = `${_url}param/`;


const WorkflowFile = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const WorkflowFileDetail = (id,params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`),params); };

const WorkflowInfo = params => { return axios.get(_util.getServerUrl('/workflow/flow/info/'), { params: params }); };

const WorkflowRecord = params => { return axios.get(_util.getServerUrl('/workflow/record/info/'), { params: params }); };




export {
    WorkflowFile,
    WorkflowInfo,
    WorkflowRecord,
    WorkflowFileDetail,
};
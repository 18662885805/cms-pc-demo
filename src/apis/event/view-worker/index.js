import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/viewworker/";
const _url2 = `${_url}param/`;

const viewWorker = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

const viewWorkerDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${id}/`), { params: params }); };

// const viewWorkerExcelPost = params => { return axios.post(_util.getServerUrl(`${_url}excel/param/`), params); };

export {
  viewWorker,
  viewWorkerDetail,
  // viewWorkerExcelPost
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/user/search/";

const interviewee = params => { return axios.get(_util.getServerUrl(`/system/user/search/`), { params: params }); };

export {
  interviewee
};

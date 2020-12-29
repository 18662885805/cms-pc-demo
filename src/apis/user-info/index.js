import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const userInfoForm = params => { return axios.post(_util.getServerUrl("/form/system/user/info/"), params); };

const userInfoPost = params => { return axios.post(_util.getServerUrl("/system/user/info/"), params); };

export {
  userInfoForm,
  userInfoPost
};

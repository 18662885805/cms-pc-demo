import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const passwordPost = params => { return axios.post(_util.getServerUrl("/system/password/"), params); };

export {
  passwordPost
};

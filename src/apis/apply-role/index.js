import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const applyRoleAdd = params => { return axios.post(_util.getServerUrl("/system/applyrole/add/"), params); };

export {
  applyRoleAdd
};

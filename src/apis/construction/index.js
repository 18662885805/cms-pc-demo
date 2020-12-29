import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const getConstructionChart = params => { return axios.post(_util.getServerUrl("/construction/dashboard/"), params); };

export {
  getConstructionChart
};

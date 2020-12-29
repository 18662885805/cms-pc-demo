import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const getOrderChart = params => { return axios.post(_util.getServerUrl("/workorder/dashboard/"), params); };

const postOrderChart = params => { return axios.post(_util.getServerUrl("/workorder/order/charts/"), params);};

const postOrderChartNew = params => { return axios.post(_util.getServerUrl('/hotline/order/charts2020/'), params) }

export {
    getOrderChart,
    postOrderChart,
    postOrderChartNew
};

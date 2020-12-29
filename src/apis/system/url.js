import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/system/url/";

const getURL = params => { return axios.get(_util.getServerUrl(_url), { params: params }); };

export {
    getURL,
};
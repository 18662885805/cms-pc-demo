import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/event/visitor/";

const visitor = params => { return axios.get(_util.getServerUrl(_url), { params: params }); };

const visitorNew = params => { return axios.get(_util.getServerUrl("/event/visitor/app/"), { params: params }); };

export {
  visitor,
  visitorNew
};

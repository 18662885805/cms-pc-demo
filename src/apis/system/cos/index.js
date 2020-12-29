import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/cos/source/";

export const getCosSourse = (params) =>
  axios.get(_util.getServerUrl(_url), { params: params });

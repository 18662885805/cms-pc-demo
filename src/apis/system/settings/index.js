import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/system/settings/";
const _url2 = `${_url}param/`;

const settingsPost = params => { return axios.post(_util.getServerUrl(_url2), params); };

const settingsForm = params => { return axios.post(_util.getServerUrl(`/form${_url}`), params); };

const settingCarousel = params => { return axios.get(_util.getServerUrl("/system/carouse"), { params: params }); };

export {
  settingsForm,
  settingsPost,
  settingCarousel
};

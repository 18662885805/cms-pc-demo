import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/upload/person/";

const savePeoplePhoto = params => { return axios.post(_util.getServerUrl(`${_url}photo/`), params); };

const savePeopleBelongs = params => { return axios.post(_util.getServerUrl(`${_url}belongs/`), params); };

export {
  savePeoplePhoto,
  savePeopleBelongs
};

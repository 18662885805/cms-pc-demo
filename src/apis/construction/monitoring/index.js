import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/construction/viewlistener/";
const _url2 = `${_url}param/`;

const Listener = params => { return axios.get(_util.getServerUrl("/construction/viewlistener/param/"), { params: params }); };
const ListenerChild = params => { return axios.get(_util.getServerUrl("/construction/viewlistener/child/"), { params: params }); };

const ListenerDetail = params => { return axios.post(_util.getServerUrl("/construction/viewlistener/detail/param/"), params); };

export {
  Listener,
  ListenerChild,
  ListenerDetail
};

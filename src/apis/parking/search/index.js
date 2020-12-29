import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

// const _url = '/parking/area/'
// const _url2 = `${_url}param/`

const MyCarSearch = params => { return axios.get(_util.getServerUrl("/parking/car/search/mine/"), { params: params }); };

const CarSearch = params => { return axios.get(_util.getServerUrl("/parking/car/search/by/no/param/"), { params: params }); };

export {
  MyCarSearch,
  CarSearch
};

import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const getCarryoutChart = params => { return axios.post(_util.getServerUrl("/carryout/dashboard/"), params); };

const goodsSetting = params => { return axios.get(_util.getServerUrl("/carryout/settings/param/"), { params: params }); };

const goodsSettingRevise = params => { return axios.post(_util.getServerUrl("/carryout/settings/edit/param/"), params); };

const goodsSettingAll = params => { return axios.get(_util.getServerUrl("/carryout/settings/all/"), { params: params }); };

export {
  getCarryoutChart,
  goodsSetting,
  goodsSettingRevise,
  goodsSettingAll
};

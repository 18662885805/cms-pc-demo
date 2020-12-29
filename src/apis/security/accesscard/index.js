import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const _url = "/safety/accesscard/";
const _url2 = `${_url}param/`;

//List
const accessCard = params => { return axios.get(_util.getServerUrl(_url2), { params: params }); };

//Detail
const accessCardDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url2}${params.id}/?project_id=${id}`), params); };

//启用
const enableAccess =(params)  => { return axios.post(_util.getServerUrl(`/safety/access/card/enabled/`), params); };

//禁用
const disableAccess =(params) => { return axios.post(_util.getServerUrl(`/safety/access/card/disabled/`), params); };

//所有可入场人员
const AllApplyList = params => { return axios.get(_util.getServerUrl(`/safety/factory/access/all/list/`), { params: params }); };


const AllApplyListDetail = (id, params) => { return axios.get(_util.getServerUrl(`/safety/factory/access/all/list/${params.id}/?project_id=${id}`),  params); };

const FactoryApply = params => { return axios.get(_util.getServerUrl(`/safety/list/factoryapply/param/`), { params: params }); };

const FactoryApplyDetail = (id, params) => { return axios.get(_util.getServerUrl(`/safety/list/factoryapply/param/${params.id}/?project_id=${id}`),  params); };

const accessCardEnable = params => { return axios.get(_util.getServerUrl(`/safety/enabled/accesscard/param/`), { params: params }); };

const accessCardEnableDetail = (id, params) => { return axios.get(_util.getServerUrl(`/safety/enabled/accesscard/param/${params.id}/?project_id=${id}`), params); };
export {
    accessCard,
    accessCardDetail,
    enableAccess,
    disableAccess,
    AllApplyList,
    AllApplyListDetail,
    FactoryApply,
    FactoryApplyDetail,
    accessCardEnable,
    accessCardEnableDetail
};
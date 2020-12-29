import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

const _url = "/today/";

const Barometer = params => { return axios.get(_util.getServerUrl(`${_url}barometer/param/`), { params: params }); };

const BarometerRecordDetail = params => { return axios.get(_util.getServerUrl(`${_url}barometer/report/info/`), { params: params }); };

const BarometerDetail = (id, params) => { return axios.get(_util.getServerUrl(`${_url}barometer/param/${params.id}/?project_id=${id}`), { params: params }); };

const BarometerRecord = params => { return axios.get(_util.getServerUrl(`${_url}barometerrecords/param/`), { params: params }); };

const DailyCreateProjectBarometer = params => { return axios.get(_util.getServerUrl(`${_url}barometer/daily/`), { params: params }); };

const HourlyCreateProjectBarometerRecord = params => { return axios.get(_util.getServerUrl(`${_url}barometer/hourly/save/`), { params: params }); };

const SearchProjectBarometer = params => { return axios.get(_util.getServerUrl(`${_url}barometer/search/by/project/`), { params: params }); };

const WeatherReport = params => { return axios.get(_util.getServerUrl(`${_url}barometer/report/`), { params: params }); };

export {
    Barometer,
    BarometerRecordDetail,
    BarometerDetail,
    BarometerRecord,
    DailyCreateProjectBarometer,
    HourlyCreateProjectBarometerRecord,
    SearchProjectBarometer,
    WeatherReport
};

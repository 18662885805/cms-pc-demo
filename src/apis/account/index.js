import axios from "axios";
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

//ECMS
const login = params => { return axios.post(_util.getServerUrl("/account/login/"), params); };

const refreshToken = params => { return axios.post(_util.getServerUrl("/account/refresh/"), params); };

const register = (project_id,params) => { return axios.post(_util.getServerUrl(`/account/register/?project_id=${project_id}`), params); };

const privacy = params => { return axios.get(_util.getServerUrl("/account/privacy/"), { params: params }); };

const MsgCode = params => { return axios.post(_util.getServerUrl("/account/code/"), params); };

const VerifyCode = params => { return axios.post(_util.getServerUrl("/account/code/verify/"), params); };

const logout = params => { return axios.post(_util.getServerUrl("/account/logout/"), params); };

const AccountProject = params => { return axios.get(_util.getServerUrl("/account/project/"), { params: params }); };

const ForgetPwd = params => { return axios.post(_util.getServerUrl("/account/pwd/"), params); };

const ChangePhone = params => { return axios.post(_util.getServerUrl("/system/user/phone/change/"), params); };

const CodeImg = params => { return axios.get(_util.getServerUrl("/account/verification_code/"), { params: params }); };

const GetTemporaryKey = params => { return axios.get(_util.getServerUrl("/account/temporary/key/"), { params: params }); };

const changePwd = params => { return axios.post(_util.getServerUrl("/system/pwd/"), params); };

export {
  login,
  logout,
  register,
  refreshToken,
  privacy,
  MsgCode,
  VerifyCode,
  AccountProject,
  ForgetPwd,
  ChangePhone,
  CodeImg,
  GetTemporaryKey,
  changePwd
};

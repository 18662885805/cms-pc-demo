import axios from "axios";
import qs from "qs";
import CommonUtil from "@utils/common";
import appState from "../store/app-state";
import menuState from "../store/menu-state";
import moment from "moment";
import reqwest from "reqwest";

const _util = new CommonUtil();
const noLoginPath = [
  "/login",
  "/forget",
  "/forget/step/two",
];

window.isRefreshing = false;

/*是否正在刷新的标志*/
window.isRefreshing = false;
/*存储请求的数组*/
let refreshSubscribers = [];

/*将所有的请求都push到数组中,其实数组是[function(token){}, function(token){},...]*/
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}
/*数组中的请求得到新的token之后自执行，用新的token去请求数据*/
function onRrefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
}

function isAccessTokenExpired() {
  let lastLogin = _util.getStorage("lastLogin");

  if (lastLogin) {
    let isExpired = moment().isSame(moment(lastLogin).add(6, "d"), "days");

    return isExpired;
  }

  // if (lastLogin) {
  //     let isExpired = moment().isSame(moment(lastLogin).add(1, 'm'), 'minute')

  //     return isExpired
  // }

}

let refreshTokenUrl = "/account/login/";

axios.interceptors.request.use(
  config => {
    if (config.method === "put" || config.method === "post" || config.method === "delete") {
      menuState.changeFetching(true);
    }

    const { pathname } = appState.routingStore.location;
    if (noLoginPath.indexOf(pathname) < 0) {
      let userInfo = _util.getStorage("userInfo");
      if (userInfo) {
        if (userInfo.need_change_password) {
          appState.setResponseStatus("needresetpassword");
        }
      }
    }
    let token = _util.getStorage("token");

    if (token) {
      if (isAccessTokenExpired() && config.url !== refreshTokenUrl) {
        if (!window.isRefreshing) {
          window.isRefreshing = true;
          reqwest({
            url: _util.getServerUrl("/account/refresh/"),
            method: "post",
            data: {
              refresh:token
            },
            type: "json",
            headers: {
              "Authorization": "JWT " + token
            },
            success: function (res) {
              window.isRefreshing = false;
              const newToken = res.token;

              _util.setStorage("token", res.token);
              _util.setStorage("userInfo", res.user);
              _util.setStorage("lastLogin", Date.now());
              onRrefreshed(newToken);
              refreshSubscribers = [];
            }
          });
        }
        let retry = new Promise((resolve, reject) => {
          subscribeTokenRefresh(token => {
            config.headers.Authorization = "JWT " + token;
            if (config.method === "get" || config.method === "delete") {
              config.params = {
                ...config.params
              };
            } else {
              let data = qs.parse(config.data);
              config.data = qs.stringify({
                ...data
              });
            }
            resolve(config);
          });
        });
        return retry;

      } else {
        config.headers.Authorization = "JWT " + token;
        if (config.method === "get" || config.method === "delete") {
          config.params = {
            ...config.params
          };
        } else {
          let data = qs.parse(config.data);
          config.data = qs.stringify({
            ...data
          });
        }
        return config;

        
        // if (isAccessTokenExpired() && config.url !== refreshTokenUrl) {
        //   if (!window.isRefreshing) {
        //     window.isRefreshing = true
        //     reqwest({
        //       url: _util.getServerUrl('/account/refresh/'),
        //       method: 'post',
        //       data: {
        //         site_id,
        //         token
        //       },
        //       type: 'json',
        //       headers: {
        //         'Authorization': 'JWT ' + token
        //       },
        //       success: function (res) {
        //         window.isRefreshing = false
        //         const newToken = res.token

        //         _util.setStorage('token', res.token)
        //         _util.setStorage('userInfo', res.user)
        //         _util.setStorage('lastLogin', Date.now())
        //         onRrefreshed(newToken)
        //         refreshSubscribers = []
        //       }
        //     })
        //   }
        //   let retry = new Promise((resolve, reject) => {
        //     subscribeTokenRefresh(token => {
        //       config.headers.Authorization = 'JWT ' + token
        //       if (config.method === 'get' || config.method === 'delete') {
        //         config.params = {
        //           site_id: site_id,
        //           ...config.params
        //         }
        //       } else {
        //         let data = qs.parse(config.data)
        //         config.data = qs.stringify({
        //           site_id: site_id,
        //           ...data
        //         })
        //       }
        //       resolve(config)
        //     })
        //   })
        //   return retry

        // } else {
        //   config.headers.Authorization = 'JWT ' + token
        //   if (config.method === 'get' || config.method === 'delete') {
        //     config.params = {
        //       site_id: site_id,
        //       ...config.params
        //     }
        //   } else {
        //     let data = qs.parse(config.data)
        //     config.data = qs.stringify({
        //       site_id: site_id,
        //       ...data
        //     })
        //   }
        //   return config
        // }
      }
    } else {
      return config;
    }
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  res => {
    menuState.changeFetching(false);
    const { status, data } = res
    if (_util.isPlainObject(res)) {
      return Promise.resolve(res);
    }
  },
  error => {
    menuState.changeFetching(false);
    let res = error.response;
    switch (res && res.status) {
      case 400:
        _util.responseError(res.data);
        return Promise.reject(error);
      case 401:
        _util.responseError(res.data);
        appState.setResponseStatus(401);
        return Promise.reject(error);
      case 403:
        _util.responseError(res.data);
        appState.setResponseStatus(403);
        return Promise.reject(error);
      case 404:
        _util.responseError("404");
        appState.setResponseStatus(404);
        break;
      case 500:
        _util.responseError("服务器错误");
        appState.setResponseStatus(500);
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);


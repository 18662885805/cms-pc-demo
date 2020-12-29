const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/v1",
    proxy({
      target: "https://testpc.mjk24.com",
      //target: "http://192.168.2.2:8000",  //刘璟的服务器
      // target: "http://192.168.2.31:8000",
      // target: "http://111.229.211.112:9000",
      changeOrigin: true
    })
  );
  // app.use(proxy('/v1', {
  //   target: 'https://efm.mjk24.com',
  //   secure: false,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     "^/v1": "/"
  //   }
  // }))
};
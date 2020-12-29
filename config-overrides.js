// const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const path = require('path')
const webpack = require('webpack')
const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer')
const {
  addDecoratorsLegacy,
  fixBabelImports,
  addLessLoader,
  disableEsLint
} = require("customize-cra");
// const { getBabelLoader } = require('react-app-rewired');

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

function removePreWorkboxWebpackPluginConfig (config) {
  const preWorkboxPluginIndex = config.plugins.findIndex((element) => {
    return Object.getPrototypeOf(element).constructor.name === 'GenerateSW'
  })
  if (preWorkboxPluginIndex !== -1) {
    config.plugins.splice(preWorkboxPluginIndex, 1)
  }
  return config
}

module.exports = function override(config, env) {
    // const { CommonsChunkPlugin } = webpack.optimize;
    // var commonsChunkPluginCommon = new CommonsChunkPlugin({
    //     children: true,
    //     async: 'common',
    //     minChunks: 2,
    //   });
    //   var commonsChunkPluginVendor =  new CommonsChunkPlugin({
    //     children: true,
    //     async: 'vendor',
    //     minChunks: function(module) {
    //       return module.context && module.context.indexOf('node_modules') !== -1;
    //     },
    //   });
    
    //   config.plugins.push(commonsChunkPluginCommon);
    //   config.plugins.push(commonsChunkPluginVendor);
    config = addDecoratorsLegacy()(config);
    config = disableEsLint()(config);
    config = fixBabelImports("import", {
        libraryName: "antd", libraryDirectory: "es", style: true // change importing css to less
    })(config);
    config = addLessLoader({javascriptEnabled: true, modifyVars: { "@primary-color": "#1890ff" }})(config);

    // config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);   //引入样式为 less
    // config = injectBabelPlugin(['transform-decorators-legacy'], config);
    // config = rewireLess.withLoaderOptions({
    //     javascriptEnabled: true,
    //     modifyVars: { "@primary-color": "#1890ff" },
    // })(config, env);
    // config = rewireLess.withLoaderOptions({
    //     modifyVars: {"@primary-color": "#1890ff"},
    // })(config, env);
    if (env === 'production') {
        config = rewireWebpackBundleAnalyzer(config, env, {
          analyzerMode: 'static',
          reportFilename: 'report.html'
        })
        // 删除默认的WorkboxWebpackPlugin配置
        config = removePreWorkboxWebpackPluginConfig(config)
      }
    config.resolve.alias = {
        '@view': resolve('src/view'),
        '@component': resolve('src/component'),
        '@utils': resolve('src/utils'),
        '@apis': resolve('src/apis')
    }

    // const babelLoader = getBabelLoader(config.module.rules);
    // const pwd = path.resolve();
    // babelLoader.include = [path.normalize(`${pwd}/src`)];
    // // use babelrc
    // babelLoader.options.babelrc = true;

    return config
}

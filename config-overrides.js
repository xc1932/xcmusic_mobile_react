const path = require('path');
const {
  override,
  addWebpackAlias, //路径别名
  addLessLoader,   //less配置
  adjustStyleLoaders,
  addWebpackModuleRule,
} = require('customize-cra');

module.exports = override(
  (config) => ({
    ...config,
    devtool: config.mode === 'development' ? 'cheap-module-source-map' : false,
  }),
  addWebpackAlias({
    '@': path.resolve(__dirname, './src'),
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      localIdentName: '[local]--[hash:base64:5]',
    },
  }),
  adjustStyleLoaders(({ use: [, , postcss] }) => {
    const postcssOptions = postcss.options;
    postcss.options = { postcssOptions };
  }),
  addWebpackModuleRule({
    test: /\.less$/,
    exclude: /\.module\.less$/,
    use: [
      {
        loader: require.resolve('style-loader'),
      },
      {
        loader: require.resolve('css-loader'),
      },
      {
        loader: require.resolve('less-loader'),
      },
      {
        loader: 'style-resources-loader',
        options: {
          patterns: path.resolve(__dirname, 'src/assets/less/public.less')//全局引入公共的less文件
        }
      }
    ]
  }),
  addWebpackModuleRule({
    test: /\.module.less$/,
    use: [
      {
        loader: require.resolve('style-loader'),
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            localIdentName: '[local]_[hash:8]'
          }
        }
      },
      {
        loader: require.resolve('less-loader'),
      }
    ]
  }),
);
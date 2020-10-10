const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const webpack = require('webpack')

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');

//配置模式，有两个单词可以选择
//development开发模式，代码不会混淆、压缩；
//production生产模式，项目上线的时候要使用的模式。

module.exports = function (env) {
  const extractLess = new MiniCssExtractPlugin({
    //被提取的页面css
    filename: (env.production ? "css/" : "") + `[name].[contenthash:8].css`,
    //被提取公共模块的css
    chunkFilename: (env.production ? "css/" : "") + "[name].[contenthash:8].css"
  });
  let cssLoader = ['css-loader'];
  if (env.production) {
    cssLoader.push({
      loader: "postcss-loader"
    })
    cssLoader.unshift({
      loader: MiniCssExtractPlugin.loader,
      options: {
        //设置css里url()的相对位置
        publicPath: "../",
        // if hmr does not work, this is a forceful method.
        //reloadAll: true,
      }
    })
  } else {
    cssLoader.unshift('style-loader')
  }

  let configs = [];
  let languages = [{
    lang: 'en',
    title: "Oil Painting Master",
    path: "",
    showLanguagesSelect: true
  }]


  languages.forEach((language, index) => {
    let lang = language.lang;
    let config = {
      entry: {
        'index': [
          './src/pages/index/index.ts']
      },

      devtool: env.production ? "source-map" : 'inline-source-map',
      //配置模式，有两个单词可以选择
      //development开发模式，代码不会混淆、压缩；
      //production生产模式，项目上线的时候要使用的模式。
      mode: env.production ? "production" : "development",
      output: {
        filename: !env.production ? "js/[name].bundle.[hash:8].js" : "js/[name].bundle.[contenthash:8].js",
        chunkFilename: !env.production ? "js/[name].bundle.[hash:8].js" : 'js/[name].bundle.[contenthash:8].js',
        path: path.resolve(__dirname, 'dist/')
      },
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': path.resolve(__dirname, 'src/')
        },

        extensions: ['.ts', '.vue', '.js']
      },
      optimization: {
        minimizer: env.production ? [new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              // 不生成内联映射,这样配置就会生成一个source-map文件
              inline: false,
              // 向css文件添加source-map路径注释
              // 如果没有此项压缩后的css会去除source-map路径注释
              annotation: true
            }
          }
        }), new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true, // Must be set to true if using source-maps in production
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          }
        })] : [],
        splitChunks: env.production ? {
          chunks: 'all', //块的范围，有三个可选值：initial/async动态异步加载/all全部块(推荐)，默认为async;
          minSize: 30000, // 提取出的新chunk在两次压缩(打包压缩和服务器压缩)之前要大于30kb
          maxSize: 0, // 提取出的新chunk在两次压缩之前要小于多少kb，默认为0，即不做限制
          minChunks: 1, // 被提取的chunk最少需要被多少chunks共同引入
          maxAsyncRequests: 5, // 最大按需载入chunks提取数
          maxInitialRequests: 3, // 最大初始同步chunks提取数
          automaticNameDelimiter: '~', // 默认的命名规则（使用~进行连接）
          name: true,

          cacheGroups: { // 缓存组配置，默认有vendors和default
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        } : false
      },
      plugins: [
        new VueLoaderPlugin(),
        extractLess,
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
          APIURL: "'//example.com/'"
        }),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
        })
      ],
      devServer: {
        host: "0.0.0.0",
        port: 8080
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: [{
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/]
              }
            }]
          },
          {
            test: /\.js$/,
            use: [{
              loader: 'webpack-replace-loader',
              options: {
                arr: [
                  { search: '#{lang}', replace: lang, attr: 'g' }
                ]
              }
            }],
          },
          {
            test: /\.vue$/,
            use: [{
              loader: 'webpack-replace-loader',
              options: {
                arr: [
                  { search: '#{lang}', replace: lang, attr: 'g' }
                ]
              }
            }, {
              loader: 'vue-loader',
              options: {
                publicPath: "../"
              }
            }],
          },
          {
            test: /\.css$/,
            use: cssLoader
          },
          {
            test: /\.less$/,
            use: cssLoader.concat(['less-loader'])
          }
          ,
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
              loader: 'url-loader',
              options: {
                esModule: false,
                limit: 5 * 1024, // 图片大小 > limit 使用file-loader, 反之使用url-loader
                emitFile: index == 0,
                outputPath: 'images/',// 指定打包后的图片位置
                // publicPath: function (url, resourcePath, context) {
                //   console.log(url, resourcePath, context)
                //   return env.production ? `${language.imagePath}` : ""
                // }
                publicPath: env.production && language.imagePath ? `${language.imagePath}` : undefined
              }
            }]
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              'file-loader'
            ]
          }
        ]
      }
    };
    //为每一个入口生成一个html文件
    for (let filename in config.entry) {
      let conf = {
        title: language.title,
        filename: env.production ? `${language.path === undefined ? lang + "/" : language.path}${filename}.html` : `${filename}.html`,
        template: `./src/pages/${filename}/template.html`,
        chunks: [filename]
      }
      config.plugins.push(new HtmlWebpackPlugin(conf))
    }

    configs.push(config);
  })
  if (env.production) {

    return configs

  } else {

    return configs[0]

  }

}
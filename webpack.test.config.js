const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: ['./test/index_1.ts'],
  devtool: 'inline-source-map',
  //配置模式，有两个单词可以选择
  //development开发模式，代码不会混淆、压缩；
  //production生产模式，项目上线的时候要使用的模式。
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src/')
    },

    extensions: ['.ts', '.vue', '.js']
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
        title:"智媒云图"
    })
  ],
  devServer: {
    host:"0.0.0.0",
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
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
      ,
      {
        test: /\.html$/,
        use: ['file-loader']
      }
      ,

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
           options: {
             esModule:false,
             limit: 5 * 1024, // 图片大小 > limit 使用file-loader, 反之使用url-loader
             outputPath: 'images/' // 指定打包后的图片位置
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
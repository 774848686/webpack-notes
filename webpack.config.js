const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //注意使用这个插件时候 要手动对js进行压缩（terser-webpack-plugin）
const TerserJSPlugin = require('terser-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const md = require('./util/readMdSyn');
/**
 *  webpack的几个小插件:
 *    cleanWebpackPlugin //清除文件
 *    copyWebpackPlugin // 拷贝文件
 *    bannerPlugin // 在打包后添加一些说明； 可以用作每次发版内容记录
 */
/**
 * 思考：为什么npm run dev 没有生成对应的js以及css文件，却能访问到对用的资源；是因为webpack将其放入到了缓存中；
 */
module.exports = {
  devServer: {
    port: 3001,
    progress: true,
    // open: true
  },
  mode: 'production', // 模式，默认两种 production和 development
  entry: './src/index.js', // 入口
  devtool: 'source-map',
  // source-map 打包后，对出错信息进行文件映射 方便调试源码
  // eval-source-map 显示行列号 不会产生映射文件
  // watch:false, // 为true 时时编译打包。false 不进行时时监控
  // watchOptions:{ // 监控的选项
  //   poll:1000,// 多久监听一次
  //   aggregaTimeout:500,// 防抖 多久进行一次更新
  //   ignored:/node_modules/// 忽略监听文件
  // },
  output: {
    filename: 'js/main.[hash].js', // 打包后的文件名
    path: path.resolve(__dirname, 'dist'), // 路径必须是一个绝对
    publicPath: '/' // dev 环境下'/' 打包时候要用其他 比如'./'
  },
  module: {
    rules: [{
        test: /\.html$/,
        use: [{
          loader: "html-loader",
        }]
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }],
        exclude: /(node_modules)/
      },
      {
        test: /.md$/,
        use: [{
          loader: 'text-loader',
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader', // url-loader 可对图片进行限制 以及转成base64 file-loader 则对图片进行正常产出
          options: {
            limit: 8 * 1024, // 大于200kb 则正常产出图片
            outputPath: '/img/',
            // publicPath: '', //可对图片进行单独cdn 前缀
          }
        }]
      },
      {
        // css-loader 主要是解析@import引入 style-loader 主要是插入到style中 MiniCssExtractPlugin.loader 抽离到link中
        // postcss-loader autoprefixer 是为了添加前缀；
        test: /\.css$/,
        // use:['style-loader','css-loader'], //第一种写法
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        // 处理 less sass stylus
        test: /\.less$/,
        use: [
          //   {
          //   loader:'style-loader',
          //   options:{

          //   }
          // },
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ],
  },
  // 优化项
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  //放置webpack 所有的插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css' //文件产出
    }),
    new CleanWebpackPlugin( // 可以都不传，默认是删除output.path 下的文件
      {
        dry: false, // 默认false dry为true时，模拟删除，加删除，不会真的删掉文件
        verbose: false, // 默认false verbose为true时 显示日志， 当dry为true时，总是会打印日志，不管verbose是什么值
        cleanStaleWebpackAssets: true, //#自动删除未被使用的webpack资源 #
        cleanOnceBeforeBuildPatterns: ['**/*', "!img", path.resolve(__dirname, 'dist')]
        // cleanOnceBeforeBuildPatterns打包前做的一些事，#忽略掉不需要删除的文件，
        // 相当于exclude,被忽略的文件需要在开头加上 "!"号，数组中必须带有"**/*"通配符#否则dist下的文件都不会被删除
        //# 删除指定文件/文件夹 path.resolve(__dirname, 'test')
      }),
    new CopyWebpackPlugin([{
      from: './doc',
      to: './doc'
    }]),
    new webpack.BannerPlugin({
      banner: () => {
        let str = ' ';
        Object.keys(md).map(key => {
          if (key !== 'content') {
            return str += md[key]+' '
          }
        })
        return str;
      },
      // include: '',
      // exclude: '',
    })
  ]
}
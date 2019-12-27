const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'word-relay-setting',
  mode: 'development', // 실 서비스: production
  devtool: 'eval',
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  
  // 입력을 받아서
  entry: {
    app: [ './client' ]
  },

  // 모듈을 적용해서
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1% in KR'],
            },
            debug: true,
          }], 
          '@babel/preset-react'],
        plugins: [
          "@babel/plugin-proposal-class-properties",
          "react-hot-loader/babel"
        ],
      },
    }]
  },

  // 추가할 확장기능들을 적용해서~
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true }),
  ],

  // 출력으로 뺀다~ webpack-dev-server를 쓰면 output은 지가 알아서 처리한다.
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/dist/',
  },


}
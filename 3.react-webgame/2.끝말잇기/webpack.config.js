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
      test: /\.jsx?/, 
      loader: 'babel-loader',
      
      // plugin들의 모음이 presets이다.
      options: {
        presets: [ ['@babel/preset-env', {
          targets: {
            browsers: ['> 5% in KR', 'last 2 chrome versions'],
          },
          debug: true,
        }], 
        '@babel/preset-react' 
      ],
        plugins: [],
      },
    }],
  },

  // 추가할 확장기능들을 적용해서~
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true }),
  ],

  // 출력으로 뺀다~
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js'
  },


}
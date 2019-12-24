const path = require('path');

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
      options: {
        presets: [ '@babel/preset-env', '@babel/preset-react' ],
        plugins: [ '@babel/plugin-proposal-class-properties' ],
      },
    }],

  },

  // 출력으로 뺀다~
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js'
  },


}
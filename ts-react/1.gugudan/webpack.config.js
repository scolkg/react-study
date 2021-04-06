const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development', // 배포할 때는 production
  devtool: 'eval', // 배포할 때는 hidden-source-map
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
  },

  entry: {
    app: './client', // client.tsx 를 통해서 app.js를 만들어 내겠다.
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader', // tsx를 awesome-typescript-loader를 통해서 옛날 문법으로 변환하겠다.
    }]
  },
  plugins: [
    // new webpack.LoaderOptionsPlugin({ debug: true }), // 이거 없어져서 필요없게 되었다.
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'), // dist 폴더 안에 app.js를 넣겠다.
  }
}

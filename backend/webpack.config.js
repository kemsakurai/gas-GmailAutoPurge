const path = require('path');
const GasPlugin = require("gas-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: false,
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }      
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]    
  },
  plugins: [
    new GasPlugin(),
    new HtmlWebpackPlugin({
      filename: "./createSchedule.html",
      template: "./src/createSchedule.html"
    }),
    new CopyWebpackPlugin([
      {
        from: "../frontend/dist/frontend/index.html",
        to: "./index.html",
        toType: 'file'
      }
    ])   
  ]
};

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  output: {
    filename: "Code.gs",
    path: path.join(__dirname, "../../dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new GasPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "./appsscript.json" },
        { from: "./src/*.html", to: "[name][ext]" }
      ],
    })
  ],
};
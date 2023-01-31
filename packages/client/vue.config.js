const { defineConfig } = require('@vue/cli-service');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  outputDir: path.resolve(__dirname, '../../dist'),
  chainWebpack: (config) => {
    //* HTMLの設定 *//
    config
      .plugin('html')
      .tap((args) => {
        // inde.htmlの`htmlWebpackPlugin.options.title`で置き換わる値
        args[0].title = 'gas-GmailAutoPurge';
        args[0].inlineSource = '^(/css/.+\\.css|/js/.+\\.js|/md/.+\\.md)';
        // bodyに埋め込む。headerだとdiv#appが読み込まれる前にスクリプトが読まれてしまい、mountに失敗する。
        args[0].inject = 'body';
        // deferだとCDNよりも先にインラインスクリプトを読み込んでしまう。
        // その為多少遅くなるけどdeferやasyncは無指定にする。
        // なお、onloadとかで指定しても、webpackがVueという変数をインラインscriptで定義しようとするため、やはりダメ。
        args[0].scriptLoading = '';
        // `...args[0].minify`によってデフォルトの設定を引き継ぐイメージ？
        args[0].minify = {
          ...args[0].minify,
          removeAttributeQuotes: false,
          removeScriptTypeAttributes: false,
        };
        return args;
      });

    //* CDNの設定 *//
    config.plugin('webpack-cdn').use(require('webpack-cdn-plugin'), [
      {
        modules: [
          {
            name: 'Vue',
            var: 'Vue',
            path: 'dist/vue.runtime.global.js',
          },
          {
             name: 'marked',
             var:  'marked',
             path: 'lib/marked.umd.js'
          },
        ],
      },
    ]);
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            'vue-loader',
            {
              loader: 'markdown-to-vue-loader',
              options: {
                exportSource: true,
              },
            },
          ],
        },
      ],
    },
    // リリース時にはproductionにする
    output: {
      globalObject: 'this',
    },
    mode: 'development',
    devtool: false,
    // HtmlInlineScriptPluginのみ追加。HtmlWebpackPluginは内部で導入済みなので不要。
    plugins: [
      new HtmlInlineScriptPlugin(),
    ],
  },
  // CSSをインライン化
  css: {
    extract: false,
  },
});

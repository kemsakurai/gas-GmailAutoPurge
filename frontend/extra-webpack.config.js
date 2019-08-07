const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');

module.exports = {
    // cdn から取得する対象のライブラリを、externals に指定する
    "externals": {
        "rxjs": "rxjs",
        "zone.js": "Zone",
        "@angular/core": "ng.core",
        "@angular/common": "ng.common",
        "@angular/platform-browser": "ng.platformBrowser",
        "@angular/router": "ng.router"
    },
    plugins: [
        new HtmlWebpackPlugin({
                  filename: 'index.html',
                  template: './src/index.html',
                  // webpack-cdn-plugin で cdn から読み込む対象にしているjs,cssはインライン化の対象外にする
                  inlineSource: '^(?!http).*.(js|css)$',
                  // Google Apps Script で読み込む際に都合が悪いので、minify時の動作を変更する
                  minify: {
                    removeAttributeQuotes: false,
                    removeScriptTypeAttributes: false
                  }
            }),
        
        new HtmlWebpackInlineSourcePlugin(),
        // Angular 関連のライブラリはCDNから取得する
        new WebpackCdnPlugin({
            modules: [
              {
                    name: 'rxjs',
                    var: 'rxjs',
                    path: 'bundles/rxjs.umd.min.js'
              },                
              {
                name: '@angular/core',
                var: 'ng.core',
                path: 'bundles/core.umd.min.js'
              },
              {
                name: '@angular/common',
                var: 'ng.common',
                path: 'bundles/common.umd.min.js'
              },
              {
                name: '@angular/platform-browser',
                var: 'ng.platformBrowser',
                path: 'bundles/platform-browser.umd.min.js'
              },
              {
                name: '@angular/router',
                var: 'ng.router',
                path: 'bundles/router.umd.min.js'
              },
              {
                name: 'zone.js',
                var: 'Zone',
                path: 'dist/zone.js'
              }
            ],
            publicPath: '/node_modules'
          })
        ]
}

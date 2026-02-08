# Project Guidelines

## アーキテクチャ

モノレポ構成のGoogle Apps Script (GAS) Webアプリケーション。Gmailを検索クエリで自動削除する。

- **packages/server/**: TypeScriptで記述されたGAS関数。Webpack経由で`dist/Code.gs`に変換
- **packages/client/**: Vue 3 (TypeScript) のSPA。HTML/CSS/JSを1つのindex.htmlにインライン化してGASで配信
- **通信**: GASの`doGet()`がクライアントを配信。`google.script.run`でサーバー関数を呼び出し

主要な依存関係:
- `gas-webpack-plugin`: TypeScript→GAS変換
- `html-inline-script-webpack-plugin`: すべてのアセットをindex.htmlに埋め込み (GAS Web Appの制約)

## ビルド & デプロイ

```bash
# 初回セットアップ
npm install -g clasp
npm install

# ビルド & デプロイ
sh build.sh && clasp push
```

`build.sh`の動作:
1. サーバーをビルド → `dist/Code.gs`, `dist/appsscript.json`
2. クライアントをビルド → `dist/index.html` (インライン化されたすべてのアセット)

## コード規約

### TypeScript

- **サーバー**: `packages/server/tsconfig.json` - 厳格モード、ES Next、`@types/google-apps-script`を使用
- **クライアント**: Vue 3 Composition API推奨、Airbnb ESLint設定

### GAS関数の公開

[packages/server/src/index.ts](packages/server/src/index.ts#L39-L50)を参照:

```typescript
declare let global: any;
global.onOpen = onOpen;
global.initialize = initialize;
// 他のエクスポート...
```

すべてのGAS関数は`global`オブジェクトに明示的に割り当てる必要がある。

### クライアント・サーバー通信

GASの制約により:
- サーバー関数は`google.script.run.functionName()`経由で呼び出し
- 型定義は`packages/client/src/@types/google.script.d.ts`で管理
- `npm run dts`でサーバー型からクライアント型を生成可能

### Webpack設定のポイント

**サーバー** ([packages/server/webpack.config.js](packages/server/webpack.config.js)):
- `GasPlugin`: top-level関数宣言をグローバルスコープに変換
- `CopyPlugin`: `appsscript.json`と`src/*.html`をdistにコピー
- 出力: `Code.gs` (GASが認識する拡張子)

**クライアント** ([packages/client/vue.config.js](packages/client/vue.config.js)):
- Vue/MarkedをCDNから読み込み (バンドルサイズ削減)
- `HtmlInlineScriptPlugin`: すべてのJS/CSSをインライン化
- `inject: 'body'`: `div#app`がマウント前に読み込まれるように設定
- Markdown→Vueローダー (About.mdを動的にインポート)

## プロジェクト固有の慣習

### ビルド成果物の配置

- すべての成果物は`dist/`に集約 (gitignore対象)
- `build.sh`はクリーンビルドを実行してから`clasp push`でデプロイ

### 多言語対応

`Session.getActiveUserLocale()`でユーザーのロケールを検出し、UIを日本語/英語で切り替え。  
例: [packages/server/src/index.ts](packages/server/src/index.ts#L11-L17)

### テスト関数

デバッグ用の`test_setting0`, `test_setting1`などの関数をindex.tsで定義し、GAS IDEから直接実行可能に。

## CI/CD

### GitHub Actionsによるビルド検証

[.github/workflows/build-verification.yml](.github/workflows/build-verification.yml)でPR毎に自動ビルド検証を実施:
- Node.js 18.x/20.xでのマトリックスビルド
- ビルド成果物の検証（`Code.gs`, `index.html`, `appsscript.json`, `*.html`）
- GAS関数のグローバルエクスポート確認
- HTMLインライン化の検証
- ビルド成果物のサイズチェック（インライン化の肥大化監視）

**手動デプロイ**: GAS環境への実際のデプロイは`clasp push`で手動実行が必須

### Dependabotによる依存関係管理

[.github/dependabot.yml](.github/dependabot.yml)で自動PR作成:
- **server/client**: 週次（月曜9:00 JST）でnpm依存関係をチェック
- **ルート**: 月次で依存関係をチェック
- グループ化: TypeScriptツール、ESLint/Prettier、Vue生態系を同時更新
- メジャーアップデート除外: `typescript`, `webpack`, `gas-webpack-plugin`, `html-inline-script-webpack-plugin`などGAS互換性が重要な依存関係

**PR承認時のチェックリスト**:
1. CIが成功していること
2. 破壊的変更がないか確認（CHANGELOGを確認）
3. マージ後に`sh build.sh && clasp push`で手動デプロイ
4. GAS Web Appで動作確認（UI表示、Gmail機能、スケジュール設定）

## セキュリティ

- GAS WebアプリはOAuth 2.0でGoogleアカウント認証
- Gmailスコープが必要: `appsscript.json`の`oauthScopes`で管理
- 設定データはGoogleスプレッドシートに保存 (GASプロジェクトと紐付け)

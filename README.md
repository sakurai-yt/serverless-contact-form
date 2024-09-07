# お問い合わせフォーム (Serverless Contact Form)

このリポジトリは、AWS Lambda と API Gateway を利用したサーバーレスのお問い合わせフォームの実装を示しています。
このフォームでは、ユーザーからの入力をSES (Simple Email Service) を使用して指定されたメールアドレスに送信します。

## 機能

- フロントエンドは、HTML/CSSとjQueryを使ってシンプルなフォームを作成。
- フォームデータはAJAX経由でAPI Gatewayに送信されます。
- Lambda関数がフォームデータを処理し、SESを使用してメールを送信します。
- サニタイズ処理を行い、XSSやメールヘッダーインジェクションなどの攻撃を防ぎます。

## 使用技術

- **AWS Lambda**: サーバーレスでフォームデータを処理し、メールを送信。
- **AWS API Gateway**: フロントエンドとLambda関数の間でデータをやり取り。
- **AWS SES (Simple Email Service)**: フォーム入力データを指定されたメールアドレスに送信。
- **HTML5 / CSS3 / jQuery**: フロントエンドのフォームを構築。

## 必要な設定

### 1. AWSリソースの準備

#### SESの設定
- SESで送信元メールアドレスを認証する必要があります。
- SESのサンドボックスを抜けて、プロダクション環境に移行してください。

#### Lambda関数の設定
- Lambda関数はSESを使用してメールを送信します。SESで認証された送信元メールアドレスを使用することを確認してください。

#### API Gatewayの設定
- API Gatewayを設定し、POSTメソッドでLambda関数を呼び出すエンドポイントを作成します。
- CORS設定を有効にし、特定のドメインからのみアクセスを許可することをお勧めします。

### 2. クライアントサイド（フロントエンド）の設定

`submit.js` ファイルでAPI GatewayのエンドポイントURLを設定してください。

```js
var URL = "https://your-api-id.execute-api.your-region.amazonaws.com/your-stage/form-api";
```

また、HTMLファイルでは、CSSやフォームのレイアウトを自由にカスタマイズできます。

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/sakurai-yt/serverless-contact-form.git
cd contact-form
```

### 2. Lambda関数のデプロイ

`index.mjs` をZIPファイルに圧縮してAWS Lambdaにデプロイしてください。また、SESの権限を持つロールをLambdaに割り当てることを忘れずに行ってください。

```bash
zip -r function.zip index.mjs
# Lambdaコンソールからfunction.zipをアップロード
```

### 3. SESとAPI Gatewayの設定

- SES: 送信元メールアドレスを認証し、プロダクション環境でメールを送信できるように設定します。
- API Gateway: POSTリクエストをLambda関数に渡すようにAPI Gatewayを設定します。

### 4. フロントエンドの設定

- `index.html` と `submit.js` を必要なWebサーバーに配置します。HTML/CSSは自由にデザインをカスタマイズできます。

## 使用方法

1. **フォームに入力**: ユーザーは、名前、件名、メールアドレス、お問い合わせ内容を入力し、送信ボタンを押します。
2. **メール送信**: フォームデータはAPI Gatewayを経由してLambda関数に送信され、SES経由で指定されたメールアドレスにメールが送信されます。
3. **確認メッセージ**: メール送信後、フォームはリセットされ、ユーザーに成功メッセージが表示されます。

## セキュリティ

- **入力データのサニタイズ**: フォームから送信されるデータは、Lambda関数内でサニタイズされ、XSS攻撃やメールヘッダーインジェクションを防ぎます。
- **CORS設定**: API GatewayのCORS設定は、特定のドメインのみからアクセスを許可するように設定されています。
- **HTTPSの使用**: セキュリティのために、HTTPSプロトコルを使用してリクエストを送信します。

## 貢献

このリポジトリに貢献したい方は、Issueを報告したり、プルリクエストを送信してください。

1. リポジトリをフォークします。
2. 新しいブランチを作成します (`git checkout -b feature/your-feature`)。
3. 変更をコミットします (`git commit -m 'Add your feature'`)。
4. ブランチにプッシュします (`git push origin feature/your-feature`)。
5. プルリクエストを作成します。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細は`LICENSE`ファイルをご覧ください。
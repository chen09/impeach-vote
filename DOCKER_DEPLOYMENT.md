# Docker デプロイメントガイド

このドキュメントでは、投票システムを Docker を使用して本番環境にデプロイする方法を説明します。

## 🚀 クイックスタート

### 1. 環境変数の設定

```bash
# 環境変数ファイルをコピー
cp env.example .env

# .env ファイルを編集
nano .env
```

必要な環境変数：
- `DATABASE_URL`: 外部 PostgreSQL 接続URL
- `JWT_SECRET`: JWT 署名用シークレット

### 2. 外部データベースの準備

外部の PostgreSQL データベースが必要です：

```bash
# データベース接続テスト
psql $DATABASE_URL -c "SELECT 1;"
```

### 3. SSL 証明書の設定

```bash
# SSL 証明書を自動生成
./scripts/ssl-setup.sh
```

### 4. デプロイの実行

```bash
# 自動デプロイスクリプトを実行
./scripts/deploy.sh
```

## 📋 詳細手順

### 前提条件

- Docker と Docker Compose がインストール済み
- サーバーに 80 と 443 ポートが開放されている
- ドメイン `vote.impeach.supplynexus.store` が設定済み
- 外部 PostgreSQL データベースが利用可能

### 手動デプロイ

#### 1. 開発環境でのテスト

```bash
# 開発環境で起動
docker-compose up -d

# ログの確認
docker-compose logs -f
```

#### 2. 本番環境でのデプロイ

```bash
# 本番環境で起動
docker-compose -f docker-compose.prod.yml up -d

# ヘルスチェック
curl http://localhost/health
```

### サービス構成

#### Next.js アプリケーション (app)
- **ポート**: 3000 (内部)
- **環境変数**: `DATABASE_URL`, `JWT_SECRET`
- **ボリューム**: `./prisma:/app/prisma`
- **設定ファイル**: `.env`

#### Nginx リバースプロキシ (nginx)
- **ポート**: 80, 443 (外部)
- **設定ファイル**: `./nginx/nginx.conf`, `./nginx/conf.d/`
- **SSL 証明書**: `./ssl/`

## 🔧 設定ファイル

### 環境変数設定 (.env)

```bash
# 外部データベース接続
DATABASE_URL="postgresql://username:password@your-database-host:5432/database_name"

# JWT 設定
JWT_SECRET=your-super-secret-jwt-key-here

# アプリケーション設定
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# ドメイン設定
NEXT_PUBLIC_DOMAIN=vote.impeach.supplynexus.store
```

### 外部データベース接続例

```bash
# ローカル PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/impeach_vote"

# リモートサーバー
DATABASE_URL="postgresql://user:password@your-server.com:5432/impeach_vote"

# AWS RDS
DATABASE_URL="postgresql://user:password@aws-rds-endpoint.amazonaws.com:5432/impeach_vote"

# Google Cloud SQL
DATABASE_URL="postgresql://user:password@/database?host=/cloudsql/project:region:instance"

# Azure Database for PostgreSQL
DATABASE_URL="postgresql://user:password@server.postgres.database.azure.com:5432/database"
```

### Nginx 設定

#### メイン設定 (`nginx/nginx.conf`)
- ワーカープロセス設定
- Gzip 圧縮
- セキュリティヘッダー
- アップストリーム設定

#### サイト設定 (`nginx/conf.d/default.conf`)
- HTTP から HTTPS へのリダイレクト
- SSL 証明書設定
- プロキシヘッダー設定
- 静的ファイルキャッシュ

### Docker Compose 設定

#### 開発環境 (`docker-compose.yml`)
- 基本的なサービス構成
- 開発用の設定
- 外部データベース接続

#### 本番環境 (`docker-compose.prod.yml`)
- ヘルスチェック設定
- 本番用の環境変数
- セキュリティ強化

## 🔍 トラブルシューティング

### よくある問題と解決方法

#### 1. データベース接続エラー

```bash
# データベース接続のテスト
psql $DATABASE_URL -c "SELECT 1;"

# 接続情報の確認
echo $DATABASE_URL
```

#### 2. アプリケーション起動エラー

```bash
# アプリケーションログの確認
docker-compose logs app

# コンテナ内でコマンド実行
docker-compose exec app sh
```

#### 3. Nginx 設定エラー

```bash
# Nginx 設定のテスト
docker-compose exec nginx nginx -t

# Nginx ログの確認
docker-compose logs nginx
```

#### 4. SSL 証明書エラー

```bash
# SSL 証明書の確認
openssl x509 -in ssl/cert.pem -text -noout

# 証明書の再生成
./scripts/ssl-setup.sh
```

### ログの確認

```bash
# 全サービスのログ
docker-compose logs

# 特定サービスのログ
docker-compose logs app
docker-compose logs nginx

# リアルタイムログ
docker-compose logs -f
```

## 📊 メンテナンス

### データベースバックアップ

```bash
# 手動バックアップ
./scripts/backup.sh

# 自動バックアップ（cron で設定）
0 2 * * * /path/to/impeach-vote/scripts/backup.sh
```

### データベース復元

```bash
# バックアップから復元
./scripts/restore.sh
```

### アプリケーションの更新

```bash
# 新しいイメージをビルド
docker-compose -f docker-compose.prod.yml build --no-cache

# サービスを再起動
docker-compose -f docker-compose.prod.yml up -d

# ロールバック（必要に応じて）
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 セキュリティ

### SSL 証明書の更新

本番環境では Let's Encrypt などの正式な証明書を使用することを推奨します：

```bash
# Let's Encrypt 証明書の取得
certbot certonly --webroot -w /var/www/html -d vote.impeach.supplynexus.store

# 証明書の配置
cp /etc/letsencrypt/live/vote.impeach.supplynexus.store/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/vote.impeach.supplynexus.store/privkey.pem ssl/key.pem

# Nginx の再起動
docker-compose restart nginx
```

### ファイアウォール設定

```bash
# 必要なポートのみ開放
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### データベースセキュリティ

- 強力なパスワードの使用
- SSL/TLS 接続の有効化
- ファイアウォールでのアクセス制限
- 定期的なバックアップ

## 📈 パフォーマンス最適化

### Nginx 設定の最適化

- Gzip 圧縮の有効化
- 静的ファイルのキャッシュ設定
- プロキシバッファリングの調整

### データベース最適化

- PostgreSQL 設定の調整
- インデックスの最適化
- クエリの最適化

### アプリケーション最適化

- Next.js の最適化設定
- 画像の最適化
- コード分割の活用

## 🆘 サポート

問題が発生した場合は、以下の手順で調査してください：

1. ログの確認
2. ヘルスチェックの実行
3. 設定ファイルの検証
4. ネットワーク接続の確認
5. データベース接続の確認

詳細なログやエラーメッセージとともに GitHub Issues で報告してください。 
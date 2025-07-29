# 投票システム (Vote System)

Next.js 15 を使用した多言語対応フルスタック投票システム

## 🚀 機能

- 多言語対応 (英語、中文、日本語、スペイン語、フランス語、ドイツ語、イタリア語、ポルトガル語)
- リアルタイム投票
- 投票結果の表示
- ユーザー認証
- レスポンシブデザイン
- Docker 対応
- 外部データベース対応

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL (外部接続)
- **認証**: JWT
- **国際化**: next-intl
- **コンテナ**: Docker & Docker Compose
- **リバースプロキシ**: Nginx

## 📦 インストール

### 前提条件

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL データベース (外部)

### 開発環境

```bash
# リポジトリをクローン
git clone <repository-url>
cd impeach-vote

# 依存関係をインストール
npm install

# 環境変数を設定
cp env.example .env
# .env ファイルを編集して必要な設定を行ってください

# データベースをセットアップ
npx prisma generate
npx prisma db push

# 開発サーバーを起動
npm run dev
```

### Docker デプロイ

```bash
# 環境変数を設定
cp env.example .env
# .env ファイルを編集（外部データベースの接続情報を設定）

# デプロイスクリプトを実行
./scripts/deploy.sh
```

または手動でデプロイする場合：

```bash
# 開発環境
docker-compose up -d

# 本番環境
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 アクセス

- **開発環境**: http://localhost:3000
- **本番環境**: https://vote.impeach.supplynexus.store

## 📁 プロジェクト構造

```
impeach-vote/
├── app/                    # Next.js アプリケーション
│   ├── [locale]/          # 国際化ルート
│   ├── api/               # API ルート
│   └── globals.css        # グローバルスタイル
├── components/             # React コンポーネント
├── lib/                   # ユーティリティライブラリ
├── messages/              # 翻訳ファイル
├── prisma/                # データベーススキーマ
├── nginx/                 # Nginx 設定
├── scripts/               # デプロイスクリプト
└── docker-compose.yml     # Docker 設定
```

## 🔧 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `DATABASE_URL` | 外部 PostgreSQL 接続URL | ✅ |
| `JWT_SECRET` | JWT 署名用シークレット | ✅ |
| `NODE_ENV` | 実行環境 | ❌ |
| `NEXT_PUBLIC_DOMAIN` | 公開ドメイン | ❌ |

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
```

## 🐳 Docker 設定

### サービス構成

- **app**: Next.js アプリケーション (ポート 3000)
- **nginx**: リバースプロキシ (ポート 80, 443)

### 外部データベース

このアプリケーションは外部の PostgreSQL データベースに接続します。Docker コンテナ内にデータベースは含まれていません。

### SSL 証明書

本番環境では SSL 証明書が必要です：

```bash
# 自己署名証明書を作成
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Impeach Vote/CN=vote.impeach.supplynexus.store"
```

## 📊 API エンドポイント

- `GET /api/polls` - 投票一覧取得
- `GET /api/polls/[id]` - 特定の投票取得
- `POST /api/polls` - 新しい投票作成
- `POST /api/votes` - 投票実行
- `GET /api/results/[pollId]` - 投票結果取得

## 🔍 トラブルシューティング

### よくある問題

1. **データベース接続エラー**
   ```bash
   # 接続テスト
   psql $DATABASE_URL -c "SELECT 1;"
   ```

2. **アプリケーション起動エラー**
   ```bash
   docker-compose logs app
   ```

3. **Nginx 設定エラー**
   ```bash
   docker-compose logs nginx
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

## 🤝 貢献

1. フォークを作成
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合は、GitHub Issues で報告してください。

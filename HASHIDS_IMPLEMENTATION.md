# HashIDs 実装の概要

## 概要

投票システムのURLをより安全で使いやすい形式に変更しました。データベース内では連続した整数ID（1, 2, 3, 4...）を使用し、外部URLではHashIDsを使用して実際のIDを隠しています。

## 変更内容

### 1. データベーススキーマの変更

- `Poll`モデルのIDを`String`から`Int`に変更
- `hashId`フィールドを追加（外部URL用）
- 関連するテーブルの`pollId`も`Int`に変更

### 2. HashIDsライブラリの導入

```bash
npm install hashids
```

### 3. 環境変数設定

HashIDsのシークレットキーは環境変数で管理されます：

```bash
# .envファイルに追加
HASHIDS_SECRET=your-super-secret-hashids-key-here
```

シークレットキーの生成：
```bash
node scripts/generate-hashids-secret.js
```

### 4. 実装されたファイル

#### `lib/hashids.ts`
- HashIDsのエンコード/デコード機能
- 環境変数からシークレットキーを取得
- デフォルト値として`impeach-vote-secret-key`を使用

#### `scripts/migrate-to-integer-ids.js`
- 既存データのマイグレーション
- cuid形式から整数IDへの変換

#### `scripts/create-sample-polls.js`
- 運営チーム用の10個のサンプル投票作成

#### `scripts/generate-qr-codes.js`
- QRコード生成用HTMLファイル作成

#### `scripts/generate-hashids-secret.js`
- 安全なHashIDsシークレットキーの生成

### 5. 更新されたAPI

- `app/api/front/polls/[id]/route.ts` - 投票詳細取得
- `app/api/front/votes/route.ts` - 投票実行
- `app/api/front/results/[pollId]/route.ts` - 結果取得
- `app/api/server/polls/route.ts` - 投票作成

## 使用方法

### 1. 環境変数の設定

```bash
# シークレットキーを生成
node scripts/generate-hashids-secret.js

# .envファイルに追加
HASHIDS_SECRET=生成されたシークレットキー
```

### 2. 新しい投票の作成

投票作成時に自動的にHashIDが生成されます：

```javascript
const poll = await prisma.poll.create({
  data: {
    isPublic: true,
    userId: userId,
    // ... その他のデータ
  }
})

// 自動的にhashIdが生成される
const hashId = encodeId(poll.id)
```

### 3. URLの形式

**変更前:**
```
https://vote.impeach.world/poll/cmdohjfjq00021yo4ff5n4c2g
```

**変更後:**
```
https://vote.impeach.world/poll/P3p0xp1D
```

### 4. 運営チーム用QRコード

10個のサンプル投票が作成され、それぞれにQRコードが生成されています：

1. **Favorite Programming Language** - `P3p0xp1D`
2. **Best Framework for Web Development** - `lXp7Wp3Q`
3. **Preferred Database** - `30pzqgKQ`
4. **Cloud Provider Preference** - `J1glypVL`
5. **Development Environment** - `m4njNnlo`
6. **Operating System** - `1aRxrgew`
7. **Version Control System** - `2NRw8n0K`
8. **Testing Framework** - `yGpqrRlA`
9. **Deployment Method** - `KJnvLpvb`
10. **Code Review Process** - `9Xg6WpK1`

## セキュリティの利点

1. **撞库攻撃の防止**: 外部からは実際のデータベースIDが分からない
2. **予測不可能**: HashIDsは連続していないため、IDを推測できない
3. **短縮URL**: より短く、覚えやすいURL
4. **環境変数管理**: シークレットキーが環境変数で安全に管理される

## 技術的な詳細

### HashIDs設定
- シークレットキー: 環境変数`HASHIDS_SECRET`から取得
- デフォルト値: `impeach-vote-secret-key`
- 最小長: 8文字
- 使用文字: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`

### データベース構造
```sql
CREATE TABLE polls (
  id INT NOT NULL AUTO_INCREMENT,
  hashId VARCHAR(191) NOT NULL DEFAULT '',
  isActive BOOLEAN NOT NULL DEFAULT true,
  isPublic BOOLEAN NOT NULL DEFAULT true,
  -- ... その他のフィールド
  PRIMARY KEY (id),
  UNIQUE KEY polls_hashId_key (hashId)
);
```

## 運営チーム向け情報

### QRコードの取得方法

1. プロジェクトルートで以下を実行：
```bash
node scripts/generate-qr-codes.js
```

2. 生成された`qr-codes.html`をブラウザで開く

3. 印刷ボタンでQRコードを印刷

### 投票URLの形式
```
https://vote.impeach.world/poll/{hashId}
```

例：
- https://vote.impeach.world/poll/P3p0xp1D
- https://vote.impeach.world/poll/lXp7Wp3Q

## 今後の拡張

1. **バッチ処理**: 大量の投票作成時の最適化
2. **キャッシュ**: HashIDのキャッシュ機能
3. **統計**: HashID使用状況の統計
4. **管理画面**: HashIDの管理機能

## 注意事項

- 既存のデータは自動的にマイグレーションされます
- HashIDは一意である必要があります
- **シークレットキーは必ず環境変数で管理してください**
- シークレットキーを変更すると、既存のhashIdが無効になります
- 本番環境では必ず安全なシークレットキーを使用してください

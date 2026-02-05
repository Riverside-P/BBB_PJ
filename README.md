# 個人間送金アプリ（プロトタイプ）

React（フロント） + Node.js/Express（API） + SQLite（DB）で構成されたプロトタイプです。フロントは Create React App、バックエンドは JSON API 専用の Express サーバーです。

---

## 1. 機能概要

- 送金（ユーザー選択 → 金額入力 → 完了）
- 請求（リンク作成、支払い、請求履歴の参照）
- 送金履歴の参照

### 画面（ルーティング）

- Home: `/`
- Send: `/send`
- Confirm: `/confirm`
- Complete: `/complete`
- Request: `/request`
- Payerselect: `/payerselect`
- Link: `/link`
- Pay: `/pay/:linkId`
- ReqHis: `/reqhis`
- TransferHistory: `/transfer-history`

---

## 2. アーキテクチャ

```text
[ Browser ]
    ↓
[ React (Frontend) ]  --- API(JSON) --->  [ Express (Backend) ]  --->  [ SQLite ]
```

---

## 3. ディレクトリ構成（現状）

```text
BBB_PJ/
└─ sample_app/
   └─ my-hello-world/
      ├─ backend/                 # APIサーバー
      │  ├─ controllers/          # APIハンドラ
      │  ├─ db/                    # SQLite DBファイル
      │  ├─ db.js                  # DB接続
      │  ├─ schema.sql             # テーブル定義
      │  ├─ seed.sql               # 初期データ
      │  └─ server.js              # サーバー起動
      ├─ src/                      # React
      │  ├─ pages/                 # 画面
      │  ├─ styles/                # CSS
      │  ├─ App.js
      │  └─ index.js
      ├─ tests/                    # Playwright
      └─ package.json
```

---

## 4. APIエンドポイント（抜粋）

### Users

- `GET /users` : ユーザー一覧
- `GET /users_excluding_self` : 自分を除いた一覧
- `GET /users/:id` : ユーザー詳細
- `GET /users/:id/stats` : 請求統計 + 受信請求の詳細

### Transfers

- `POST /transfers` : 送金
- `GET /transfers/history/:payerId` : 送金履歴（支払い者）

### Links（請求）

- `GET /links` : 全件取得
- `GET /links/requester/:id` : 請求者別取得
- `POST /link` : リンク作成
- `GET /link/:id` : 詳細取得
- `PUT /link/:id` : 更新

### Health

- `GET /health` : ヘルスチェック

---

## 5. DBスキーマ（現状）

### users

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  balance INTEGER DEFAULT 0,
  icon_url TEXT
);
```

### links

```sql
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status INTEGER CHECK (status IN (0, 1)),
  requester INTEGER,
  payer INTEGER,
  amount INTEGER NOT NULL CHECK (amount >= 1),
  comment TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester) REFERENCES users(id),
  FOREIGN KEY (payer) REFERENCES users(id)
);
```

---

## 6. セットアップ

### ① 依存関係インストール

```bash
cd BBB_PJ/sample_app/my-hello-world
npm install
```

### ② DB初期化（SQLite）

```bash
cd BBB_PJ/sample_app/my-hello-world/backend
sqlite3 db/bbb_database.db < schema.sql
sqlite3 db/bbb_database.db < seed.sql
```

---

## 7. 起動方法

### フロント + API を同時起動

```bash
cd BBB_PJ/sample_app/my-hello-world
npm run dev
```

- フロント: `http://localhost:3000`
- API: `http://localhost:3001`

---

## 8. テスト

Playwright のテストが `tests/` にあります。

```bash
cd BBB_PJ/sample_app/my-hello-world
npx playwright test
```

---

## 9. 補足

- 認証・認可は未対応（プロトタイプ）
- DB は `backend/db/bbb_database.db` を利用


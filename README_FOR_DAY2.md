# 個人間送金アプリ（プロトタイプ）開発_Day2事前共有資料

本ドキュメントは、**数日間でプロトタイプを完成させること**を目的とした
React + Node.js + SQLite3 による個人間送金アプリの設計方針・構成・DB構築フローをまとめたものです。

Rails 経験者が React + Node.js にスムーズに移行できるよう、
**Rails との対応関係を意識した構成**を採用しています。

---

## 1. アプリ概要（プロトタイプ要件）

### 想定ユースケース（画面遷移）

1. **Home**
   - 表示項目：
     - 自身のアイコン / 氏名
     - 自分の残高
     - 「送金」ボタン
   - 「送金」ボタンを押すとSendに遷移
2. **Send**
   - 表示項目：
     - ユーザーのアイコン / 氏名一覧
     - プロトタイプ段階では「自分以外の全Users」を表示
   - ユーザーをタップするとConfirmへ推移
3. **Confirm**
   - 表示項目：
     - 選択したユーザーのアイコン・氏名
     - 送金金額入力フォーム
     - 自分の残高
     - 確定ボタン
   - 送金額入力 → 確定ボタン押下でCompleteに遷移
4. **Complete**
   - 表示項目：
     - 完了マーク
     - Homeへ戻るボタン
   - Homeへ戻るボタンを押下するとHomeへ遷移

※ 認証・認可・セキュリティは **本プロトタイプでは一旦考慮しない**

---

## 2. 全体アーキテクチャ

```text
[ Browser (Smartphone) ]
        ↓
[ React (Frontend) ]  --- API(JSON) --->  [ Node.js (Backend) ]  --->  [ SQLite3 ]
```

- 画面・状態管理：React
- 永続データ・事実：Node.js + SQLite3
- HTMLレンダリングは行わず、**API専用バックエンド**とする

---

## 3. ディレクトリ構成（重要）

### ルート構成

```text
project-root/
├─ frontend/          # React（画面・状態）
└─ backend/           # Node.js（API・DB）
```

---

### frontend 構成

```text
frontend/
└─ src/
   ├─ pages/          # 画面（URL単位）
   │  ├─ Home.js
   │  ├─ Send.js
   │  ├─ Confirm.js
   │  └─ Complete.js
   │
   ├─ components/     # 再利用UI部品
   ├─ hooks/          # 状態・ロジック共有
   ├─ services/       # API通信
   ├─ styles/         # CSS（global / page）
   ├─ App.js
   └─ index.js
```

#### Rails対応イメージ

| React      | Rails             |
| ---------- | ----------------- |
| pages      | controller + view |
| components | partial           |
| hooks      | helper / concern  |
| services   | model（API呼び出し）    |

---

### backend 構成

```text
backend/
├─ db/
│  └─ app.db                 # SQLite DB本体
│
├─ migrations/               # テーブル定義（migration相当）
│  ├─ 001_create_users.js
│  └─ 002_create_transactions.js
│
├─ seeds.js                  # 初期データ投入（seeds相当）
├─ migrate.js                # migration実行スクリプト
│
├─ src/
│  ├─ routes/                # ルーティング
│  ├─ controllers/           # API処理
│  ├─ services/              # ビジネスロジック
│  └─ db.js                  # DB接続
│
├─ index.js                  # サーバ起動
└─ package.json
```

#### Rails対応イメージ


| Node.js     | Rails            |
| ----------- | ---------------- |
| migrations  | db/migrate       |
| migrate.js  | rails db:migrate |
| seeds.js    | db/seeds.rb      |
| controllers | app/controllers  |
| services    | Service Object   |

---

## 4. DB設計（Users）

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  balance INTEGER DEFAULT 0,
  icon_url TEXT
);
```

- プロトタイプのため balance は users に直接保持
- Send画面では **id / name / icon_url のみ使用**

---

## 5. DB構築フロー（必読）

### ① 依存関係のインストール

```bash
npm install sqlite3 sqlite
```

---

### ② migration ファイル作成

- `backend/migrations/001_create_users.js`
- **役割：テーブル定義のみを書く**

```text
backend/migrations/
├─ 001_create_users.js
├─ 002_create_transactions.js
```

```js
// 001_create_users.js
export default `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  balance INTEGER DEFAULT 0,
  icon_url TEXT
);
`;
```

---

### ③ migrate.js（migration実行役）

```js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

import createUsers from "./migrations/001_create_users.js";
//import createXxxxs from "./migrations/00x_create_xxxxs.js";のように書き加えていく

const db = await open({
  filename: "./db/database.sqlite",
  driver: sqlite3.Database,
});

await db.exec(createUsers);
//await db.exec(createXxxxs);のように書き加えていく

console.log("Migration completed");
```

```bash
node migrate.js
```

- **テーブルを追加するたびに**
  - migrations にファイルを追加
  - migrate.js に import + exec を追記

---

### ④ seeds.js（ダミーデータ投入）

```js
async function seed() {
  const db = await open({
    filename: "./db/app.db",
    driver: sqlite3.Database
  });

  // 既存データを消す（順序注意）
  await db.exec("DELETE FROM transactions;");
  await db.exec("DELETE FROM users;");

  // users
  await db.exec(`
    INSERT INTO users (name, account_number, balance, icon_url)
    VALUES
      ('Alice', '0001', 5000, 'https://example.com/alice.png'),
      ('Bob', '0002', 3000, 'https://example.com/bob.png');
  `);

  // transactions（例）
  await db.exec(`
    INSERT INTO transactions (from_user_id, to_user_id, amount, created_at)
    VALUES
      (1, 2, 1000, datetime('now'));
  `);

  await db.close();
}
```

```bash
node seeds.js
```

- 毎回同じ状態を再現可能
- チーム全員が同じDBを持てる

---

## テーブル追加時の手順まとめ

1. `migrations/00x_create_xxx.js` を作成
2. `migrate.js` に import & `await db.exec(...)` を追加
3. `node migrate.js` を実行
4. `seeds.js` にテストデータを追記
5. `node seeds.js` を実行



#### npmのscriptが定義済なら実行箇所は次のようにも書ける

```bash
#npm install package.json読み込み（？）
npm run migrate
npm run seed
npm run dev
```

---

## 6. 開発ルール（プロトタイプ向け）

### まずやること

- pages 以外で API を直接呼ばない
- DBは backend のみが操作する
- migration / seeds を分離する

### （一旦）やらないこと

- 認証・認可
- トランザクション管理（すぐ必要になりそう？）
- rollback / migration管理テーブル

---

## 7. 設計思想（重要）

> **入力途中の状態はフロント、確定した事実はバックエンド**

---

## 8. 次のステップ候補

- Confirm → POST /transfers の設計
- transactions テーブル設計の詳細化
- 残高更新ロジックの整理

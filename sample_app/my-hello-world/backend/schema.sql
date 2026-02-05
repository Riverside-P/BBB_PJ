-- ==========================================================
-- 【DB初期化手順】
-- 1. sqlite3 がインストールされていない場合は、各OSのパッケージマネージャーで導入してください。
--    (例: sudo apt install sqlite3)
-- 2. このディレクトリで以下のコマンドを実行し、テーブルを作成します。
--    コマンド: sqlite3 db/bbb_database.db < schema.sql
-- ==========================================================

-- ①ユーザ情報を管理するテーブル (ステップ1・3で使用)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,           -- ③ユーザ名
    account_number TEXT NOT NULL,  -- ②口座番号
    balance INTEGER DEFAULT 0,    -- ④預金残高
    icon_url TEXT                 -- ①ユーザアイコン
);

-- リンク情報を管理するテーブル
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status INTEGER CHECK (status IN (0, 1)),
    requester INTEGER,
    payer INTEGER,
    amount INTEGER NOT NULL CHECK (amount >= 1),
    comment TEXT,
    transaction_type INTEGER NOT NULL CHECK (transaction_type IN (0, 1)),
    date DATETIME DEFAULT (datetime('now', '+09:00')),
    FOREIGN KEY (requester) REFERENCES users(id),
    FOREIGN KEY (payer) REFERENCES users(id)
);
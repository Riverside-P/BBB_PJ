-- ==========================================================
-- 【DB初期化手順】
-- 1. sqlite3 がインストールされていない場合は、各OSのパッケージマネージャーで導入してください。
--    (例: sudo apt install sqlite3)
-- 2. このディレクトリで以下のコマンドを実行し、テーブルを作成します。
--    コマンド: sqlite3 db/bbb_database.db < schema.sql
-- ==========================================================

-- ①ユーザ情報を管理するテーブル (ステップ1・3で使用）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,           -- ③ユーザ名
    account_number TEXT NOT NULL,  -- ②口座番号
    balance INTEGER DEFAULT 0,    -- ④預金残高
    icon_url TEXT                 -- ①ユーザアイコン
);

-- ②請求リンク情報を管理するテーブル
CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status INTEGER DEFAULT 0 CHECK (status IN (0, 1)), -- 0:未払い, 1:支払済
    requester TEXT,              -- 請求者（口座番号）
    payer TEXT NOT NULL,         -- 支払者
    amount INTEGER NOT NULL CHECK (amount >= 1), -- 請求金額（1円以上）
    comment TEXT,                -- メッセージ
    date DATETIME DEFAULT CURRENT_TIMESTAMP -- 作成日時
);

-- 今後、ステップ5や7で必要になる transfers や requests テーブルも
-- 決まり次第、このファイルに追記して共有しましょう。

-- リンク情報を管理するテーブル
-- 外部キー制約を有効にする（セッションごとに必要）
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- 0か1のみを許容する制約
    -- 0ならリンクが有効、1なら無効
    status INTEGER CHECK (status IN (0, 1)),
    
    -- usersテーブルのnameカラムを参照する外部キー
    requester TEXT,
    
    -- NULLを許容しない
    payer TEXT NOT NULL,
    
    -- 1以上かつNULLを許容しない
    amount INTEGER NOT NULL CHECK (amount >= 1),
    
    -- 文字列型
    comment TEXT,
    
    -- デフォルトで現在時刻が入るタイムスタンプ
    date DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- 外部キーの設定
    FOREIGN KEY (requester) REFERENCES users(account_number)
);
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

-- リンク情報を管理するテーブル
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- 0:請求中, 1:支払い済み or キャンセル
    status INTEGER CHECK (status IN (0, 1)),
    
    -- 【修正1】 usersテーブルの id カラムを参照するように変更
    -- JSからはユーザーID(数値)が送られてくるため、ここもINTEGERにします
    requester INTEGER,
    
    -- 【修正2】 リンク作成時は支払う人が未定なので、NULLを許容する（NOT NULLを削除）
    payer INTEGER,  -- ← TEXT → INTEGER に変更、NULL許容のまま
    
    -- 匿名支払い時の支払者名（payerがNULLの場合に使用）
    payer_name TEXT,
    
    -- 金額
    amount INTEGER NOT NULL CHECK (amount >= 1),
    
    -- コメント
    comment TEXT,
    
    -- 作成日時
    date DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- 【修正1の続き】 外部キーを users(id) に向ける
    FOREIGN KEY (requester) REFERENCES users(id),
    FOREIGN KEY (payer) REFERENCES users(id)  -- ← 外部キー制約を追加
);
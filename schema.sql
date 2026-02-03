-- ==========================================================
-- 【DB初期化手順】
-- 1. sqlite3 がインストールされていない場合は、各OSのパッケージマネージャーで導入してください。
--    (例: sudo apt install sqlite3)
-- 2. このディレクトリで以下のコマンドを実行し、テーブルを作成します。
--    コマンド: sqlite3 bbb_database.db < schema.sql
-- ==========================================================

-- ①ユーザ情報を管理するテーブル (ステップ1・3で使用）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,           -- ③ユーザ名
    account_number TEXT NOT NULL,  -- ②口座番号
    balance INTEGER DEFAULT 0,    -- ④預金残高
    icon_url TEXT                 -- ①ユーザアイコン
);

-- ダミーデータ挿入
INSERT INTO users (name, account_number, balance, icon_url) VALUES
  ('三菱 太郎', '普通 1234567', 1250000, '🏦'),
  ('山田 花子', '普通 7654321', 850000, '👩'),
  ('鈴木 二郎', '普通 5555555', 500000, '👨'),
  ('佐藤 美咲', '普通 9999999', 2000000, '👧');

-- 今後、ステップ5や7で必要になる transfers や requests テーブルも
-- 決まり次第、このファイルに追記して共有しましょう。
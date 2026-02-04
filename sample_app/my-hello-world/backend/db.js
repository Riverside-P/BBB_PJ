// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// backend 配下の `db` ディレクトリ内に bbb_database.db を置く
const dbPath = path.resolve(__dirname, 'db', 'bbb_database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ DB接続エラー:', err.message);
  } else {
    console.log(`✅ SQLiteデータベースに接続しました: ${dbPath}`);
    
    // マイグレーション: payer_name カラムが存在しなければ追加
    db.all("PRAGMA table_info(links)", [], (err, columns) => {
      if (err) {
        console.error('テーブル情報取得エラー:', err);
        return;
      }
      
      const hasPayerName = columns.some(col => col.name === 'payer_name');
      if (!hasPayerName) {
        db.run("ALTER TABLE links ADD COLUMN payer_name TEXT", (err) => {
          if (err) {
            console.error('payer_nameカラム追加エラー:', err);
          } else {
            console.log('✅ linksテーブルにpayer_nameカラムを追加しました');
          }
        });
      }
    });
  }
});

module.exports = db;
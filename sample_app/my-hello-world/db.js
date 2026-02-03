// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// プロジェクト直下の bbb_database.db を指定
const dbPath = path.resolve(__dirname, 'bbb_database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ DB接続エラー:', err.message);
  } else {
    console.log(`✅ SQLiteデータベースに接続しました: ${dbPath}`);
  }
});

module.exports = db;
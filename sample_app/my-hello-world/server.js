const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 4000;

// DB ファイルはワークスペース直下の bbb_database.db を想定
const dbPath = path.join(__dirname, '..', '..', 'bbb_database.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite DB at', dbPath);
});

// CORS ヘッダ（開発用）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/users', (req, res) => {
  const sql = 'SELECT id, name, icon_url FROM users ORDER BY id';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

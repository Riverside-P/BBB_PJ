// controllers/userController.js
const db = require('../db'); // 親フォルダのdb.jsを読み込む

// [相手担当] ユーザー一覧を取得（自分自身 id=1 を除外）
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, name, icon_url FROM users WHERE id != 1 ORDER BY id';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// [あなた担当] 特定のユーザー情報を取得
exports.getUserById = (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }
    res.json(row);
  });
};
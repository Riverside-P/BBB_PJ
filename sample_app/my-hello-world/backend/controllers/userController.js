// controllers/userController.js
const db = require('../db'); // 親フォルダのdb.jsを読み込む

// 【Home.jsデバッグ用】全てのユーザーを取得（自分 id=1 も含める）
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, name FROM users ORDER BY id';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// 【Send.js用】ユーザー一覧を取得（自分自身を除外）
exports.getUsersExcludingSelf = (req, res) => {
  // フロントエンドから送られてきた myId を取得
  const myId = req.query.myId;

  // IDが指定されていない場合のガード（任意）
  if (!myId) {
    return res.status(400).json({ error: "myId is required" });
  }
  //変数 myId を除外する
  const sql = 'SELECT id, name, icon_url FROM users WHERE id != ? ORDER BY id';

  db.all(sql, [myId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// 特定のユーザー情報を取得
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

// [あなた担当] ユーザーの請求統計を取得
exports.getUserRequestStats = (req, res) => {
  const id = req.params.id;
  
  // 自分が請求中の件数
  db.get(
    "SELECT COUNT(*) as count FROM links WHERE requester = ? AND status = 0",
    [id],
    (err, sentRequests) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // 自分宛の請求中の件数
      db.get(
        "SELECT COUNT(*) as count FROM links WHERE payer = ? AND status = 0",
        [id],
        (err, receivedRequests) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          res.json({
            sentPendingCount: sentRequests.count,
            receivedPendingCount: receivedRequests.count
          });
        }
      );
    }
  );
};
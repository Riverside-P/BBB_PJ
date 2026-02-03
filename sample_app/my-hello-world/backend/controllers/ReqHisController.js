// controllers/ReqHisController.js
const db = require('../db'); // 親フォルダのdb.jsを読み込む

// 請求履歴一覧を取得（自分が請求者のもの）
exports.getAllLinks = (req, res) => {
  const sql = `
    SELECT 
      links.id,
      links.status,
      links.requester,
      links.payer,
      links.amount,
      links.comment,
      links.date
    FROM links
    ORDER BY links.date DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// 特定ユーザーの請求履歴を取得
exports.getLinksByRequester = (req, res) => {
  const { accountNumber } = req.params;
  const sql = `
    SELECT 
      links.id,
      links.status,
      links.requester,
      links.payer,
      links.amount,
      links.comment,
      links.date
    FROM links
    WHERE links.requester = ?
    ORDER BY links.date DESC
  `;
  
  db.all(sql, [accountNumber], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

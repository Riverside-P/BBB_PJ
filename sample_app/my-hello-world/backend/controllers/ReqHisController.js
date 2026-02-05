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

exports.getLinksByRequesterId = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      l.id,
      l.status,
      l.amount,
      l.comment,
      l.date,
      u_payer.name AS payer,
      u_payer.icon_url AS payer_icon
    FROM links l
    LEFT JOIN users u_payer ON l.payer = u_payer.id
    WHERE l.requester = ?
    ORDER BY l.date DESC
  `;

  db.all(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
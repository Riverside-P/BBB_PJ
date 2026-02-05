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
      l.transaction_type,
      u_payer.name AS payer,
      u_payer.icon_url AS payer_icon
    FROM links l
    LEFT JOIN users u_payer ON l.payer = u_payer.id
    WHERE l.requester = ? AND l.transaction_type = 1
    ORDER BY l.date DESC
  `;

  db.all(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getTransactionHistory = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      l.id,
      l.transaction_type,
      l.status,
      l.amount,
      l.comment,
      l.date,
      CASE 
        WHEN l.transaction_type = 0 THEN u_to.name
        WHEN l.transaction_type = 1 THEN u_requester.name
      END AS counterparty_name,
      CASE 
        WHEN l.transaction_type = 0 THEN u_to.icon_url
        WHEN l.transaction_type = 1 THEN u_requester.icon_url
      END AS counterparty_icon,
      CASE 
        WHEN l.transaction_type = 0 AND l.requester = ? THEN l.amount
        WHEN l.transaction_type = 0 AND l.payer = ? THEN -l.amount
        WHEN l.transaction_type = 1 AND l.requester = ? THEN l.amount
        WHEN l.transaction_type = 1 AND l.payer = ? THEN -l.amount
      END AS balance_change
    FROM links l
    LEFT JOIN users u_to ON l.requester = u_to.id
    LEFT JOIN users u_requester ON l.requester = u_requester.id
    WHERE l.status = 1 AND (l.requester = ? OR l.payer = ?)
    ORDER BY l.date DESC
  `;

  db.all(sql, [id, id, id, id, id, id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
};
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

exports.getLinksByRequester = (req, res) => {
  const { accountNumber } = req.params;

  const sql = `
    SELECT
      l.id,
      l.status,
      l.amount,
      l.comment,
      l.date,
      u_payer.name AS payer,       -- 名前がなければ NULL になる
      u_payer.icon_url AS payer_icon
    FROM links l
    JOIN users u_req ON l.requester = u_req.id
    -- ★ここを LEFT JOIN にすることで、payer が空でもデータが消えません
    LEFT JOIN users u_payer ON l.payer = u_payer.id
    WHERE u_req.account_number = ?
    ORDER BY l.date DESC
  `;

  db.all(sql, [accountNumber], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
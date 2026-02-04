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
  const { accountNumber } = req.params; // '123-4567-89' が入ってくる

  const sql = `
    SELECT
      l.id,
      l.status,
      l.amount,
      l.comment,
      l.date,
      u_payer.name AS payer -- 支払相手の名前を取得
    FROM links l
    JOIN users u_req ON l.requester = u_req.id -- 請求者のIDでユーザーテーブルと結合
    LEFT JOIN users u_payer ON l.payer = u_payer.id -- 支払相手の名前を取得（空の場合も考慮してLEFT JOIN）
    WHERE u_req.account_number = ?             -- 送られてきた口座番号で絞り込み
    ORDER BY l.date DESC
  `;

  db.all(sql, [accountNumber], (err, rows) => {
    if (err) {
      console.error("SQLエラー:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log(`口座番号 ${accountNumber} (ID: ${rows.length > 0 ? '一致あり' : 'なし'}) の検索結果: ${rows.length}件`);
    res.json(rows);
  });
};
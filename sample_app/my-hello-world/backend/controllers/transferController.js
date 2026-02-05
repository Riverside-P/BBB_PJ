const db = require('../db');

exports.createTransfer = (req, res) => {
  const { fromId, toId, amount, message, linkId } = req.body;
  console.log(`💸 送金開始: ID:${fromId} -> ID:${toId} 金額:${amount}円`);

  // トランザクション（簡易版）
  db.run("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, fromId], (err) => {
    if (err) {
      return res.status(500).json({ error: "送り主の引き落としに失敗しました" });
    }
    db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, toId], (err) => {
      if (err) {
        return res.status(500).json({ error: "受取人の入金に失敗しました" });
      }

      // linkIdがある場合のみリンクテーブルに記録（Pay.js経由）
      if (linkId) {
        const updateLinkSql = "UPDATE links SET status = 1 WHERE id = ?";
        db.run(updateLinkSql, [linkId], (err) => {
          if (err) {
            console.error("リンク更新エラー:", err);
          }
          console.log('✅ 送金完了');
          res.json({ message: "送金が完了しました！" });
        });
      } else {
        // linkIdがない場合（Send.js経由）は、linksテーブルに新規作成
        const insertLinkSql = `
          INSERT INTO links (status, requester, payer, amount, comment, transaction_type, date)
          VALUES (1, ?, ?, ?, ?, 0, datetime('now','localtime'))
        `;
        db.run(insertLinkSql, [toId, fromId, amount, message || ''], (err) => {
          if (err) {
            console.error("リンク作成エラー:", err);
          }
          console.log('✅ 送金完了');
          res.json({ message: "送金が完了しました！" });
        });
      }
    });
  });
};

// 送金履歴取得（ログイン中のユーザーが payer となった links）
exports.getPayerTransferHistory = (req, res) => {
  const payerId = req.params.payerId;

  const sql = `
    SELECT 
      links.id,
      links.requester,
      users.name as requester_name,
      users.icon_url as requester_icon,
      links.amount,
      links.comment,
      links.date
    FROM links
    JOIN users ON links.requester = users.id
    WHERE links.payer = ? AND links.status = 1
    ORDER BY links.date DESC
  `;

  db.all(sql, [payerId], (err, rows) => {
    if (err) {
      console.error("送金履歴取得エラー:", err);
      return res.status(500).json({ error: "データベースエラーが発生しました。" });
    }
    res.json(rows || []);
  });
};
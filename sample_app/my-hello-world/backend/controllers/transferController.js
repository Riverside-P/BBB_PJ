const { useParams } = require('react-router-dom');
const db = require('../db');

// ★ここ！ exports.createTransfer になっているか確認してください
exports.createTransfer = (req, res) => {
  const { fromId, toId, amount } = req.body;
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
      console.log('✅ 送金完了');
      res.json({ message: "送金が完了しました！" });
    });
  });
};
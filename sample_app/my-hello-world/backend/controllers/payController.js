// payController.js - 支払い処理用のコントローラー
const db = require('../db');

// リンク情報と請求者情報を取得
const getLinkWithRequester = (req, res) => {
  const linkId = req.params.id;

  const sql = `
    SELECT 
      l.id,
      l.status,
      l.requester,
      l.payer,
      l.amount,
      l.comment,
      l.date,
      u.name as requester_name,
      u.icon_url as requester_icon,
      u.account_number as requester_account
    FROM links l
    JOIN users u ON l.requester = u.id
    WHERE l.id = ?
  `;

  db.get(sql, [linkId], (err, row) => {
    if (err) {
      console.error('リンク情報取得エラー:', err);
      return res.status(500).json({ error: 'データベースエラー' });
    }
    if (!row) {
      return res.status(404).json({ error: 'リンクが見つかりません' });
    }
    res.json(row);
  });
};

// 支払い処理
const processPayment = (req, res) => {
  const linkId = req.params.id;
  const { payerId, payerName } = req.body;

  // まずリンク情報を取得
  db.get('SELECT * FROM links WHERE id = ?', [linkId], (err, link) => {
    if (err) {
      console.error('リンク取得エラー:', err);
      return res.status(500).json({ error: 'データベースエラー' });
    }
    if (!link) {
      return res.status(404).json({ error: 'リンクが見つかりません' });
    }
    if (link.status === 1) {
      return res.status(400).json({ error: 'この請求は既に支払い済みです' });
    }

    const amount = link.amount;
    const requesterId = link.requester;

    // payerIdがある場合（ログインユーザーからの支払い）
    if (payerId) {
      // 支払い者の残高確認
      db.get('SELECT balance FROM users WHERE id = ?', [payerId], (err, payer) => {
        if (err) {
          return res.status(500).json({ error: 'データベースエラー' });
        }
        if (!payer) {
          return res.status(404).json({ error: '支払い者が見つかりません' });
        }
        if (payer.balance < amount) {
          return res.status(400).json({ error: '残高不足です' });
        }

        // トランザクション的に処理（実際のSQLiteではserializeを使用）
        db.serialize(() => {
          // 1. 支払い者の残高を減らす
          db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, payerId], function(err) {
            if (err) console.error('支払い者残高更新エラー:', err);
            else console.log(`支払い者(${payerId})の残高を${amount}減らしました`);
          });
          
          // 2. 請求者の残高を増やす
          db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, requesterId], function(err) {
            if (err) console.error('請求者残高更新エラー:', err);
            else console.log(`請求者(${requesterId})の残高を${amount}増やしました`);
          });
          
          // 3. リンクのステータスを支払い済み(1)に更新し、payerを設定
          db.run('UPDATE links SET status = 1, payer = ? WHERE id = ?', [payerId, linkId], function(err) {
            if (err) {
              console.error('リンクステータス更新エラー:', err);
              return res.status(500).json({ error: '支払い処理に失敗しました' });
            }
            console.log(`リンク(${linkId})のステータスを支払い済みに更新しました`);
            res.json({ success: true, message: '支払いが完了しました' });
          });
        });
      });
    } else {
      // payerIdがない場合（匿名支払い - 名前だけ入力）
      // この場合は残高チェックなしで、請求者の残高だけ増やす
      db.serialize(() => {
        // 請求者の残高を増やす
        db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, requesterId], function(err) {
          if (err) console.error('請求者残高更新エラー:', err);
          else console.log(`請求者(${requesterId})の残高を${amount}増やしました（匿名支払い）`);
        });
        
        // リンクのステータスを支払い済み(1)に更新
        db.run('UPDATE links SET status = 1 WHERE id = ?', [linkId], function(err) {
          if (err) {
            console.error('リンクステータス更新エラー:', err);
            return res.status(500).json({ error: '支払い処理に失敗しました' });
          }
          console.log(`リンク(${linkId})のステータスを支払い済みに更新しました（匿名支払い）`);
          res.json({ success: true, message: '支払いが完了しました', payerName: payerName });
        });
      });
    }
  });
};

// ユーザーの残高を取得
const getUserBalance = (req, res) => {
  const userId = req.params.id;
  
  db.get('SELECT balance FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'データベースエラー' });
    }
    if (!row) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }
    res.json({ balance: row.balance });
  });
};

module.exports = {
  getLinkWithRequester,
  processPayment,
  getUserBalance
};

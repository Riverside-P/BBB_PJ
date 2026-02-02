// ==========================================
// 1. 必要な部品（ライブラリ）を読み込む
// ==========================================
const express = require('express');          // サーバーを作るためのメイン部品
const sqlite3 = require('sqlite3').verbose(); // SQLiteデータベースを操作する部品
const cors = require('cors');                // React(3000番)からのアクセスを許可する部品

// サーバーアプリ本体を作成
const app = express();

// ==========================================
// 2. 設定（ミドルウェア）
// ==========================================
// セキュリティ設定：React（他ドメイン）からの通信を許可する
app.use(cors());

// データ設定：送られてきたデータ（JSON）をプログラムで読めるようにする
app.use(express.json());

// ==========================================
// 3. データベースへの接続
// ==========================================
// 'bbb_database.db' というファイルを開く（なければエラーになる）
const db = new sqlite3.Database('./bbb_database.db', (err) => {
  if (err) {
    console.error('DB接続エラー:', err.message);
  } else {
    console.log('✅ SQLiteデータベースに接続しました。');
  }
});

// ==========================================
// 4. API（窓口）の作成
// ==========================================

// ------------------------------------------
// API①: IDを指定してユーザー情報を取得する
// URL: http://localhost:3001/users/2 など
// ------------------------------------------
app.get('/users/:id', (req, res) => {
  // URLの :id の部分（例: 2）を取得
  const id = req.params.id;

  // SQL実行: id が一致するユーザーを探す
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      // DBエラーが起きた場合
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      // ユーザーが見つからなかった場合
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }
    // 見つかったユーザーデータをReactに返す
    res.json(row);
  });
});

// ------------------------------------------
// API②: 送金を実行する（残高を書き換える）
// URL: http://localhost:3001/transfers
// メソッド: POST
// ------------------------------------------
app.post('/transfers', (req, res) => {
  // Reactから送られてきたデータを取り出す
  // body = { fromId: 1, toId: 2, amount: 10000 }
  const { fromId, toId, amount } = req.body;

  console.log(`送金開始: ID:${fromId} -> ID:${toId} 金額:${amount}円`);

  // ステップ1: 送り主（fromId）の残高を減らす
  db.run("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, fromId], (err) => {
    if (err) {
      return res.status(500).json({ error: "送り主の引き落としに失敗しました" });
    }

    // ステップ2: 受取人（toId）の残高を増やす
    db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, toId], (err) => {
      if (err) {
        return res.status(500).json({ error: "受取人の入金に失敗しました" });
      }

      // 両方成功したら、成功メッセージを返す
      console.log('✅ 送金完了');
      res.json({ message: "送金が完了しました！" });
    });
  });
});

// ==========================================
// 5. サーバーを起動する
// ==========================================
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
});
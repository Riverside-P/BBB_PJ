// server.js
const express = require('express');
const cors = require('cors');

// 作ったコントローラーをそれぞれ読み込む
const userController = require('./controllers/userController');
const transferController = require('./controllers/transferController');
const reqHisController = require('./controllers/ReqHisController');
const linkController = require('./controllers/linkController');

const app = express();
const PORT = 3001;

// --- 設定 ---
app.use(cors());
app.use(express.json());

// --- ルーティング ---

// ユーザー関連の窓口 -> userControllerにお任せ
app.get('/users', userController.getAllUsers);       // 一覧
app.get('/users/:id', userController.getUserById);   // 詳細

// 送金関連の窓口 -> transferControllerにお任せ
app.post('/transfers/:id', transferController.createTransfer); // 送金

// 請求履歴関連の窓口 -> reqHisControllerにお任せ
app.get('/links', reqHisController.getAllLinks);                    // 全件取得
app.get('/links/:accountNumber', reqHisController.getLinksByRequester); // 特定ユーザーの請求

//リンク情報関連の窓口
//リンクテーブルへのインサート
app.post('/link', linkController.insertLink);

//詳細取得
app.get('/link/:id', linkController.getLink);

// ヘルスチェック
app.get('/health', (req, res) => res.json({ ok: true }));

// --- 起動 ---
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
});
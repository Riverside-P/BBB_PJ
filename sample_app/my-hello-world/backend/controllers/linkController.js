const db = require('../db'); // 親フォルダのdb.jsを読み込む

exports.insertLink = (req, res) => {
    // リクエストボディからデータを抽出
    const { status, requester, payer, amount, comment } = req.body;

    // 1. SQL文の準備（dateはDEFAULT設定があるので省略可能）
    const sql = `
        INSERT INTO links (status, requester, payer, amount, comment)
        VALUES (?, ?, ?, ?, ?)
    `;

    // 2. 外部キー制約を有効にする（db.js側で設定済みなら不要ですが、念のため）
    db.run("PRAGMA foreign_keys = ON;");

    // 3. 実行
    // プレースホルダ（?）を使ってSQLインジェクションを防止します
    db.run(sql, [status, requester, payer, amount, comment], function (err) {
        if (err) {
            console.error("Insert Error:", err.message);
            
            // エラーの種類に応じたレスポンス
            if (err.message.includes("FOREIGN KEY constraint failed")) {
                return res.status(400).json({ error: "指定されたrequester(ユーザー)が存在しません。" });
            }
            if (err.message.includes("CHECK constraint failed")) {
                return res.status(400).json({ error: "入力値が制約（statusが0,1か、amountが1以上か）に違反しています。" });
            }
            
            return res.status(500).json({ error: "データベースエラーが発生しました。" });
        }

        // 成功時のレスポンス（this.lastID で新しく作成されたIDが取得できます）
        res.status(201).json({
            message: "データが正常に登録されました。",
            linkId: this.lastID
        });
    });
};

exports.getLink = (req, res) => {
    // URLからIDを取得 (例: /api/links/5)
    const id = req.params.id;

    // 1. SQL文の準備
    const sql = `SELECT * FROM links WHERE id = ?`;

    // 2. データベースから取得
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error("Select Error:", err.message);
            return res.status(500).json({ error: "データベースエラーが発生しました。" });
        }

        // 3. データが存在したかチェック
        if (!row) {
            return res.status(404).json({ error: "指定されたIDのデータが見つかりません。" });
        }

        // 4. 成功時のレスポンス
        res.status(200).json(row);
    });
};

exports.updateLink = (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const sql = `UPDATE links SET status = ? WHERE id = ?`;

    db.run(sql, [status, id], function (err) {
        if (err) {
            console.error("Update Error:", err.message);
            return res.status(500).json({ error: "データベースエラーが発生しました。" });
        }

        res.status(200).json({
            message: "リンク情報が更新されました。",
            id: id
        });
    });
};
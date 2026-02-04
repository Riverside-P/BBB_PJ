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
    const { id } = req.params;

    // SQL: links(l) と users(u) を結合して、必要な変数をすべて取得
    const sql = `
        SELECT 
            l.status,
            l.amount, 
            l.comment, 
            l.requester AS requester_id, 
            u.id AS requester_user_id,
            u.name AS requester_name, 
            u.account_number AS requester_account, 
            u.icon_url AS requester_icon
        FROM links l
        LEFT JOIN users u ON l.requester = u.id
        WHERE l.id = ?
    `;

    db.get(sql, [id], (err, row) => {
        if (err) return res.status(500).json({ error: "DBエラーが発生しました。" });
        if (!row) return res.status(404).json({ error: "リンクが見つかりません。" });

        console.log(row);
        // ここで返却されるJSONにすべての変数が含まれます
        res.status(200).json(row);
    });
};

exports.updateLinkStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // フロントから 1 が送られてくる想定

    const sql = `UPDATE links SET status = ? WHERE id = ?`;

    db.run(sql, [status, id], function (err) {
        if (err) {
            console.error("Update Error:", err.message);
            return res.status(500).json({ error: "ステータスの更新に失敗しました。" });
        }
        res.status(200).json({ message: "ステータスを更新しました。" });
    });
};
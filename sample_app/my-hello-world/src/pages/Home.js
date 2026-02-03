import React, { useState, useEffect } from 'react';
import '../styles/Home.css'; // スタイルを引き継ぐため
import { useNavigate } from 'react-router-dom';
import userImage from "../images/human_image_a.png";


function Home() {
  const navigate = useNavigate();

  // --- [変更点] ステート（状態）の定義 ---
  const [user, setUser] = useState(null); // DBから取得したユーザーデータ
  const [loading, setLoading] = useState(true); // 読み込み中フラグ

  // --- [変更点] API呼び出し ---
  useEffect(() => {
    // ひとまず ID=1 のユーザー（上田さん）を取得
    fetch('http://localhost:3001/users/1')
      .then((res) => {
        if (!res.ok) throw new Error('ユーザー情報の取得に失敗しました');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // --- [変更点] ガード処理（データがない時のエラー回避） ---
  if (loading) return <div className="loading">データを読み込み中...</div>;
  if (!user) return <div className="error">ユーザーが見つかりません。</div>;

  return (
    <div className="app-container">
      <h2 className="app-title">マイページ</h2>
      <div className="account-card">
        <div className="card-header">
          {/* [変更点] user.icon_url を使用 */}
          <img src={user.icon_url} className="user-icon" alt="ユーザーアイコン" />

          <span className="account-type">メイン口座</span>
        </div>
        <div className="user-info">
          {/* [変更点] DBのカラム名 (name, account_number) に合わせる */}
          <p className="user-name">{user.name} 様</p>
          <p className="account-number">{user.account_number}</p>
        </div>
        <div className="balance-section">
          <p className="balance-label">現在の残高</p>
          {/* [変更点] 数値としてカンマ区切りにフォーマット */}
          <p className="balance-amount">¥ {Number(user.balance).toLocaleString()}</p>
        </div>
      </div>
      <div className="button-group">
        <button className="action-button send-button" onClick={() => navigate('/send')}>送金</button>
        <button className="action-button request-button" onClick={() => navigate('/request')}>請求</button>
        </div>
    </div>
  );
}

export default Home;
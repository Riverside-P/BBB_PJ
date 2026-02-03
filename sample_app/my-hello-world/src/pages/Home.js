import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import userImage from "../images/human_image_a.png";


function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <div className="loading">データを読み込み中...</div>;
  if (!user) return <div className="error">ユーザーが見つかりません。</div>;

  return (
    <div className="app-container">
      <h2 className="app-title">マイページ</h2>
      <div className="account-card">
        <div className="card-header">
          <img src={user.icon_url} className="user-icon" alt="ユーザーアイコン" />
          <span className="account-type">メイン口座</span>
        </div>
        <div className="user-info">
          <p className="user-name">{user.name} 様</p>
          <p className="account-number">{user.account_number}</p>
        </div>
        <div className="balance-section">
          <p className="balance-label">現在の残高</p>
          <p className="balance-amount">¥ {Number(user.balance).toLocaleString()}</p>
        </div>
      </div>
      <div className="button-group">
        <button className="action-button send-button" onClick={() => navigate('/send')}>送金</button>
        <button className="action-button request-button" onClick={() => navigate('/request')}>請求</button>
        <button className="action-button history-button" onClick={() => navigate('/reqhis')}>請求履歴</button>
      </div>
    </div>
  );
}

export default Home;
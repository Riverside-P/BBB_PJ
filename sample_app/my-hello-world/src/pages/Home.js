import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ステップ11等のテストでも使いやすいダミーデータ
  const dummyRequests = [
    { id: 1, sender: "上田 斉汰", amount: 1200, message: "昨日のランチ代", date: "2026/02/01" },
    { id: 2, sender: "鈴木 一郎", amount: 3500, message: "飲み会会費", date: "2026/02/03" },
  ];

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

      {/* 届いている請求セクション（新規追加） */}
      <div className="incoming-requests-section">
        <h3 className="section-title">届いている請求</h3>
        {dummyRequests.length > 0 ? (
          dummyRequests.map((req) => (
            <div key={req.id} className="request-item-card">
              <div className="request-info">
                <span className="request-sender">{req.sender}</span>
                <span className="request-date">{req.date}</span>
              </div>
              <div className="request-main">
                <span className="request-message">{req.message}</span>
                <span className="request-amount">¥{req.amount.toLocaleString()}</span>
              </div>
              <button 
                className="pay-now-button" 
                onClick={() => navigate('/send')}
              >
                今すぐ支払う
              </button>
            </div>
          ))
        ) : (
          <p className="no-requests">現在、新しい請求はありません。</p>
        )}
      </div>
    </div>
  );
}

export default Home;
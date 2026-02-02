import React from 'react';
import './Home.css'; // スタイルを引き継ぐため
import { useNavigate } from 'react-router';

// 先頭は大文字にするのがReactの約束です
function Home() {
  const navigate = useNavigate();

  const accountData = {
    name: "三菱 太郎",
    accountNumber: "普通 1234567",
    balance: "1,250,000",
    icon: "🏦"
  };

  return (
    <div className="app-container">
      <h2 className="app-title">マイページ</h2>
      <div className="account-card">
        <div className="card-header">
          <span className="bank-icon">{accountData.icon}</span>
          <span className="account-type">メイン口座</span>
        </div>
        <div className="user-info">
          <p className="user-name">{accountData.name} 様</p>
          <p className="account-number">{accountData.accountNumber}</p>
        </div>
        <div className="balance-section">
          <p className="balance-label">現在の残高</p>
          <p className="balance-amount">¥ {accountData.balance}</p>
        </div>
      </div>
      <div className="button-group">
        <button className="action-button send-button" onClick={() => navigate('\send')}>送金</button>
        <button className="action-button request-button">請求</button>
        </div>
    </div>
  );
}

export default Home; // 他のファイルで使えるようにエクスポート
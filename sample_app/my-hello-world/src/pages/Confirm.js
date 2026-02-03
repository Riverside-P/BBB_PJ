import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Confirm.css';

function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Send.js から渡されたユーザー情報を取得
    if (location.state?.user) {
      setUser(location.state.user);
    } else {
      // ユーザー情報がない場合は Send ページに戻す
      navigate('/send');
    }
  }, [location, navigate]);

  const handleConfirm = () => {
    if (user) {
      console.log('確認されたユーザ:', user);
      // ここに送金処理などを追加
      alert(`${user.name}への送金が完了しました`);
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/send');
  };

  if (!user) {
    return <div className="app-container"><p>読み込み中...</p></div>;
  }

  return (
    <div className="app-container">
      <h2 className="app-title">送金確認</h2>
      <div className="confirm-card">
        <div className="user-detail">
          <p className="label">送金先</p>
          <div className="user-info">
            <span className="user-icon-emoji">{user.icon_url || '👤'}</span>
            <span className="user-name">{user.name}</span>
          </div>
        </div>
        <div className="user-detail">
          <p className="label">口座番号</p>
          <p className="detail-value">{user.account_number}</p>
        </div>
        <div className="user-detail">
          <p className="label">残高</p>
          <p className="detail-value">¥ {user.balance?.toLocaleString()}</p>
        </div>
      </div>
      <div className="button-group">
        <button className="action-button confirm-button" onClick={handleConfirm}>確認</button>
        <button className="action-button cancel-button" onClick={handleCancel}>キャンセル</button>
      </div>
    </div>
  );
}

export default Confirm;

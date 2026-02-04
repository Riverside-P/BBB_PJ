import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Payerselect.css';

function Payerselect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentAmount = location.state?.amount || '';
  const currentMessage = location.state?.message || '';
  const currentSelectedUser = location.state?.selectedUser || null;

  useEffect(() => {
    // サーバー(3001番)からユーザー一覧を取得
    fetch('http://localhost:3001/users')
      .then(response => response.json())
      .then(data => {
        console.log("取得データ:", data);
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  // ユーザー選択時の処理：Request.jsに戻り、選択したユーザー情報を渡す
  const handleUserSelect = (user) => {
    console.log("選択したユーザー:", user);
    // Request.jsに選択したユーザー情報と、受け取った金額・メッセージを返す
    navigate('/request', { 
      state: { 
        selectedUser: user,
        amount: currentAmount,
        message: currentMessage
      } 
    });
  };

  // アイコン表示のロジック（Send.jsと同じ）
  const renderIcon = (iconUrl, userName) => {
    if (iconUrl && typeof iconUrl === 'string' && (iconUrl.startsWith('http://') || iconUrl.startsWith('https://'))) {
      return <img src={iconUrl} alt={userName} className="user-icon" />;
    }
    if (iconUrl && typeof iconUrl === 'string' && iconUrl.trim().length > 0) {
      return <span className="user-icon-emoji">{iconUrl}</span>;
    }
    return <span className="user-icon-fallback">{(userName || '').slice(0, 1)}</span>;
  };

  return (
    <div className="app-container">
      <h2 className="app-title">請求相手を選択</h2>
      <div className="users-list">
        {loading ? (
          <p>読み込み中...</p>
        ) : users.length > 0 ? (
          users.map(user => (
            <button
              key={user.id}
              className="user-item"
              onClick={() => handleUserSelect(user)}
            >
              {renderIcon(user.icon_url, user.name)}
              <span className="user-name">{user.name}</span>
            </button>
          ))
        ) : (
          <p>ユーザーが見つかりません</p>
        )}
      </div>
      <div className="button-group">
        <button className="action-button clear-button" onClick={() => navigate('/request', {
          state: {
            selectedUser: null,
            amount: currentAmount,
            message: currentMessage
          }
        })}>
          選択を解除
        </button>
        <button className="action-button back-button" onClick={() => navigate('/request', {
          state: {
            selectedUser: currentSelectedUser,
            amount: currentAmount,
            message: currentMessage
          }
        })}>
          戻る
        </button>
      </div>
    </div>
  );
}

export default Payerselect;

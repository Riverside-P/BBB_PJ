import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Send.css';

function Send() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ローカルの SQLite を参照する Express サーバから users を取得
    fetch('http://localhost:4000/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const handleUserClick = (user) => {
    // ユーザ情報を state で Confirm.js に渡して遷移
    navigate('/confirm', { state: { user } });
  };

  const renderIcon = (iconUrl, userName) => {
    // URL パターン（http://... または https://...）
    if (iconUrl && typeof iconUrl === 'string' && (iconUrl.startsWith('http://') || iconUrl.startsWith('https://'))) {
      return <img src={iconUrl} alt={userName} className="user-icon" />;
    }
    // 絵文字またはテキスト（単文字または複数文字）
    if (iconUrl && typeof iconUrl === 'string' && iconUrl.trim().length > 0) {
      return <span className="user-icon-emoji">{iconUrl}</span>;
    }
    // フォールバック：イニシャル
    return <span className="user-icon-fallback">{(userName || '').slice(0, 1)}</span>;
  };

  return (
    <div className="app-container">
      <h2 className="app-title">ユーザ一覧</h2>
      <div className="users-list">
        {loading ? (
          <p>読み込み中...</p>
        ) : users.length > 0 ? (
          users.map(user => (
            <button
              key={user.id}
              className="user-item"
              onClick={() => handleUserClick(user)}
            >
              {renderIcon(user.icon_url, user.name)}
              <span className="user-name">{user.name}</span>
            </button>
          ))
        ) : (
          <p>ユーザが見つかりません</p>
        )}
      </div>
      <div className="button-group">
        <button className="action-button back-button" onClick={() => navigate('/')}>戻る</button>
      </div>
    </div>
  );
}

export default Send;
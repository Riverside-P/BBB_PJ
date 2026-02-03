import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Send.css';

function Send() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // クリック時の処理
  const handleUserClick = (user) => {
    console.log("送るデータ:", user); // 確認用ログ
    navigate('/confirm', { state: { user } });
  };

  // アイコン表示のロジック
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
      <h2 className="app-title">ユーザ一覧</h2>
      <div className="users-list">
        {loading ? (
          <p>読み込み中...</p>
        ) : users.length > 0 ? (
          users.map(user => (
            <button
              key={user.id}
              className="user-item"
              // ★ここで handleUserClick を正しく呼び出す
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
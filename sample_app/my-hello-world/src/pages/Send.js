import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Send.css';
import { useUser } from '../UserContext';

function Send() {
  const navigate = useNavigate();
  const { currentUserId } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // 念のため、フェッチ開始時に true に戻す

    // 自分のIDを除外して取得
    fetch(`http://localhost:3001/users_excluding_self?myId=${currentUserId}`)
      .then(res => {
        if (!res.ok) throw new Error('通信エラーが発生しました');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false); // ★成功：読み込み完了！
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false); // ★失敗：エラーでも「読み込み中」は解除する
      });
  }, [currentUserId]);

  // クリック時の処理
  const handleUserClick = (user) => {
    console.log("送るデータ:", user); // 確認用ログ
    navigate('/confirm', { state: { user } });
  };

  // アイコン表示のロジック
  const renderIcon = (iconUrl, userName) => {
    if (iconUrl && typeof iconUrl === 'string' && (iconUrl.startsWith('http://') || iconUrl.startsWith('https://'))) {
      return <img src={iconUrl} alt={userName} className="send-user-icon" />;
    }
    if (iconUrl && typeof iconUrl === 'string' && iconUrl.trim().length > 0) {
      return <span className="send-user-icon-emoji">{iconUrl}</span>;
    }
    return <span className="send-user-icon-fallback">{(userName || '').slice(0, 1)}</span>;
  };

  return (
    <div className="send-container">
      <h2 className="send-title">ユーザ一覧</h2>
      <div className="send-users-list">
        {loading ? (
          <p>読み込み中...</p>
        ) : users.length > 0 ? (
          users.map(user => (
            <button
              key={user.id}
              className="send-user-item"
              // ★ここで handleUserClick を正しく呼び出す
              onClick={() => handleUserClick(user)}
            >
              {renderIcon(user.icon_url, user.name)}
              <span className="send-user-name">{user.name}</span>
            </button>
          ))
        ) : (
          <p>ユーザが見つかりません</p>
        )}
      </div>
      <div className="send-button-group">
        <button className="send-back-button" onClick={() => navigate('/')}>戻る</button>
      </div>
    </div>
  );
}

export default Send;
import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ★1: DB内の全ユーザーを保持するステート
  const [allUsers, setAllUsers] = useState([]);

  // ★2: 初回のみ実行：切り替え用の全ユーザーリストを取得
  useEffect(() => {
    fetch('http://localhost:3001/users') // getAllUsersを呼び出す
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
      .catch((err) => console.error("全ユーザー取得エラー:", err));
  }, []);

  // 選択中のユーザー情報を取得
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/users/${currentUserId}`)
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
  }, [currentUserId]);

  if (loading && !user) return <div className="loading">データを読み込み中...</div>;
  if (!user) return <div className="error">ユーザーが見つかりません。</div>;

  return (
    <div className="app-container">
      {/* ★3: 全ユーザーを map で回して選択肢を生成 */}
      <div className="debug-switcher" style={{ background: '#fce7f3', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
        <label style={{ fontSize: '12px', color: '#be185d', fontWeight: 'bold' }}>【開発用】ログイン切替：</label>
        <select
          value={currentUserId}
          onChange={(e) => setCurrentUserId(Number(e.target.value))}
          style={{ marginLeft: '8px', padding: '4px', borderRadius: '4px' }}
        >
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>
              ID: {u.id} ({u.name})
            </option>
          ))}
        </select>
      </div>

      <h2 className="app-title">マイページ</h2>
      <div className="account-card">
        <div className="card-header">
          <img src={user.icon_url} className="user-icon" alt="ユーザーアイコン" />
          <span className="account-type">メイン口座</span>
        </div>
        <div className="user-info">
          <p className="user-name">{user.name} 様</p>
          <p className="account-number">口座番号: {user.account_number}</p>
        </div>
        <div className="balance-section">
          <p className="balance-label">現在の残高</p>
          <p className="balance-amount">¥ {Number(user.balance).toLocaleString()}</p>
        </div>
      </div>
      <div className="button-group">
        <button
          className="action-button send-button"
          onClick={() => navigate('/send', { state: { myId: currentUserId } })} // IDを渡す
        >
          送金
        </button>
        <button className="action-button request-button" onClick={() => navigate('/request')}>請求</button>
        <button className="action-button history-button" onClick={() => navigate('/reqhis')}>請求履歴</button>
      </div>
    </div>
  );
}

export default Home;
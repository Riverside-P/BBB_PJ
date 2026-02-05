import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Complete.css';
import { useUser } from '../UserContext';

const Complete = () => {
  const navigate = useNavigate();
  const { currentUserId } = useUser();
  const [newBalance, setNewBalance] = useState(null);

  // 送金完了後、最新の残高を取得
  useEffect(() => {
    const fetchLatestBalance = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${currentUserId}`);
        if (res.ok) {
          const userData = await res.json();
          setNewBalance(userData.balance);
        }
      } catch (err) {
        console.error('残高取得エラー:', err);
      }
    };

    if (currentUserId) {
      fetchLatestBalance();
    }
  }, [currentUserId]);

  return (
    <div className="app-container">
      <h2 className="app-title">送金完了</h2>
      <div className="card">
        <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#27ae60' }}>
          ✓ 送金が完了しました
        </p>
        {newBalance !== null && (
          <p style={{ textAlign: 'center', fontSize: '16px', marginTop: '20px' }}>
            現在の残高: ¥{newBalance.toLocaleString()}
          </p>
        )}
      </div>
      <div className="button-group">
        <button
          className="action-button primary"
          onClick={() => navigate('/')}
        >
          ホームへ戻る
        </button>
      </div>
    </div>
  );
};

export default Complete;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReqHis.css';
import { useUser } from '../UserContext'; // Context のインポート

function ReqHis() {
  const navigate = useNavigate();
  const { currentUserId } = useUser(); // Context から現在のユーザーIDを取得
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUserId) return;
      setLoading(true);

      try {
        const historyRes = await fetch(`http://localhost:3001/links/requester/${currentUserId}`);
        if (!historyRes.ok) throw new Error('請求履歴の取得に失敗しました');
        const historyData = await historyRes.json();

        setLinks(historyData);
      } catch (err) {
        console.error("履歴取得プロセスでエラーが発生しました:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUserId]);

  const getStatusText = (status) => status === 0 ? '未払い' : '支払済';
  const getStatusClass = (status) => status === 0 ? 'status-pending' : 'status-paid';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="app-container">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2 className="app-title">請求履歴</h2>

      <div className="links-list">
        {links.length > 0 ? (
          links.map((link) => (
            <div key={link.id} className="link-item">
              <div className="link-header">
                <span className={`status-badge ${getStatusClass(link.status)}`}>
                  {getStatusText(link.status)}
                </span>
                <span className="link-date">{formatDate(link.date)}</span>
              </div>

              <div className="link-body" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="payer-icon-wrapper">
                  {link.payer_icon && link.payer_icon.startsWith('http') ? (
                    <img
                      src={link.payer_icon}
                      alt={link.payer}
                      className="history-user-icon"
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="user-icon-fallback" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                      {link.payer ? link.payer[0] : '?'}
                    </div>
                  )}
                </div>

                <div className="link-main-info" style={{ flex: 1 }}>
                  <div className="link-info">
                    <p className="link-label">請求先</p>
                    <p className="link-value">{link.payer || '（未設定）'}</p>
                  </div>
                  <div className="link-amount">
                    <p className="amount-value">¥{Number(link.amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {link.comment && (
                <div className="link-comment">
                  <p className="comment-label">メッセージ</p>
                  <p className="comment-text">{link.comment}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>請求履歴がありません</p>
          </div>
        )}
      </div>

      <div className="button-group">
        <button className="action-button back-button" onClick={() => navigate('/')}>
          戻る
        </button>
      </div>
    </div>
  );
}

export default ReqHis;
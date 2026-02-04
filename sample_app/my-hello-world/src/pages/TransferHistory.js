import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../styles/TransferHistory.css';

const TransferHistory = () => {
  const navigate = useNavigate();
  const { currentUserId } = useUser();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await fetch(`http://localhost:3001/transfers/history/${currentUserId}`);
        if (!res.ok) throw new Error('送金履歴の取得に失敗しました');
        const data = await res.json();
        setTransfers(data);
      } catch (err) {
        console.error('送金履歴取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchTransfers();
    }
  }, [currentUserId]);

  if (loading) return <div className="app-container"><p>Loading...</p></div>;

  return (
    <div className="app-container">
      <h2 className="app-title">送金履歴</h2>

      <div className="links-list">
        {transfers.length > 0 ? (
          transfers.map((transfer) => {
            const commentText = transfer.comment && transfer.comment.trim()
              ? transfer.comment
              : 'メッセージなし';

            return (
              <div key={transfer.id} className="link-item">
                <div className="link-header">
                  <span className="link-date">{formatDate(transfer.date)}</span>
                </div>

                <div className="link-body" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="payer-icon-wrapper">
                    {transfer.requester_icon && transfer.requester_icon.startsWith('http') ? (
                      <img
                        src={transfer.requester_icon}
                        alt={transfer.requester_name}
                        className="history-user-icon"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="user-icon-fallback" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {(transfer.requester_name || '?').slice(0, 1)}
                      </div>
                    )}
                  </div>

                  <div className="link-main-info" style={{ flex: 1 }}>
                    <div className="link-info">
                      <p className="link-label">送金先</p>
                      <p className="link-value">{transfer.requester_name}</p>
                    </div>
                    <div className="link-amount">
                      <p className="amount-value">¥{Number(transfer.amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="link-comment">
                  <p className="comment-label">メッセージ</p>
                  <p className="comment-text">{commentText}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>送金履歴はありません。</p>
          </div>
        )}
      </div>

      <div className="button-group">
        <button className="action-button secondary" onClick={() => navigate('/')}>
          ホームへ戻る
        </button>
      </div>
    </div>
  );
};

export default TransferHistory;
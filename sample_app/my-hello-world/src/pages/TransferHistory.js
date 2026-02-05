import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../styles/TransferHistory.css';

const TransferHistory = () => {
  const navigate = useNavigate();
  const { currentUserId } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`http://localhost:3001/transactions/history/${currentUserId}`);
        if (!res.ok) throw new Error('取引履歴の取得に失敗しました');
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error('取引履歴取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchTransactions();
    }
  }, [currentUserId]);

  const getTypeText = (type) => type === 0 ? '送金' : '完了した請求';
  const getTypeClass = (type) => type === 0 ? 'type-transfer' : 'type-request';
  
  const formatBalanceChange = (change) => {
    if (change > 0) {
      return { text: `+¥${change.toLocaleString()}`, className: 'balance-increase' };
    } else {
      return { text: `-¥${Math.abs(change).toLocaleString()}`, className: 'balance-decrease' };
    }
  };

  if (loading) return <div className="app-container"><p>読み込み中...</p></div>;

  return (
    <div className="app-container">
      <h2 className="app-title">取引履歴</h2>

      <div className="links-list">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const balanceInfo = formatBalanceChange(transaction.balance_change);
            
            return (
              <div key={transaction.id} className="link-item">
                <div className="link-header">
                  <span className={`type-badge ${getTypeClass(transaction.transaction_type)}`}>
                    {getTypeText(transaction.transaction_type)}
                  </span>
                  <span className="link-date">{formatDate(transaction.date)}</span>
                </div>

                <div className="link-body" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="payer-icon-wrapper">
                    {transaction.counterparty_icon && transaction.counterparty_icon.startsWith('http') ? (
                      <img
                        src={transaction.counterparty_icon}
                        alt={transaction.counterparty_name}
                        className="history-user-icon"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="user-icon-fallback" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {(transaction.counterparty_name || '?').slice(0, 1)}
                      </div>
                    )}
                  </div>

                  <div className="link-main-info" style={{ flex: 1 }}>
                    <div className="link-info">
                      <p className="link-label">
                        {transaction.transaction_type === 0 
                          ? (transaction.balance_change > 0 ? '送金元' : '送金先')
                          : '請求元'
                        }
                      </p>
                      <p className="link-value">{transaction.counterparty_name}</p>
                    </div>
                  </div>

                  <div className="link-amount">
                    <p className={`amount-value ${balanceInfo.className}`}>
                      {balanceInfo.text}
                    </p>
                  </div>
                </div>

                {transaction.comment && (
                  <div className="link-comment">
                    <p className="comment-label">メッセージ</p>
                    <p className="comment-text">{transaction.comment}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>取引履歴はありません。</p>
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReqHis.css';

function ReqHis() {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // サーバーから請求履歴を取得
    fetch('http://localhost:3001/links')
      .then((res) => {
        if (!res.ok) throw new Error('請求履歴の取得に失敗しました');
        return res.json();
      })
      .then((data) => {
        console.log('取得した請求履歴:', data);
        setLinks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ステータスの表示テキスト
  const getStatusText = (status) => {
    return status === 0 ? '未払い' : '支払済';
  };

  // ステータスのクラス名
  const getStatusClass = (status) => {
    return status === 0 ? 'status-pending' : 'status-paid';
  };

  // 日付のフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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
              
              <div className="link-body">
                <div className="link-info">
                  <p className="link-label">請求先</p>
                  <p className="link-value">{link.payer}</p>
                </div>
                <div className="link-amount">
                  <p className="amount-value">¥{Number(link.amount).toLocaleString()}</p>
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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Pay.css';
import { useUser } from '../UserContext';

function Pay() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { currentUserId } = useUser();

  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payerName, setPayerName] = useState('');
  const [userBalance, setUserBalance] = useState(null);
  const [processing, setProcessing] = useState(false);

  // リンク情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // リンク情報を取得
        const linkRes = await fetch(`http://localhost:3001/pay/${linkId}`);
        if (!linkRes.ok) {
          throw new Error('リンク情報の取得に失敗しました');
        }
        const linkInfo = await linkRes.json();
        setLinkData(linkInfo);

        // payer指定がある場合、またはログインユーザーがいる場合は残高を取得
        if (linkInfo.payer || currentUserId) {
          const userId = linkInfo.payer || currentUserId;
          const balanceRes = await fetch(`http://localhost:3001/users/${userId}`);
          if (balanceRes.ok) {
            const userData = await balanceRes.json();
            setUserBalance(userData.balance);
            setPayerName(userData.name);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [linkId, currentUserId]);

  // 支払い処理
  const handlePayment = async () => {
    if (processing) return;
    
    // 残高チェック（ログインユーザーの場合）
    if (userBalance !== null && userBalance < linkData.amount) {
      setError('残高が不足しています');
      return;
    }

    if (!payerName.trim()) {
      setError('お名前を入力してください');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const payerId = linkData.payer || currentUserId || null;
      
      const res = await fetch(`http://localhost:3001/pay/${linkId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerId: payerId,
          payerName: payerName
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '支払いに失敗しました');
      }

      // 成功したらステータスを更新
      setLinkData(prev => ({ ...prev, status: 1 }));
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // ローディング中
  if (loading) {
    return (
      <div className="pay-container">
        <p>読み込み中...</p>
      </div>
    );
  }

  // エラー（リンクが見つからない等）
  if (error && !linkData) {
    return (
      <div className="pay-container">
        <div className="pay-error">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>ホームに戻る</button>
        </div>
      </div>
    );
  }

  // 支払い済みの場合
  const isPaid = linkData?.status === 1;

  // 残高不足かどうか
  const isInsufficientBalance = userBalance !== null && userBalance < linkData?.amount;

  return (
    <div className="pay-container">
      <h2 className="pay-title">支払い</h2>

      <div className="pay-card">
        {/* 請求者情報 */}
        <div className="pay-requester-section">
          <span className="pay-label">請求者</span>
          <div className="pay-requester-info">
            {linkData.requester_icon && (
              <img 
                src={linkData.requester_icon} 
                alt={linkData.requester_name} 
                className="pay-requester-icon"
              />
            )}
            <span className="pay-requester-name">{linkData.requester_name}</span>
          </div>
        </div>

        <hr className="pay-divider" />

        {/* 請求金額 */}
        <div className="pay-amount-section">
          <span className="pay-label">請求金額</span>
          <p className="pay-amount">¥{Number(linkData.amount).toLocaleString()}</p>
        </div>

        {/* メッセージがある場合 */}
        {linkData.comment && (
          <>
            <hr className="pay-divider" />
            <div className="pay-message-section">
              <span className="pay-label">メッセージ</span>
              <p className="pay-message">{linkData.comment}</p>
            </div>
          </>
        )}

        <hr className="pay-divider" />

        {/* 支払い者情報入力 */}
        <div className="pay-payer-section">
          <span className="pay-label">お名前</span>
          {linkData.payer ? (
            // payer指定ありの場合は編集不可
            <p className="pay-payer-name-fixed">{payerName}</p>
          ) : (
            // payer指定なしの場合は入力可能
            <input
              type="text"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              placeholder="お名前を入力"
              className="pay-payer-input"
              disabled={isPaid}
            />
          )}
        </div>

        {/* 残高表示（ログインユーザーの場合） */}
        {userBalance !== null && (
          <div className="pay-balance-display">
            <span>現在の残高: </span>
            <span className={isInsufficientBalance ? 'insufficient' : ''}>
              ¥{userBalance.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && <p className="pay-error-message">{error}</p>}

      {/* ボタン */}
      <div className="pay-button-group">
        {isPaid ? (
          <button className="pay-button paid" disabled>
            支払い済み
          </button>
        ) : isInsufficientBalance ? (
          <button className="pay-button insufficient" disabled>
            残高不足
          </button>
        ) : (
          <button 
            className="pay-button primary" 
            onClick={handlePayment}
            disabled={processing || !payerName.trim()}
          >
            {processing ? '処理中...' : `¥${Number(linkData.amount).toLocaleString()} を支払う`}
          </button>
        )}
        
        {/* payer指定がある場合のみホームに戻るボタンを表示 */}
        {linkData.payer && (
          <button className="pay-button secondary" onClick={() => navigate('/')}>
            ホームに戻る
          </button>
        )}
      </div>
    </div>
  );
}

export default Pay;

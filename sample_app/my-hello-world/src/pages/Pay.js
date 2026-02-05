import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../styles/Pay.css';

const Pay = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { currentUserId, setCurrentUserId, refreshBalance } = useUser();

  const [linkData, setLinkData] = useState(null);
  const [requesterData, setRequesterData] = useState(null);
  const [myBalance, setMyBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [payerUser, setPayerUser] = useState(null); // ← 追加

  const isDisabled = !amount || Number(amount) <= 0;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 20) {
      setAmount(value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const linkRes = await fetch(`http://localhost:3001/link/${linkId}`);
        if (!linkRes.ok) {
          setError('リンク情報が見つかりません');
          return;
        }
        const link = await linkRes.json();
        setLinkData(link);

        if (link.status === 1) {
          setError('このリンクは既に支払い済みです');
          return;
        }

        const payerId = link.payer != null ? Number(link.payer) : null;
        const currentId = Number(currentUserId);

        // 開発用: 支払者に自動切替
        if (payerId && currentId !== payerId) {
          setCurrentUserId(payerId);
          return; // currentUserId が変わるので再実行される
        }

        const requesterRes = await fetch(`http://localhost:3001/users/${link.requester}`);
        if (!requesterRes.ok) throw new Error('請求元ユーザー情報の取得に失敗しました');
        const requester = await requesterRes.json();
        setRequesterData(requester);

        // 送金元の残高を取得
        const myRes = await fetch(`http://localhost:3001/users/${payerId ?? currentId}`);
        if (!myRes.ok) throw new Error('残高の取得に失敗しました');
        const myData = await myRes.json();
        setMyBalance(myData.balance);
        setPayerUser(myData); // ← 追加

        setAmount(link.amount.toString());
        setMessage(link.comment || '');
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの読み込みに失敗しました');
      }
    };

    if (linkId && currentUserId) {
      fetchData();
    }
  }, [linkId, currentUserId, setCurrentUserId]);

  const handlePayRequest = async () => {
    const sendAmount = Number(amount);
    const fromId = linkData?.payer != null ? Number(linkData.payer) : Number(currentUserId);

    if (sendAmount <= 0) {
      setError('金額を入力してください');
      return;
    }
    if (sendAmount > myBalance) {
      setError('残高不足です');
      return;
    }

    const requestBody = {
      fromId,
      toId: linkData.requester,
      amount: sendAmount,
      message: message,
      linkId: linkId
    };

    try {
      const res = await fetch('http://localhost:3001/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        await fetch(`http://localhost:3001/link/${linkId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 1 }),
        });

        await refreshBalance();

        navigate('/complete');
      } else {
        const errorData = await res.json();
        setError(errorData.error || '送金に失敗しました');
      }
    } catch (error) {
      console.error(error);
      setError('通信エラーが発生しました');
    }
  };

  // ✅ エラー表示を先に
  if (error) {
    return (
      <div className="app-container">
        <div className="card" style={{ textAlign: 'center', color: '#ff4d4f' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{error}</p>
          <button
            className="action-button secondary"
            onClick={() => navigate('/')}
          >
            ホームへ戻る
          </button>
        </div>
      </div>
    );
  }

  // 読み込み中の表示
  if (!linkData || !requesterData || myBalance === null) {
    return <div className="app-container"><p>Loading...</p></div>;
  }

  const afterBalance = myBalance - Number(amount);

  return (
    <div className="app-container">
      <h2 className="app-title">請求内容の確認</h2>

      {/* 追加: 現在ログイン中のユーザー */}
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
        現在ログイン中: {payerUser ? `${payerUser.name}` : `ID: ${currentUserId}`}
      </p>

      <div className="card">
        <h3 className="card-title">請求元</h3>

        <div className="user-info">
          <img
            src={requesterData.icon_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
            alt="icon"
            className="user-icon"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
          <p className="user-name">{requesterData.name} 様</p>
        </div>
        <p className="account-info">普通 {requesterData.account_number || '****'}</p>

        <hr className="divider" />

        <div className="limit-info">
          <p className="label">送金可能額（あなたの残高）</p>
          <p className="limit-amount">¥{myBalance.toLocaleString()}</p>
        </div>

        <div className="input-group">
          <span className="label">送金金額</span>
          <div className="amount-wrapper">
            <span className="currency-symbol">¥</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="金額を入力"
              className="amount-input"
              readOnly
            />
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '15px' }}>
          <span className="label">メッセージ</span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージ（任意）"
            className="amount-input"
            style={{ fontSize: '16px', textAlign: 'left', paddingLeft: '10px' }}
            readOnly
          />
        </div>

        <hr className="divider" />

        <div className="balance-preview">
          <p>送金後の残高</p>
          <div className="balance-row">
            <span>¥{myBalance.toLocaleString()}</span>
            <span className="arrow">→</span>
            <span style={{ color: afterBalance < 0 ? '#ff4d4f' : '#f39c12', fontWeight: 'bold' }}>
              ¥{afterBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button
          className={`action-button primary ${isDisabled ? 'disabled' : ''}`}
          onClick={handlePayRequest}
          disabled={isDisabled}
        >
          送金する
        </button>
        <button className="action-button secondary" onClick={() => navigate('/')}>
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default Pay;
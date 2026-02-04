import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Confirm.css';
import { useUser } from '../UserContext'; // Contextのインポート

const Confirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUserId } = useUser(); // Contextから「自分」のIDを取得

  // 前の画面から渡された送金先ユーザー情報
  const { user } = location.state || {};

  const [transferData, setTransferData] = useState(null); // 送金先情報
  const [myBalance, setMyBalance] = useState(null);       // 自分の残高
  const [amount, setAmount] = useState('');               // 送金金額
  const [message, setMessage] = useState('');             // 任意メッセージ

  // ボタンの無効化条件
  const isDisabled = !amount || Number(amount) <= 0;

  // 金額入力ハンドラー（数字のみ・20桁制限）
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 20) {
      setAmount(value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 送金先データのセット
        if (user) {
          setTransferData({
            toId: user.id,
            toName: user.name,
            toAccount: user.account_number || '****',
            toIcon: user.icon_url,
          });
        } else {
          // 直リンクなどでデータがない場合のフォールバック（デバッグ用）
          const toRes = await fetch('http://localhost:3001/users/2');
          const toData = await toRes.json();
          setTransferData({
            toId: toData.id,
            toName: toData.name,
            toAccount: toData.account_number,
            toIcon: toData.icon_url,
          });
        }

        // 2. 自分の残高データを Context の ID を元に取得
        const fromRes = await fetch(`http://localhost:3001/users/${currentUserId}`);
        if (!fromRes.ok) throw new Error('残高の取得に失敗しました');
        const fromData = await fromRes.json();
        setMyBalance(fromData.balance);

      } catch (err) {
        console.error("データ取得エラー:", err);
      }
    };
    fetchData();
  }, [user, currentUserId]); // currentUserId が変われば再取得

  // 送金ボタン実行処理
  const handleTransfer = async () => {
    const sendAmount = Number(amount);
    if (sendAmount <= 0) return alert("金額を入力してください");
    if (sendAmount > myBalance) return alert("残高不足です");

    // リクエストボディの組み立て
    const requestBody = {
      fromId: currentUserId,   // ログイン中の自分のID
      toId: transferData.toId, // 相手のID
      amount: sendAmount,
      message: message
    };

    try {
      const res = await fetch('http://localhost:3001/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        navigate('/complete'); // 完了画面へ
      } else {
        const errorData = await res.json();
        alert(errorData.error || "送金に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    }
  };

  // 読み込み中の表示
  if (!transferData || myBalance === null) {
    return <div className="confirm-container"><p>Loading...</p></div>;
  }

  // 送金後の残高計算
  const afterBalance = myBalance - Number(amount);

  return (
    <div className="confirm-container">
      <h2 className="confirm-title">送金内容の入力</h2>

      <div className="confirm-card">
        <h3 className="confirm-card-title">送金先</h3>

        <div className="confirm-user-info">
          <img
            src={transferData.toIcon || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
            alt="icon"
            className="confirm-user-icon"
          />
          <p className="confirm-user-name">{transferData.toName} 様</p>
        </div>
        <p className="confirm-account-info">普通 {transferData.toAccount}</p>

        <hr className="confirm-divider" />

        {/* 送金上限（現在の自分の残高） */}
        <div className="confirm-limit-info">
          <p className="confirm-label">送金可能額（残高）</p>
          <p className="confirm-limit-amount">¥{myBalance.toLocaleString()}</p>
        </div>

        {/* 金額入力エリア */}
        <div className="confirm-input-group">
          <span className="confirm-label">送金金額</span>
          <div className="confirm-amount-wrapper">
            <span className="confirm-currency-symbol">¥</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="金額を入力"
              className="confirm-amount-input"
            />
          </div>
        </div>

        {/* メッセージ入力エリア */}
        <div className="confirm-input-group" style={{ marginTop: '15px' }}>
          <span className="confirm-label">メッセージ（任意）</span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="送金相手へのメモ"
            className="confirm-amount-input"
            style={{ fontSize: '16px', textAlign: 'left', paddingLeft: '10px' }}
          />
        </div>

        <hr className="confirm-divider" />

        {/* 残高変化のプレビュー */}
        <div className="confirm-balance-preview">
          <p>送金後の残高（目安）</p>
          <div className="confirm-balance-row">
            <span>¥{myBalance.toLocaleString()}</span>
            <span className="confirm-arrow">→</span>
            <span style={{ color: afterBalance < 0 ? '#ff4d4f' : '#f39c12', fontWeight: 'bold' }}>
              ¥{afterBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="confirm-button-group">
        <button
          className={`confirm-action-button confirm-primary ${isDisabled ? 'disabled' : ''}`}
          onClick={handleTransfer}
          disabled={isDisabled}
        >
          送金する
        </button>
        <button className="confirm-action-button confirm-secondary" onClick={() => navigate(-1)}>
          戻る
        </button>
      </div>
    </div>
  );
};

export default Confirm;
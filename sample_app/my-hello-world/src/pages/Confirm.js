import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirm.css';

const Confirm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = location.state || {};

  const [transferData, setTransferData] = useState(null); // 相手
  const [myBalance, setMyBalance] = useState(null);       // 自分
  const [amount, setAmount] = useState('');               // 金額
  // ★追加1: メッセージ用のステート (初期値は空文字)
  const [message, setMessage] = useState('');

  // ボタンを無効にする条件を定義
  const isDisabled = !amount || Number(amount) <= 0;


  // 入力文字数を制限するハンドラー
  const handleAmountChange = (e) => {
  const value = e.target.value;

  // 数字（0-9）のみを許可し、かつ20桁以内に制限する
  // ^\d*$ は「空文字、または数字のみ」にマッチします
  if (/^\d*$/.test(value) && value.length <= 20) {
    setAmount(value);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          setTransferData({
            toId: user.id,
            toName: user.name,
            toAccount: user.account_number || '****',
            toIcon: user.icon_url,
          });
        } else {
          // フォールバック
          const toRes = await fetch('http://localhost:3001/users/2');
          const toData = await toRes.json();
          setTransferData({
            toId: toData.id,
            toName: toData.name,
            toAccount: toData.account_number,
            toIcon: toData.icon_url,
          });
        }

        const fromRes = await fetch('http://localhost:3001/users/1');
        const fromData = await fromRes.json();
        setMyBalance(fromData.balance);

      } catch (err) {
        console.error("データ取得エラー:", err);
      }
    };
    fetchData();
  }, [user]);

  // 送金ボタン処理
  const handleTransfer = async () => {
    const sendAmount = Number(amount);
    if (sendAmount <= 0) return alert("金額を入力してください");
    if (sendAmount > myBalance) return alert("残高不足です");


    // ★追加2: 送信データに message を含める
    const requestBody = {
      fromId: 1,
      toId: transferData.toId,
      amount: sendAmount,
      message: message // サーバー側で受け取る準備が必要です
    };

    try {
      const res = await fetch('http://localhost:3001/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        navigate('/complete');
      } else {
        const errorData = await res.json();
        alert(errorData.error || "エラーが発生しました");
      }
    } catch (error) {
      console.error(error);
      alert("通信エラー");
    }
  };

  if (!transferData || myBalance === null) {
    return <div className="app-container"><p>Loading...</p></div>;
  }

  const afterBalance = myBalance - Number(amount);

  return (
    <div className="app-container">
      <h2 className="app-title">送金内容の入力</h2>

      <div className="card">
        <h3 className="card-title">送金先</h3>

        <div className="user-info">
          <img
             src={transferData.toIcon || 'https://placehold.jp/150x150.png'}
             alt="icon"
             className="user-icon"
             style={{width: '50px', height: '50px', borderRadius: '50%'}} // 念のためスタイル

          />
          <p className="user-name">{transferData.toName} 様</p>
        </div>
        <p className="account-info">普通 {transferData.toAccount}</p>

        <hr className="divider" />

        {/*送金上限額の表示スペース  */}
        <div className="limit-info">
          <p className="label">送金上限額</p>
          <p className="limit-amount">¥{myBalance.toLocaleString()}</p>
        </div>

        {/* 金額入力 */}
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
            />
          </div>
        </div>

        {/* ★追加3: メッセージ入力エリア */}
        <div className="input-group" style={{ marginTop: '15px' }}>
          <span className="label">メッセージ（任意）</span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder=""
            className="amount-input" // 既存のクラスを流用（必要ならCSS変更）
            style={{ fontSize: '16px', textAlign: 'left', paddingLeft: '10px' }}
          />
        </div>

        <hr className="divider" />

        {/* 残高プレビュー */}
        <div className="balance-preview">
          <p>送金後の残高</p>
          <div className="balance-row">
            <span>¥{myBalance.toLocaleString()}</span>
            <span className="arrow">→</span>
            <span style={{ color: afterBalance < 0 ? 'red' : 'orange' }}>
              ¥{afterBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="button-group">
        {/* disabled 属性を追加し、条件が true のときにボタンを無効化 */}
          <button
            className={`action-button primary ${isDisabled ? 'disabled' : ''}`}
            onClick={handleTransfer}
            disabled={isDisabled}
          >
          送金する
        </button>
        <button className="action-button secondary" onClick={() => navigate(-1)}>
          戻る
        </button>
      </div>
    </div>
  );
};

export default Confirm;
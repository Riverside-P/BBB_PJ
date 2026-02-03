import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reqest.css'; // 専用のスタイル

function Request() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 金額のバリデーション
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && Number(value) < 1) {
      setError('1円以上を入力してください');
    } else {
      setError('');
    }
  };

  // リンク作成ボタンの処理（後で実装）
  const handleCreateLink = () => {
    const numAmount = Number(amount);
    if (!amount || numAmount < 1) {
      setError('1円以上を入力してください');
      return;
    }
    // TODO: リンク作成の処理を後で実装
    console.log('リンク作成:', { amount: numAmount, message });
    alert('リンク作成機能は後で実装します');
  };

  return (
    <div className="app-container">
      <h2 className="app-title">請求画面</h2>

      <div className="card">
        {/* 請求金額入力 */}
        <div className="input-group">
          <span className="label">請求金額</span>
          <div className="amount-wrapper">
            <span className="currency-symbol">¥</span>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="amount-input"
              min="1"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <hr className="divider" />

        {/* メッセージ入力 */}
        <div className="input-group">
          <span className="label">メッセージ（任意）</span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="例：飲み会代です"
            className="message-input"
          />
        </div>
      </div>

      <div className="button-group">
        <button 
          className="action-button primary" 
          onClick={handleCreateLink}
          disabled={!amount || Number(amount) < 1}
        >
          リンク作成
        </button>
        <button className="action-button secondary" onClick={() => navigate(-1)}>
          戻る
        </button>
      </div>
    </div>
  );
}

export default Request;

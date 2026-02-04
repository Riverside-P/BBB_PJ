import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Request.css'; // 専用のスタイル

function Request() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 金額のバリデーション
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
<<<<<<< HEAD
    
    if (value && Number(value) < 1) {
      setError('1円以上を入力してください');
    } else {
      setError('');
    }
=======
    if (value && Number(value) < 1) setError('1円以上を入力してください');
    else setError('');
  };

  // ★ユーザ選択画面へ遷移する処理
  const handleGoToSelect = () => {
    // 現在の入力内容を持って遷移する
    navigate('/payerselect', { 
      state: { 
        amount: amount, 
        message: message 
      } 
    });
>>>>>>> 38ba1ed (ユーザーselect画面の作成)
  };

  // リンク作成ボタンの処理（後で実装）
  const handleCreateLink = async () => {
    const numAmount = Number(amount);
    if (!amount || numAmount < 1) {
      setError('1円以上を入力してください');
      return;
    }
    // TODO: リンク作成の処理を後で実装
    const requestData = {
      status: 0,          // 0: 未払い/請求中
      requester: 1,       // 請求者(自分)のID
      payer: null,        // 支払う人はまだ決まっていないのでnull
      amount: numAmount,  // 金額
      comment: message    // メッセージ
    };

    try {
      // API呼び出し
      const response = await fetch('http://localhost:3001/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        // サーバーからエラーが返ってきた場合
        throw new Error(data.error || 'リンクの作成に失敗しました');
      }

      console.log('リンク作成成功 ID:', data.linkId);
      
      // 成功したら完了画面やシェア画面へ遷移
      // 生成された linkId をURLパラメータとして渡す
      navigate('/link', { 
        state: { linkId: data.linkId } 
      });

    } catch (err) {
      console.error(err);
      setError(err.message || '通信エラーが発生しました');
    }
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

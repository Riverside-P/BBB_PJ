import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocationを追加
import '../styles/Request.css';

function Request() {
  const navigate = useNavigate();
  const location = useLocation(); // 戻ってきたデータを受け取る用

  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  const myId = location.state?.myId || 1;

  // ★画面が表示された時に、戻ってきたデータがあればセットする
  useEffect(() => {
    if (location.state) {
      // PayerSelectから戻ってきた場合
      if (location.state.selectedUser) {
        setSelectedUser(location.state.selectedUser);
      }
      // 金額やメッセージも復元（undefinedチェックを行う）
      if (location.state.amount !== undefined) setAmount(location.state.amount);
      if (location.state.message !== undefined) setMessage(location.state.message);
    }
  }, [location.state]);

  // 金額変更
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value && Number(value) < 1) setError('1円以上を入力してください');
    else setError('');
  };

  // ★ユーザ選択画面へ遷移する処理
  const handleGoToSelect = () => {
    // 現在の入力内容を持って遷移する
    navigate('/payerselect', { 
      state: { 
        selectedUser: selectedUser,
        amount: amount, 
        message: message ,
        myId: myId
      } 
    });
  };

  // リンク作成処理（変更なし）
  const handleCreateLink = async () => {
    const numAmount = Number(amount);
    if (!amount || numAmount < 1) {
      setError('1円以上を入力してください');
      return;
    }

    const requestData = {
      status: 0,
      requester: 1, 
      payer: selectedUser ? selectedUser.id : null, 
      amount: numAmount,
      comment: message
    };

    try {
      const response = await fetch('http://localhost:3001/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '作成失敗');

      navigate('/link', { state: { linkId: data.linkId } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // アイコン表示用ヘルパー（PayerSelectと同じロジック）
  const renderUserIcon = (iconUrl, userName) => {
    if (iconUrl && typeof iconUrl === 'string' && (iconUrl.startsWith('http://') || iconUrl.startsWith('https://'))) {
      return <img src={iconUrl} alt={userName} className="user-icon" />;
    }
    if (iconUrl && typeof iconUrl === 'string' && iconUrl.trim().length > 0) {
      return <span className="user-icon-emoji">{iconUrl}</span>;
    }
    return <span className="user-icon-fallback">{(userName || '').slice(0, 1)}</span>;
  };

  return (
    <div className="app-container">
      <h2 className="app-title">請求画面</h2>

      <div className="card">
        {/* 金額入力 */}
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

        <hr className="divider" />

        {/* ★請求先指定エリア */}
        <div className="input-group">
          <span className="label">請求先指定（任意）</span>
          <button 
            className={`select-user-btn ${selectedUser ? 'selected' : ''}`}
            onClick={handleGoToSelect} // ★ページ遷移関数を呼ぶ
          >
            {selectedUser ? (
              <div className="selected-user-display">
                {renderUserIcon(selectedUser.icon_url, selectedUser.name)}
                <span>{selectedUser.name}</span>
                <span className="change-text">変更</span>
              </div>
            ) : (
              <span className="placeholder-text">ユーザを選択 ＞</span>
            )}
          </button>
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
        <button className="action-button secondary" onClick={() => navigate('/')}>
          戻る
        </button>
      </div>
    </div>
  );
}

export default Request;
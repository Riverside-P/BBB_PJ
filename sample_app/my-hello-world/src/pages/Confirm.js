import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirm.css'; // ★修正ポイント1: パスを ../ に修正

const Confirm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ★修正ポイント2: Send画面から渡された "user" データを受け取る
  // (なければ undefined になるので、空のオブジェクト {} をバックアップにする)
  const { user } = location.state || {};

  const [transferData, setTransferData] = useState(null); // 相手
  const [myBalance, setMyBalance] = useState(null);       // 自分
  const [amount, setAmount] = useState('');               // 金額

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
        // --- 1. 相手データのセット ---
        if (user) {
          // A. Send画面からデータが届いている場合 → それを使う（早い！）
          console.log("受け取ったデータ:", user);
          setTransferData({
            toId: user.id,
            toName: user.name,
            toAccount: user.account_number || '****', // データになければ仮置き
            toIcon: user.icon_url,
          });
        } else {
          // B. データがない場合（URL直打ちなど） → サーバーから取り直す（フォールバック）
          // ※とりあえず ID:2 を固定で取得する設定にしています
          console.log("データがないためサーバーから取得します");
          const toRes = await fetch('http://localhost:3001/users/2');
          const toData = await toRes.json();
          setTransferData({
            toId: toData.id,
            toName: toData.name,
            toAccount: toData.account_number,
            toIcon: toData.icon_url,
          });
        }

        // --- 2. 自分の残高取得 (ID:1) ---
        const fromRes = await fetch('http://localhost:3001/users/1');
        const fromData = await fromRes.json();
        setMyBalance(fromData.balance);

      } catch (err) {
        console.error("データ取得エラー:", err);
      }
    };
    fetchData();
  }, [user]); // userが変わったら再実行

  // 送金ボタン処理
  const handleTransfer = async () => {
    const sendAmount = Number(amount);
    if (sendAmount <= 0) return alert("金額を入力してください");
    if (sendAmount > myBalance) return alert("残高不足です");

    const requestBody = {
      fromId: 1,
      toId: transferData.toId,
      amount: sendAmount
    };

    try {
      // サーバー(3001番)へ送金リクエスト
      const res = await fetch('http://localhost:3001/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        navigate('/complete'); // Homeへ戻る
      } else {
        alert("エラーが発生しました");
      }
    } catch (error) {
      console.error(error);
      alert("通信エラー");
    }
  };

  // 読み込み中表示
  if (!transferData || myBalance === null) {
    return <div className="app-container"><p>Loading...</p></div>;
  }

  const afterBalance = myBalance - Number(amount);

  return (
    <div className="app-container">
      <h2 className="app-title">送金金額の入力</h2>

      <div className="card"> {/* CSSクラス名は適宜調整してください */}
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
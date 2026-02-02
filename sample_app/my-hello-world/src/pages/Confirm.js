import React, { useState, useEffect } from 'react';
import './Confirm.css';

const Confirm = ({ onBack, onComplete }) => {
  const [transferData, setTransferData] = useState(null); // 相手(ID:2)
  const [myBalance, setMyBalance] = useState(null);       // 自分(ID:1)
  const [amount, setAmount] = useState('');               // ★入力された金額

  // 画面が開いたらデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 相手（ID:2）
        const toRes = await fetch('http://localhost:3001/users/2');
        const toData = await toRes.json();

        // 自分（ID:1）
        const fromRes = await fetch('http://localhost:3001/users/1');
        const fromData = await fromRes.json();

        setTransferData({
          toId: toData.id,
          toName: toData.name,
          toAccount: toData.account_number,
          toIcon: toData.icon_url,
        });
        setMyBalance(fromData.balance);

      } catch (err) {
        console.error("データ取得エラー:", err);
      }
    };
    fetchData();
  }, []);

  // 送金ボタンを押した時の処理
  const handleTransfer = async () => {
    const sendAmount = Number(amount);

    // バリデーション（入力チェック）
    if (sendAmount <= 0) {
      alert("金額を入力してください");
      return;
    }
    if (sendAmount > myBalance) {
      alert("残高不足です");
      return;
    }

    // サーバーへ送金依頼
    const requestBody = { 
      fromId: 1, 
      toId: transferData.toId, 
      amount: sendAmount 
    };

    try {
      const res = await fetch('http://localhost:3001/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        // 成功したら、親(App.js)から渡された完了時の処理を実行
        // もし親の設定がまだなら、とりあえずアラートを出してリロード
        if (onComplete) {
          onComplete();
        } else {
          alert("送金完了しました！");
          window.location.reload();
        }
      } else {
        alert("エラーが発生しました");
      }
    } catch (error) {
      alert("通信エラー");
    }
  };

  // 読み込み中
  if (!transferData || myBalance === null) {
    return <div className="container"><p style={{marginTop:'50px'}}>Loading...</p></div>;
  }

  // ★リアルタイム計算：今の残高 - 入力した金額
  const afterBalance = myBalance - Number(amount);

  return (
    <div className="container">
      <h2 className="appTitle">送金金額の入力</h2>

      <div className="card">
        <h3 className="cardTitle">送金先</h3>
        
        <div className="userInfo">
          <img src={transferData.toIcon} alt="icon" className="userIcon" />
          <p className="userName">{transferData.toName} 様</p>
        </div>
        <p className="accountInfo">普通 {transferData.toAccount}</p>
        
        <hr className="divider" />

        {/* ★金額入力エリア */}
        <div className="totalRow" style={{ alignItems: 'center' }}>
          <span className="label">送金金額</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '24px', color: 'white', marginRight: '5px' }}>¥</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="amountInput" 
            />
          </div>
        </div>

        <hr className="divider" />

        {/* 残高シミュレーション */}
        <div className="balancePreview">
          <p className="balanceTitle">送金後の残高</p>
          <div className="balanceRow">
            <span className="balanceBefore">¥{myBalance.toLocaleString()}</span>
            <span className="arrow">→</span>
            {/* マイナスになったら赤文字にする演出 */}
            <span className="balanceAfter" style={{ color: afterBalance < 0 ? '#ff9999' : '#fbbf24' }}>
              ¥{afterBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="buttonGroup">
        <button className="btnPrimary" onClick={handleTransfer}>
          送金する
        </button>
        {/* 親から onBack が渡されていれば実行、なければ何もしない */}
        <button className="btnSecondary" onClick={onBack ? onBack : () => {}}>
          戻る
        </button>
      </div>
    </div>
  );
};

export default Confirm;
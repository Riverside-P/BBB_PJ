// src/pages/Pay.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Pay.module.css'; 

const Pay = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 前の画面から渡されたユーザー情報
  const { user } = location.state || {};

  const [transferData, setTransferData] = useState(null); 
  const [myBalance, setMyBalance] = useState(null);       
  const [payerName, setPayerName] = useState('');         

  // ★ここでダミー金額を固定設定（GUIからは変更不可）
  const DUMMY_AMOUNT = 3000; 

  // 【ロジック】
  // 1. 氏名が未入力
  // 2. または、残高が固定金額より少ない
  // いずれかでボタンをグレーアウト
  const isDisabled = 
    payerName.trim().length === 0 || 
    (myBalance !== null && myBalance < DUMMY_AMOUNT);

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

  const handleTransfer = async () => {
    if (DUMMY_AMOUNT > myBalance) return alert("残高不足のため支払えません。");

    const requestBody = { 
      fromId: 1, 
      toId: transferData.toId, 
      amount: DUMMY_AMOUNT, // 固定値を送信
      payerName: payerName,
      message: "請求支払い"
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
      alert("通信エラーが発生しました");
    }
  };

  if (!transferData || myBalance === null) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  const afterBalance = myBalance - DUMMY_AMOUNT;

  return (
    <div className={styles.container}>
      <h2 className={styles.appTitle}>請求内容の確認</h2>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>請求元</h3>

        <div className={styles.userInfo}>
          <img
             src={transferData.toIcon || 'https://placehold.jp/150x150.png'}
             alt="icon"
             className={styles.userIcon}
          />
          <p className={styles.userName}>{transferData.toName} 様</p>
        </div>
        <p className={styles.accountInfo}>普通 {transferData.toAccount}</p>

        <hr className={styles.divider} />

        {/* 【修正】支払金額を「表示のみ」に変更（inputを削除） */}
        <div className={styles.totalRow}>
          <span className={styles.label}>支払金額</span>
          <span className={styles.amountValue}>¥{DUMMY_AMOUNT.toLocaleString()}</span>
        </div>

        <div className={styles.balancePreview}>
          <p className={styles.balanceTitle}>メッセージ</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>いつもご利用ありがとうございます。
          </p>
        </div>

        <hr className={styles.divider} />

        {/* 支払者氏名：こちらは引き続き入力可能 */}
        <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'column' }}>
          <span className={styles.label}>支払者氏名</span>
          <input
            type="text"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            placeholder="例: 三菱 太郎"
            className={styles.amountInput}
          />
        </div>

        {/* 残高予測 */}
        <div className={styles.balanceRow} style={{marginTop: '20px'}}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>支払後の残高予測</span>
        </div>
        <div className={styles.balanceRow}>
          <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>¥{myBalance.toLocaleString()}</span>
          <span className={styles.arrow}>→</span>
          <span style={{ color: afterBalance < 0 ? '#ff4d4d' : '#fbbf24' }}>
            ¥{afterBalance.toLocaleString()}
          </span>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.btnPrimary} ${isDisabled ? styles.disabled : ''}`}
          onClick={handleTransfer}
          disabled={isDisabled}
        >
          {afterBalance < 0 ? '残高不足のため支払不可' : '支払する'}
        </button>
        <button className={styles.btnSecondary} onClick={() => navigate(-1)}>
          戻る
        </button>
      </div>
    </div>
  );
};

export default Pay;
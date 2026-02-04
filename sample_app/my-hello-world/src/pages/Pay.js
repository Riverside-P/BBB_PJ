// src/pages/Pay.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Pay.module.css'; 

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transferData, setTransferData] = useState(null); 
  const [myBalance, setMyBalance] = useState(null);       
  const [payerData, setPayerData] = useState(null);    

  // 【ロジック】
  // 1. 氏名が未入力
  // 2. または、残高が固定金額より少ない
  // いずれかでボタンをグレーアウト
  const isDisabled = false;

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        // URL指定をバッククォート ` に修正（${id}を有効化するため）
        const toRes = await fetch(`http://localhost:3001/link/${id}`);
        const toData = await toRes.json();

        // 【追加】ステータスが 1（支払い済み/無効）ならホームへ戻す
        if (toData.status === 1 && !ignore) {
          alert("この請求リンクは既に使用済みか、無効になっています。");
          navigate('/failed'); // ホーム画面のパスに合わせて変更してください
          return; // ここで処理を終了し、下の setTransferData は実行させない
        }

        setTransferData({
          toId: toData.requester_user_id,
          toName: toData.requester_name,
          toAccount: toData.requester_account,
          toIcon: toData.requester_icon,
          toComment: toData.comment,
          toAmount: toData.amount,
          toStatus: toData.status,
        });

      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();

    return () => {
      ignore = true;
    };
  }, [id]); // ← ここに [id] を追加！

  useEffect(() => {
    const fetchMyData = async() => {
      try{
        const toRes = await fetch('http://localhost:3001/users/2');
        const toData = await toRes.json();

        setPayerData({
          toId: toData.id,
          toName: toData.name,
          toAmount: toData.balance,
        });

        setMyBalance(toData.balance);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchMyData();
  },[id]);

  const handleTransfer = async () => {
    if (transferData.toAmount > myBalance) return alert("残高不足のため支払えません。");

    const requestBody = { 
      fromId: payerData.toId, 
      toId: transferData.toId, 
      amount: transferData.toAmount,
      payerName: payerData.toName,
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

  const afterBalance = myBalance - transferData.toAmount;

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
          <span className={styles.amountValue}>¥{transferData.toAmount}</span>
        </div>

        <div className={styles.balancePreview}>
          <p className={styles.balanceTitle}>メッセージ</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{transferData.toComment}
          </p>
        </div>

        <hr className={styles.divider} />

        {/* 支払者氏名：こちらは引き続き入力可能 */}
        <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'column' }}>
          <span className={styles.label}>支払者氏名</span>
          <p className={styles.userName}>{payerData.toName} </p>
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
        <button className={styles.btnPrimary} onClick={() => navigate(-1)}>
          戻る
        </button>
      </div>
    </div>
  );
};

export default Pay;
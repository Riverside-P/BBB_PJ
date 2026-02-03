import React, { useState, useEffect } from 'react';
import './Home.css'; // 次のステップで作るCSSファイルを読み込み

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // APIからデータを取得する関数
    const fetchUserData = async () => {
      try {
        // ★本来はここでバックエンド(Node.js)からデータを取得します
        // const response = await fetch('http://localhost:3000/api/user/me');
        // const data = await response.json();
        // setUserInfo(data);
        
        // ★今はまだバックエンドがないと仮定して、ダミーデータをセットします
        // （バックエンドができたら、ここを消して上のfetchを有効にしてください）
        const dummyData = {
          name: "山田 太郎",
          accountNumber: "123-4567-89",
          balance: 50000,
          iconUrl: "https://via.placeholder.com/150" // 仮のアイコン画像
        };
        
        // ローディングの雰囲気を出すために少し遅延させています
        setTimeout(() => {
          setUserInfo(dummyData);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error("データの取得に失敗しました", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="home-container">
      {/* ヘッダー部分：アイコンと名前 */}
      <div className="user-header">
        <div className="icon-wrapper">
          <img 
            src={userInfo.iconUrl} 
            alt="User Icon" 
            className="user-icon" 
          />
        </div>
        <h2 className="user-name">{userInfo.name} 様</h2>
      </div>

      {/* メインカード部分：残高と口座番号 */}
      <div className="balance-card">
        <p className="label">現在の残高</p>
        <h1 className="balance-amount">
          ¥ {userInfo.balance.toLocaleString()}
        </h1>
        
        <div className="account-info">
          <span className="label-small">口座番号:</span>
          <span className="account-number">{userInfo.accountNumber}</span>
        </div>
      </div>

      {/* 操作ボタン（今後のために入れておきました） */}
      <div className="action-buttons">
        <button className="btn-send">送金する</button>
        <button className="btn-history">履歴を見る</button>
      </div>
    </div>
  );
};

export default Home;
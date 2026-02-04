import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Failed.css'; 

// 画像は centralized images ディレクトリへ
import checkMarkImg from '../images/mark_batsu.png'; 

function Complete() {
  const navigate = useNavigate();

  return (
    <div className="complete-container">
      <div className="content-wrapper">
        {/* 成功を表すアイコン画像 */}
        <div className="success-icon-area">
          <img 
            src={checkMarkImg} 
            alt="失敗" 
            className="check-mark-img" 
          />
        </div>
        
        <h1 className="success-title">支払いに失敗しました...</h1>
        <p className="success-message">
          この請求書は無効です。
        </p>
      </div>

      {/* 画面下部のボタンエリア */}
      <div className="footer-area">
        <button 
          className="btn-top" 
          onClick={() => navigate('/')}
        >
          トップへ
        </button>
      </div>
    </div>
  );
}

export default Complete;
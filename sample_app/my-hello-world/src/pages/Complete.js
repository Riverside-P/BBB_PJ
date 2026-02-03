import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Complete.css'; 

// 画像は centralized images ディレクトリへ
import checkMarkImg from '../images/approval.png'; 

function Complete() {
  const navigate = useNavigate();

  return (
    <div className="complete-container">
      <div className="content-wrapper">
        {/* 成功を表すアイコン画像 */}
        <div className="success-icon-area">
          <img 
            src={checkMarkImg} 
            alt="完了" 
            className="check-mark-img" 
          />
        </div>
        
        <h1 className="success-title">送金が完了しました！</h1>
        <p className="success-message">
          お取引ありがとうございます。<br />
          手続きが正常に完了しました。
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
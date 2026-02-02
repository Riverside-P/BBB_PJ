import React from 'react';
import '../App.css'; // 上の階層のCSSを読み込む

// 仮の送金データ
const dummyTransfer = {
  toName: '鈴木 一郎',
  toAccount: '123-4567-89',
  amount: 10000,
  fee: 220,
};

const Confirm = () => {
  const totalAmount = dummyTransfer.amount + dummyTransfer.fee;

  return (
    <div className="container">
      <header className="header-simple">
        <h2 className="page-title">送金内容の確認</h2>
      </header>

      <main>
        <div className="card">
          <h3 className="card-title">送金先</h3>
          <p className="confirm-text-large">{dummyTransfer.toName} 様</p>
          <p className="confirm-text-sub">普通 {dummyTransfer.toAccount}</p>
          
          <hr className="divider" />

          <div className="detail-row">
            <span className="label">送金金額</span>
            <span className="value">¥{dummyTransfer.amount.toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span className="label">手数料</span>
            <span className="value">¥{dummyTransfer.fee.toLocaleString()}</span>
          </div>

          <hr className="divider" />

          <div className="detail-row total-row">
            <span className="label">お支払い合計</span>
            <span className="value">¥{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary">この内容で送金する</button>
          <button className="btn btn-secondary">戻る</button>
        </div>
      </main>
    </div>
  );
};

export default Confirm;
import React, { useState, useEffect } from 'react';
import '../styles/Link.css';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocationを追加

function Link() {
  const navigate = useNavigate();
  const location = useLocation(); // 受け取り用のフック
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Request.js から渡された linkId を取得
    // (?. を使って、データがない場合のエラーを防ぎます)
    const linkId = location.state?.linkId;

    if (linkId && typeof window !== 'undefined') {
      // 2. 現在のドメインを取得 (例: http://localhost:3000)
      const origin = window.location.origin;

      // 3. 相手に送るURLを作成
      // 例: http://localhost:3000/pay/15
      // ※ '/pay/' の部分は、後で作る「支払い画面」のルートに合わせて変更してください
      const shareUrl = `${origin}/pay/${linkId}`;
      
      setUrl(shareUrl);
    } else {
      // IDがない場合（直接このページに来た場合など）の処理
      // 必要に応じてTOPへ戻すなどのガードを入れても良いです
      setUrl('リンクの生成に失敗しました');
    }
  }, [location.state]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="link-container">
      <h1>共有リンク</h1>
      <p style={{textAlign: 'center', fontSize: '14px', color: '#666'}}>
        以下のリンクを相手に送ってください
      </p>
      <input
        type="text"
        readOnly
        value={url}
        className="link-input"
      />
      <div className="button-group">
        <button
          className="copy-button"
          onClick={handleCopy}
          disabled={!url || url === 'リンクの生成に失敗しました'}
        >
          {copied ? 'コピーしました' : 'リンクをコピー'}
        </button>
        <button
          className="top-button"
          onClick={() => navigate('/')}
        >
          TOPへ
        </button>
      </div>
    </div>
  );
}

export default Link;
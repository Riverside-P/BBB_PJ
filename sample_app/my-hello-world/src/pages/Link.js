import React, { useState, useEffect } from 'react';
import '../styles/Link.css';
import { useNavigate } from 'react-router-dom';

function Link() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

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

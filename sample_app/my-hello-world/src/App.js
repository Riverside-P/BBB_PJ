import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import { UserProvider } from './UserContext';
import Home from './pages/Home';
import Send from './pages/Send';
import Confirm from './pages/Confirm';
import Complete from './pages/Complete';
import ReqHis from './pages/ReqHis';
import Request from './pages/Request';
import Payerselect from './pages/Payerselect';
import Link from './pages/Link';
import Pay from './pages/Pay'; // ← 追加
import TransferHistory from './pages/TransferHistory'; // ← 追加

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/send" element={<Send />} />
          <Route path="/complete" element={<Complete />} />

          {/* 追加：請求履歴（従来通り） */}
          <Route path="/reqhis" element={<ReqHis />} />

          {/* 取引履歴は別ページで表示（後述） */}
          <Route path="/transaction-history" element={<TransferHistory />} />

          <Route path="/request" element={<Request />} />
          <Route path="/payerselect" element={<Payerselect />} />
          <Route path="/link" element={<Link />} />
          <Route path="/pay/:linkId" element={<Pay />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
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

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/send" element={<Send />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/reqhis" element={<ReqHis />} />
          <Route path="/request" element={<Request />} />
          <Route path="/payerselect" element={<Payerselect />} />
          <Route path="/link" element={<Link />} />
          <Route path="/pay/:linkId" element={<Pay />} /> {/* ← 追加 */}
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
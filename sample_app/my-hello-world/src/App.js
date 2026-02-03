import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Send from './pages/Send';
import Confirm from './pages/Confirm';
import Complete from './pages/Complete';
import ReqHis from './pages/ReqHis';
import Request from './pages/Request';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/send" element={<Send />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/reqhis" element={<ReqHis />} />
        <Route path="/request" element={<Request />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
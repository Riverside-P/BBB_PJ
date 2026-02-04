import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Send from './pages/Send';
import Confirm from './pages/Confirm';
import Complete from './pages/Complete';
import ReqHis from './pages/ReqHis';
import Request from './pages/Request';

import Link from './pages/Link';
import Pay from './pages/Pay';


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
        <Route path="/link" element={<Link />} />
        <Route path="/pay/:id" element={<Pay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
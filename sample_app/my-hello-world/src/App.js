import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router"
import './pages/Home';
import Home from './pages/Home';
import Send from './pages/Send';
import Confirm from './pages/Confirm';
import Complete from './pages/Complete';
import Request from './pages/Request';
import Link from './pages/Link';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/send" element={<Send />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/request" element={<Request />} />
        <Route path="/link" element={<Link />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
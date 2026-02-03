import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router"
import './pages/Home';
import Home from './pages/Home';
import Send from './pages/Send';
import Confirm from './pages/Confirm';
import Complete from './pages/Complete';
import Pay from './pages/Pay';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/send" element={<Send />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/pay" element={<Pay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
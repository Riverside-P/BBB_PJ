import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router"
import './pages/Home';
import Home from './pages/Home';
import Send from './pages/Send';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/send" element={<Send />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import logo from './logo.svg';
import './App.css';
// src/App.js
import React from 'react';
import HelloWorld from './HelloWorld';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div className="Hello">
          <HelloWorld />
        </div>
      </header>
    </div>
  );
}

export default App;

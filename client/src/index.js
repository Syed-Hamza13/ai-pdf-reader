// ============================================
// client/src/index.js
// ============================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './pages/App.jsx';
const a = 42;
console.log('The answer is', a);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


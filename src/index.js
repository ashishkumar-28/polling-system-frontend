import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // This imports the App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // The root ID from your HTML file
);

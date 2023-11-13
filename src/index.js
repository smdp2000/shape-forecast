import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
const gradientBackgroundStyle = {
  background: 'linear-gradient(180deg, #333, #1c1c1c)', // This creates a light black gradient
  color: 'white', // This sets the text color to white for all child elements
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode style ={{gradientBackgroundStyle}}>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

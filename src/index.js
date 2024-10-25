import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DateProvider } from './Context/DateContext';
import Buttons from './components/Buttons/Buttons';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DateProvider>
        <Buttons/>
        <App />
        <ToastContainer autoClose={3000} /> {/* 3 seconds for auto close */}
      </DateProvider>
    </BrowserRouter> 
  </React.StrictMode>
);


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PortalWrap from './portal';
import './index.css';
import Chatbox from './components/ui/chatbox';
import Taglist from './components/ui/taglist'
import Header from './components/ui/header'
import Footer from './components/ui/footer';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const IndexWrap = () => {
  return (
    <React.StrictMode>
      <Header />
      <div className="main-container">
       <Taglist />
       <Chatbox />
      </div>
      <Footer />
    </React.StrictMode>
  );
}

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<IndexWrap />} />
        <Route path="/portal" element={<PortalWrap />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
import React, { useState } from 'react'; // Voeg useState toe
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PortalWrap from './portal';
import './index.css';
import Chatbox from './components/ui/chatbox';
import Taglist from './components/ui/taglist';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const IndexWrap = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // useState correct importeren

  return (
    <React.StrictMode>
      <Header />
      <div className="main-container">
        <Taglist selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        <Chatbox 
          selectedTags={selectedTags} 
          setSelectedTags={setSelectedTags} 
        />
      </div>
      <Footer />
    </React.StrictMode>
  );
};

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

reportWebVitals();

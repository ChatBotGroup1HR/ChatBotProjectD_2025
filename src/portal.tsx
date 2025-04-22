import React from 'react';
import './portal.css';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';
import reportWebVitals from './reportWebVitals';

const PortalBody = () => {
  return (
    <div className='portalBody'>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <h1>Admin Portal</h1>
          <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>
        </div>
      </div>
    </div>
  );
}

const PortalWrap = () => {
  return (
    <React.StrictMode>
      <Header />
      <PortalBody />
      <Footer />
      
    </React.StrictMode>
  );
};

export default PortalWrap;

reportWebVitals();
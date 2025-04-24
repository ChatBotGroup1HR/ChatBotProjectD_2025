import React, { useState } from 'react';
import './portal.css';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';
import reportWebVitals from './reportWebVitals';

const PortalBody = () => {
  const [hideContent, setHideContent] = useState(false);

  const handleAddTagsClick = () => {
    setHideContent(true);
  };

  const handleCloseModal = () => {
    setHideContent(false);
  };

  return (
    <div className='portalBody'>
      <div className="admin-layout">
        <Sidebar onAddTagsClick={handleAddTagsClick} onCloseModal={handleCloseModal} />
        <div className="admin-content">
          {!hideContent && (
            <>
              <h1>Admin Portal</h1>
              <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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

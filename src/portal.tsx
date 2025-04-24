import React, { useState } from 'react';
import './portal.css';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';
import FileUpload from './components/ui/fileupload';
import reportWebVitals from './reportWebVitals';

const PortalBody = () => {
  const [activePage, setActivePage] = useState<string>('');

  const handleSidebarItemClick = (path: string) => {
    setActivePage(path);
  };

  return (
    <div className='portalBody'>
      <div className="admin-layout">
        <Sidebar onItemClick={handleSidebarItemClick} />
        <div className="admin-content">
          {activePage === '/fileupload' ? (
            <FileUpload />
          ) : (
            <>
              <h1>Admin Portal</h1>
              <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>
            </>
          )}
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
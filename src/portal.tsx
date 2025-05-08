import React, { useState, useEffect } from 'react';
import './portal.css';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';
import FileUpload from './components/ui/fileupload';
import Login from './components/ui/login';
import PocketBase from 'pocketbase';
import reportWebVitals from './reportWebVitals';

const pb = new PocketBase('http://localhost:8090');

const PortalBody = () => {
  const [activePage, setActivePage] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid);
  }, []);

  const handleSidebarItemClick = (path: string) => {
    setActivePage(path);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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
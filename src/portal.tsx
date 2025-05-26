import React, { useState, useEffect } from 'react';

import './portal.css';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';

import DocumentsPage from './components/ui/DocumentPage';
import FileUpload from './components/ui/fileupload';
import Login from './components/ui/login';
import PocketBase from 'pocketbase';
import reportWebVitals from './reportWebVitals';
import AddTagPage from './components/ui/addtags';
import TagOverzicht from './components/ui/tagoverzicht';

const pb = new PocketBase('http://localhost:8090');

const PortalBody = () => {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <h1>Admin Portal</h1>
            <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>
          </>
        );
      case 'documents':
        return <DocumentsPage />;
      case 'fileupload':
        return <FileUpload />;
      case 'profile':
        return <h1>Profiel Pagina</h1>;
      case 'settings':
        return <h1>Instellingen Pagina</h1>;
      case 'addtags':
        return <AddTagPage />;
      case 'tagoverzicht':
        return (
          <TagOverzicht
            tagId={activeTagId ?? undefined}
            onBack={() => setActiveTagId(null)}
          />
        );
      default:
        return (
          <>
            <h1>Admin Portal</h1>
            <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>
          </>
        );
    }
  };

  return (
    <div className='portalBody'>
      <div className="admin-layout">
        <Sidebar
          onMenuItemClick={(page) => {
            setActivePage(page);
            if (page !== 'tagoverzicht') setActiveTagId(null);
          }}
        />
        <div className="admin-content">
          {renderContent()}
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
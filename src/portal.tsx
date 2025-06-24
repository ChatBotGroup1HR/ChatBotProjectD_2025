import React, { useState, useEffect } from 'react';

import './portal.css';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';

import DocumentsPage from './components/ui/DocumentPage';
import FileUpload from './components/ui/fileupload';
import Login from './components/ui/login';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from './config';
import AddTagPage from './components/ui/addtags';
import TagOverzicht from './components/ui/tagoverzicht';
import Dashboard from './components/ui/dashboard';


const pb = new PocketBase(POCKETBASE_URL);

const PortalBody = () => {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    console.log('PortalBody: Checking authentication status');
    console.log('PortalBody: PocketBase URL:', POCKETBASE_URL);
    setIsAuthenticated(pb.authStore.isValid);
    
    // Test connection to PocketBase
    fetch(`${POCKETBASE_URL}/api/health`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        console.log('PortalBody: PocketBase connection successful');
        setConnectionError(null);
      })
      .catch(error => {
        console.error('PortalBody: PocketBase connection failed:', error);
        setConnectionError(`Cannot connect to PocketBase: ${error.message}`);
      });
  }, []);

  const handleLoginSuccess = () => {
    console.log('PortalBody: Login successful');
    setIsAuthenticated(true);
  };

  if (connectionError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Connection Error</h2>
        <p>{connectionError}</p>
        <p>Please check if PocketBase is running at: {POCKETBASE_URL}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('PortalBody: Not authenticated, showing login');
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  console.log('PortalBody: Authenticated, rendering content for page:', activePage);

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <h1>Admin Portal</h1>
            <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>
          </>
        );
      case 'dashboard':
        return <Dashboard />
      case 'documents':
        return <DocumentsPage />;
      case 'fileupload':
        return <FileUpload />;
      case 'addtags':
        return <AddTagPage />;
      case 'tagoverzicht':
        return <TagOverzicht />
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
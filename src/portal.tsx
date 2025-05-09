import React, { useState } from 'react';
import './portal.css';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';
import DocumentsPage from './components/ui/DocumentPage'; // Importeer de documentenpagina

const PortalBody = () => {
  const [activePage, setActivePage] = useState<string>('dashboard'); // State voor actieve pagina

  return (
    <div className='portalBody'>
      <div className="admin-layout">
        <Sidebar onMenuItemClick={(page) => setActivePage(page)} /> {/* Callback toevoegen */}
        <div className="admin-content">
          {activePage === 'dashboard' && (
            <>
              <h1>Admin Portal</h1>
              <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>
            </>
          )}
          {activePage === 'documents' && <DocumentsPage />} {/* Toon de documentenpagina */}
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
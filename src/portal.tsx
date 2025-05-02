import React, { useState } from 'react';
import Header from './components/ui/header';
import Footer from './components/ui/footer';
import Sidebar from './components/ui/sidebar';
import DocumentsPage from './components/ui/DocumentsPage'; // Zorg ervoor dat dit pad klopt

const PortalBody = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State voor sidebar
  const [showDocuments, setShowDocuments] = useState(false); // State voor documentenweergave

  // Toggle functie voor de sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Toggle functie voor de documenten
  const toggleDocuments = () => {
    setShowDocuments(!showDocuments);
  };

  return (
    <div className="portalBody">
      <div className="admin-layout">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="admin-content">
          <h1>Admin Portal</h1>
          <p>Selecteer een optie in de sidebar om de pagina te bekijken.</p>

          {/* Knop om de documenten te tonen of te verbergen */}
          <button onClick={toggleDocuments}>
            {showDocuments ? 'Verberg documenten' : 'Toon documenten'}
          </button>

          {/* Toon de documenten als showDocuments true is */}
          {showDocuments && <DocumentsPage />}
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

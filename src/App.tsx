import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import Sidebar from './components/ui/sidebar';
import './App.css'; // Zorg ervoor dat je CSS goed is ingesteld.

const pb = new PocketBase('http://localhost:8090');

interface FileRecord {
  id: string;
  name: string;
  file: string;
  created: string;
}

const App = () => {
  const [documents, setDocuments] = useState<FileRecord[]>([]); // Array van documenten
  const [loading, setLoading] = useState<boolean>(true); // Laadstatus
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open of gesloten

  const fetchDocuments = async () => {
    try {
      // Haal alle documenten op uit de collectie 'files'
      const records = await pb.collection('files').getFullList<FileRecord>({
        sort: 'name', // Sorteer op naam
      });

      setDocuments(records); // Zet de documenten in de state
    } catch (err) {
      console.error('Fout bij ophalen van documenten:', err); // Foutafhandelingsbericht
    } finally {
      setLoading(false); // Verberg de laadstatus wanneer het ophalen is voltooid
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`content ${isSidebarOpen ? 'open' : 'closed'}`}>
        <h1>Documenten</h1>

        {/* Laadindicator */}
        {loading && <p>Bezig met laden...</p>}

        {/* Lijst van documenten */}
        {!loading && documents.length === 0 && <p>Geen documenten gevonden.</p>}

        <ul>
          {/* Itereer over de documenten en toon ze */}
          {documents.map(doc => (
            <li key={doc.id}>
              <a href={pb.getFileUrl(doc, doc.file)} target="_blank" rel="noopener noreferrer">
                📄 {doc.name || doc.file} {/* Gebruik de naam of bestandnaam */}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

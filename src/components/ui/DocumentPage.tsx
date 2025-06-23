import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import './DocumentPage.css';

const pb = new PocketBase('http://localhost:8090');

export function filterDocuments(documents: any[], searchTerm: string): any[] {
  return documents.filter(doc =>
    (doc.name || doc.file || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await pb.collection('files').getFullList({
        expand: 'tag',
      });
      setDocuments(response);
      setError(null);
    } catch (err) {
      setError('Kan documenten niet ophalen.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDocument = (doc: any) => {
    setSelectedDocument({
      id: doc.id,
      name: doc.name || '',
    });
  };

  const handleUpdateDocument = async (updatedDoc: any) => {
    if (!updatedDoc.id) return;

    try {
      await pb.collection('files').update(updatedDoc.id, {
        name: updatedDoc.name,
      });
      await fetchDocuments(); // Refresh de lijst met bijgewerkte data
      setSelectedDocument(null);
    } catch (err) {
      setError('Kan document niet bijwerken.');
    }
  };

  const filteredDocuments = filterDocuments(documents, searchTerm);

  return (
    <div className="ndw-container">
      <h1>📁 Documenten</h1>

      <input
        type="text"
        placeholder="Zoek op bestandsnaam..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="ndw-search"
      />

      {loading && <p>⏳ Bezig met laden...</p>}
      {error && <p className="ndw-error">{error}</p>}
      {!loading && documents.length === 0 && <p>📭 Geen documenten gevonden.</p>}

      <div className="ndw-table-container">
        <table className="ndw-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Tags</th>
              <th>Download</th>
              <th>Actie</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr key={doc.id}>
                <td>
                  {selectedDocument?.id === doc.id ? (
                    <input
                      type="text"
                      value={selectedDocument.name || ''}
                      onChange={(e) =>
                        setSelectedDocument({
                          ...selectedDocument,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    doc.name || doc.file
                  )}
                </td>

                <td>
                  {doc.expand?.tag?.length > 0 ? (
                    doc.expand.tag.map((tag: any) => (
                      <span
                        key={tag.id}
                        style={{
                          backgroundColor: '#e0f7fa',
                          color: '#00796b',
                          padding: '4px 8px',
                          borderRadius: '16px',
                          fontSize: '0.85rem',
                          display: 'inline-block',
                          marginRight: '4px',
                        }}
                      >
                        ☁️ {tag.tag || tag.name}
                      </span>
                    ))
                  ) : (
                    <span
                      style={{
                        backgroundColor: '#fbe9e7',
                        color: '#d84315',
                        padding: '4px 8px',
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                      }}
                    >
                      🚫 Geen tags
                    </span>
                  )}
                </td>

                <td>
                  {doc.file ? (
                    <a
                      href={pb.files.getUrl(doc, doc.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'underline' }}
                    >
                      📥 Download
                    </a>
                  ) : (
                    'Geen bestand'
                  )}
                </td>

                <td>
                  {selectedDocument?.id === doc.id ? (
                    <>
                      <button onClick={() => handleUpdateDocument(selectedDocument)}>Opslaan</button>
                      <span style={{ display: 'inline-block', width: '12px' }}></span>
                      <button onClick={() => setSelectedDocument(null)}>Annuleren</button>
                    </>
                  ) : (
                    <button onClick={() => handleSelectDocument(doc)}>Bewerk</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

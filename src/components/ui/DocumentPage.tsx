import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import './DocumentPage.css';

const pb = new PocketBase('http://localhost:8090');

export default function DocumentPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Zoekterm
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

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
      await fetchDocuments();
      setSelectedDocument(null);
    } catch (err) {
      setError('Kan document niet bijwerken.');
    }
  };

  // Filter documenten op naam of tag
  const filteredDocuments = documents.filter((doc) => {
    const nameMatch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = doc.expand?.tag?.some((tag: any) =>
      (tag.tag || tag.name)?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameMatch || tagMatch;
  });

  // Sorteer documenten alfabetisch op naam
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  // Paginatie berekeningen
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="ndw-container">
      <h1>📁 Documenten</h1>

      {/* Zoekbalk */}
      <input
        type="text"
        placeholder="🔍 Zoek op naam of tag..."
        className="ndw-searchbar"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset naar pagina 1 bij zoeken
        }}
      />

      {loading && <p>⏳ Bezig met laden...</p>}
      {error && <p className="ndw-error">{error}</p>}
      {!loading && sortedDocuments.length === 0 && <p>📭 Geen documenten gevonden.</p>}

      {/* Tabel zonder scroll container */}
      <table
        className="ndw-table"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: 'none',
          marginTop: '10px',
          borderRadius: '4px',
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Naam</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Tags</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Download</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Actie</th>
          </tr>
        </thead>
        <tbody>
          {currentDocuments.map((doc) => (
            <tr key={doc.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #f5f5f5' }}>
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

              <td style={{ padding: '8px', borderBottom: '1px solid #f5f5f5' }}>
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

              <td style={{ padding: '8px', borderBottom: '1px solid #f5f5f5' }}>
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

              <td style={{ padding: '8px', borderBottom: '1px solid #f5f5f5' }}>
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

      {/* Paginatie onder de tabel */}
      {totalPages > 1 && (
        <div className="ndw-pagination" style={{ marginTop: '10px' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Vorige
          </button>
          <span style={{ margin: '0 10px' }}>
            Pagina {currentPage} van {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Volgende
          </button>
        </div>
      )}
    </div>
  );
}

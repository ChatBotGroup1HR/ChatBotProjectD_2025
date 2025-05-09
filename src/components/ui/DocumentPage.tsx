import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await pb.collection('files').getFullList({
          expand: 'tag', // ⬅️ Haal de gekoppelde tags ook op
        });
        setDocuments(response);
      } catch (err) {
        console.error('Fout bij ophalen bestanden:', err);
        setError('Kan documenten niet ophalen.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📁 Documenten</h1>
      {loading && <p>⏳ Bezig met laden...</p>}
      {error && documents.length === 0 && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && documents.length === 0 && <p>📭 Geen documenten gevonden.</p>}
      <ul>
  {documents.map((doc) => {
    const fileUrl = pb.getFileUrl(doc, doc.file);
    const tags = doc.expand?.tag;

    return (
      <li key={doc.id} style={{ marginBottom: '20px' }}>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={doc.name || doc.file}
        >
          📎 {doc.name || doc.file}
        </a>

        {/* Tags */}
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.map((tag: any, index: number) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e0f7fa',
                  color: '#00796b',
                  padding: '4px 8px',
                  borderRadius: '16px',
                  fontSize: '0.85rem',
                  display: 'inline-block',
                }}
              >
                ☁️ {tag.tag}
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
        </div>
      </li>
    );
  })}
</ul>
    </div>
  );
}

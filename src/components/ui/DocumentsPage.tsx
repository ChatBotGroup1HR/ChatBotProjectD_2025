import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090'); // Let op: dit moet correct overeenkomen met je backend

interface FileItem {
  id: string;
  file: string;
  name?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📄 DocumentsPage geladen');
    
    const fetchDocuments = async () => {
      console.log('📡 Ophalen bestanden...');
      try {
        const response = await pb.collection('files').getFullList();
        console.log('📂 Response van PocketBase:', response);

        const mapped = response.map((doc: any) => ({
          id: doc.id,
          file: doc.file,
          name: doc.name || doc.file,
        }));

        console.log('✅ Gemapte documenten:', mapped);
        setDocuments(mapped);
      } catch (err) {
        console.error('❌ Fout bij ophalen bestanden:', err);
        setError('Kan documenten niet ophalen.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Debug log om de documentlijst te controleren
  console.log('Documents state:', documents);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📁 Documenten</h1>
      {loading && <p>⏳ Bezig met laden...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && documents.length === 0 && <p>📭 Geen documenten gevonden.</p>}

      <ul>
        {documents.map((doc) => (
          <li key={doc.id} style={{ marginBottom: '10px' }}>
            <a
              href={pb.getFileUrl(doc, doc.file)}
              target="_blank"
              rel="noopener noreferrer"
            >
              📎 {doc.name || doc.file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import './TagDetailPage.css';

interface TagDetailPageProps {
  tagId?: string;
  onBack?: () => void;
}

interface FileRecord {
  id: string;
  name?: string;
  file: string;
}

const pb = new PocketBase('http://localhost:8090');

const TagDetailPage: React.FC<TagDetailPageProps> = ({ tagId, onBack }) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tagId) return;
    setLoading(true);
    setError(null);

    pb.collection('files')
      .getFullList({
        filter: `tag ~ "${tagId}"`,
      })
      .then((records: any[]) => {
        setFiles(records);
        setError(null);
      })
      .catch((err) => setError('Fout bij ophalen bestanden'))
      .finally(() => setLoading(false));
  }, [tagId]);

  return (
    <div className="tagdetail-container">
      <div className ="tagdetail-page">
      <div className="tagdetail-content">
        <h2 className="tagdetail-title">Bestanden met deze tag</h2>
        {loading && <p>Bestanden laden...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && files.length === 0 && <p>Geen bestanden gevonden.</p>}
        <ul className="tagdetail-list">
          {files.map((file) => (
            <li key={file.id}>
              {file.name || file.file}
            </li>
          ))}
        </ul>
        {onBack && (
          <button className="tagdetail-back-btn" onClick={onBack}>
            Terug
          </button>
        )}
      </div>
      </div>
    </div>
  );
};

export default TagDetailPage;
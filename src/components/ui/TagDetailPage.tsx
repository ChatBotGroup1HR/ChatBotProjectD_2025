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
  expand?: {
    tag?: any[];
  };
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
        expand: 'tag',
      })
      .then((records: any[]) => {
        setFiles(records);
        setError(null);
      })
      .catch(() => setError('Fout bij ophalen bestanden'))
      .finally(() => setLoading(false));
  }, [tagId]);

  const tagName =
    files.length > 0 && files[0].expand?.tag && Array.isArray(files[0].expand.tag) && files[0].expand.tag.length > 0
      ? files[0].expand.tag[0].tag
      : null;

  return (
    <div className="ndw-container">
      <h1>📁 Bestanden met tag: <span>{tagName}</span></h1>

      {loading && <p>⏳ Bestanden laden...</p>}
      {error && <p className="ndw-error">{error}</p>}
      {!loading && files.length === 0 && <p>📭 Geen bestanden gevonden.</p>}

      <table className="ndw-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.name || file.file}</td>
              <td>
                {Array.isArray(file.expand?.tag) && (file.expand?.tag?.length ?? 0) > 0 ? (
                  file.expand?.tag?.map((tag: any) => (
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
            </tr>
          ))}
        </tbody>
      </table>

      {onBack && (
        <button
          style={{
            marginTop: '24px',
            padding: '8px 20px',
            background: '#f47c20',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onClick={onBack}
        >
          Terug
        </button>
      )}
    </div>
  );
};

export default TagDetailPage;
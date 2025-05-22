import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

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
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'orangered', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        {`📁 Bestanden met ${tagName} tag`}
      </h2>
      {loading && <p>⏳ Bestanden laden...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && files.length === 0 && <p>📭 Geen bestanden gevonden.</p>}
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {files.map((file) => {
          const fileUrl = pb.getFileUrl(file, file.file);
          const tags = file.expand?.tag;
          return (
            <li key={file.id} style={{ marginBottom: '20px', background: '#fff', borderRadius: '10px', padding: '18px', boxShadow: '0 1px 4px #eee' }}>
              <span
                style={{
                  fontWeight: 600,
                  color: '#fe5101',
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  cursor: 'default',
                }}
              >
                📎 {file.name || file.file}
              </span>
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
      {onBack && (
        <button
          style={{
            marginTop: '24px',
            padding: '8px 20px',
            background: 'orangered',
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
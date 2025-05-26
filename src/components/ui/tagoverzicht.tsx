import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import './tagoverzicht.css';

const pb = new PocketBase('http://localhost:8090');

interface FileLink {
  name: string;
  url: string;
}

const TagOverzicht: React.FC = () => {
  const [tagsWithFiles, setTagsWithFiles] = useState<{ tag: string; files: FileLink[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIdx, setSelectedTagIdx] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      pb.collection('tags').getFullList(),
      pb.collection('files').getFullList({ expand: 'tag' }),
    ])
      .then(([tags, files]) => {
        if (!Array.isArray(tags) || !Array.isArray(files)) {
          console.error('tags:', tags, 'files:', files);
          throw new Error('Tags of files zijn geen array');
        }

        const tagMap: { [tagId: string]: { tag: string; files: FileLink[] } } = {};
        tags.forEach((tag: any) => {
          if (tag && tag.id && typeof tag.tag === 'string') {
            tagMap[tag.id] = { tag: tag.tag, files: [] };
          }
        });

        files.forEach((file: any) => {
          try {
            const tags = file?.expand?.tag;
            const fileUrl = file.file
              ? `${pb.baseUrl}/api/files/${file.collectionId || 'files'}/${file.id}/${file.file}`
              : '#';
            const fileObj: FileLink = {
              name: file.name || file.file,
              url: fileUrl,
            };
            if (Array.isArray(tags)) {
              tags.forEach((tag: any) => {
                if (tag && tag.id && tagMap[tag.id]) {
                  tagMap[tag.id].files.push(fileObj);
                }
              });
            } else if (tags && tags.id && tagMap[tags.id]) {
              tagMap[tags.id].files.push(fileObj);
            }
          } catch (e) {
            console.error('Fout bij verwerken file:', file, e);
          }
        });

        setTagsWithFiles(Object.values(tagMap));
      })
      .catch((err) => {
        if (err?.message?.includes('autocancelled')) {
          console.warn('PocketBase request werd geannuleerd:', err);
          return;
        }
        console.error('PocketBase error:', err, JSON.stringify(err));
        setError(err?.message || 'Fout bij ophalen tags/bestanden');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ndw-container">
      <h1>📁 Tagoverzicht</h1>

      {loading && <p>⏳ Bestanden laden...</p>}
      {error && <p className="ndw-error">{error}</p>}
      {!loading && tagsWithFiles.length === 0 && <p>📭 Geen bestanden gevonden.</p>}

      <table className="ndw-table">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Gekoppelde Bestanden</th>
          </tr>
        </thead>
        <tbody>
          {tagsWithFiles.map(({ tag, files }, idx) => {
            const isSelected = idx === selectedTagIdx;
            const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

            return (
              <React.Fragment key={idx}>
                <tr
                  style={{ cursor: sortedFiles.length > 3 ? 'pointer' : 'default', verticalAlign: 'top' }}
                  onClick={() => sortedFiles.length > 3 && setSelectedTagIdx(isSelected ? null : idx)}
                >
                  <td>
                    <span
                      style={{
                        backgroundColor: '#e0f7fa',
                        color: '#00796b',
                        padding: '4px 8px',
                        borderRadius: '16px',
                        fontSize: '0.95rem',
                        display: 'inline-block',
                      }}
                    >
                      ☁️ {tag}
                    </span>
                  </td>
                  <td>
                    {sortedFiles.length === 0 ? (
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
                        🚫 Geen bestanden
                      </span>
                    ) : (
                      <>
                        {isSelected
                          ? (() => {
                              const rows = [];
                              for (let i = 0; i < sortedFiles.length; i += 3) {
                                rows.push(sortedFiles.slice(i, i + 3));
                              }
                              return rows.map((row, rowIdx) => (
                                <div key={rowIdx}>
                                  {row.map((file, i) => {
                                    const isLast =
                                      rowIdx === rows.length - 1 && i === row.length - 1;
                                    return (
                                      <React.Fragment key={i}>
                                        <a
                                          href={file.url}
                                          download
                                          style={{
                                            color: '#1a73e8',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {file.name}
                                        </a>
                                        {isLast ? '.' : ',' + (i === row.length - 1 ? '' : ' ')}
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              ));
                            })()
                          : (
                            <>
                              {sortedFiles.slice(0, 3).map((file, i, arr) => (
                                <React.Fragment key={i}>
                                  <a
                                    href={file.url}
                                    download
                                    style={{
                                      color: '#1a73e8',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {file.name}
                                  </a>
                                  {i < arr.length - 1
                                    ? ', '
                                    : sortedFiles.length > 3
                                    ? ', ...'
                                    : ''}
                                </React.Fragment>
                              ))}
                            </>
                          )
                        }
                      </>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TagOverzicht;

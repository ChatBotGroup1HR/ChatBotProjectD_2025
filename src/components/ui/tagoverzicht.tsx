import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import './tagoverzicht.css';

const pb = new PocketBase('http://localhost:8090');

interface FileLink {
  name: string;
  url: string;
}

interface TagWithFiles {
  tag: string;
  files: FileLink[];
  archived: boolean;
}

export function filterTags(tags: TagWithFiles[], term: string) {
  return tags.filter(({ tag }) =>
    tag.toLowerCase().includes(term.toLowerCase())
  );
}

const TagOverzicht: React.FC = () => {
  const [tagsWithFiles, setTagsWithFiles] = useState<TagWithFiles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIdx, setSelectedTagIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

        const tagMap: { [tagId: string]: TagWithFiles } = {};
        tags.forEach((tag: any) => {
          if (tag && tag.id && typeof tag.tag === 'string') {
            tagMap[tag.id] = { tag: tag.tag, files: [], archived: tag.archived || false, };
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

  const filteredTags = filterTags(tagsWithFiles, searchTerm);

  const handleToggleArchived = async (tagName: string) => {
    const tagIdx = tagsWithFiles.findIndex((t) => t.tag === tagName);
    const tag = tagsWithFiles[tagIdx];

    try {
      const tagRecord = await pb.collection('tags').getFirstListItem(`tag="${tagName}"`);
      const newArchived = !tag.archived;
      await pb.collection('tags').update(tagRecord.id, {
        archived: newArchived,
      });

      const updated = [...tagsWithFiles];
      updated[tagIdx] = { ...tag, archived: newArchived };
      setTagsWithFiles(updated);
    } catch (err) {
      console.error('Fout bij updaten archived status:', err);
    }
  };

  return (
    <div className="ndw-container">
      <h1>📁 Tagoverzicht</h1>

      <input
        type="text"
        placeholder="Zoek op tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="ndw-search"
      />

      {loading && <p>⏳ Bestanden laden...</p>}
      {error && <p className="ndw-error">{error}</p>}
      {!loading && filteredTags.length === 0 && <p>📭 Geen bestanden gevonden.</p>}

      <div className="ndw-table-container">
        <table className="ndw-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Gekoppelde Bestanden</th>
              <th>Archiveer</th>
            </tr>
          </thead>
          <tbody>
            {filteredTags.map(({ tag, files, archived }, idx) => {
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
                                            className="ndw-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {file.name}
                                          </a>
                                          {isLast ? '.' : ', '}
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
                                      className="ndw-link"
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
                    <td>
                      <label className="switch" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={!archived}
                          onChange={() => handleToggleArchived(tag)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagOverzicht;

import React, { useEffect, useState, useCallback, useRef } from 'react';
import PocketBase from 'pocketbase';
import './tagoverzicht.css';

const pb = new PocketBase('http://localhost:8090');

interface Tag {
  id: string;
  tag: string;
  aantal: number;
}

interface Bestand {
  id: string;
  name: string;
  file: string;
  tag: string[];
}

const TagOverzicht: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [zoekterm, setZoekterm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTagsEnAantal = async () => {
      setIsLoading(true);
      try {
        const tagsResponse = await pb.collection('tags').getFullList({
          sort: '-created',
          $autoCancel: false, // Prevent PocketBase from auto-cancelling
          fetchOptions: { signal: abortController.signal }, // Pass abort signal
        });

        const tagsMetAantal = await Promise.all(
          tagsResponse.map(async (item: any) => {
            const filesResponse = await pb.collection('files').getList(1, 5000, {
              filter: `tag ~ "${item.id}"`, // <-- aangepast
              $autoCancel: false,
              fetchOptions: { signal: abortController.signal },
            });
            const fileCount = filesResponse.totalItems;
            return {
              id: item.id,
              tag: item.tag,
              aantal: fileCount,
            };
          })
        );
        setTags(tagsMetAantal);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Fout bij het ophalen van tags', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagsEnAantal();

    return () => {
      abortController.abort(); // Cancel all ongoing requests on unmount
    };
  }, []);

  const handleZoektermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setZoekterm(term);
      }, 100);
    },
    []
  );

  const zoektermNorm = zoekterm.trim().toLowerCase();
  const gefilterdeTags = tags.filter((tag) =>
    tag.tag.toLowerCase().includes(zoektermNorm)
  );

  return (
    <div className="tagoverzicht-container">
      <h1>Tags</h1>
      <input
        className="tag-zoek-input"
        type="text"
        placeholder="Zoek op tagnaam..."
        value={zoekterm}
        onChange={handleZoektermChange}
      />

      <div className="tags-lijst">
        {isLoading ? (
          <p>Tags laden...</p>
        ) : (
          gefilterdeTags.map((tag) => (
            <div key={tag.id} className="tag-knop">
              {tag.tag} ({tag.aantal})
            </div>
          ))
        )}
      </div>
      {gefilterdeTags.length > 0 && (
        <div className="zoekresultaten">
          <h3>Zoekresultaten:</h3>
          <ul>
            {gefilterdeTags.map((tag) => (
              <li key={tag.id}>
                {tag.tag} ({tag.aantal})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagOverzicht;

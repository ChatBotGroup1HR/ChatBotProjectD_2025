import React, { useEffect, useState, useCallback, useRef } from 'react';
import PocketBase from 'pocketbase';
import { useNavigate } from 'react-router-dom';
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

interface TagOverzichtProps {
  onTagClick?: (tagId: string) => void;
}

const TagOverzicht: React.FC<TagOverzichtProps> = ({ onTagClick }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [zoekterm, setZoekterm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTagsEnAantal = async () => {
      setIsLoading(true);
      try {
        const tagsResponse = await pb.collection('tags').getFullList({
          sort: '-created',
          $autoCancel: false,
          fetchOptions: { signal: abortController.signal },
        });

        const tagsMetAantal = await Promise.all(
          tagsResponse.map(async (item: any) => {
            const filesResponse = await pb.collection('files').getList(1, 5000, {
              filter: `tag ~ "${item.id}"`,
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
      abortController.abort();
    };
  }, []);

  const handleZoektermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setInputValue(term);
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
    <div className="tagoverzicht-page">
      <div className="tagoverzicht-content">
        <h1>Tags</h1>
        <input
          className="tag-zoek-input"
          type="text"
          placeholder="Zoek op tagnaam..."
          value={inputValue}
          onChange={handleZoektermChange}
        />

        <div className="tags-lijst">
          {isLoading ? (
            <p>Tags laden...</p>
          ) : (
            gefilterdeTags.map((tag) => (
              <div
                key={tag.id}
                className="tag-knop"
                onClick={() => window.open(`/tag/${tag.id}`, '_blank')}
                style={{ cursor: 'pointer' }}
              >
                {tag.tag} ({tag.aantal})
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TagOverzicht;

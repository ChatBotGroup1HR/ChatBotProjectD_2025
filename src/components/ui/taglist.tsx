import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import './taglist.css';

const pb = new PocketBase('http://localhost:8090');

const TagList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const records = await pb.collection('tags').getFullList({
          sort: '-created',
        });

        const tagNames = records.map(record => record.tag);
        setTags(tagNames);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="taglist-container">
      <input
        type="text"
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="taglist-search"
      />

      {loading ? (
        <div className="taglist-loading">Loading tags...</div>
      ) : (
        <div className="taglist-tags">
          {filteredTags.map((tag, index) => (
            <div key={index} className="taglist-tag">
              <div className="taglist-tag-inner">
                {tag}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagList;
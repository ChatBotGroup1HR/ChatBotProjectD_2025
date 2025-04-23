import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import './taglist.css';

const pb = new PocketBase('http://localhost:8090');

// Interface voor de props die deze component verwacht
interface TagListProps {
  selectedTags: string[]; // Lijst van momenteel geselecteerde tags
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>; // Functie om tags bij te werken
}

const TagList: React.FC<TagListProps> = ({ selectedTags, setSelectedTags }) => {
  // State voor zoekinput, beschikbare tags en laadstatus
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect wordt één keer uitgevoerd bij het laden van de component
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Alle velden van tags ophalen vanuit de database
        const records = await pb.collection('tags').getFullList();

        // Haal de tags uit de records
        const tagNames = records.map(record => record.tag);
        setTags(tagNames);
      } catch (error) {
        console.error('Fout bij het ophalen van tags', error);
      } finally {
        // Zet loading op false zodra de data is opgehaald
        setLoading(false);
      }
    };

    fetchTags();
  }, []); // Lege dependency array betekent dat dit effect maar 1 keer draait

  // Filter tags op basis van de zoekopdracht
  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  // Voeg of verwijder tag uit de selected door te klikken
  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter(t => t !== tag) // Verwijder als al geselecteerd
        : [...prevSelectedTags, tag] // Voeg toe als niet geselecteerd
    );
  };

  // Zorg dat geselecteerde tags eerst getoond worden, daarna de rest
  const sortedTags = [
    ...selectedTags,
    ...filteredTags.filter(tag => !selectedTags.includes(tag))
  ];

  return (
    <div className="taglist-container">
      {/* Inputveld om tags te zoeken */}
      <input
        type="text"
        placeholder="Zoek tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="taglist-search"
      />

      {/* Toon laadstatus of de gefilterde tags */}
      {loading ? (
        <div className="taglist-loading">Tags laden...</div>
      ) : (
        <div className="taglist-tags">
          {sortedTags.map((tag, index) => (
            <div 
              key={index} 
              className={`taglist-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleTagSelection(tag)}
            >
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
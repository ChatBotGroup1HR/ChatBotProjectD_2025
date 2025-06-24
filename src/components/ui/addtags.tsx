import React, { useState } from 'react';
import PocketBase from 'pocketbase';
import './addtags.css';

const pb = new PocketBase('http://localhost:8090');

export const formatTagNames = (name: string): string => {
  if (!name) return '';
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const AddTagPage: React.FC = () => {
  const [tagName, setTagName] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleAddTag = async () => {
    const formattedTagName = formatTagNames(tagName);

    if (formattedTagName.trim() === '') {
      setStatusMessage('Tagnaam mag niet leeg zijn.');
      return;
    }

    try {
      const existingTags = await pb.collection('tags').getFullList({ filter: `tag="${formattedTagName}"` });

      if (existingTags.length > 0) {
        setStatusMessage('Tag bestaat al.');
        return;
      }

      await pb.collection('tags').create({ tag: formattedTagName });
      setStatusMessage('Tag succesvol toegevoegd!');
      setTagName('');
    } catch (error) {
      console.error('Fout bij toevoegen van tag:', error);
      setStatusMessage('Toevoegen van tag mislukt. Probeer het opnieuw.');
    }
  };

  return (
    <div className="add-tag-page">
      <div className="add-tag-content">
        <h2>Tag Toevoegen</h2>
        <input
          type="text"
          placeholder="Voer tagnaam in"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <div>
          <button onClick={handleAddTag}>Toevoegen</button>
          <button onClick={() => { setTagName(''); setStatusMessage(''); }}>Annuleren</button>
        </div>
        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('succesvol') ? 'success' : 'error'}`}>
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTagPage;
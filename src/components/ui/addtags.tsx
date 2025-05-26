import React, { useState } from 'react';
import PocketBase from 'pocketbase';
import './addtags.css';

const pb = new PocketBase('http://localhost:8090');

const AddTagPage: React.FC = () => {
  const [tagName, setTagName] = useState('');

  const formatTagName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const handleAddTag = async () => {
        const formattedTagName = formatTagName(tagName);

        if (formattedTagName.trim() === '') {
            alert('Tag name cannot be empty');
            return;
        }

        try {
            const existingTags = await pb.collection('tags').getFullList({ filter: `tag="${formattedTagName}"` });

            if (existingTags.length > 0) {
                alert('Tag already exists');
                return;
            }

            await pb.collection('tags').create({ tag: formattedTagName });
            alert('Tag added successfully!');
            setTagName('');
        } catch (error) {
            console.error('Error adding tag:', error);
            alert('Failed to add tag. Please try again.');
        }
    };

  return (
    <div className="add-tag-page">
      <div className="add-tag-content">
        <h2>Tag toevoegen</h2>
        <input
          type="text"
          placeholder="Voer tagnaam in"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <div>
          <button onClick={handleAddTag}>Toevoegen</button>
          <button onClick={() => setTagName('')}>Annuleren</button>
        </div>
      </div>
    </div>
  );
};

export default AddTagPage;
import React, { useState, useEffect, useRef } from 'react';
import './fileupload.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface Tag {
  id: string;
  tag: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [referenceName, setReferenceName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [noTags, setNoTags] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch available tags from PocketBase
    const fetchTags = async () => {
      try {
        const records = await pb.collection('tags').getFullList();
        const mappedTags: Tag[] = records.map(record => ({
          id: record.id,
          tag: record.tag
        }));
        setAvailableTags(mappedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const doesDocumentExist = async (name: string, originalName: string) => {
    try {
      const results = await pb.collection('files').getList(1, 1, {
        filter: `name="${name}" || originalName="${originalName}"`,
      });
      return results.items.length > 0;
    } catch (err) {
      console.error('Error checking for duplicates:', err);
      return false;
    }
  };

  const filteredTags = availableTags.filter(tag => {
    if (!tag || !tag.tag) return false;
    return tag.tag.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !referenceName) {
      setUploadStatus('Please provide both a file and reference name');
      return;
    }

    if (!noTags && selectedTags.length === 0) {
      setUploadStatus('Error: Selecteer minimaal 1 tag of selecteer "geen tag(s) toevoegen"');
      return;
    }

    const duplicateExists = await doesDocumentExist(referenceName, file.name.toLowerCase().replace(/[\s+-]/g, '_'));
      if (duplicateExists) {
        setUploadStatus('Error: Een document met dezelfde naam bestaat al.');
        return;
      }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', referenceName);
      formData.append('originalName', file.name);
      
      const record = await pb.collection('files').create(formData);
      
      if (selectedTags.length > 0) {
        await pb.collection('files').update(record.id, {
          tag: selectedTags
        });
      }

      setUploadStatus('Upload voltooid!');
      
      // Reset form
      setFile(null);
      setReferenceName('');
      setSelectedTags([]);
      setSearchTerm('');
      setNoTags(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Document Toevoegen</h2>
      <form onSubmit={handleSubmit} className="file-upload-form">
        <div className="form-group">
          <label htmlFor="file">Selecteer Document:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="referenceName">Referentienaam:</label>
          <input
            type="text"
            id="referenceName"
            value={referenceName}
            onChange={(e) => setReferenceName(e.target.value)}
            required
            placeholder="Voer een referentienaam in..."
          />
        </div>

        <div className="form-group">
          <div className="tags-header">
            <label>Tags:</label>
            <div className="no-tags-checkbox">
              <input
                type="checkbox"
                id="noTags"
                checked={noTags}
                onChange={(e) => {
                  setNoTags(e.target.checked);
                  if (e.target.checked) {
                    setSelectedTags([]);
                    setSearchTerm('');
                  }
                }}
              />
              <label htmlFor="noTags">geen tag(s) toevoegen</label>
            </div>
          </div>
          <div className="tags-search-container" ref={dropdownRef}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => !noTags && setIsDropdownOpen(true)}
              placeholder="Zoek of selecteer tags..."
              className="tags-search-input"
              disabled={noTags}
            />
            {isDropdownOpen && !noTags && (
              <div className="tags-dropdown">
                {filteredTags.map(tag => (
                  <div
                    key={tag.id}
                    className={`tag-option ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                    onClick={() => {
                      handleTagToggle(tag.id);
                      setSearchTerm('');
                    }}
                  >
                    {tag.tag}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="selected-tags-container">
            {selectedTags.map(tagId => {
              const tag = availableTags.find(t => t.id === tagId);
              return tag ? (
                <div key={tagId} className="selected-tag">
                  {tag.tag}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => handleTagToggle(tagId)}
                    disabled={noTags}
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <button type="submit" className="upload-button">
          Document Uploaden
        </button>

        {uploadStatus && (
          <div className={`status-message ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
            {uploadStatus}
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload; 
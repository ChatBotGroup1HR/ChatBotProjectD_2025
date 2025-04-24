import React, { useState, useEffect, useRef } from 'react';
import './fileupload.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface Tag {
  id: string;
  name: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [referenceName, setReferenceName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch available tags from PocketBase
    const fetchTags = async () => {
      try {
        const records = await pb.collection('tags').getFullList();
        const mappedTags: Tag[] = records.map(record => ({
          id: record.id,
          name: record.name
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

  const filteredTags = availableTags.filter(tag => {
    if (!tag || !tag.name) return false;
    return tag.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !referenceName) {
      setUploadStatus('Please provide both a file and reference name');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('referenceName', referenceName);
      formData.append('tags', JSON.stringify(selectedTags));

      const record = await pb.collection('files').create(formData);
      setUploadStatus('File uploaded successfully!');
      
      // Reset form
      setFile(null);
      setReferenceName('');
      setSelectedTags([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit} className="file-upload-form">
        <div className="form-group">
          <label htmlFor="file">Select File:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="referenceName">Reference Name:</label>
          <input
            type="text"
            id="referenceName"
            value={referenceName}
            onChange={(e) => setReferenceName(e.target.value)}
            required
            placeholder="Enter a reference name for the file"
          />
        </div>

        <div className="form-group">
          <label>Tags:</label>
          <div className="tags-search-container" ref={dropdownRef}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search or select tags..."
              className="tags-search-input"
            />
            {isDropdownOpen && (
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
                    {tag.name}
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
                  {tag.name}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => handleTagToggle(tagId)}
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <button type="submit" className="upload-button">
          Upload File
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
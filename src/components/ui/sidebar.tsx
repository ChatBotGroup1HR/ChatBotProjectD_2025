import React, { useState } from 'react';
import './sidebar.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface SidebarItem {
  label: string;
  path: string;
}

const AddTagModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tagName, setTagName] = useState('');

  const handleAddTag = async () => {
    if (tagName.trim() === '') {
      alert('Tag name cannot be empty');
      return;
    }

    try {
      await pb.collection('tags').create({ name: tagName });
      alert('Tag added successfully!');
      setTagName('');
      onClose();
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Failed to add tag. Please try again.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Tag</h2>
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Enter tag name"
        />
        <button type="button" onClick={handleAddTag}>Add Tag</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const Sidebar: React.FC<{ onAddTagsClick: () => void; onCloseModal: () => void }> = ({ onAddTagsClick, onCloseModal }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('');
  const [showAddTagModal, setShowAddTagModal] = useState(false);

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', path: '/portal' },
    { label: 'Profiel', path: '/portal' },
    { label: 'Instellingen', path: '/portal' },
    { label: 'Add tags', path: '/portal' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMenuItemClick = (item: SidebarItem) => {
    setActiveItem(item.path);
    if (item.label === 'Add tags') {
      setShowAddTagModal(true);
      onAddTagsClick();
    }
  };

  const handleCloseModal = () => {
    setShowAddTagModal(false);
    onCloseModal();
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <button className="hamburger-button" onClick={toggleSidebar}>
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={activeItem === item.path ? 'active' : ''}
                onClick={() => handleMenuItemClick(item)}
              >
                <a href={item.path}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {showAddTagModal && <AddTagModal onClose={handleCloseModal} />}
    </>
  );
};

export default Sidebar;

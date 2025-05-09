import React, { useState } from 'react';
import './sidebar.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface SidebarItem {
  label: string;
  page: string;
}

interface SidebarProps {
  onMenuItemClick: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('');
  const [showAddTagModal, setShowAddTagModal] = useState(false);

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Bestanden Toevoegen', page: 'fileupload' },
    { label: 'Documenten', page: 'documents' },
    { label: 'Profiel', page: 'profile' },
    { label: 'Instellingen', page: 'settings' },
    { label: 'Add tags', page: 'addtags' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMenuItemClick = (item: SidebarItem) => {
    setActiveItem(item.page);
    if (item.label === 'Add tags') {
      setShowAddTagModal(true);
    } else {
      onMenuItemClick(item.page);
    }
  };

  const handleCloseModal = () => {
    setShowAddTagModal(false);
  };

  return (
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
              key={item.page}
              className={activeItem === item.page ? 'active' : ''}
              onClick={() => handleMenuItemClick(item)}
            >
              <span className="sidebar-item">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      {showAddTagModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Tags</h2>
            {/* Add your tag form here */}
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
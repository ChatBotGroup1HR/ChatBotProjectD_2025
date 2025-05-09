import React, { useState } from 'react';
import './sidebar.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface SidebarItem {
  label: string;
  path: string;
}

interface SidebarProps {
  onItemClick: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('');
  const [showAddTagModal, setShowAddTagModal] = useState(false);

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', path: '/portal' },
    { label: 'Bestanden Toevoegen', path: '/fileupload' },
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

  const handleItemClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveItem(path);
    onItemClick(path);
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
              key={item.path}
              className={activeItem === item.path ? 'active' : ''}
            >
              <a 
                href={item.path}
                onClick={(e) => handleItemClick(item.path, e)}
              >
                {item.label}
              </a>
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

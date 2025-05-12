import React, { useState } from 'react';
import './sidebar.css';

interface SidebarItem {
  label: string;
  page: string;
}

interface SidebarProps {
  onMenuItemClick: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Bestanden Toevoegen', page: 'fileupload' },
    { label: 'Documenten', page: 'documents' },
    { label: 'Profiel', page: 'profile' },
    { label: 'Instellingen', page: 'settings' },
    { label: 'Tag Toevoegen', page: 'addtags' },
    { label: 'Tag Overzicht', page: 'tagoverzicht' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMenuItemClick = (item: SidebarItem) => {
    setActiveItem(item.page);
    onMenuItemClick(item.page);
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
    </div>
  );
};

export default Sidebar;

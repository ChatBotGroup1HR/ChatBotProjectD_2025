import React, { useState } from 'react';
import './sidebar.css';

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

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', path: '/portal' },
    { label: 'Bestanden Toevoegen', path: '/fileupload' },
    { label: 'Profiel', path: '/portal' },
    { label: 'Instellingen', path: '/portal' }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
  );
};

export default Sidebar; 
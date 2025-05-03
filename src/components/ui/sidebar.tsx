import React, { useState } from 'react';
import './sidebar.css';

interface SidebarItem {
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('');

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', path: '/portal' },
    { label: 'Profiel', path: '/portal' },
    { label: 'Instellingen', path: '/portal' }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
              onClick={() => setActiveItem(item.path)}
            >
              <a href={item.path}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 
import React, { useState } from 'react';
import './sidebar.css';

interface SidebarProps {
  onMenuItemClick: (page: string) => void; // Callback-prop toegevoegd
}

interface SidebarItem {
  label: string;
  page: string; // Verander 'path' naar 'page' om beter te passen bij je logica
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Profiel', page: 'profile' },
    { label: 'Instellingen', page: 'settings' },
    { label: 'Documents', page: 'documents' }, // Nieuw item toegevoegd
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
              key={item.page}
              className={activeItem === item.page ? 'active' : ''}
              onClick={() => {
                setActiveItem(item.page);
                onMenuItemClick(item.page); // Callback aanroepen
              }}
            >
              <span className="sidebar-item">{item.label}</span> {/* Gebruik een span in plaats van een button */}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
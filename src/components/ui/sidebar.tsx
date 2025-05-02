import React from 'react';
import './sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
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
          <li>
            <a href="/portal">Dashboard</a> {/* Link naar dashboard */}
          </li>
          <li>
            <a href="#!" onClick={() => window.location.reload()}>Documents</a> {/* Geen navigatie, maar herlaad de pagina */}
          </li>
          <li>
            <a href="/profile">Profiel</a>
          </li>
          <li>
            <a href="/settings">Instellingen</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

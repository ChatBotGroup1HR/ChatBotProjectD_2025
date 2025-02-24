import React from 'react';
import './portal.css';
import Header from './components/ui/header';
import reportWebVitals from './reportWebVitals';

const PortalBody = () => {
  return (
    <div className='portalBody'>
      <p>Portal items</p>
    </div>
  );
}

const PortalWrap = () => {
  return (
    <React.StrictMode>
      <Header />
      <PortalBody />
    </React.StrictMode>
  );
};

export default PortalWrap;

reportWebVitals();
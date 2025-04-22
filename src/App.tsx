import React from 'react';
import './App.css';
import ChatFileUploader from './components/ChatFileUploader';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>PocketBase Bestand Upload</h2>
        <ChatFileUploader />
      </header>
    </div>
  );
}

export default App;

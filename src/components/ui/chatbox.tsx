import React, { useState, KeyboardEvent } from 'react';
import './chatbox.css';

export default function Chatbox() {
  // Typen toegevoegd voor useState
  const [messages, setMessages] = useState<string[]>([]); // Berichten moeten strings zijn
  const [input, setInput] = useState<string>('');          // Input moet een string zijn

  const sendMessage = () => {
    if (input.trim() === '') return; // Geen lege berichten toestaan

    setMessages([...messages, input]); // Bericht toevoegen aan de lijst
    setInput(''); // Maak het invoerveld leeg
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {  // Typing voor event
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-area">
        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chatbox-message user">
              {msg}
            </div>
          ))}
        </div>
        <div className="chatbox-input-area">
          <input
            type="text"
            className="chatbox-input"
            placeholder="Stel een vraag"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress} // Keydown event
          />
          <button className="chatbox-button" onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, KeyboardEvent, useEffect } from 'react';
import './chatbox.css';

type FileResponse = {
  filename: string;
  url: string;
};

export default function Chatbox() {
  const [messages, setMessages] = useState<any[]>([]); // Maak berichten een array van React-elementen
  const [input, setInput] = useState<string>(''); // Gebruikersinvoer
  const [fileResponse, setFileResponse] = useState<FileResponse | null>(null);

  // Bestandsinformatie die altijd teruggestuurd wordt
  const fileData: FileResponse = {
    filename: 'voorbeeld.docx', // hier moet je die doc zetten die je wilt versturen  als reactie
    url: 'http://localhost:8090/api/files/files/7a1q965m3fy2i2t/file/cheat_o0jlm6znqk.docx', // voorbeeld link die hij kan geven
  };

  // Berichten sturen
  const sendMessage = () => {
    if (input.trim() === '') return;

    // Voeg het gebruikersbericht toe
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', message: input },
    ]);
    setInput(''); // Leeg het invoerveld

    // Stel de fileResponse pas in als deze nog niet is ingesteld
    if (!fileResponse) {
      setFileResponse(fileData); // Stel de fileResponse in
    }
  };

  // Klavietoets Enter indrukken om te versturen
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Na elke gebruikersinvoer, voeg het bestand als reactie toe
  useEffect(() => {
    if (fileResponse) {
      // Voeg het bestand toe als een bericht met een klikbare link
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          message: (
            <div>
              <p>🗂️ Hier is je bestand: {fileResponse.filename}</p>
              <a href={fileResponse.url} target="_blank" rel="noreferrer" download>
                Download het bestand
              </a>
            </div>
          ),
        },
      ]);
      setFileResponse(null); // Reset de fileResponse nadat deze is gestuurd
    }
  }, [fileResponse]);

  return (
    <div className="chatbox-container">
      <div className="chatbox-area">
        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbox-message ${msg.type === 'bot' ? 'bot' : 'user'}`}
            >
              {/* Renderen van berichten met React-elementen */}
              {typeof msg.message === 'string' ? (
                msg.message
              ) : (
                // Render het React-element voor het bestand
                msg.message
              )}
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
            onKeyDown={(e) => handleKeyPress(e)}
          />
          <button className="chatbox-button" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

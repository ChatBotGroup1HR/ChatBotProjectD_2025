import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import './chatbox.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface ChatboxProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Chatbox({ selectedTags, setSelectedTags }: ChatboxProps) {
  type ChatMessage = {
    sender: 'user' | 'bot';
    content: string;
    files?: any[];
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [botTyping, setBotTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = {
      sender: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');



    try {
      if (selectedTags.length === 0) return;

      const tagRecords = await Promise.all(
        selectedTags.map(async (tagName) => {
          const tagRecord = await pb.collection('tags').getFirstListItem(`tag="${tagName}"`);
          return tagRecord?.id;
        })
      );

      const tagIds = tagRecords.filter(Boolean);

      if (tagIds.length === 0) return;

      const tagFilter = tagIds.map(id => `tag ~ "${id}"`).join(' || ');

      // laat de typing indicator zien
      setBotTyping(true);

      const response = await pb.collection('files').getFullList({
        filter: `(${tagFilter})`,
        expand: 'tag',
      });

      setTimeout(() => { 
        const botMessage: ChatMessage = {
          sender: 'bot',
          content: response.length > 0
            ? 'Hier zijn bestanden die overeenkomen met je tags:'
            : 'Geen bestanden gevonden voor deze tags.',
          files: response,
        };

        setMessages(prev => [...prev, botMessage]);
        setBotTyping(false);
        setSelectedTags([]);
      }, 1000); // Voor nu er om te laten zien dat er een typing indicator is, haal weg indien de echte bot is geconfigureerd
    } catch (err) {
      console.error('Fout bij ophalen bestanden:', err);
      setBotTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-area">
        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbox-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              <div>{msg.content}</div>

              {msg.files && msg.files.length > 0 && (
                <div className="chatbox-files">
                  {msg.files.map((file, idx) => (
                    <div key={idx}>
                      <a
                        href={pb.getFileUrl(file, file.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📎 {file.name || file.file}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            <div ref={bottomRef} />
            {/* Scroll naar beneden na het toevoegen van een nieuw bericht */}
            </div>
          ))}

          {botTyping && (
            <div className="chatbox-message bot">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="chatbox-input-area">
          <input
            type="text"
            className="chatbox-input"
            placeholder="Stel een vraag"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="chatbox-button" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
     
    </div>
    
  );
}
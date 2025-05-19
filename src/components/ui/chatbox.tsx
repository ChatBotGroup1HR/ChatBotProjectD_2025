import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './chatbox.css';
import PocketBase from 'pocketbase';
import { countMatchingWords } from '../../utils/fileMatcher';

const pb = new PocketBase('http://localhost:8090');

interface ChatboxProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Chatbox({ selectedTags, setSelectedTags }: ChatboxProps) {
  type ChatMessage = {
    sender: 'user' | 'bot'; // Heeft de user of de bot het verstuurd
    content: string; // content van het bericht
    files?: any[]; // Eventueele bestanden die zijn meegegeven bij het bericht
    currentFileIndex?: number; // Voor bladeren door bestanden
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [botTyping, setBotTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return; // Als de input leeg is, doe dan niets

    const userMessage: ChatMessage = { // Maak een bericht aan voor de gebruiker
      sender: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]); // Voeg het gebruikersbericht toe aan de chat
    setInput(''); // Maak het inputveld leeg na het versturen van het bericht

    try {
      if (selectedTags.length === 0) return; // Als er geen geselecteerde tags zijn, doe dan niets

      // Haal de bijbehorende tag records op uit de database
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

      setTimeout(async () => {
        // Maak een bot bericht aan om de gevonden bestanden te tonen
        const botMessage: ChatMessage = {
          sender: 'bot',
          content: response.length > 0
            ? 'Hier zijn bestanden die overeenkomen met je tags:'
            : 'Geen bestanden gevonden voor deze tags.',
          files: [], // Voeg de bestanden toe aan het bericht
          currentFileIndex: 0,
        };


        // Doorloop alle bestanden die zijn opgehaald uit de database
        for (const file of response) {
          const fileUrl = pb.getFileUrl(file, file.file); // Genereer de volledige URL naar het bestand
          const isTxt = file.file?.endsWith('.txt'); // Check of het bestand .txt is

          if (isTxt) {
            try {
              const res = await fetch(fileUrl);
              const textContent = await res.text(); // Lees de content van het bestand

              const matchCount = countMatchingWords(input, textContent);

              botMessage.files?.push({
                ...file,
                textPreview: textContent, // Toon de inhoud van het tekstbestand
                fileUrl,
                matchCount,
              });
            } catch (err) {
              // Als het niet lukt om de tekst te lezen, geef error message terug en stuur URL
              console.error(`Kon .txt bestand niet lezen: ${fileUrl}`, err);
              botMessage.files?.push({ ...file, fileUrl, matchCount: 0 });
            }
          } else {
            // Voeg andere bestandstypen gewoon toe met URL
            botMessage.files?.push({ ...file, fileUrl, matchCount: 0 });
          }
        }
        //Sorteer op relevantie
        if (botMessage.files) {
          botMessage.files.sort((a, b) => (b.matchCount ?? 0) - (a.matchCount ?? 0));
        }

        setMessages(prev => [...prev, botMessage]); // Voeg het bot bericht toe aan de chat
        setBotTyping(false);
        setSelectedTags([]); // Reset de geselecteerde tags
      }, 1000);
    } catch (err) {
      console.error('Fout bij ophalen bestanden:', err);
      setBotTyping(false);
    }
  };

  // Functie om te reageren op keypress in het inputveld (Enter toets)
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // Als de Enter toets wordt ingedrukt
      sendMessage(); // Verstuur het bericht
    }
  };

    // Functie om door files heen te kunnen klikken
  const handleFileNavigation = (messageIndex: number, direction: 'next' | 'prev') => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, idx) => {
        if (idx !== messageIndex || !msg.files || msg.files.length <= 1) return msg;

        const newIndex =
          direction === 'next'
            ? Math.min((msg.currentFileIndex || 0) + 1, msg.files.length - 1)
            : Math.max((msg.currentFileIndex || 0) - 1, 0);

        return { ...msg, currentFileIndex: newIndex };
      })
    );
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-area">
          
        {/* Container voor alle chatberichten */}
        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbox-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              <div>{msg.content}</div>

              {msg.files && msg.files.length > 0 && (
                <div>
                  {(() => {
                    const file = msg.files[msg.currentFileIndex ?? 0];
                    return (
                      <div>
                        {file.textPreview ? (
                          <div>
                            {/* Plaatst de link boven de tekst preview */}
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chatbox-file-link"
                            >
                              📁 Download: {file.name || file.file}
                            </a>
                            {file.matchCount !== undefined && (
                              <div>
                                🔍 Matches: {file.matchCount}
                              </div>
                            )}
                            <div className="chatbox-text-preview">
                              {file.textPreview}
                            </div>
                          </div>
                        ) : (
                          <a
                            href={pb.getFileUrl(file, file.file)} // Haalt correcte URL op voor bestand
                            target="_blank"
                            rel="noopener noreferrer"
                            className="chatbox-file-link"
                          >
                            📁 Download: {file.name || file.file} {/* Toon naam of naam van de file zelf als de naam leeg is */}
                          </a>
                        )}

                        {/* buttons renderen wanneer dit nodig is */}
                        <div style={{ marginTop: '8px' }}>
                          {(msg.currentFileIndex ?? 0) > 0 && (
                            <button
                              className="chatbox-button"
                              onClick={() => handleFileNavigation(index, 'prev')}
                            >
                              ◀ Vorige
                            </button>
                          )}
                          {(msg.currentFileIndex ?? 0) < msg.files.length - 1 && (
                            <button
                              className="chatbox-button"
                              onClick={() => handleFileNavigation(index, 'next')}
                              style={{ marginLeft: '8px' }}
                            >
                              Volgende ▶
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
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
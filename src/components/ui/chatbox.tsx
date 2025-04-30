import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './chatbox.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface ChatboxProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Chatbox({ selectedTags, setSelectedTags }: ChatboxProps) {
  // Definieert de type voor een chatbericht
  type ChatMessage = {
    sender: 'user' | 'bot'; // Heeft de user of de bot het verstuurd
    content: string; // content van het bericht
    files?: any[]; // Eventueele bestanden die zijn meegegeven bij het bericht
  };

  // State voor de berichten en inputveld
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Berichten in de chat
  const [input, setInput] = useState<string>(''); // De waarde van het inputveld

  // Ref voor het einde van de berichtenlijst
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scrollt naar beneden
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Functie om een bericht te versturen
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
          return tagRecord?.id; // Retourneer de ID van het tagrecord
        })
      );

      const tagIds = tagRecords.filter(Boolean); // Filter alleen de geldige tag IDs

      if (tagIds.length === 0) return; // Als er geen geldige tag IDs zijn, doe dan niets

      // Maak een filter string voor de tags die gevonden zijn
      const tagFilter = tagIds.map(id => `tag ~ "${id}"`).join(' || ');

      // Haal bestanden op uit de database die bij de tags horen
      const response = await pb.collection('files').getFullList({
        filter: `(${tagFilter})`, // Gebruik de filter string die we zojuist gemaakt hebben
        expand: 'tag', // Zorg dat de tags bij elk bestand worden meegeleverd
      });

      // Maak een bot bericht aan om de gevonden bestanden te tonen
      const botMessage: ChatMessage = {
        sender: 'bot',
        content: response.length > 0
          ? 'Hier zijn bestanden die overeenkomen met je tags:'
          : 'Geen bestanden gevonden voor deze tags.',
        files: [], // Voeg de bestanden toe aan het bericht
      };


      // Doorloop alle bestanden die zijn opgehaald uit de database
      for (const file of response) {
        const fileUrl = pb.getFileUrl(file, file.file); // Genereer de volledige URL naar het bestand
        const isTxt = file.file?.endsWith('.txt'); // Check of het bestand .txt is

        if (isTxt) {
          try {
            const res = await fetch(fileUrl);
            const textContent = await res.text(); // Lees de content van het bestand

            botMessage.files?.push({
              ...file,
              textPreview: textContent, // Toon de inhoud van het tekstbestand
              fileUrl,
            });
          } catch (err) {
            // Als het niet lukt om de tekst te lezen, geef error message terug en stuur URL
            console.error(`Kon .txt bestand niet lezen: ${fileUrl}`, err);
            botMessage.files?.push({ ...file, fileUrl });
          }
        } else {
          // Voeg andere bestandstypen gewoon toe met URL
          botMessage.files?.push({ ...file, fileUrl });
        }
      }

      setMessages(prev => [...prev, botMessage]); // Voeg het bot bericht toe aan de chat
      setSelectedTags([]); // Reset de geselecteerde tags
    } catch (err) {
      console.error('Fout bij ophalen bestanden:', err); // Log een fout als er iets misgaat
    }
  };

  // Functie om te reageren op keypress in het inputveld (Enter toets)
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // Als de Enter toets wordt ingedrukt
      sendMessage(); // Verstuur het bericht
    }
  };

  return (
    <div className="chatbox-container">
      {/* Container van de hele chatbox */}
      <div className="chatbox-area">

        {/* Container voor alle chatberichten */}
        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbox-message ${msg.sender === 'user' ? 'user' : 'bot'}`} // Voeg styling class toe op basis van wie het bericht verzond
            >
              {/* Tekstuele inhoud van het bericht */}
              <div>{msg.content}</div>

              {/* Als het bericht bestanden bevat, toon dan links naar die bestanden */}
              {msg.files && msg.files.length > 0 && (
                <div className="chatbox-files">
                  {msg.files.map((file, idx) => (
                    <div key={idx}>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

        {/* Inputgedeelte onderin waar de gebruiker zijn vraag intypt */}
        <div className="chatbox-input-area">
          <input
            type="text"
            className="chatbox-input"
            placeholder="Stel een vraag" // Placeholdertekst
            value={input} // Gekoppeld aan state
            onChange={(e) => setInput(e.target.value)} // Update state bij typen
            onKeyDown={handleKeyPress} // Verstuur bij Enter-toets
          />
          <button className="chatbox-button" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";

// Bestandsinformatie die altijd teruggestuurd wordt
type FileResponse = {
  filename: string;
  url: string;
};

const ChatFileUploader: React.FC = () => {
  // State voor het bestand dat de chatbot altijd stuurt
  const [response, setResponse] = useState<FileResponse | null>(null);

  // De bestandsinformatie, bijvoorbeeld de naam en de URL van een bestand uit PocketBase
  const fileData: FileResponse = {
    filename: 'voorbeeld.docx', // hier moet je die doc zetten die je wilt versturen  als reactie
    url: 'http://localhost:8090/api/files/files/7a1q965m3fy2i2t/file/cheat_o0jlm6znqk.docx', // voorbeeld link die hij kan geven
};
  
  
  // Functie die altijd wordt aangeroepen om de reactie van de chatbot in te stellen
  useEffect(() => {
    // Wanneer de component wordt geladen, stuur het bestand automatisch als antwoord
    setResponse(fileData);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {/* De reactie van de chatbot wordt hier getoond */}
      {response && (
        <div style={{ marginTop: 20 }}>
          <p>📁 Het bestand is verstuurd door de chatbot:</p>
          <a href={response.url} target="_blank" rel="noreferrer">
            Download {response.filename}
          </a>
        </div>
      )}
    </div>
  );
};

export default ChatFileUploader;

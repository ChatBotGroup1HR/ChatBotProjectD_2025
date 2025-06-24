import pdf from 'react-pdftotext';

// Haalt tekstinhoud uit een PDF-bestand dat via een URL wordt opgehaald.
export async function extractTextFromPdf(url: string): Promise<string> {
    try {
        // Haal het PDF-bestand op van de opgegeven URL
        const response = await fetch(url);
        // Zet de response om naar een blob-object (binair)
        const blob = await response.blob();
        // Maak een File-object aan van de blob (nodig voor react-pdftotext)
        const file = new File([blob], 'document.pdf', { type: 'application/pdf' });

        // Converteer de PDF naar tekst met react-pdftotext
        const text = await pdf(file);
        return text;

    } catch (error) {
        console.error('Fout bij het converteren van PDF:', error);
        return '';
    }
}

import stopwords from './stopwords.json';

// Zet tekst om naar een array van woorden:
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // leestekens eruit
    .split(/\s+/) // splits op spaties/newlines
    .filter((word) => word && !stopwords.includes(word));
}

// Vergelijkt input van gebruiker met bestand en telt hoe vaak woorden overeenkomen
// returnt Aantal woorden uit input die voorkomen in het bestand
export function countMatchingWords(input: string, fileContent: string): number {
  const inputWords = tokenize(input);
  const contentWords = new Set(tokenize(fileContent));

  return inputWords.reduce((count, word) => {
    return contentWords.has(word) ? count + 1 : count;
  }, 0);
}

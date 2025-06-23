import { countMatchingWords } from '../utils/fileMatcher';

describe('countMatchingWords', () => {
  it('MatchingWordsTest', () => {
    const input = 'Dit is een test zin';
    const fileContent = 'Dit bestand bevat een test en nog een zin';
    expect(countMatchingWords(input, fileContent)).toBe(2);
  });

  it('SpecialCharactersTest', () => {
    const input = 'Hallo, wereld!';
    const fileContent = 'hallo wereld';
    expect(countMatchingWords(input, fileContent)).toBe(2);
  });

  it('FilterStopwordsTest', () => {
    const input = 'de en het een test';
    const fileContent = 'test';
    expect(countMatchingWords(input, fileContent)).toBe(1); 
  });

  it('NoMatchesTest', () => {
    const input = 'abc def';
    const fileContent = 'xyz hij';
    expect(countMatchingWords(input, fileContent)).toBe(0);
  });
});
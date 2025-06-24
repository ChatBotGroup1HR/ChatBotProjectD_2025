import { filterTags } from '../components/ui/taglist';

describe('filterTagsString', () => {
  it('tagListTest', () => {
    const tags = [
      { id: '1', tag: 'React', files: [], archived: false },
      { id: '2', tag: 'NodeJS', files: [], archived: false },
      { id: '3', tag: 'Design', files: [], archived: false }
    ];

    // Zoekt op 'React' en verwacht dat alleen 'React' terugkomt (functionaliteit van filterTags)
    expect(filterTags(tags, 'React')).toEqual([{ id: '1', tag: 'React', files: [], archived: false }]);
    // Zoekt op 'nodejs' en verwacht dat alleen 'NodeJS' terugkomt (hoofdletterongevoelig)
    expect(filterTags(tags, 'nodejs')).toEqual([{ id: '2', tag: 'NodeJS', files: [], archived: false }]);
    // Zoekt op 'JS' en verwacht dat alleen 'NodeJS' terugkomt (gedeeltelijke overeenkomsten)
    expect(filterTags(tags, 'JS')).toEqual([{ id: '2', tag: 'NodeJS', files: [], archived: false }]);
    // Zoekt op 'xyz', wat niet voorkomt verwacht een lege array
    expect(filterTags(tags, 'xyz')).toEqual([]);
    // Zoekt op een lege string en verwacht alle tags terug
    expect(filterTags(tags, '')).toEqual(tags);
  });
});
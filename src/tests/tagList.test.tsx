import { filterTags } from '../components/ui/taglist';

describe('filterTagsString', () => {
  it('tagListTest', () => {
    const tags = ['React', 'NodeJS', 'Design'];

    // Zoekt op 'React' en verwacht dat alleen 'React' terugkomt (functionaliteit van filterTags)
    expect(filterTags(tags, 'React')).toEqual(['React']);
    // Zoekt op 'nodejs' en verwacht dat alleen 'NodeJS' terugkomt (hoofdletterongevoelig)
    expect(filterTags(tags, 'nodejs')).toEqual(['NodeJS']);
    // Zoekt op 'JS' en verwacht dat alleen 'NodeJS' terugkomt (gedeeltelijke overeenkomsten)
    expect(filterTags(tags, 'JS')).toEqual(['NodeJS']);
    // Zoekt op 'xyz', wat niet voorkomt verwacht een lege array
    expect(filterTags(tags, 'xyz')).toEqual([]);
    // Zoekt op een lege string en verwacht alle tags terug
    expect(filterTags(tags, '')).toEqual(tags);
  });
});
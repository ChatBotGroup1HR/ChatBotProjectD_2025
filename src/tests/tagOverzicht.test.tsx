import { filterTags } from '../components/ui/tagoverzicht';

describe('filterTagsArray', () => {
  it('tagOverzichtTest', () => {
    const data = [
      { tag: 'React', files: [], archived: false },
      { tag: 'NodeJS', files: [], archived: false },
      { tag: 'Design', files: [], archived: false },
    ];

    // Zoekt op 'react' en verwacht dat alleen 'React' terugkomt
    expect(filterTags(data, 'react')).toEqual([{ tag: 'React', files: [], archived: false }]);
    //Zoekt op 'JS' en verwacht dat alleen 'NodeJS' terugkomt
    expect(filterTags(data, 'JS')).toEqual([{ tag: 'NodeJS', files: [], archived: false }]);
    //Zoekt op 'xyz', wat niet voorkomt en verwacht lege array
    expect(filterTags(data, 'xyz')).toEqual([]);
  });
});
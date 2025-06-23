import { filterTags } from '../components/ui/tagoverzicht';

describe('filterTagsArray', () => {
  it('tagOverzichtTest', () => {
    const data = [
      { tag: 'React', files: [] },
      { tag: 'NodeJS', files: [] },
      { tag: 'Design', files: [] },
    ];

    // Zoekt op 'react' en verwacht dat alleen 'React' terugkomt
    expect(filterTags(data, 'react')).toEqual([{ tag: 'React', files: [] }]);
    //Zoekt op 'JS' en verwacht dat alleen 'NodeJS' terugkomt
    expect(filterTags(data, 'JS')).toEqual([{ tag: 'NodeJS', files: [] }]);
    //Zoekt op 'xyz', wat niet voorkomt en verwacht lege array
    expect(filterTags(data, 'xyz')).toEqual([]);
  });
});
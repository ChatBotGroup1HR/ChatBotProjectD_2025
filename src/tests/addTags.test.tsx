import { formatTagNames } from '../components/ui/addtags'

describe('formatTagNames', () => {
  it('addTagsTest', () => {
    // Input "example" en verwacht "Example" terug(hoofdletter eerste letter)
    expect(formatTagNames('example')).toBe('Example');
    // Input "" en verwacht een lege string terug
    expect(formatTagNames('')).toBe('');
    // Input "  example" en verwacht "Example" terug (hoofdletter eerste letter, spaties verwijderd)
    expect(formatTagNames('  example')).toBe('Example');
    // Input "tagname" en verwacht "Tagname" terug (hoofdletter eerste letter, behoud 2de hoofdletter)
    expect(formatTagNames('TagName')).toBe('TagName');
    // Input "  tagname" en verwacht "Tagname" terug (hoofdletter eerste letter, spaties verwijderd)
    expect(formatTagNames('  tagname')).toBe('Tagname');
  });
});
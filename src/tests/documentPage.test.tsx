import { filterDocuments } from '../components/ui/DocumentPage';

describe('filterDocuments', () => {
    it('documentPageTest', () => {
    const docs = [
        { name: 'Factuur2024', file: 'factuur2024.pdf' },
        { name: 'Handleiding', file: 'handleiding.txt' },
        { name: '', file: 'onbekendbestand.txt' },
        { name: 'Overeenkomst', file: '' },
    ];

    // Zoekt op deel van de naam
    expect(filterDocuments(docs, 'factuur')).toEqual([{ name: 'Factuur2024', file: 'factuur2024.pdf' }]);
    // Checkt op hoofdletterongevoeligheid
    expect(filterDocuments(docs, 'HANDLEIDING')).toEqual([{ name: 'Handleiding', file: 'handleiding.txt' }]);

    });
});
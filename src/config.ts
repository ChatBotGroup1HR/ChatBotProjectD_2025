// Configuration for PocketBase connection
export const POCKETBASE_URL = process.env.REACT_APP_POCKETBASE_URL || 'http://localhost:8090';

// Export the configured PocketBase instance
export const getPocketBaseUrl = () => POCKETBASE_URL;

// Debug logging
console.log('🔧 Configuratie geladen:');
console.log('  POCKETBASE_URL:', POCKETBASE_URL);
console.log('  REACT_APP_PB_SUPER_EMAIL:', process.env.REACT_APP_PB_SUPER_EMAIL ? 'Ingesteld' : 'Niet ingesteld');
console.log('  REACT_APP_PB_SUPER_PW:', process.env.REACT_APP_PB_SUPER_PW ? 'Ingesteld' : 'Niet ingesteld'); 
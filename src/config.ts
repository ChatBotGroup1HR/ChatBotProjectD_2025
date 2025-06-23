// Configuration for PocketBase connection
export const POCKETBASE_URL = process.env.REACT_APP_POCKETBASE_URL || 'http://localhost:8090';

// Export the configured PocketBase instance
export const getPocketBaseUrl = () => POCKETBASE_URL;

// Debug logging
console.log('🔧 Config loaded:');
console.log('  POCKETBASE_URL:', POCKETBASE_URL);
console.log('  REACT_APP_PB_SUPER_EMAIL:', process.env.REACT_APP_PB_SUPER_EMAIL ? 'Set' : 'Not set');
console.log('  REACT_APP_PB_SUPER_PW:', process.env.REACT_APP_PB_SUPER_PW ? 'Set' : 'Not set'); 
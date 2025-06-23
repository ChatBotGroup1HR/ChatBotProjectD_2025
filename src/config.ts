// Configuration for PocketBase connection
export const POCKETBASE_URL = process.env.REACT_APP_POCKETBASE_URL || 'http://localhost:8090';

// Export the configured PocketBase instance
export const getPocketBaseUrl = () => POCKETBASE_URL; 
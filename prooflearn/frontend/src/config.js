// Centralized API Configuration
// This ensures consistent API URL usage across the entire application

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Remove trailing slash if present to avoid double slashes
const START_API_URL = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

console.log("🔌 API Configuration Loaded:", START_API_URL);

export default START_API_URL;

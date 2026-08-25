/**
 * Production-ready API request utility
 * Seamlessly handles:
 * 1. Local Vite Proxy (relative /api requests)
 * 2. Vercel Rewrites Proxy
 * 3. Direct Render Backend URL (via VITE_API_URL environment variable)
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiUrl = (endpoint) => {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export const apiFetch = (endpoint, options = {}) => {
  return fetch(apiUrl(endpoint), options);
};

export default apiFetch;

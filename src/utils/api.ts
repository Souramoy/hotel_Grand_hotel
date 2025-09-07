// src/utils/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  // Add auth token if it exists
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

export default {
  // Rooms API
  getRooms: () => fetchApi('/api/rooms'),
  updateRooms: (data: any) => fetchApi('/api/rooms', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Menu API
  getMenu: () => fetchApi('/api/menu'),
  updateMenu: (data: any) => fetchApi('/api/menu', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Gallery API
  getGallery: () => fetchApi('/api/gallery'),
  updateGallery: (data: any) => fetchApi('/api/gallery', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Auth API
  login: (username: string, password: string) => fetchApi('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
};

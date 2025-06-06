export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('session_token');
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Handle token expiration
    localStorage.removeItem('session_token');
    window.location.reload();
  }
  
  return response;
}
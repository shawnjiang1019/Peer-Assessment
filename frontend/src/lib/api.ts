'use-client'
import { getAccessToken } from "@auth0/nextjs-auth0";

// Updated fetchProtectedData with debugging
export async function fetchProtectedData() {
  try {
    // 1. Verify token exists

    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      console.error('No access token');
      return null;
    }

    // 2. Log token for verification
    console.log('Access Token:', accessToken);

    // 3. Make test request
    const response = await fetch('http://localhost:8000/api/protected', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // 4. Check response status
    if (!response.ok) {
      console.error('API Error:', response.status, await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
}
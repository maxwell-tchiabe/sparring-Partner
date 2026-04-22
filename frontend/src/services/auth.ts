/**
 * Authentication service for synchronizing sessions with the backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

/**
 * Sync the Supabase session with the backend to set an HttpOnly cookie.
 * @param accessToken The session access token from Supabase
 */
export async function syncSessionWithBackend(accessToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync session: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error syncing session with backend:', error);
    throw error;
  }
}

/**
 * Clear the session from the backend (removes HttpOnly cookie).
 */
export async function clearBackendSession(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to clear backend session: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error clearing backend session:', error);
    throw error;
  }
}

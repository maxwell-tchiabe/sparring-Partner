/**
 * Authentication service for synchronizing sessions with the backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

/**
 * Sync the Supabase session with the backend to set an HttpOnly cookie.
 * @param accessToken The session access token from Supabase
 * @param refreshToken The session refresh token from Supabase
 */
export async function syncSessionWithBackend(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure existing cookies are sent and updated
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
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
 * Fetch the current session from the backend (rehydration).
 * @returns The session data containing both tokens if valid, otherwise null.
 */
export async function fetchMe(): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include', // Important to send the HttpOnly cookie
    });

    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error(`Failed to fetch session: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching session from backend:', error);
    return null;
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

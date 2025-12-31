import { useAuth } from '../context/AuthContext';

export function useApi() {
  const { apiUrl, passcode } = useAuth();

  async function fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, apiUrl);
    url.searchParams.set('passcode', passcode);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.retnmesg === 'deny') {
      throw new Error('Access denied');
    }

    return data as T;
  }

  return { fetchApi };
}

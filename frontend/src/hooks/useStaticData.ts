import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useAuth } from '../context/AuthContext';
import type { DeadSyncResponse } from '../types/api';

export function useStaticData() {
  const { isConnected } = useAuth();
  const { fetchApi } = useApi();
  const [data, setData] = useState<DeadSyncResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setData(null);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchApi<DeadSyncResponse>('/deadsync');
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [isConnected]);

  return { data, error, loading };
}

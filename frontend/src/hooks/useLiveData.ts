import { useState, useEffect, useRef } from 'react';
import { useApi } from './useApi';
import { useAuth } from '../context/AuthContext';
import type { LiveSyncResponse } from '../types/api';

const POLL_INTERVAL = 1000;

export function useLiveData() {
  const { isConnected } = useAuth();
  const { fetchApi } = useApi();
  const [data, setData] = useState<LiveSyncResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [connectionLost, setConnectionLost] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isConnected) {
      setData(null);
      setConnectionLost(false);
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const result = await fetchApi<LiveSyncResponse>('/livesync');
        if (!cancelled) {
          setData(result);
          setError(null);
          setConnectionLost(false);
          timeoutRef.current = window.setTimeout(poll, POLL_INTERVAL);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Connection failed'));
          setConnectionLost(true);
          // Retry after a longer delay on error
          timeoutRef.current = window.setTimeout(poll, POLL_INTERVAL * 3);
        }
      }
    }

    poll();

    return () => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isConnected]);

  return { data, error, connectionLost };
}

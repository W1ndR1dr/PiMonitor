import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_URL = 'http://raspberrypi:4040';
const DEFAULT_PASSCODE = 'PIMONITOR';

export function ConnectModal() {
  const { setCredentials } = useAuth();
  const [url, setUrl] = useState(DEFAULT_URL);
  const [passcode, setPasscode] = useState(DEFAULT_PASSCODE);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoConnecting, setAutoConnecting] = useState(true);

  // Auto-connect on load
  useEffect(() => {
    const autoConnect = async () => {
      try {
        const testUrl = new URL('/deadsync', DEFAULT_URL);
        testUrl.searchParams.set('passcode', DEFAULT_PASSCODE);
        const response = await fetch(testUrl.toString());
        const data = await response.json();
        if (data.retnmesg !== 'deny') {
          setCredentials(DEFAULT_URL, DEFAULT_PASSCODE);
          return;
        }
      } catch {
        // Auto-connect failed, show form
      }
      setAutoConnecting(false);
    };
    autoConnect();
  }, [setCredentials]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const testUrl = new URL('/deadsync', url);
      testUrl.searchParams.set('passcode', passcode);

      const response = await fetch(testUrl.toString());
      const data = await response.json();

      if (data.retnmesg === 'deny') {
        setError('Invalid passcode');
        return;
      }

      setCredentials(url, passcode);
    } catch {
      setError('Failed to connect. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (autoConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-emerald-400 mb-4">PiMonitor</h1>
          <p className="text-gray-400">Connecting to Pi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
        <h1 className="text-xl font-bold text-emerald-400 mb-6">PiMonitor</h1>
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">API URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:4040"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Passcode</label>
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode from driver console"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !passcode}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded font-medium transition-colors"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500 text-center">
          Run the driver with <code className="text-gray-400">python driver/falc.py</code> to get the passcode
        </p>
      </div>
    </div>
  );
}

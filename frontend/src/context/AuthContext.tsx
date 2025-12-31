import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  apiUrl: string;
  passcode: string;
  isConnected: boolean;
  setCredentials: (url: string, passcode: string) => void;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiUrl, setApiUrl] = useState(() =>
    sessionStorage.getItem('pimonitor_url') || ''
  );
  const [passcode, setPasscode] = useState(() =>
    sessionStorage.getItem('pimonitor_passcode') || ''
  );

  const isConnected = !!(apiUrl && passcode);

  const setCredentials = (url: string, code: string) => {
    setApiUrl(url);
    setPasscode(code);
    sessionStorage.setItem('pimonitor_url', url);
    sessionStorage.setItem('pimonitor_passcode', code);
  };

  const disconnect = () => {
    setApiUrl('');
    setPasscode('');
    sessionStorage.removeItem('pimonitor_url');
    sessionStorage.removeItem('pimonitor_passcode');
  };

  return (
    <AuthContext.Provider value={{ apiUrl, passcode, isConnected, setCredentials, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

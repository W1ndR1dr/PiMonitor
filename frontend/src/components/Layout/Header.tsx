import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  connectionLost?: boolean;
}

export function Header({ connectionLost }: HeaderProps) {
  const { disconnect, apiUrl } = useAuth();

  return (
    <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {connectionLost ? (
          <span className="flex items-center gap-2 text-red-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Connection lost
          </span>
        ) : (
          <span className="flex items-center gap-2 text-emerald-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Connected
          </span>
        )}
        <span className="text-gray-500 text-sm">{apiUrl}</span>
      </div>
      <button
        onClick={disconnect}
        className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
      >
        Disconnect
      </button>
    </header>
  );
}

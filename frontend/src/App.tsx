import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useLiveData } from './hooks/useLiveData';
import { useStaticData } from './hooks/useStaticData';
import { Sidebar, Header } from './components/Layout';
import { ConnectModal } from './components/ConnectModal';
import { Overview } from './components/Dashboard/Overview';
import { CpuSection } from './components/CPU/CpuSection';
import { MemorySection } from './components/Memory/MemorySection';
import { StorageSection } from './components/Storage/StorageSection';
import { NetworkSection } from './components/Network/NetworkSection';
import { SensorsSection } from './components/Sensors/SensorsSection';
import { ProcessList } from './components/Processes/ProcessList';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const { data: liveData, connectionLost } = useLiveData();
  const { data: staticData } = useStaticData();

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview liveData={liveData} staticData={staticData} />;
      case 'processes':
        return <ProcessList data={liveData} />;
      case 'cpu':
        return <CpuSection data={liveData} />;
      case 'memory':
        return <MemorySection data={liveData} />;
      case 'storage':
        return <StorageSection liveData={liveData} staticData={staticData} />;
      case 'network':
        return <NetworkSection liveData={liveData} staticData={staticData} />;
      case 'sensors':
        return <SensorsSection data={liveData} />;
      default:
        return <Overview liveData={liveData} staticData={staticData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <Header connectionLost={connectionLost} />
        <main className="flex-1 p-6 overflow-auto">{renderSection()}</main>
      </div>
    </div>
  );
}

function AppContent() {
  const { isConnected } = useAuth();

  if (!isConnected) {
    return <ConnectModal />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

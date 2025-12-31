import { Tabs, Card } from '../ui';
import { Table } from '../ui/Table';
import type { LiveSyncResponse, DeadSyncResponse } from '../../types/api';

interface NetworkSectionProps {
  liveData: LiveSyncResponse | null;
  staticData: DeadSyncResponse | null;
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

export function NetworkSection({ liveData, staticData }: NetworkSectionProps) {
  const usageData = liveData?.netusage
    ? Object.entries(liveData.netusage).map(([iface, stats]) => ({
        interface: iface,
        bytesSent: formatBytes(stats.bytes_sent),
        bytesRecv: formatBytes(stats.bytes_recv),
        packetsSent: stats.packets_sent.toLocaleString(),
        packetsRecv: stats.packets_recv.toLocaleString(),
        errors: stats.errin + stats.errout,
        dropped: stats.dropin + stats.dropout,
      }))
    : [];

  const usageTab = (
    <Card>
      <Table
        columns={[
          { key: 'interface', header: 'Interface' },
          { key: 'bytesSent', header: 'Sent' },
          { key: 'bytesRecv', header: 'Received' },
          { key: 'packetsSent', header: 'Packets Out' },
          { key: 'packetsRecv', header: 'Packets In' },
          { key: 'errors', header: 'Errors' },
        ]}
        data={usageData}
        keyExtractor={(item) => item.interface}
      />
    </Card>
  );

  const statsData = staticData?.netstats
    ? Object.entries(staticData.netstats).map(([iface, stats]) => ({
        interface: iface,
        status: stats.isup ? 'Up' : 'Down',
        speed: `${stats.speed} Mbps`,
        mtu: stats.mtu,
        duplex: stats.duplex,
      }))
    : [];

  const statsTab = (
    <Card>
      <Table
        columns={[
          { key: 'interface', header: 'Interface' },
          { key: 'status', header: 'Status' },
          { key: 'speed', header: 'Speed' },
          { key: 'mtu', header: 'MTU' },
          { key: 'duplex', header: 'Duplex' },
        ]}
        data={statsData}
        keyExtractor={(item) => item.interface}
      />
    </Card>
  );

  const addressData = staticData?.netaddrs
    ? Object.entries(staticData.netaddrs).flatMap(([iface, addrs]) =>
        Object.entries(addrs).map(([family, addr]) => ({
          key: `${iface}-${family}`,
          interface: iface,
          family,
          address: addr.address,
          netmask: addr.netmask,
          broadcast: addr.broadcast || '-',
        }))
      )
    : [];

  const addressTab = (
    <Card>
      <Table
        columns={[
          { key: 'interface', header: 'Interface' },
          { key: 'family', header: 'Family' },
          { key: 'address', header: 'Address' },
          { key: 'netmask', header: 'Netmask' },
          { key: 'broadcast', header: 'Broadcast' },
        ]}
        data={addressData}
        keyExtractor={(item) => item.key}
      />
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-200">Network</h2>
      <Tabs
        tabs={[
          { id: 'usage', label: 'Usage', content: usageTab },
          { id: 'stats', label: 'Statistics', content: statsTab },
          { id: 'addresses', label: 'Addresses', content: addressTab },
        ]}
      />
    </div>
  );
}

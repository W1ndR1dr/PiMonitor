import { Tabs, Card } from '../ui';
import { Table } from '../ui/Table';
import type { LiveSyncResponse, DeadSyncResponse } from '../../types/api';

interface StorageSectionProps {
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

export function StorageSection({ liveData, staticData }: StorageSectionProps) {
  const diskUsageData = liveData?.diousage
    ? Object.entries(liveData.diousage).map(([disk, stats]) => ({
        disk,
        readCount: stats.read_count.toLocaleString(),
        writeCount: stats.write_count.toLocaleString(),
        readBytes: formatBytes(stats.read_bytes),
        writeBytes: formatBytes(stats.write_bytes),
        readTime: `${stats.read_time}ms`,
        writeTime: `${stats.write_time}ms`,
        busyTime: `${stats.busy_time}ms`,
      }))
    : [];

  const usageTab = (
    <Card>
      <Table
        columns={[
          { key: 'disk', header: 'Disk' },
          { key: 'readCount', header: 'Reads' },
          { key: 'writeCount', header: 'Writes' },
          { key: 'readBytes', header: 'Read' },
          { key: 'writeBytes', header: 'Written' },
          { key: 'busyTime', header: 'Busy' },
        ]}
        data={diskUsageData}
        keyExtractor={(item) => item.disk}
      />
    </Card>
  );

  const partitionsTab = (
    <Card>
      <Table
        columns={[
          { key: 'device', header: 'Device' },
          { key: 'fstype', header: 'Type' },
          { key: 'mountpoint', header: 'Mount Point' },
          { key: 'opts', header: 'Options', className: 'max-w-xs truncate' },
        ]}
        data={staticData?.diskpart || []}
        keyExtractor={(item) => item.device}
      />
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-200">Storage</h2>
      <Tabs
        tabs={[
          { id: 'usage', label: 'Disk I/O', content: usageTab },
          { id: 'partitions', label: 'Partitions', content: partitionsTab },
        ]}
      />
    </div>
  );
}

import { Tabs, Card } from '../ui';
import type { LiveSyncResponse } from '../../types/api';

interface MemorySectionProps {
  data: LiveSyncResponse | null;
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

export function MemorySection({ data }: MemorySectionProps) {
  const virt = data?.virtdata;
  const swap = data?.swapinfo;

  const overviewTab = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Physical Memory">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-mono text-emerald-400">
              {virt?.percent.toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm">
              {virt ? formatBytes(virt.used) : '-'} / {virt ? formatBytes(virt.total) : '-'}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${virt?.percent || 0}%` }}
            />
          </div>
        </div>
      </Card>
      <Card title="Swap Memory">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-mono text-emerald-400">
              {swap?.percent.toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm">
              {swap ? formatBytes(swap.used) : '-'} / {swap ? formatBytes(swap.total) : '-'}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${swap?.percent || 0}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const physicalTab = virt && (
    <Card>
      <dl className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ['Total', virt.total],
          ['Available', virt.available],
          ['Used', virt.used],
          ['Active', virt.active],
          ['Inactive', virt.inactive],
          ['Buffers', virt.buffers],
          ['Cached', virt.cached],
          ['Shared', virt.shared],
          ['Slab', virt.slab],
        ].map(([label, value]) => (
          <div key={label as string}>
            <dt className="text-gray-500 text-sm">{label}</dt>
            <dd className="text-lg font-mono text-gray-200">{formatBytes(value as number)}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );

  const swapTab = swap && (
    <Card>
      <dl className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ['Total', swap.total],
          ['Used', swap.used],
          ['Free', swap.free],
          ['Swapped In', swap.sin],
          ['Swapped Out', swap.sout],
        ].map(([label, value]) => (
          <div key={label as string}>
            <dt className="text-gray-500 text-sm">{label}</dt>
            <dd className="text-lg font-mono text-gray-200">{formatBytes(value as number)}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-200">Memory</h2>
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', content: overviewTab },
          { id: 'physical', label: 'Physical', content: physicalTab },
          { id: 'swap', label: 'Swap', content: swapTab },
        ]}
      />
    </div>
  );
}

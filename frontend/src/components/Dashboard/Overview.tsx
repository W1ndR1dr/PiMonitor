import { Card, MetricCard } from '../ui';
import type { LiveSyncResponse, DeadSyncResponse } from '../../types/api';

interface OverviewProps {
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
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function Overview({ liveData, staticData }: OverviewProps) {
  const cpuUsage = liveData?.cpuprcnt
    ? Object.values(liveData.cpuprcnt).reduce((a, b) => a + b, 0) /
      Object.keys(liveData.cpuprcnt).length
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-200">System Overview</h2>

      {/* System Info */}
      {staticData?.osnmdata && (
        <Card title="System Information">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Username</dt>
              <dd className="text-gray-200 font-mono">{staticData.osnmdata.Username}</dd>
            </div>
            <div>
              <dt className="text-gray-500">System</dt>
              <dd className="text-gray-200 font-mono">{staticData.osnmdata['System name']}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Hostname</dt>
              <dd className="text-gray-200 font-mono">{staticData.osnmdata['Host name']}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Boot Time</dt>
              <dd className="text-gray-200 font-mono">{staticData.boottime}</dd>
            </div>
          </dl>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="CPU Usage"
          value={cpuUsage.toFixed(1)}
          unit="%"
          percentage={cpuUsage}
        />
        <MetricCard
          label="Physical Memory"
          value={liveData?.virtdata ? formatBytes(liveData.virtdata.used) : '-'}
          percentage={liveData?.virtdata?.percent}
        />
        <MetricCard
          label="Swap Memory"
          value={liveData?.swapinfo ? formatBytes(liveData.swapinfo.used) : '-'}
          percentage={liveData?.swapinfo?.percent}
        />
        <MetricCard
          label="Battery"
          value={liveData?.sensread?.battstat?.percent?.toFixed(0) ?? '-'}
          unit={liveData?.sensread?.battstat ? '%' : ''}
          percentage={liveData?.sensread?.battstat?.percent}
        />
      </div>
    </div>
  );
}

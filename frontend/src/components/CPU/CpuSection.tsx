import { Tabs, Card } from '../ui';
import { Table } from '../ui/Table';
import { ProgressBar } from '../ui/ProgressBar';
import type { LiveSyncResponse } from '../../types/api';

interface CpuSectionProps {
  data: LiveSyncResponse | null;
}

export function CpuSection({ data }: CpuSectionProps) {
  const cpuCount = data?.cpuprcnt ? Object.keys(data.cpuprcnt).length : 0;

  const usageTab = (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.cpuprcnt &&
        Object.entries(data.cpuprcnt).map(([core, percent]) => (
          <Card key={core} title={`Core ${core}`}>
            <div className="text-2xl font-mono text-emerald-400 mb-2">
              {percent.toFixed(1)}%
            </div>
            <ProgressBar value={percent} />
          </Card>
        ))}
    </div>
  );

  const cyclesTab = (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.cpuclock &&
        Object.entries(data.cpuclock).map(([core, clock]) => (
          <Card key={core} title={`Core ${core}`}>
            <div className="text-2xl font-mono text-emerald-400">
              {clock.current.toFixed(0)} <span className="text-sm text-gray-500">MHz</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {clock.min} - {clock.max} MHz
            </div>
          </Card>
        ))}
    </div>
  );

  const timesData = data?.cputimes
    ? Object.entries(data.cputimes).map(([core, times]) => ({
        core: `Core ${core}`,
        ...times,
      }))
    : [];

  const timesTab = (
    <Card>
      <Table
        columns={[
          { key: 'core', header: 'Core' },
          { key: 'user', header: 'User' },
          { key: 'system', header: 'System' },
          { key: 'idle', header: 'Idle' },
          { key: 'iowait', header: 'IOWait' },
          { key: 'irq', header: 'IRQ' },
        ]}
        data={timesData}
        keyExtractor={(item) => item.core}
      />
    </Card>
  );

  const statsTab = data?.cpustats && (
    <Card>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-gray-500 text-sm">Context Switches</dt>
          <dd className="text-xl font-mono text-gray-200">
            {data.cpustats.ctx_switches.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 text-sm">Interrupts</dt>
          <dd className="text-xl font-mono text-gray-200">
            {data.cpustats.interrupts.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 text-sm">Soft Interrupts</dt>
          <dd className="text-xl font-mono text-gray-200">
            {data.cpustats.soft_interrupts.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 text-sm">System Calls</dt>
          <dd className="text-xl font-mono text-gray-200">
            {data.cpustats.syscalls.toLocaleString()}
          </dd>
        </div>
      </dl>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-200">
        CPU <span className="text-gray-500 text-sm">({cpuCount} cores)</span>
      </h2>
      <Tabs
        tabs={[
          { id: 'usage', label: 'Usage', content: usageTab },
          { id: 'cycles', label: 'Cycles', content: cyclesTab },
          { id: 'times', label: 'Times', content: timesTab },
          { id: 'stats', label: 'Statistics', content: statsTab },
        ]}
      />
    </div>
  );
}

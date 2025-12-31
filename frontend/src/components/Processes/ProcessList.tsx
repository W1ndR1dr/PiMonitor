import { useState } from 'react';
import { Card, Modal } from '../ui';
import { Table } from '../ui/Table';
import { useApi } from '../../hooks/useApi';
import type { LiveSyncResponse, ProcessInfo, ProcessDetail } from '../../types/api';

interface ProcessListProps {
  data: LiveSyncResponse | null;
}

export function ProcessList({ data }: ProcessListProps) {
  const { fetchApi } = useApi();
  const [selectedProcess, setSelectedProcess] = useState<ProcessDetail | null>(null);

  const processes = data?.procinfo
    ? Object.values(data.procinfo).sort((a, b) => b.cpu_percent - a.cpu_percent)
    : [];

  const handleRowClick = async (proc: ProcessInfo) => {
    try {
      const detail = await fetchApi<ProcessDetail>('/procinfo', {
        prociden: proc.pid.toString(),
      });
      setSelectedProcess(detail);
    } catch (err) {
      console.error('Failed to fetch process details:', err);
    }
  };

  const handleProcessAction = async (action: 'kill' | 'term' | 'susp' | 'resm') => {
    if (!selectedProcess) return;
    try {
      await fetchApi(`/${action}proc`, { prociden: selectedProcess.pid.toString() });
      setSelectedProcess(null);
    } catch (err) {
      console.error(`Failed to ${action} process:`, err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-200">
        Processes <span className="text-gray-500 text-sm">({processes.length})</span>
      </h2>

      <Card>
        <Table
          columns={[
            { key: 'pid', header: 'PID', className: 'w-20' },
            { key: 'name', header: 'Name' },
            { key: 'username', header: 'User' },
            {
              key: 'memory_percent',
              header: 'Memory',
              render: (p) => `${p.memory_percent.toFixed(1)}%`,
            },
            {
              key: 'cpu_percent',
              header: 'CPU',
              render: (p) => `${p.cpu_percent.toFixed(1)}%`,
            },
          ]}
          data={processes}
          keyExtractor={(p) => p.pid}
          onRowClick={handleRowClick}
        />
      </Card>

      <Modal
        isOpen={!!selectedProcess}
        onClose={() => setSelectedProcess(null)}
        title={selectedProcess ? `Process: ${selectedProcess.name}` : ''}
      >
        {selectedProcess && (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">PID</dt>
                <dd className="font-mono text-gray-200">{selectedProcess.pid}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd className="font-mono text-gray-200">{selectedProcess.status}</dd>
              </div>
              <div>
                <dt className="text-gray-500">User</dt>
                <dd className="font-mono text-gray-200">{selectedProcess.username}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Threads</dt>
                <dd className="font-mono text-gray-200">{selectedProcess.num_threads}</dd>
              </div>
              <div>
                <dt className="text-gray-500">CPU %</dt>
                <dd className="font-mono text-gray-200">
                  {selectedProcess.cpu_percent.toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Memory %</dt>
                <dd className="font-mono text-gray-200">
                  {selectedProcess.memory_percent.toFixed(1)}%
                </dd>
              </div>
            </dl>

            <div className="flex gap-2 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleProcessAction('term')}
                className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors"
              >
                Terminate
              </button>
              <button
                onClick={() => handleProcessAction('kill')}
                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
              >
                Kill
              </button>
              <button
                onClick={() => handleProcessAction('susp')}
                className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Suspend
              </button>
              <button
                onClick={() => handleProcessAction('resm')}
                className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
              >
                Resume
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

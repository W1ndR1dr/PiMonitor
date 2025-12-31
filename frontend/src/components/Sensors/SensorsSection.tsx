import { Tabs, Card, MetricCard } from '../ui';
import { Table } from '../ui/Table';
import type { LiveSyncResponse } from '../../types/api';

interface SensorsSectionProps {
  data: LiveSyncResponse | null;
}

export function SensorsSection({ data }: SensorsSectionProps) {
  const battery = data?.sensread?.battstat;
  const temps = data?.sensread?.senstemp;
  const fans = data?.sensread?.fanspeed;

  const batteryTab = battery ? (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <MetricCard
        label="Battery Level"
        value={battery.percent.toFixed(0)}
        unit="%"
        percentage={battery.percent}
      />
      <Card title="Status">
        <div className="text-lg font-mono text-gray-200">
          {battery.power_plugged ? 'Charging' : 'On Battery'}
        </div>
      </Card>
      <Card title="Time Remaining">
        <div className="text-lg font-mono text-gray-200">
          {battery.secsleft > 0
            ? `${Math.floor(battery.secsleft / 3600)}h ${Math.floor((battery.secsleft % 3600) / 60)}m`
            : battery.power_plugged
              ? 'Charging'
              : 'Calculating...'}
        </div>
      </Card>
    </div>
  ) : (
    <Card>
      <p className="text-gray-500">No battery detected</p>
    </Card>
  );

  const tempData = temps
    ? Object.entries(temps).flatMap(([device, readings]) =>
        readings.map((reading, i) => ({
          key: `${device}-${i}`,
          device,
          label: reading.label || `Sensor ${i}`,
          current: `${reading.current.toFixed(1)}°C`,
          high: reading.high ? `${reading.high}°C` : '-',
          critical: reading.critical ? `${reading.critical}°C` : '-',
          percentage: reading.high ? (reading.current / reading.high) * 100 : 0,
        }))
      )
    : [];

  const thermalTab = tempData.length > 0 ? (
    <Card>
      <Table
        columns={[
          { key: 'device', header: 'Device' },
          { key: 'label', header: 'Sensor' },
          { key: 'current', header: 'Current' },
          { key: 'high', header: 'High' },
          { key: 'critical', header: 'Critical' },
        ]}
        data={tempData}
        keyExtractor={(item) => item.key}
      />
    </Card>
  ) : (
    <Card>
      <p className="text-gray-500">No temperature sensors detected</p>
    </Card>
  );

  const fanData = fans
    ? Object.entries(fans).flatMap(([device, readings]) =>
        readings.map((reading, i) => ({
          key: `${device}-${i}`,
          device,
          label: reading.label || `Fan ${i}`,
          rpm: `${reading.current} RPM`,
        }))
      )
    : [];

  const fansTab = fanData.length > 0 ? (
    <Card>
      <Table
        columns={[
          { key: 'device', header: 'Device' },
          { key: 'label', header: 'Fan' },
          { key: 'rpm', header: 'Speed' },
        ]}
        data={fanData}
        keyExtractor={(item) => item.key}
      />
    </Card>
  ) : (
    <Card>
      <p className="text-gray-500">No fan sensors detected</p>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-200">Sensors</h2>
      <Tabs
        tabs={[
          { id: 'battery', label: 'Battery', content: batteryTab },
          { id: 'thermal', label: 'Thermal', content: thermalTab },
          { id: 'fans', label: 'Fans', content: fansTab },
        ]}
      />
    </div>
  );
}

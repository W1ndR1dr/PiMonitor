// API Response Types for PiMonitor

export interface CpuTimes {
  user: number;
  nice: number;
  system: number;
  idle: number;
  iowait: number;
  irq: number;
  softirq: number;
  steal: number;
  guest: number;
  guest_nice: number;
}

export interface CpuClock {
  current: number;
  min: number;
  max: number;
}

export interface CpuStats {
  ctx_switches: number;
  interrupts: number;
  soft_interrupts: number;
  syscalls: number;
}

export interface VirtualMemory {
  total: number;
  available: number;
  percent: number;
  used: number;
  active: number;
  inactive: number;
  buffers: number;
  cached: number;
  shared: number;
  slab: number;
}

export interface SwapInfo {
  total: number;
  used: number;
  free: number;
  percent: number;
  sin: number;
  sout: number;
}

export interface DiskIO {
  read_count: number;
  write_count: number;
  read_bytes: number;
  write_bytes: number;
  read_time: number;
  write_time: number;
  read_merged_count: number;
  write_merged_count: number;
  busy_time: number;
}

export interface DiskPartition {
  device: string;
  mountpoint: string;
  fstype: string;
  opts: string;
}

export interface NetworkIO {
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
  errin: number;
  errout: number;
  dropin: number;
  dropout: number;
}

export interface NetworkStats {
  isup: boolean;
  duplex: string;
  speed: number;
  mtu: number;
}

export interface NetworkAddress {
  address: string;
  netmask: string;
  broadcast: string;
  ptp: string;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  username: string;
  memory_percent: number;
  cpu_percent: number;
}

export interface ProcessDetail extends ProcessInfo {
  status: string;
  create_time: number;
  terminal: string;
  num_threads: number;
  cpu_times: {
    user: number;
    system: number;
    children_user: number;
    children_system: number;
    iowait: number;
  };
  memory_info: {
    rss: number;
    vms: number;
    shared: number;
    text: number;
    data: number;
    lib: number;
    dirty: number;
  };
  uids: { real: number; effective: number; saved: number };
  gids: { real: number; effective: number; saved: number };
  num_ctx_switches: { voluntary: number; involuntary: number };
}

export interface TempReading {
  label: string;
  current: number;
  high: number;
  critical: number;
}

export interface FanReading {
  label: string;
  current: number;
}

export interface BatteryStatus {
  percent: number;
  secsleft: number;
  power_plugged: boolean;
}

export interface SensorData {
  senstemp: Record<string, TempReading[]>;
  fanspeed: Record<string, FanReading[]>;
  battstat: BatteryStatus | null;
}

export interface SystemInfo {
  'System name': string;
  'Host name': string;
  Version: string;
  Username: string;
}

// Live sync response (polled every second)
export interface LiveSyncResponse {
  virtdata: VirtualMemory;
  swapinfo: SwapInfo;
  cpustats: CpuStats;
  cputimes: Record<number, CpuTimes>;
  cpuprcnt: Record<number, number>;
  cpuclock: Record<number, CpuClock>;
  diousage: Record<string, DiskIO>;
  netusage: Record<string, NetworkIO>;
  procinfo: Record<string, ProcessInfo>;
  sensread: SensorData;
}

// Dead sync response (fetched once)
export interface DeadSyncResponse {
  osnmdata: SystemInfo;
  cpuquant: string;
  diskpart: DiskPartition[];
  diousage: Record<string, DiskIO>;
  netusage: Record<string, NetworkIO>;
  netaddrs: Record<string, Record<string, NetworkAddress>>;
  netstats: Record<string, NetworkStats>;
  boottime: string;
  procinfo: Record<string, ProcessInfo>;
  sensread: SensorData;
}

// API error response
export interface ApiError {
  retnmesg: 'deny';
}

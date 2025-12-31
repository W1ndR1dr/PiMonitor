import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-200">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  percentage?: number;
}

export function MetricCard({ label, value, unit, percentage }: MetricCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-mono text-emerald-400">
        {value}
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </div>
      {percentage !== undefined && (
        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      )}
    </div>
  );
}

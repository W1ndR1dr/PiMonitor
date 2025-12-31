interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className = '', showLabel }: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-mono text-gray-400 w-12 text-right">
          {percentage.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

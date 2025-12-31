import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
}

export function Table<T>({ columns, data, onRowClick, keyExtractor }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2 text-left text-gray-400 font-medium ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-gray-700/50 ${
                onRowClick ? 'cursor-pointer hover:bg-gray-700/50' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-3 py-2 text-gray-300 font-mono ${col.className || ''}`}
                >
                  {col.render
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

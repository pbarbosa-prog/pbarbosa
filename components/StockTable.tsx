import React, { useState, useMemo } from 'react';
import { StockData, SortKey, SortDirection, SortConfig } from '../types';

interface StockTableProps {
  title: string;
  stocks: StockData[];
}

const SortableHeader: React.FC<{
  columnKey: SortKey;
  title: string;
  sortConfig: SortConfig | null;
  requestSort: (key: SortKey) => void;
  className?: string;
}> = ({ columnKey, title, sortConfig, requestSort, className }) => {
  const isSorted = sortConfig?.key === columnKey;
  const directionIcon = isSorted ? (sortConfig?.direction === 'ascending' ? '▲' : '▼') : '';

  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer select-none ${className || ''}`}
      onClick={() => requestSort(columnKey)}
    >
      {title} <span className="text-cyan-400 ml-1">{directionIcon}</span>
    </th>
  );
};

const StockTable: React.FC<StockTableProps> = ({ title, stocks }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedStocks = useMemo(() => {
    let sortableItems = [...stocks];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null) return 1;
        if (bValue === null) return -1;

        if(typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [stocks, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: 'companyName', label: 'Company Name' },
    { key: 'ticker', label: 'Ticker' },
    { key: 'country', label: 'Country' },
    { key: 'dailyChange', label: 'Daily %' },
    { key: 'weeklyChange', label: 'Weekly %' },
    { key: 'monthlyChange', label: 'Monthly %' },
    { key: 'yearlyChange', label: 'Yearly %' },
    { key: 'dividendYield', label: 'Div. Yield %' },
    { key: 'peRatio', label: 'P/E Ratio' },
  ];

  const renderChangeCell = (change: number) => {
    const color = change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400';
    const sign = change > 0 ? '+' : '';
    return <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${color}`}>{sign}{change.toFixed(2)}%</td>;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <h3 className="text-xl font-semibold p-4 bg-gray-700/50">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {headers.map((header, index) => (
                <SortableHeader
                  key={header.key}
                  columnKey={header.key}
                  title={header.label}
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                  className={index === 0 ? 'sticky left-0 bg-gray-700 z-20' : ''}
                />
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {sortedStocks.map((stock) => (
              <tr key={stock.ticker} className="group hover:bg-gray-700 transition-colors duration-150">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 sticky left-0 bg-gray-800 group-hover:bg-gray-700 z-10">{stock.companyName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 font-mono">{stock.ticker}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stock.country}</td>
                {renderChangeCell(stock.dailyChange)}
                {renderChangeCell(stock.weeklyChange)}
                {renderChangeCell(stock.monthlyChange)}
                {renderChangeCell(stock.yearlyChange)}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stock.dividendYield.toFixed(2)}%</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{stock.peRatio !== null ? stock.peRatio.toFixed(2) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;

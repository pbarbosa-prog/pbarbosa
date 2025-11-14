
import React from 'react';

interface HeaderProps {
  onExportCsv: () => void;
  isActionDisabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ onExportCsv, isActionDisabled }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          EU Stock Movers <span className="text-cyan-400">+</span>
        </h1>
        <button
          onClick={onExportCsv}
          disabled={isActionDisabled}
          className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export to CSV
        </button>
      </div>
    </header>
  );
};

export default Header;

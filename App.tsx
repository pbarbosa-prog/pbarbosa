import React, { useState, useEffect, useCallback } from 'react';
import { GlobalStockMovers } from './types';
import { fetchStockMovers } from './services/geminiService';
import { exportToCsv } from './utils/csvExporter';
import Header from './components/Header';
import StockTable from './components/StockTable';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [stockData, setStockData] = useState<GlobalStockMovers | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStockData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStockMovers();
      setStockData(data);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportCsv = () => {
    if (stockData) {
      exportToCsv(stockData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onExportCsv={handleExportCsv} isActionDisabled={isLoading || !stockData} />
      <main className="container mx-auto p-4 md:p-6">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && stockData && (
          <div className="space-y-12">
             <section aria-labelledby="global-movers-heading">
                <h2 id="global-movers-heading" className="text-3xl font-bold text-cyan-400 mb-6 border-b-2 border-cyan-400/30 pb-2">
                  Top EU Market Movers
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <StockTable title="Top 10 Gainers" stocks={stockData.gainers} />
                  <StockTable title="Top 10 Losers" stocks={stockData.losers} />
                </div>
              </section>
          </div>
        )}
         {!isLoading && !error && !stockData && (
            <div className="text-center text-gray-400 p-4">
                <p>No stock data available.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
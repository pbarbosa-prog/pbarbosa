import { GlobalStockMovers, StockData } from '../types';

const convertToCSV = (data: GlobalStockMovers): string => {
    const headers = [
        'Status',
        'Company Name',
        'Ticker',
        'Country',
        'Daily % Change',
        'Weekly % Change',
        'Monthly % Change',
        'Yearly % Change',
        'Dividend Yield %',
        'P/E Ratio'
    ];

    const rows: string[][] = [];
    rows.push(headers);

    const processStocks = (stocks: StockData[], status: 'Gainer' | 'Loser') => {
        stocks.forEach(stock => {
            const row = [
                status,
                `"${stock.companyName.replace(/"/g, '""')}"`,
                stock.ticker,
                stock.country,
                stock.dailyChange.toFixed(2),
                stock.weeklyChange.toFixed(2),
                stock.monthlyChange.toFixed(2),
                stock.yearlyChange.toFixed(2),
                stock.dividendYield.toFixed(2),
                stock.peRatio !== null ? stock.peRatio.toFixed(2) : 'N/A'
            ];
            rows.push(row);
        });
    };
    
    processStocks(data.gainers, 'Gainer');
    processStocks(data.losers, 'Loser');

    return rows.map(row => row.join(',')).join('\n');
};

export const exportToCsv = (data: GlobalStockMovers) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `eu_stock_movers_${date}.csv`);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export interface StockData {
  companyName: string;
  ticker: string;
  country: string;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  yearlyChange: number;
  dividendYield: number;
  peRatio: number | null;
}

export interface GlobalStockMovers {
  gainers: StockData[];
  losers: StockData[];
}

export type SortKey = keyof StockData;

export type SortDirection = 'ascending' | 'descending';

export interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

import { GoogleGenAI, Type } from "@google/genai";
import { GlobalStockMovers } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const stockDataSchema = {
    type: Type.OBJECT,
    properties: {
        companyName: { type: Type.STRING },
        ticker: { type: Type.STRING },
        country: { type: Type.STRING },
        dailyChange: { type: Type.NUMBER },
        weeklyChange: { type: Type.NUMBER },
        monthlyChange: { type: Type.NUMBER },
        yearlyChange: { type: Type.NUMBER },
        dividendYield: { type: Type.NUMBER },
        peRatio: { type: Type.NUMBER, nullable: true },
    },
    required: ['companyName', 'ticker', 'country', 'dailyChange', 'weeklyChange', 'monthlyChange', 'yearlyChange', 'dividendYield', 'peRatio']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        gainers: {
            type: Type.ARRAY,
            items: stockDataSchema
        },
        losers: {
            type: Type.ARRAY,
            items: stockDataSchema
        }
    },
    required: ['gainers', 'losers']
};

export const fetchStockMovers = async (): Promise<GlobalStockMovers> => {
    const prompt = `
      You are a precise financial data API. Your task is to provide a market snapshot of the top movers across major European stock exchanges. You must source, verify, and present your information as if it were directly queried from the Financial Modeling Prep (FMP) API.

      Based on the current UTC time, determine if the main European markets (Euronext) are generally open or closed.
      - If they are still open, provide data based on the PREVIOUS trading day's closing prices as reported by FMP.
      - If they are closed, provide data based on TODAY's closing prices as reported by FMP.

      Your main task is to identify the TOP 10 overall daily percentage gainers and the TOP 10 overall daily percentage losers from the combined pool of major indices in the following countries: Portugal, Germany, Spain, France, Netherlands, Belgium, and Ireland.

      For each of the 20 stocks identified (10 gainers, 10 losers), provide the following data points. The data should mirror what would be found in FMP's API endpoints (like /api/v3/profile/, /api/v3/historical-price-full/, etc.). All percentage values should be numbers, not strings with '%'.
      - Company Name
      - Ticker Symbol (as used on FMP, e.g., 'AIR.PA' for Airbus)
      - Country of the exchange (e.g., 'France', 'Germany')
      - Daily % Change
      - Weekly % Change
      - Monthly % Change
      - Yearly % Change
      - Dividend Yield % (from the 'dividendYield' field, returned as a number, e.g., 0.0525 should be 5.25)
      - Price/Earnings (P/E) Ratio (from the 'peRatio' field) (use null if not applicable or negative)

      Return the data as a single JSON object that strictly adheres to the provided schema, containing two keys: 'gainers' and 'losers'. Do not add any commentary or explanations outside of the JSON structure.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        // FMP dividend yield is a ratio, convert to percentage number
        const convertDividendYield = (stocks) => stocks.map(stock => ({
            ...stock,
            dividendYield: stock.dividendYield * 100 
        }));

        data.gainers = convertDividendYield(data.gainers);
        data.losers = convertDividendYield(data.losers);

        return data as GlobalStockMovers;
    } catch (error) {
        console.error("Error fetching stock data from Gemini API:", error);
        throw new Error("Failed to parse stock data from API response.");
    }
};
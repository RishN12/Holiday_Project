// Helper for reading from localStorage safely
export const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Helper for writing to localStorage safely
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
};

// Storage Keys Constants
export const KEYS = {
  ITINERARY: 'orlando_itinerary_v1',
  PACKING: 'orlando_packing_v1',
  SPENDING: 'orlando_spending_v1',
  RATE: 'orlando_usd_gbp_rate_v1',
  BINGO: 'orlando_bingo_v1',
  QUESTS: 'orlando_quests_v1',
  TRIVIA_SCORE: 'orlando_trivia_score_v1',
  GAME_HIGH_SCORE: 'orlando_skywings_score_v1',
  JOURNAL: 'orlando_flight_journal_v1'
};

// Currency helper (Default 1 USD = 0.77 GBP approx)
export const DEFAULT_USD_GBP_RATE = 0.77;

export const formatUSD = (val) => {
  const num = parseFloat(val) || 0;
  return `$${num.toFixed(2)}`;
};

export const formatGBP = (val) => {
  const num = parseFloat(val) || 0;
  return `£${num.toFixed(2)}`;
};
